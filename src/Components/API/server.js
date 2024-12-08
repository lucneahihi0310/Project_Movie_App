const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");
const cron = require("node-cron");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Đường dẫn file database.json
const databasePath = "../../../database.json";

// Cấu hình VNPay
const vnpayConfig = {
    vnp_TmnCode: "7HJM21XJ", // Mã TMN
    vnp_HashSecret: "EUGNBYHOEDDNGAR4NW90DXOGTIXGS26I", // Secret Key
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // URL thanh toán môi trường TEST
    vnp_ReturnUrl: "http://localhost:5000/payment-result", // URL trả về kết quả thanh toán
};

// Cấu hình email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kubinduong2002@gmail.com",
        pass: "wubr bysj fvrk rvju", // App Password của bạn
    },
});

// Hàm đọc dữ liệu từ file database.json
function getDatabase() {
    return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

// API xử lý quên mật khẩu
app.post("/api/forgot-password", (req, res) => {
    const { email } = req.body;

    const database = getDatabase();
    const accounts = database.accounts;

    // Kiểm tra xem email có tồn tại trong hệ thống không
    const user = accounts.find((u) => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // Tạo token reset mật khẩu
    const resetToken = Math.random().toString(36).substring(2, 12);
    const tokenExpirationTime = Date.now() + 300000; // 5 phút

    // Gửi email
    const mailOptions = {
        from: "kubinduong2002@gmail.com",
        to: email,
        subject: "Đặt lại mật khẩu của bạn",
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <img src="https://duongvanluc2002.sirv.com/black_on_trans.png" width="100" height="100" alt="Logo" style="margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
          <h2 style="color: #333; text-align: center;">Xin chào ${user.full_name}</h2>
          <p style="font-size: 16px; color: #555;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã dưới đây để thay đổi mật khẩu của bạn:</p>
          <div style="text-align: center; margin: 20px 0;">
            <h3 style="font-size: 24px; color: #007bff; font-weight: bold;">${resetToken}</h3>
          </div>
          <p style="font-size: 16px; color: #555;">Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này. Mã đặt lại mật khẩu này sẽ hết hạn trong vòng 5 phút.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 14px; color: #777; text-align: center;">Nếu bạn gặp bất kỳ vấn đề gì, hãy liên hệ với chúng tôi qua email này.</p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #777;">Trân trọng,</p>
            <p style="font-size: 14px; color: #777;">Đội ngũ hỗ trợ khách hàng của chúng tôi</p>
          </div>
        </div>
      </div>
    `,
    };

    // Lưu token và thời gian hết hạn vào tài khoản
    user.resetToken = resetToken;
    user.resetTokenExpiration = tokenExpirationTime;

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Gửi email thất bại!" });
        }

        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
        res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
    });
});

// API cập nhật mật khẩu mới
app.post("/api/reset-password", (req, res) => {
    const { email, resetToken, newPassword } = req.body;

    const database = getDatabase();
    const accounts = database.accounts;

    // Kiểm tra xem email có tồn tại trong hệ thống không
    const user = accounts.find((u) => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // Kiểm tra token có hợp lệ không
    if (user.resetToken !== resetToken) {
        return res.status(400).json({ message: "Mã reset không hợp lệ!" });
    }

    // Kiểm tra xem token có hết hạn chưa
    if (Date.now() > user.resetTokenExpiration) {
        delete user.resetToken;
        delete user.resetTokenExpiration;
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
        return res.status(400).json({ message: "Mã reset đã hết hạn!" });
    }

    // Cập nhật mật khẩu
    user.password = newPassword;
    delete user.resetToken;
    delete user.resetTokenExpiration;
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));

    res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
});

// Cron job để kiểm tra và xóa các token hết hạn
cron.schedule("* * * * *", () => {
    const database = getDatabase();
    const accounts = database.accounts;

    accounts.forEach((user) => {
        if (user.resetToken && Date.now() > user.resetTokenExpiration) {
            delete user.resetToken;
            delete user.resetTokenExpiration;

            fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
            console.log(`Reset token của người dùng ${user.email} đã hết hạn và bị xóa.`);
        }
    });
});

// API xử lý thanh toán
app.post("/payment", (req, res) => {
    const ticketInfo = req.body;

    // Tạo mã giao dịch (txnRef)
    const txnRef = new Date().getTime();

    // Thông tin thanh toán
    const vnp_Params = {
        vnp_TmnCode: vnpayConfig.vnp_TmnCode,
        vnp_Amount: ticketInfo.totalAmount * 100, // Số tiền thanh toán, VNPay yêu cầu tính bằng đồng
        vnp_BillFirstName: ticketInfo.userName,
        vnp_BillEmail: ticketInfo.email,
        vnp_BillPhone: ticketInfo.phone,
        vnp_OrderInfo: `Thanh toán vé phim ${ticketInfo.movieTitle}`,
        vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
        vnp_TxnRef: txnRef,
        vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, ""),
        vnp_Locale: "vn", // Hoặc "en" tùy thuộc vào ngôn ngữ bạn muốn
        vnp_CurrCode: "VND", // Đơn vị tiền tệ
    };

    // Tạo chữ ký
    const queryString = Object.keys(vnp_Params)
        .map((key) => `${key}=${vnp_Params[key]}`)
        .join("&");

    const secureHash = crypto
        .createHmac("sha512", vnpayConfig.vnp_HashSecret)
        .update(queryString)
        .digest("hex");

    // Thêm chữ ký vào tham số
    vnp_Params.vnp_SecureHash = secureHash;

    // Tạo URL thanh toán
    const vnpUrl = `${vnpayConfig.vnp_Url}?${new URLSearchParams(vnp_Params).toString()}`;

    // Trả về URL thanh toán
    res.json({ url: vnpUrl });
});

// Xử lý kết quả thanh toán
app.get("/payment-result", (req, res) => {
    const vnpayData = req.query;
    const secureHash = vnpayData.vnp_SecureHash;

    const queryString = Object.keys(vnpayData)
        .filter((key) => key !== "vnp_SecureHash")
        .map((key) => `${key}=${vnpayData[key]}`)
        .join("&");

    const hashData = crypto
        .createHmac("sha512", vnpayConfig.vnp_HashSecret)
        .update(queryString)
        .digest("hex");

    if (secureHash === hashData && vnpayData.vnp_ResponseCode === "00") {
        // Thanh toán thành công
        const ticketInfo = {
            userName: vnpayData.vnp_BillFirstName,
            movieTitle: "Tên Phim", // Lấy thông tin phim từ database
            showDate: "Ngày Chiếu", // Lấy ngày chiếu
            showTime: "Giờ Chiếu", // Lấy giờ chiếu
            seats: "Ghế Đã Chọn", // Lấy ghế từ thông tin frontend
            totalAmount: vnpayData.vnp_Amount / 100, // Tiền đã thanh toán
        };

        // Gửi email thông báo cho người dùng
        sendTicketEmail(vnpayData.vnp_BillEmail, ticketInfo);

        res.send("Thanh toán thành công và email đã được gửi.");
    } else {
        res.send("Thanh toán thất bại.");
    }
});

// Hàm gửi email
const sendTicketEmail = (userEmail, ticketInfo) => {
    const mailOptions = {
        from: "kubinduong2002@gmail.com",  // Email người gửi
        to: userEmail,  // Địa chỉ email người nhận
        subject: `Thông tin vé đặt chỗ - ${ticketInfo.movieTitle}`,
        html: `
      <h2>Thông tin vé của bạn</h2>
      <p><strong>Người đặt:</strong> ${ticketInfo.userName}</p>
      <p><strong>Phim:</strong> ${ticketInfo.movieTitle}</p>
      <p><strong>Ngày chiếu:</strong> ${ticketInfo.showDate}</p>
      <p><strong>Giờ chiếu:</strong> ${ticketInfo.showTime}</p>
      <p><strong>Ghế:</strong> ${ticketInfo.seats}</p>
      <p><strong>Tổng tiền:</strong> ${ticketInfo.totalAmount}</p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
