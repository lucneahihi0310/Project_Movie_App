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
    const handleFetchData = async () => {
      try {
        const request = await axios.get("http://localhost:3001/movies");
        if (request.status === 200) {
          const response = request.data;
          setData(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    handleFetchData();
  }, []);

  useEffect(() => {
    const handleFetchMovieTypeData = async () => {
      try {
        const request = await axios.get("http://localhost:3001/movietypes");
        if (request.status === 200) {
          const response = request.data;
          setMovieType(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    handleFetchMovieTypeData();
  }, []);

  useEffect(() => {
    const handleFetchGenresData = async () => {
      try {
        const request = await axios.get("http://localhost:3001/genres");
        if (request.status === 200) {
          const response = request.data;
          setCategory(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    handleFetchGenresData();
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

              const genres = category.filter((genre) =>
                genre_ids.includes(genre.id)
              );

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
                      <span>Thể loại:</span>{" "}
                      {genres.length > 0
                        ? genres.map((genre) => genre.name).join(", ")
                        : "N/A"}
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
