import React, { useState } from "react";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData, fetchData } from "../API/ApiService"; // Import your APIService functions
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../CSS/LoginRegister.css";

const LoginRegister = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submit for login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const users = await fetchData("accounts"); // Assuming 'accounts' is the endpoint for login
      const user = users.find((user) => user.email === email && user.password === password);
      if (user) {
        console.log("Login successful", user);
        navigate("/");
        // Handle login success (e.g., redirect)
      } else {
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in");
    }
  };

  // Handle form submit for registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const data = { name, email, password, dob, phone, gender, role: 2 }; // Assuming role 2 is for user

    try {
      const response = await postData("accounts", data);
      console.log("Registration successful", response);
      // Handle registration success (e.g., redirect to login)
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred while registering");
    }
  };

  // Handle the form submit for forgotten password (not yet fully implemented)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // Implement password reset functionality here
  };

  return (
    <div className="login-register-container">
      <Card className="text-center border-0">
        <Card.Body>
          <div className="tabs mb-4">
            <Button
              variant="outline-danger"
              className={`me-2 ${currentForm === "login" ? "active-tab" : ""}`}
              onClick={() => setCurrentForm("login")}
            >
              <i className="bi bi-box-arrow-in-right"></i> Đăng nhập
            </Button>
            <Button
              variant="outline-warning"
              className={currentForm === "register" ? "active-tab" : ""}
              onClick={() => setCurrentForm("register")}
            >
              <i className="bi bi-person-plus-fill"></i> Đăng ký
            </Button>
          </div>

          <div className="form-container">
            {currentForm === "login" && (
              <Form onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <Form.Group className="mb-3">
                  <Form.Check type="checkbox" label="Remember" id="remember" />
                </Form.Group>
                <div className="forgot-password">
                  <a
                    style={{ textDecoration: "none" }}
                    href="#"
                    onClick={() => setCurrentForm("forgotPassword")}
                  >
                    <i className="bi bi-question-circle"></i> Quên mật khẩu?
                  </a>
                </div>
                <Button type="submit" className="btn-danger w-100">
                  <i className="bi bi-box-arrow-in-right"></i> Đăng nhập
                </Button>
              </Form>
            )}

            {currentForm === "register" && (
              <Form onSubmit={handleRegister}>
                <h2>Đăng ký</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="* Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="* Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="* Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-calendar-event"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    placeholder="* Ngày sinh"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-telephone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder="* Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-gender-ambiguous"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">* Giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </Form.Select>
                </InputGroup>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <div className="terms mb-3">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        Tôi cam kết tuân theo{" "}
                        <a href="#">chính sách bảo mật</a> và{" "}
                        <a href="#">điều khoản sử dụng</a>.
                      </>
                    }
                  />
                </div>
                <Button type="submit" className="btn-warning w-100">
                  <i className="bi bi-person-plus-fill"></i> Đăng ký
                </Button>
              </Form>
            )}

            {currentForm === "forgotPassword" && (
              <Form onSubmit={handleForgotPassword}>
                <h2>Quên mật khẩu</h2>
                <p>Vui lòng nhập email để đặt lại mật khẩu</p>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    required
                  />
                </InputGroup>
                <Button type="submit" className="btn-warning w-100">
                  <i className="bi bi-envelope-fill"></i> Gửi yêu cầu
                </Button>
                <div className="mt-3">
                  <a href="#" onClick={() => setCurrentForm("login")}>
                    <i className="bi bi-box-arrow-in-left"></i> Quay lại Đăng nhập
                  </a>
                </div>
              </Form>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginRegister;
