import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import "../../CSS/Header.css";

function Header() {
  return (
    <>
      <Container fluid className="bg-black">
        <Row className="d-flex justify-content-end py-2">
          <Col className="text-right Sig">
            <Link to="" className="text-white me-3">
              Đăng Nhập
            </Link>
            <Link to="" className="text-white">
              Đăng Ký
            </Link>
          </Col>
        </Row>
      </Container>
      <Navbar expand="lg" className="bg-white border-bottom">
        <Container>
          <Navbar.Brand
            href="#home"
            className="d-flex align-items-center nav-image"
          >
            <img src="../assets/Logo/black_on_trans.png" alt="Beta Cinemas" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="fw-bold fs-5 custom-nav">
              <Nav.Link href="#lichchieu">Lịch Chiếu Theo Rạp</Nav.Link>
              <Nav.Link href="#phim">Phim</Nav.Link>
              <Nav.Link href="#rap">Rạp</Nav.Link>
              <Nav.Link href="#giave">Giá Vé</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
