// Đây là một lớp mới để quản lý kết nối WebSocket
// Nó sẽ được khởi tạo bởi Game.js

export class SocketClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.messageListeners = [];
        this.onOpenCallback = null;
    }

    connect() {
        console.log(`Đang kết nối tới ${this.url}...`);
        // Giả sử server của bạn chạy ở localhost:8080 (cổng mặc định)
        // Nếu khác, bạn của bạn cần cung cấp địa chỉ
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("SocketClient: Đã kết nối tới server.");
            if(this.onOpenCallback){//gọi callback nếu đã được đăng ký
                this.onOpenCallback();
            }
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Gửi dữ liệu nhận được cho tất cả các "listener" (ví dụ: Game.js)
            this.messageListeners.forEach(listener => listener(data));
        };

        this.socket.onclose = () => {
            console.log("SocketClient: Đã ngắt kết nối.");
        };

        this.socket.onerror = (error) => {
            console.error("SocketClient: Lỗi WebSocket!", error);
        };
    }

    // Hàm này để App.jsx đăng ký callback một cách an toàn
    onOpen(callback) {
        this.onOpenCallback = callback;
        // Nếu socket đã mở rồi thì gọi callback ngay lập
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            callback();
        }
    }

    // Hàm để Game.js đăng ký lắng nghe tin nhắn
    addMessageListener(callback) {
        this.messageListeners.push(callback);
    }

    // Hàm để gửi dữ liệu đi (dưới dạng JSON)
    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn("SocketClient: Không thể gửi tin nhắn, kết nối chưa sẵn sàng.");
        }
    }

    // Hàm để đóng kết nối
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
