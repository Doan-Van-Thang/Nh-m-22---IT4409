Dự án Game Tank 2D (Bài tập lớn Lập trình Web)
Đây là dự án game bắn súng xe tăng 2D multiplayer thời gian thực, được xây dựng cho môn học IT4409.

🚀 Công nghệ sử dụng
Client (Giao diện & Game): React (Vite) + HTML5 Canvas

Server (Logic & Mạng): Node.js + WebSocket (ws) + MongoDB (Mongoose)

Xác thực: JWT (jsonwebtoken) + bcryptjs

Ngôn ngữ: JavaScript (ES Modules)

📂 Cấu trúc thư mục
/client: Chứa toàn bộ code cho phần React (UI, Giao diện) và Canvas (Lõi game).

/server: Chứa toàn bộ code cho phần Backend (Node.js, xử lý logic game, xác thực).

💻 Hướng dẫn chạy (Development)
Để chơi game, bạn bắt buộc phải chạy cả Server (xử lý logic) và Client (hiển thị hình ảnh) cùng một lúc. Bạn sẽ cần mở 2 cửa sổ dòng lệnh (Terminal).

Bước 1: (Mở Terminal 1) - Chạy Server Backend
Server là nơi xử lý toàn bộ logic game, va chạm, kết nối và xác thực tài khoản.

1.1. Cấu hình Môi trường (Quan trọng!)

Trước khi chạy, bạn cần tạo một file .env trong thư mục server để lưu các khóa bí mật.

Đi vào thư mục server: cd server

Tạo file tên là .env

Thêm nội dung sau vào file .env:

PORT=5174
# Thay thế bằng chuỗi kết nối MongoDB Atlas của bạn
MONGODB_URI="your_mongodb_connection_string_here" 
# Thay thế bằng một chuỗi bí mật ngẫu nhiên
JWT_SECRET="your_super_secret_key_here" 


Lưu ý: File .gitignore đã được cấu hình để bỏ qua file này.

1.2. Cài đặt và Chạy Server

# 1. Đảm bảo bạn đang ở trong thư mục server
cd server

# 2. Cài đặt các thư viện cần thiết (chỉ làm 1 lần)
# Lệnh này sẽ cài đặt ws, mongoose, dotenv, bcryptjs, jsonwebtoken
npm install

# 3. Khởi động máy chủ
npm start


Nếu thành công, bạn sẽ thấy thông báo:
[Server] Đang kết nối tới MongoDB...
[Server] Đã kết nối MongoDB.
[Server] Đã khởi động tại http://localhost:5174

Quan trọng: Hãy để yên Terminal này chạy.

Bước 2: (Mở Terminal 2) - Chạy Client Frontend
Bây giờ, hãy mở một cửa sổ Terminal mới để chạy giao diện game.

# 1. Đi vào thư mục client (từ thư mục gốc)
cd client

# 2. Cài đặt các thư viện cần thiết (chỉ làm 1 lần)
# Lệnh này sẽ cài React, Vite...
npm install

# 3. Khởi động máy chủ development (Vite)
npm run dev


Bước 3: Chơi game!
Vite sẽ cung cấp cho bạn một địa chỉ, thường là: http://localhost:5173/

Mở trình duyệt (Chrome, Firefox...) và truy cập địa chỉ đó.

Bạn sẽ thấy màn hình Đăng nhập / Đăng ký. Sau khi đăng nhập thành công, bạn có thể nhấn "Chơi ngay" để vào game.

Để kiểm tra multiplayer, bạn có thể mở 2 tab trình duyệt cùng lúc và đăng nhập bằng 2 tài khoản khác nhau.