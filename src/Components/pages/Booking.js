import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchData } from "../API/ApiService";
import "../../CSS/Booking.css";
import { MdChair } from "react-icons/md";

function Booking() {
  const { id: movieId } = useParams();
  const location = useLocation();
  const showtimeId = location.state?.showtimeId;
  const [movieData, setMovieData] = useState(null);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movie = await fetchData(`movies/${movieId}`);
        const showtime = movie.showtimes.find((s) => s.id === showtimeId);
        const genreData = await fetchData("genres");
        const languageData = await fetchData("languages");
        const cinemaData = await fetchData("cinema");

        setMovieData({ ...movie, selectedShowtime: showtime });
        setGenres(genreData);
        setLanguages(languageData);
        setCinemas(cinemaData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [movieId, showtimeId]);

  // Tạo mảng ghế cho 8 hàng (A-H) và mỗi hàng có 12 ghế (1-12)
  const seats = Array.from({ length: 8 }, (_, rowIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex); // Tạo hàng từ A đến H
    return Array.from({ length: 12 }, (_, seatIndex) => {
      const seatId = `${rowLabel}${seatIndex + 1}`; // Ghế A1, A2, ..., H12
      return { id: seatId, status: "empty" };
    });
  });

  // Hàm xác định class cho ghế (chọn, trống, đã đặt)
  const getSeatClass = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      return "seat-selected";
    }
    return "seat-empty";
  };

  // Hàm xử lý chọn ghế
  const handleSeatSelection = (seatId) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((id) => id !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  if (!movieData) {
    return <div>Loading...</div>;
  }

  const getGenreNames = (genreIds) => {
    const genreNames = genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");
    return genreNames || "Unknown Genre";
  };

  const getLanguageName = (languageId) => {
    const languageName = languages.find(
      (language) => language.id == languageId
    )?.name;
    return languageName || "Unknown Language";
  };

  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const time = new Date();
    time.setHours(hours, minutes, seconds, 0);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
          <img
            src={movieData.poster}
            alt={movieData.title}
            className="poster"
          />
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
              <strong>Rạp chiếu:</strong> {cinemas[0]?.name || "N/A"}
            </li>
            <li>
              <strong>Ngày chiếu:</strong>{" "}
              {formatDate(movieData.selectedShowtime?.date)}
            </li>
            <li>
              <strong>Giờ chiếu:</strong>{" "}
              {formatTime(movieData.selectedShowtime?.start_time)} -{" "}
              {formatTime(movieData.selectedShowtime?.end_time)}
            </li>
            <li>
              <strong>Phòng chiếu:</strong> Phòng{" "}
              {movieData.selectedShowtime?.screen_id || "N/A"}
            </li>
            <li>
              <strong>Ghế:</strong>{" "}
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "Chưa chọn ghế"}
            </li>
          </ul>
          <button className="continue-button">Tiếp tục</button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
