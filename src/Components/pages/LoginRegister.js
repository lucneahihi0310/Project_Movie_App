import React, { useState } from "react";
// import FacebookLogin from 'react-facebook-login'; // Import thư viện Facebook Login
import "../../CSS/LoginRegister.css";

const LoginRegister = () => {
    const [currentForm, setCurrentForm] = useState("login"); // "login", "register", "forgotPassword"
    //   const [facebookData, setFacebookData] = useState(null); // Dữ liệu từ Facebook

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý đăng nhập, đăng ký hoặc quên mật khẩu ở đây
        console.log("Form submitted!");
    };

    //   const responseFacebook = (response) => {
    //     console.log("Facebook response:", response); // Xử lý phản hồi từ Facebook
    //     if (response.status !== "unknown") {
    //       setFacebookData(response); // Lưu dữ liệu từ Facebook vào state
    //     } else {
    //       console.error("Facebook login failed");
    //     }
    //   };

    return (
        <div className="login-register-container">
            <div className="tabs">
                <button
                    className={currentForm === "login" ? "active-tab" : ""}
                    onClick={() => setCurrentForm("login")}
                >
                    Đăng nhập
                </button>
                <button
                    className={currentForm === "register" ? "active-tab" : ""}
                    onClick={() => setCurrentForm("register")}
                >
                    Đăng ký
                </button>
            </div>

            <div className="form-container">
                {currentForm === "login" && (
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2>Đăng nhập</h2>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Mật khẩu" required />
                        <a
                            href="#"
                            className="forgot-password"
                            onClick={() => setCurrentForm("forgotPassword")}
                        >
                            Quên mật khẩu?
                        </a>
                        <button type="submit" className="btn login-btn">
                            Đăng nhập
                        </button>
                        {/* <FacebookLogin
              appId="552157667519890" // Thay bằng app ID của bạn
              autoLoad={false} 
              fields="name,email,picture"
              callback={responseFacebook} 
              cssClass="btn facebook-btn" 
            /> */}
                    </form>
                )}

                {currentForm === "register" && (
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2>Đăng ký</h2>
                        <input type="text" placeholder="* Họ tên" required />
                        <input type="email" placeholder="* Email" required />
                        <input type="password" placeholder="* Mật khẩu" required />
                        <input
                            type="password"
                            placeholder="* Xác nhận lại mật khẩu"
                            required
                        />
                        <input type="date" placeholder="* Ngày sinh" required />
                        <input type="tel" placeholder="* Số điện thoại" required />
                        <select required>
                            <option value="">* Giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        <div className="terms">
                            <input type="checkbox" required />
                            <label>
                                Tôi cam kết tuân theo{" "}
                                <a href="#">chính sách bảo mật</a> và{" "}
                                <a href="#">điều khoản sử dụng</a>.
                            </label>
                        </div>
                        <button type="submit" className="btn register-btn">
                            Đăng ký
                        </button>
                        {/* <FacebookLogin
              appId="552157667519890" // Thay bằng app ID của bạn
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              cssClass="btn facebook-btn"
            /> */}
                    </form>
                )}

                {currentForm === "forgotPassword" && (
                    <form className="forgot-password-form" onSubmit={handleSubmit}>
                        <h2>Quên mật khẩu</h2>
                        <p>Vui lòng nhập email để đặt lại mật khẩu</p>
                        <input type="email" placeholder="Email" required />
                        <button type="submit" className="btn reset-btn">
                            Gửi yêu cầu
                        </button>
                        <p>
                            <a href="#" onClick={() => setCurrentForm("login")}>
                                Quay lại Đăng nhập
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginRegister;
