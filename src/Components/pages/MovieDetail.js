import React, { useEffect, useState } from "react";
import "../../CSS/MovieDetail.css";
import { useParams } from "react-router-dom";
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

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
    fetch(`http://localhost:3001/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie:", error));
    fetch("http://localhost:3001/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error("Error fetching genres:", error));

    fetch("http://localhost:3001/languages")
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => console.error("Error fetching languages:", error));
    fetch(`http://localhost:3001/showtimes?movie_id=${id}`)
      .then((response) => response.json())
      .then((data) => setShowtimes(data))
      .catch((error) => console.error("Error fetching showtimes:", error));
  }, [id]);
  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  const getGenreNames = (genreIds) =>
    genreIds
      .map((id) => genres.find((genre) => genre.id == id)?.name)
      .join(", ");

  const getLanguageName = (languageId) =>
    languages.find((language) => language.id == languageId)?.name;
  return (
    <div className="movie-detail">
      <main className="content">
        <div className="breadcrumb">
          <a href="#">Home</a> &gt; Linh Miêu
        </div>

        <div className="movie-info">
          <div className="poster">
            <img
              src={movie.poster[1]}
              alt={`${movie.title} Poster`}
              className="poster-image"
            />
          </div>

          <div className="details">
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <ul class="list-unstyled row">
              <li class="col-md-3 col-sm-5">
                <strong>ĐẠO DIỄN:</strong>
              </li>
              <li class="col-md-9 col-sm-7">{movie.director}</li>

              <li class="col-md-3 col-sm-5">
                <strong>DIỄN VIÊN:</strong>
              </li>
              <li class="col-md-9 col-sm-7">{movie.actor}</li>

              <li class="col-md-3 col-sm-5">
                <strong>THỂ LOẠI:</strong>
              </li>
              <li class="col-md-9 col-sm-7">
                {getGenreNames(movie.genre_ids)}
              </li>

              <li class="col-md-3 col-sm-5">
                <strong>THỜI LƯỢNG:</strong>
              </li>
              <li class="col-md-9 col-sm-7">{movie.duration} phút</li>

              <li class="col-md-3 col-sm-5">
                <strong>NGÔN NGỮ:</strong>
              </li>
              <li class="col-md-9 col-sm-7">
                {getLanguageName(movie.language_id)}
              </li>

              <li class="col-md-3 col-sm-5">
                <strong>NGÀY KHỞI CHIẾU:</strong>
              </li>
              <li class="col-md-9 col-sm-7">{movie.release_date}</li>
            </ul>
          </div>
        </div>

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
                  <span>{slot.seats}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
