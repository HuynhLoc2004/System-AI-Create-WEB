# THEO DÕI TỐC ĐỘ LÀM VIỆC & BIỂU ĐỒ CHÁY VIỆC (VELOCITY & BURNDOWN TRACKING)

## 1. Bảng Theo Dõi Vận Tốc Làm Việc Đội Ngũ (Team Velocity Tracking)

| Sprint Số | Story Points Cam Kết (Committed) | Story Points Hoàn Thành Thực Tế (Completed) | Tỷ Lệ Hoàn Thành (%) | Ghi Chú Rút Kinh Nghiệm |
|:---:|:---:|:---:|:---:|---|
| **Sprint 01** | 35 | 30 | 85.7% | Giai đoạn thiết lập môi trường ban đầu mất nhiều thời gian |
| **Sprint 02** | 38 | 36 | 94.7% | Quy trình Git Flow đã ổn định |
| **Sprint 03** | 42 | 42 | 100% | Team bắt đầu đạt trạng thái nhịp điệu làm việc chuẩn (Flow state) |
| **Sprint 04** | 45 | 43.5 | 96.6% | 1 task dời sang sprint sau do chờ xác nhận từ phía đối tác thanh toán |
| **Trung bình** | **40.0** | **37.8** | **94.5%** | **Vận tốc dự kiến an toàn cho Sprint tới: 38 - 40 Points** |

---

## 2. Hướng Dẫn Đọc Biểu Đồ Burndown Chart (Burn-down Interpretation)

```
Story Points
 50 | *
    |   *  (Đường lý tưởng - Ideal line)
 40 |     *  \
    |       * \ (Đường thực tế - Actual line)
 30 |         *
    |           *
 20 |             *
    |               *
 10 |                 *
    |                   *
  0 +----------------------- Ngày làm việc (Day 1 -> Day 10)
```

* **Hiện tượng đường thực tế nằm DƯỚI đường lý tưởng:** Đội ngũ đang hoàn thành công việc nhanh hơn dự kiến. Có thể chủ động kéo thêm các task nợ kỹ thuật (Tech Debt) hoặc nghiên cứu tối ưu hóa.
* **Hiện tượng đường thực tế nằm TRÊN đường lý tưởng:** Đội ngũ đang bị chậm tiến độ. TPM cần can thiệp ngay lập tức:
  1. Kiểm tra có task nào bị nghẽn (Blocker) không.
  2. Xem xét bớt các tính năng không thiết yếu ra khỏi Sprint để bảo vệ cam kết Release.
  3. Tuyệt đối không ép Overtime liên tục vì sẽ làm giảm sút chất lượng code và gây ra nhiều bug tiềm ẩn.

