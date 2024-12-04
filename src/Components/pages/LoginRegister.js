import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData, fetchData } from "../API/ApiService";
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
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const data = { name, email, password, dob, phone, gender, role: 2 };

    try {
      const response = await postData("accounts", data);
      console.log("Registration successful", response);
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred while registering");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
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
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginRegister;
