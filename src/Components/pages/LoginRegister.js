import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData, fetchData } from "../API/ApiService";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../CSS/LoginRegister.css";

const LoginRegister = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFull_name] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedAccount = localStorage.getItem("rememberedAccount");
    if (rememberedAccount) {
      const { email, password } = JSON.parse(rememberedAccount);
      setEmail(email);
      setPassword(password);
      setRemember(true);
    }

    const account = localStorage.getItem("account");
    if (account) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const users = await fetchData("accounts");
      const existUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (existUser) {
        if (remember) {
          const userData = {
            id: existUser.id,
            email: existUser.email,
            password: existUser.password,
            full_name: existUser.full_name,
            role: existUser.role
          };
          localStorage.setItem("rememberedAccount", JSON.stringify(userData));
        } else {
          localStorage.removeItem("rememberedAccount");
        }
        sessionStorage.setItem("account", JSON.stringify(existUser));
        navigate("/");
      } else {
        setErrorMessage("Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const data = { full_name, email, password, dob, phone, gender, role: 2 };

    try {
      const response = await postData("accounts", data);
      console.log("Registration successful", response);

      setShowSuccessModal(true);

      setCurrentForm("login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred while registering");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Email không được để trống");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Yêu cầu đặt lại mật khẩu đã được gửi.");
        setCurrentForm("resetPassword");
      } else {
        setErrorMessage(data.message || "Đã xảy ra lỗi khi gửi yêu cầu!");
      }
    } catch (error) {
      console.error("Error in forgot password:", error);
      setErrorMessage("Không thể kết nối đến server, vui lòng thử lại.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), resetToken, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Mật khẩu đã được thay đổi.");
        setCurrentForm("login");
      } else {
        setErrorMessage(data.message || "Đã xảy ra lỗi khi thay đổi mật khẩu!");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Không thể kết nối đến server, vui lòng thử lại.");
    }
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
                <Form.Group
                  className="mb-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    marginLeft: "10px",
                  }}
                >
                  <Form.Check.Input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ marginRight: "10px" }} />
                  <Form.Check.Label htmlFor="remember">Remember</Form.Check.Label>
                </Form.Group>

                <div className="forgot-password">
                  <Button
                    style={{
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentForm("forgotPassword")}
                  >
                    <i className="bi bi-question-circle"></i> Quên mật khẩu?
                  </Button>
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
                    value={full_name}
                    onChange={(e) => setFull_name(e.target.value)}
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
                  <Form.Control
                    as="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">* Giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </Form.Control>
                </InputGroup>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <Button type="submit" className="btn-warning w-100">
                  <i className="bi bi-person-plus-fill"></i> Đăng ký
                </Button>
              </Form>
            )}
            <Modal
              show={showSuccessModal}
              onHide={() => setShowSuccessModal(false)}
              backdrop="static"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Registration Successful</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Your account has been successfully created. You will be redirected to the login page.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            {currentForm === "forgotPassword" && (
              <>
                <Form onSubmit={handleForgotPassword}>
                  {errorMessage && <div className="text-danger">{errorMessage}</div>}

                  <h2 className="mb-4">Quên mật khẩu</h2>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                      required
                    />
                  </InputGroup>

                  <Button variant="primary" type="submit" className="w-100">
                    Gửi yêu cầu đặt lại mật khẩu
                  </Button>
                </Form>
              </>
            )}

            {currentForm === "resetPassword" && (
              <>
                <Form onSubmit={handleResetPassword}>
                  {errorMessage && <div className="text-danger">{errorMessage}</div>}

                  <h2 className="mb-4">Đặt lại mật khẩu</h2>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-key"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Nhập mã reset"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-lock"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-lock-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu mới"
                      required
                    />
                  </InputGroup>

                  <Button variant="primary" type="submit" className="w-100">
                    Đặt lại mật khẩu
                  </Button>
                </Form>
              </>
            )}

          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginRegister;
