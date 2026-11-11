import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";

export interface CreateOrderDto {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: "VIETQR" | "VNPAY" | "MOMO";
}

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectQueue("order-notifications") private readonly notificationQueue: Queue
  ) {}

  /**
   * Tạo đơn hàng với Transaction toàn vẹn ACID & Khóa dòng chống race condition
   */
  async createOrder(dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItemsToSave = [];

      for (const item of dto.items) {
        // Khóa bi quan (Pessimistic Lock) dòng sản phẩm để ngăn 2 người mua cùng lúc khi chỉ còn 1 món
        const product = await queryRunner.manager
          .createQueryBuilder()
          .select("p")
          .from("products", "p")
          .where("p.id = :id", { id: item.productId })
          .setLock("pessimistic_write")
          .getRawOne();

        if (!product) {
          throw new NotFoundException(`Sản phẩm với ID ${item.productId} không tồn tại.`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm "${product.name}" không đủ số lượng tồn kho (Còn lại: ${product.stock_quantity}).`
          );
        }

        // Trừ tồn kho tạm thời
        await queryRunner.manager.query(
          "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
          [item.quantity, item.productId]
        );

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        orderItemsToSave.push({
          productId: item.productId,
          unitPrice: product.price,
          quantity: item.quantity,
          subtotal,
        });
      }

      // Tạo đơn hàng trạng thái CHỜ THANH TOÁN
      const insertResult = await queryRunner.manager.query(
        `INSERT INTO orders (user_id, total_amount, payment_status, payment_method, expires_at)
         VALUES ($1, $2, 'PENDING_PAYMENT', $3, NOW() + INTERVAL '10 minutes')
         RETURNING id, order_code, created_at`,
        [dto.userId, totalAmount, dto.paymentMethod]
      );

      const createdOrder = insertResult[0];

      // Commit toàn bộ giao dịch vào PostgreSQL
      await queryRunner.commitTransaction();

      // Đẩy tác vụ hẹn giờ tự động hoàn tồn kho sau 10 phút vào hàng đợi BullMQ
      await this.notificationQueue.add(
        "expire-unpaid-order",
        { orderId: createdOrder.id },
        { delay: 10 * 60 * 1000 } // Trì hoãn 10 phút
      );

      return {
        orderId: createdOrder.id,
        orderCode: createdOrder.order_code,
        totalAmount,
        status: "PENDING_PAYMENT",
      };
    } catch (error) {
      // Bất kỳ bước nào gặp sự cố -> Hủy toàn bộ thay đổi
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Giải phóng kết nối về Connection Pool
      await queryRunner.release();
    }
  }
}

