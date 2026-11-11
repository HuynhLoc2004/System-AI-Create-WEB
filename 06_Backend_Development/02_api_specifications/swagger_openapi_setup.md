# THIẾT LẬP TÀI LIỆU HÓA SWAGGER / OPENAPI 3.0

## 1. Cấu Hình Tự Động Sinh Tài Liệu Trên NestJS
Đội Backend tích hợp Swagger trực tiếp vào file khởi động `main.ts`:

```typescript
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Hệ Thống Doanh Nghiệp Core API")
    .setDescription("Tài liệu đặc tả toàn bộ RESTful APIs cho Web, Mobile và Đối tác thứ ba")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000);
}
bootstrap();
```

## 2. Quy Tắc Gắn Decorators Bắt Buộc Trên Controller & DTO
* Mỗi endpoint bắt buộc có `@ApiOperation({ summary: "Tóm tắt tác vụ" })`.
* Khai báo rõ các mã lỗi có thể xảy ra: `@ApiResponse({ status: 400, description: "Dữ liệu không hợp lệ" })`.
* Đội Frontend và QA có thể truy cập đường dẫn `https://api-staging.domain.com/api/docs` để test trực tiếp hoặc xuất file JSON nạp vào Postman.

