import React, { useState } from "react";
import "../../CSS/LoginRegister.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(""); // Notification message
    const [loading, setLoading] = useState(false); // Loading state for API request

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting the form

        if (email) {
            try {
                // Replace with your actual API endpoint
                const response = await fetch("/api/send-recovery-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage("Mật khẩu mới đã được gửi vào mail của bạn!"); // Updated success message
                } else {
                    setMessage(data.message || "Đã xảy ra lỗi, vui lòng thử lại.");
                }
            } catch (error) {
                setMessage("Đã xảy ra lỗi, vui lòng thử lại.");
            }
        } else {
            setMessage("Vui lòng nhập email hợp lệ.");
        }
        setLoading(false); // Reset loading after API call
    };

    return (
        <div className="forgot-password-container">
            <h2>Quên mật khẩu</h2>
            <p>
                Vui lòng nhập địa chỉ email của bạn để chúng tôi gửi liên kết khôi phục
                mật khẩu.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn submit-btn" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
            <a
                href="#"
                className="back-to-login"
                onClick={() => setIsForgotPassword(false)}
            >
                Quay lại đăng nhập
            </a>
        </div>
    );
};

export default ForgotPassword;
