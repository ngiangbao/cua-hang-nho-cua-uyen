# ☕ Cửa hàng nhỏ của Uyên

Game kinh doanh quán cà phê chạy trực tiếp trên trình duyệt. Vào vai **Bảo Uyên**, cô gái nhận lại căn nhà nhỏ trong hẻm phố cổ Hà Nội cùng cái phin nhôm cũ của ngoại. Bắt đầu từ một quán nhỏ, Uyên pha chế, trò chuyện với khách quen, thuê nhân viên rồi mở chuỗi quán khắp Việt Nam.

**▶ Chơi ngay:** https://ngiangbao.github.io/cua-hang-nho-cua-uyen/

![Màn hình chính](docs/screenshots/01-man-hinh-chinh.png)

## Hình ảnh trong game

| Tập pha chế trước ngày đầu tiên | Một ngày bán hàng |
|---|---|
| ![Tập pha chế](docs/screenshots/02-tap-pha-che.png) | ![Bán hàng](docs/screenshots/03-ban-hang.png) |
| **Trò chuyện với khách quen** | **Sổ tay khách quen** |
| ![Trò chuyện](docs/screenshots/04-tro-chuyen.png) | ![Khách quen](docs/screenshots/05-khach-quen.png) |
| **Thực đơn & máy móc** | **Tổng kết cuối ngày** |
| ![Thực đơn](docs/screenshots/06-thuc-don.png) | ![Tổng kết ngày](docs/screenshots/07-tong-ket-ngay.png) |

## Tính năng

- **Pha chế:** 23 món đậm chất Việt — cà phê đen, sữa đá, bạc xỉu, cà phê trứng, cà phê muối, cốt dừa, trà đào cam sả, nước mót Hội An, sinh tố bơ, latte… Bấm nguyên liệu đúng thứ tự để được “Hoàn hảo”. Có 3 công thức bí mật do khách quen truyền lại.
- **Màn tập pha chế:** trước ngày 1, Bé Na làm khách tập, chỉ từng bước. Cuối màn hỏi bạn đã sẵn sàng chưa; chưa thì tập lại với món khác.
- **27 khách quen** có tính cách và lời thoại riêng: sinh viên IT, cô giáo về hưu, nghệ sĩ saxophone, chú xe ôm Sài Gòn, du khách Úc, ca sĩ ca Huế… Trò chuyện, chọn câu trả lời hợp ý để tăng tim. Đạt 1, 3, 5 tim sẽ mở khóa câu chuyện và quà. Mỗi thành phố có khách quen riêng.
- **Kinh doanh:** chi phí nguyên liệu, tiền thuê mặt bằng, lương nhân viên, điện nước, bảo trì, quảng cáo, sự cố. Thời tiết ảnh hưởng món khách gọi; có sự kiện ngẫu nhiên (đoàn du lịch, nhà phê bình, cúp điện, lễ hội…).
- **Nhân viên:** tuyển lần lượt Phục vụ → Tạp vụ → Thu ngân → **Pha chế (cuối cùng)**. Mỗi người có tay nghề, tính cách, lương riêng và lên tay nghề theo thời gian.
- **Chuỗi quán:** khi quán đã có Pha chế, quán tự vận hành và Uyên được mở quán mới: Hà Nội → Sài Gòn → Đà Lạt → Hội An → Đà Nẵng → Huế. Doanh thu các quán đồng bộ về một két chung, kho và máy móc dùng chung, có biểu đồ doanh thu chuỗi.
- **Đồ họa 2D** hoạt hình màu tươi sáng, mỗi thành phố một khung cảnh riêng. **Nhạc jazz nhẹ** tạo trực tiếp bằng Web Audio, đổi giọng và nhịp theo từng thành phố.
- **Mục tiêu hằng ngày, 13 thành tựu, trang trí quán, quảng cáo.**

## Cách chơi

1. Bấm vào khách có bong bóng 💬 để nhận order (hoặc trò chuyện).
2. Chọn phiếu order ở quầy bên phải, bấm nguyên liệu theo đúng công thức.
3. Bấm **✅ Phục vụ** trước khi thanh kiên nhẫn của khách cạn.
4. Nhập kho, thuê nhân viên, trang trí, rồi mở thêm quán.

Phím tắt trên máy tính: `Enter` phục vụ, `Backspace` bỏ bước vừa thêm, `Space` tạm dừng.

## Lưu tiến trình

- Game **tự động lưu** đầu và cuối mỗi ngày, mỗi 30 phút trong game và khi đóng tab. Mở lại sẽ có nút **“Tiếp tục”** đúng ngày, đúng giờ đang chơi.
- Có **3 ô lưu**, và có thể **xuất/nhập file save** (⚙️ Lưu & Cài đặt) để sao lưu hoặc chuyển sang máy khác.

## Cài lên iPhone như một ứng dụng

1. Mở link game bằng **Safari**.
2. Bấm nút **Chia sẻ** (⬆︎) → **Thêm vào MH chính**.
3. Mở icon ☕ “Quán của Uyên” trên màn hình chính: game chạy toàn màn hình như app, chơi được cả khi không có mạng. Xoay ngang điện thoại để chơi.

> iOS tách bộ nhớ của Safari và của ứng dụng trên màn hình chính. Nếu đã chơi trong Safari trước đó, hãy dùng **Xuất file save** trong Safari rồi **Nhập file save** trong ứng dụng.

## Chạy trên máy

Không cần cài đặt hay build. Chỉ cần một web server tĩnh:

```bash
python3 -m http.server 8000
```

Rồi mở http://localhost:8000.
