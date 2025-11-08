Dự án Game Tank 2D (Bài tập lớn Lập trình Web)
Đây là dự án game bắn súng xe tăng 2D multiplayer thời gian thực, được xây dựng cho môn học IT4409.

🚀 Công nghệ sử dụng
Client (Giao diện & Game): React (Vite) + HTML5 Canvas

Server (Logic & Mạng): Node.js + WebSocket (ws)

Ngôn ngữ: JavaScript (ES Modules)

📂 Cấu trúc thư mục
/client: Chứa toàn bộ code cho phần React (UI, Giao diện) và Canvas (Lõi game).

/server: Chứa toàn bộ code cho phần Backend (Node.js, xử lý logic game).

💻 Hướng dẫn chạy (Development)
Để chơi game, bạn bắt buộc phải chạy cả Server (xử lý logic) và Client (hiển thị hình ảnh) cùng một lúc. Bạn sẽ cần mở 2 cửa sổ dòng lệnh (Terminal).

Bước 1: (Mở Terminal 1) - Chạy Server Backend
Server là nơi xử lý toàn bộ logic game, va chạm và kết nối.

Bash

# 1. Đi vào thư mục server
cd server

# 2. Cài đặt các thư viện cần thiết (chỉ làm 1 lần)
# Lệnh này sẽ cài đặt thư viện WebSocket (ws)
npm install

# 3. Khởi động máy chủ
npm start
Nếu thành công, bạn sẽ thấy thông báo: [Server] Đã khởi động tại http://localhost:5174

Quan trọng: Hãy để yên Terminal này chạy.

Bước 2: (Mở Terminal 2) - Chạy Client Frontend
Bây giờ, hãy mở một cửa sổ Terminal mới để chạy giao diện game.

Bash

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

Nhấn "Chơi ngay (Test)" để kết nối vào server và chơi.

Để kiểm tra multiplayer, bạn có thể mở 2 tab trình duyệt cùng lúc.