import Carousel from "react-bootstrap/Carousel";
import { FaPlay } from "react-icons/fa";
import "../../CSS/HomePage.css";

function HomePage() {
  return (
    <>
      <Carousel slide interval={5000}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../assets/Banner/banner1.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../assets/Banner/banner2.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../assets/Banner/banner3.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      <div className="home-page-content">
        <nav className="navi">
          <a href="#" id="upcoming">
            Phim Sắp Chiếu
          </a>
          <a href="#" id="currently-playing">
            Phim Đang Chiếu
          </a>
          <a href="#" id="special">
            Suất Chiếu Đặc Biệt
          </a>
        </nav>
        <div className="movie-list">
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
          <div className="movie-item">
            <div className="image-container">
              <img src="https://via.placeholder.com/200x300" alt="movie" />
              <div className="overlay-icon">
                <FaPlay size={40} color="white" />
              </div>
            </div>
            <a href="#">Movie Title 1</a>
            <ul>
              <li>
                <span>Thể loại:</span> Phiêu lưu, Hoạt hình
              </li>
              <li>
                <span>Thời lượng:</span> 100 phút
              </li>
              <li>
                <span>Ngày khởi chiếu:</span> 29/11/2024
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;
