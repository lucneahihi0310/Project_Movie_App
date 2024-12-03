import { FaPlay } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../../CSS/MoviePage.css";
import { Modal, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoTicketOutline } from "react-icons/io5";

function MoviePage() {
  const [data, setData] = useState([]);
  const [movieType, setMovieType] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMovieType, setSelectedMovieType] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cinema, setCinema] = useState([]);
  const [showTime, setShowTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [language, setLanguage] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/movies")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching movies:", error));

    fetch("http://localhost:3001/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error("Error fetching genres:", error));

    fetch("http://localhost:3001/movietypes")
      .then((response) => response.json())
      .then((data) => setMovieType(data))
      .catch((error) => console.error("Error fetching movie types:", error));

    fetch(`http://localhost:3001/cinema`)
      .then((response) => response.json())
      .then((data) => setCinema(data))
      .catch((error) => console.error("Error fetching showtimes:", error));

    fetch(`http://localhost:3001/languages`)
      .then((response) => response.json())
      .then((data) => setLanguage(data))
      .catch((error) => console.error("Error fetching showtimes:", error));
  }, []);

  useEffect(() => {
    if (showTime.length > 0) {
      const earliestDate = showTime.map((showtime) => showtime.date).sort()[0];
      setSelectedDate(earliestDate);
    }
  }, [showTime]);

  const handleMovieTypeFilter = (type) => {
    setSelectedMovieType(type.id);
  };

  const handleBookTicket = (movie) => {
    setSelectedMovie(movie);

    fetch(`http://localhost:3001/showtimes?movie_id=${movie.id}`)
      .then((response) => response.json())
      .then((data) => {
        setShowTime(data);
        setShowBookingModal(true);
        setShowModal(false);
        setSelectedShowtime(null);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  console.log(showTime);
  const filteredData = data.filter(
    (movie) => movie.movie_type == selectedMovieType
  );

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");

  const getLanguageName = (languageId) =>
    language.find((language) => language.id == languageId)?.name;

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    setShowBookingModal(false);
    setSelectedShowtime(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowBookingModal(false);
    setSelectedShowtime(null);
    setSelectedMovie(null);
  };

  const handleShowtimeClick = (showtimes) => {
    setSelectedShowtime(showtimes);
    setShowModal(false);
    setShowBookingModal(false);
  };

  const handleCloseModal = () => {
    setSelectedShowtime(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const filteredShowtimes = showTime.filter(
    (showtimes) => showtimes.date === selectedDate
  );

  return (
    <>
      <div className="movie-page-content">
        <nav className="navi">
          {movieType.length > 0 ? (
            movieType.map((type) => (
              <a
                key={type.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMovieTypeFilter(type);
                }}
                className={selectedMovieType == type.id ? "actived" : ""}
              >
                {type.name}
              </a>
            ))
          ) : (
            <p>Loading movie types...</p>
          )}
        </nav>

        <div className="movie-list">
          {filteredData.length > 0 ? (
            filteredData.map((movie) => {
              return (
                <div className="movie-items" key={movie.id}>
                  <div className="image-container">
                    <img
                      src={
                        movie.poster[1] || "https://via.placeholder.com/200x300"
                      }
                      alt={movie.title}
                    />
                    <div
                      className="overlay-icon"
                      onClick={() => openModal(movie)}
                    >
                      <FaPlay size={40} color="white" />
                    </div>
                  </div>
                  <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                  <ul>
                    <li>
                      <span>Thể loại:</span> {getGenreNames(movie.genre_ids)}
                    </li>
                    <li>
                      <span>Thời lượng:</span> {movie.duration || "N/A"} phút
                    </li>
                    <li>
                      <span>Ngày khởi chiếu:</span>{" "}
                      {movie.release_date || "N/A"}
                    </li>
                  </ul>
                  <Button onClick={() => handleBookTicket(movie)}>
                    <IoTicketOutline
                      style={{ marginRight: "8px", fontSize: "1.5rem" }}
                    />
                    Đặt vé
                  </Button>
                </div>
              );
            })
          ) : (
            <p>Đang load phim</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Trailer: {selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="415"
            src={selectedMovie?.video_url}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal.Body>
      </Modal>

      <Modal show={showBookingModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lịch chiếu: {selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{ margin: "1rem", textAlign: "center", fontSize: "2rem" }}>
            {cinema.name}
          </h5>
          <div className="container">
            <div className="date-selector">
              {showTime
                .map((s) => s.date)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((date) => (
                  <div
                    key={date}
                    className={`date-item ${
                      selectedDate === date ? "active" : ""
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    {formatDate(date)}
                  </div>
                ))}
            </div>
            <div className="schedule">
              {[...new Set(filteredData.map((movie) => movie.language_id))].map(
                (languageId) => (
                  <h2 key={languageId}>{getLanguageName(languageId)}</h2>
                )
              )}
              <div className="time-slot">
                {filteredShowtimes.length > 0 ? (
                  filteredShowtimes.map((show) => (
                    <div
                      key={show.id}
                      className="time-box"
                      onClick={() => handleShowtimeClick(show)}
                    >
                      <p>{formatTime(show.start_time)}</p>
                      <span>Giá vé: {show.price.toLocaleString()} VNĐ</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    Không có lịch chiếu
                  </p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={selectedShowtime}
        onHide={handleCloseModal}
        centered
        className="custom-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Bạn đang đặt vé xem phim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedShowtime && (
            <>
              <h5>{selectedMovie?.title}</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Rạp chiếu</th>
                    <th>Ngày chiếu</th>
                    <th>Giờ chiếu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{cinema.name}</td>
                    <td>{selectedShowtime.date}</td>
                    <td>{formatTime(selectedShowtime.start_time)}</td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">
            {" "}
            <IoTicketOutline
              style={{ marginRight: "8px", fontSize: "1.5rem" }}
            />
            Đặt vé
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MoviePage;
