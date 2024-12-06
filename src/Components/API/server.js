const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const cron = require("node-cron");
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Đường dẫn file database.json
const databasePath = "../../../database.json";

// Hàm đọc dữ liệu từ file database.json
function getDatabase() {
    return JSON.parse(fs.readFileSync(databasePath, "utf8"));
}

// Cấu hình email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kubinduong2002@gmail.com",
        pass: "wubr bysj fvrk rvju", // App Password của bạn
    },
});

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
          <h2 style="color: #333; text-align: center;">Xin chào ${user.full_name} chúng tôi là MOVIE88,</h2>
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

// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
