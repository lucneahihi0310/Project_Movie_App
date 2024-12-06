import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";

function UserProfile() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="center">
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <h4
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "3rem",
                }}
              >
                Thông tin tài khoản
              </h4>
              <Row>
                <Col md={6}>
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Họ và tên"
                    style={{ width: "80%" }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    style={{ width: "80%" }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    style={{ width: "80%" }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Ngày Sinh</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    style={{ width: "80%" }}
                  />
                </Col>
                <Col md={12}>
                  <Form.Label htmlFor="inputAddress">Địa chỉ</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{ width: "90%", height: "100px" }}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </Col>
              </Row>

              {/* Đổi mật khẩu link above submit button */}
              <Row style={{ marginTop: "2rem" }}>
                <Col>
                  <a href="#" onClick={handleShow}>
                    Đổi mật khẩu
                  </a>
                </Col>
              </Row>

              {/* Submit Button */}
              <Row
                className="d-flex justify-content-center"
                style={{ marginTop: "2rem" }}
              >
                <Col xs="auto">
                  <Button
                    style={{ width: "8rem", background: "#2891d3" }}
                    type="submit"
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Label>Mật khẩu hiện tại</Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  autoFocus
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Label>Mật khẩu mới</Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control type="password" placeholder="Nhập mật khẩu mới" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  placeholder="Nhập xác nhận mật khẩu mới"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-right">
          <Button
            variant="primary"
            style={{ width: "8rem", background: "#2891d3" }}
            onClick={handleClose}
          >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
