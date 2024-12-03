import { FaPlay } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../../CSS/MoviePage.css";
import { Modal, Button } from "react-bootstrap";
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

  const [selectedDate, setSelectedDate] = useState("30/11 - T7");

  const dates = [
    { id: 1, label: "30/11 - T7" },
    { id: 2, label: "01/12 - CN" },
    { id: 3, label: "02/12 - T2" },
    { id: 4, label: "03/12 - T3" },
  ];

  const timeSlots = [
    { time: "09:30 NORMAL", seats: "132 ghế trống" },
    { time: "11:40 NORMAL", seats: "136 ghế trống" },
    { time: "14:15 NORMAL", seats: "170 ghế trống" },
    { time: "20:00 NORMAL", seats: "156 ghế trống" },
  ];
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
  }, []);

  const handleMovieTypeFilter = (type) => {
    setSelectedMovieType(type.id);
  };

  const handleBookTicket = (movie) => {
    setSelectedMovie(movie); // Set the selected movie
    setShowBookingModal(true); // Show the booking modal
  };

  const filteredData = data.filter(
    (movie) => movie.movie_type == selectedMovieType
  );

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowBookingModal(false);
    setSelectedMovie(null);
  };

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
            <p>Loading movies...</p>
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
          <h5 style={{ margin: "1rem", textAlign: "center" }}>{cinema.name}</h5>
          <div className="container">
            <div className="date-selector">
              {dates.map((date) => (
                <div
                  key={date.id}
                  className={`date-item ${
                    selectedDate === date.label ? "active" : ""
                  }`}
                  onClick={() => setSelectedDate(date.label)}
                >
                  {date.label}
                </div>
              ))}
            </div>
            <div className="schedule">
              <h2>2D PHỤ ĐỀ</h2>
              <div className="time-slot">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="time-box">
                    <p>{slot.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MoviePage;
