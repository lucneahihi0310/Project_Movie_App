import Carousel from "react-bootstrap/Carousel";
import { FaPlay } from "react-icons/fa";
import "../../CSS/HomePage.css";
import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [data, setData] = useState([]);
  const [movieType, setMovieType] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedMovieType, setSelectedMovieType] = useState(1);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [moviesResponse, movieTypesResponse, genresResponse] =
          await Promise.all([
            axios.get("http://localhost:3001/movies"),
            axios.get("http://localhost:3001/movietypes"),
            axios.get("http://localhost:3001/genres"),
          ]);
        setData(moviesResponse.data);
        setMovieType(movieTypesResponse.data);
        setCategory(genresResponse.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllData();
  }, []);

  const handleMovieTypeFilter = (type) => {
    setSelectedMovieType(type.id);
  };

  const filteredData = data.filter(
    (movie) => movie.movie_type === selectedMovieType
  );

  return (
    <>
      <Carousel slide interval={5000}>
        {data.map((movie, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={movie.poster[0]}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="home-page-content">
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
                className={selectedMovieType === type.id ? "actived" : ""}
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
              const { id, title, genre_ids, duration, poster } = movie;

              const getGenreNames = (genreIds) =>
                genreIds
                  .map((id) => category.find((genre) => genre.id === id)?.name)
                  .join(", ");

              return (
                <div className="movie-item" key={id}>
                  <div className="image-container">
                    <img
                      src={poster[1] || "https://via.placeholder.com/200x300"}
                      alt={title}
                    />
                    <div className="overlay-icon">
                      <FaPlay size={40} color="white" />
                    </div>
                  </div>
                  <a href="#">{title}</a>
                  <ul>
                    <li>
                      <span>Thể loại:</span> {getGenreNames(movie.genre_ids)}
                    </li>
                    <li>
                      <span>Thời lượng:</span> {duration || "N/A"} phút
                    </li>
                    <li>
                      <span>Ngày khởi chiếu:</span>{" "}
                      {movie.release_date || "N/A"}
                    </li>
                  </ul>
                </div>
              );
            })
          ) : (
            <p>Loading movies...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
