import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchData } from "../API/ApiService";
import { MdChair } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import "../../CSS/Booking.css";

function Booking() {
  const { id: movieId } = useParams();
  const location = useLocation();
  const showtimeId = location.state?.showtimeId;
  const [movieData, setMovieData] = useState(null);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [screen, setScreen] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const sessionUser = JSON.parse(sessionStorage.getItem("account"));
  const localUser = JSON.parse(localStorage.getItem("rememberedAccount"));
  const user = sessionUser || localUser;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movie = await fetchData(`movies/${movieId}`);
        const showtime = movie.showtimes.find((s) => s.id === showtimeId);
        const genreData = await fetchData("genres");
        const languageData = await fetchData("languages");
        const cinemaData = await fetchData("cinema");
        const screenData = await fetchData("screens");

        setMovieData({ ...movie, selectedShowtime: showtime });
        setGenres(genreData);
        setScreen(screenData);
        setLanguages(languageData);
        setCinemas(cinemaData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [movieId, showtimeId]);

  const seats = Array.from({ length: 8 }, (_, rowIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    return Array.from({ length: 12 }, (_, seatIndex) => {
      const seatId = `${rowLabel}${seatIndex + 1}`;
      return { id: seatId, status: "empty" };
    });
  });

  const getSeatClass = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      return "seat-selected";
    }
    return "seat-empty";
  };

  const handleSeatSelection = (seatId) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((id) => id !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setShowAlertModal(true);
    } else {
      setShowModal(true);
    }
  };

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ") || "Unknown Genre";
  };
  const getScreenName = (screenId) => {
    return screen.find((screen) => screen.id == screenId)?.name || "Unknown Screen";
  }
  const getLanguageName = (languageId) => {
    return languages.find((language) => language.id == languageId)?.name || "Unknown Language";
  };
  const getCinemaName = (cinemaId) => {
    return cinemas.find((cinema) => cinema.id == cinemaId)?.name || "Unknown Cinema";
  };
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format price with commas and currency symbol
  const formatPrice = (price) => {
    return price
      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
      : "N/A";
  };

  if (!movieData) {
    return <div>Loading...</div>;
  }
  const handlePayment = async () => {
    const ticketInfo = {
        userName: user?.full_name,
        email: user?.email,
        phone: user?.phone,
        movieTitle: movieData.title,
        showDate: formatDate(movieData.selectedShowtime?.date),
        showTime: `${formatTime(movieData.selectedShowtime?.start_time)} - ${formatTime(movieData.selectedShowtime?.end_time)}`,
        seats: selectedSeats.join(", "),
        totalAmount: movieData.selectedShowtime?.price * selectedSeats.length,
    };

    try {
        const response = await fetch("http://localhost:5000/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketInfo),
        });

        const result = await response.json();

        if (result.url) {
            // Chuyển hướng người dùng đến trang thanh toán VNPay
            window.location.href = result.url;
        } else {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Error during payment:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
};

  
  return (
    <div className="booking-container">
      <div className="seats-container">
        <h3>Sơ đồ ghế</h3>
        <div className="seat-legend">
          <div className="legend-item">
            <MdChair className="seat-icon seat-empty-icon" size={20} />
            <span className="seat empty">Ghế trống</span>
          </div>
          <div className="legend-item">
            <MdChair className="seat-icon seat-selected-icon" size={20} />
            <span className="seat selected">Ghế đang chọn</span>
          </div>
          <div className="legend-item">
            <MdChair className="seat-icon seat-reserved-icon" size={20} />
            <span className="seat reserved">Ghế đã bán</span>
          </div>
        </div>
        <div className="screen">Màn hình chiếu</div>
        <div className="seats">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {row.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${getSeatClass(seat.id)}`}
                  onClick={() => handleSeatSelection(seat.id)}
                >
                  <MdChair className="seat-icon" size={20} />
                  <span>{seat.id}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="ticket">
        <div className="header">
          <img src={movieData.poster[1]} alt={movieData.title} className="poster" />
        </div>
        <div className="info">
          <h2>{movieData.title}</h2>
          <p>{getLanguageName(movieData.language_id)}</p>
          <ul>
            <li>
              <strong>Thể loại:</strong> {getGenreNames(movieData.genre_ids)}
            </li>
            <li>
              <strong>Thời lượng:</strong> {movieData.duration} phút
            </li>
            <li>
              <strong>Rạp chiếu:</strong> {getCinemaName(movieData.selectedShowtime?.cinema_id)}
            </li>
            <li>
              <strong>Ngày chiếu:</strong> {formatDate(movieData.selectedShowtime?.date)}
            </li>
            <li>
              <strong>Giờ chiếu:</strong> {formatTime(movieData.selectedShowtime?.start_time)} - {formatTime(movieData.selectedShowtime?.end_time)}
            </li>
            <li>
              <strong>Phòng chiếu:</strong> {getScreenName(movieData.selectedShowtime?.screen_id)}
            </li>
            <li>
              <strong>Ghế:</strong> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn ghế"}
            </li>
            <li>
              <strong>Tổng tiền:</strong> {formatPrice(movieData.selectedShowtime?.price * selectedSeats.length)}
            </li>
          </ul>
          <button className="continue-button" onClick={handleContinue}>Tiếp tục</button>
        </div>
      </div>

      {/* Modal thông báo khi chưa chọn ghế */}
      <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Vui lòng chọn ít nhất một ghế trước khi tiếp tục!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận đặt vé */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đặt vé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Người đặt:</strong> {user?.full_name || "Khách"}</p>
          <p><strong>Email người đặt:</strong> {user?.email}</p>
          <p><strong>Số điện thoại người đặt:</strong> {user?.phone || "Khách"}</p>
          <p><strong>Thời gian đặt:</strong> {new Date().toLocaleString()}</p>
          <p><strong>Thông tin vé:</strong></p>
          <ul>
            <li>
              <strong>Rạp chiếu:</strong> {getCinemaName(movieData.selectedShowtime?.cinema_id)}
            </li>
            <li><strong>Phim:</strong> {movieData.title}</li>
            <li>
              <strong>Thời lượng:</strong> {movieData.duration} phút
            </li>
            <li>
              <strong>Phòng chiếu:</strong> {getScreenName(movieData.selectedShowtime?.screen_id)}
            </li>
            <li><strong>Ghế:</strong> {selectedSeats.join(", ")}</li>
            <li>
              <strong>Ngày chiếu:</strong> {formatDate(movieData.selectedShowtime?.date)}
            </li>
            <li><strong>Thời gian chiếu:</strong> {formatTime(movieData.selectedShowtime?.start_time)} - {formatTime(movieData.selectedShowtime?.end_time)}</li>
            <li><strong>Tổng tiền:</strong> {formatPrice(movieData.selectedShowtime?.price * selectedSeats.length)}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Thanh Toán
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Booking;
