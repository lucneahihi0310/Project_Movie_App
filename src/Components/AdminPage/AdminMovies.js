import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Container, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

function AdminMovies() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [showModal, setShowModal] = useState(false); // Modal for add/edit
    const [showDetailModal, setShowDetailModal] = useState(false); // Modal for movie details
    const [selectedMovie, setSelectedMovie] = useState(null); // Movie selected for detail view
    const [editMovie, setEditMovie] = useState(null);
    const [screens, setScreens] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [newMovie, setNewMovie] = useState({
        title: "",
        director: "",
        actor: "",
        description: "",
        genre_ids: [],
        duration: "",
        rating: "",
        language_id: "",
        poster: [],
    });

    useEffect(() => {
        fetchData("movies")
            .then((data) => setMovies(data))
            .catch((error) => console.error("Error fetching movies:", error));

        fetchData("screens")
            .then((data) => setScreens(data))
            .catch((error) => console.error("Error fetching screens:", error));

        fetchData("cinema")
            .then((data) => setCinemas(data))
            .catch((error) => console.error("Error fetching cinemas:", error));

        fetchData("genres")
            .then((data) => setGenres(data))
            .catch((error) => console.error("Error fetching genres:", error));

        fetchData("languages")
            .then((data) => setLanguages(data))
            .catch((error) => console.error("Error fetching languages:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMovie({ ...newMovie, [name]: value });
    };

    const handleSubmit = () => {
        const movieToSubmit = {
            ...newMovie,
            genre_ids: Array.isArray(newMovie.genre_ids)
                ? newMovie.genre_ids
                : newMovie.genre_ids.split(",").map(Number),
            poster: Array.isArray(newMovie.poster)
                ? newMovie.poster
                : newMovie.poster.split(","),
        };

        if (editMovie) {
            updateData("movies", editMovie.id, movieToSubmit)
                .then(() => {
                    setMovies((prevMovies) =>
                        prevMovies.map((movie) =>
                            movie.id === editMovie.id ? { ...movieToSubmit, id: editMovie.id } : movie
                        )
                    );
                    resetForm();
                })
                .catch((error) => console.error("Error updating movie:", error));
        } else {
            postData("movies", { ...movieToSubmit, id: movies.length + 1 })
                .then((data) => {
                    setMovies([...movies, data]);
                    resetForm();
                })
                .catch((error) => console.error("Error adding movie:", error));
        }
    };

    const handleDelete = (id) => {
        deleteData("movies", id)
            .then(() => setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id)))
            .catch((error) => console.error("Error deleting movie:", error));
    };

    const handleEdit = (movie) => {
        setEditMovie(movie);
        setNewMovie(movie);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditMovie(null);
        setNewMovie({
            title: "",
            director: "",
            actor: "",
            description: "",
            genre_ids: [],
            duration: "",
            rating: "",
            language_id: "",
            poster: [],
        });
        setShowModal(true);
    };

    const handleTitleClick = (movie) => {
        setSelectedMovie(movie);
        setShowDetailModal(true); // Open the detail modal
    };

    const resetForm = () => {
        setEditMovie(null);
        setNewMovie({
            title: "",
            director: "",
            actor: "",
            description: "",
            genre_ids: [],
            duration: "",
            rating: "",
            language_id: "",
            poster: [],
        });
        setShowModal(false);
    };

    const getGenreNames = (genreIds) =>
        genreIds.map((id) => genres.find((genre) => genre.id == id)?.name).join(", ");

    const getLanguageName = (languageId) =>
        languages.find((language) => language.id == languageId)?.name;
    const groupShowtimesByDate = (showtimes) => {
        return showtimes.reduce((acc, showtime) => {
            const date = showtime.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(showtime);
            return acc;
        }, {});
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
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4" style={{ color: "#3a3a3a" }}>Quản Lý Phim</h1>
            <Row className="mb-3">
                <Col md={12} className="text-end">
                    <Button
                        variant="primary"
                        onClick={handleCreate}
                    >
                        <FaPlus /> Thêm Phim Mới
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Poster</th>
                        <th>Tiêu Đề</th>
                        <th>Thể Loại</th>
                        <th>Ngôn Ngữ</th>
                        <th>Thời Lượng</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>
                            <td>
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </td>
                            <td
                                style={{ cursor: "pointer", color: "blue" }}
                                onClick={() => handleTitleClick(movie)}
                            >
                                {movie.title}
                            </td>
                            <td>
                                <Badge bg="info">{getGenreNames(movie.genre_ids)}</Badge>
                            </td>
                            <td>{getLanguageName(movie.language_id)}</td>
                            <td>{movie.duration} phút</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEdit(movie)}
                                    style={{ backgroundColor: "#ffc107", border: "none" }}
                                >
                                    <FaEdit /> Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(movie.id)}
                                    style={{ backgroundColor: "#dc3545", border: "none" }}
                                >
                                    <FaTrashAlt /> Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add/Edit Movie */}
            <Modal show={showModal} onHide={resetForm}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMovie ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tiêu Đề</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newMovie.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Đạo Diễn</Form.Label>
                            <Form.Control
                                type="text"
                                name="director"
                                value={newMovie.director}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Diễn Viên</Form.Label>
                            <Form.Control
                                type="text"
                                name="actor"
                                value={newMovie.actor}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô Tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={newMovie.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thể Loại</Form.Label>
                            <Form.Control
                                as="select"
                                multiple
                                name="genre_ids"
                                value={newMovie.genre_ids}
                                onChange={handleInputChange}
                            >
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngôn Ngữ</Form.Label>
                            <Form.Control
                                as="select"
                                name="language_id"
                                value={newMovie.language_id}
                                onChange={handleInputChange}
                            >
                                {languages.map((language) => (
                                    <option key={language.id} value={language.id}>
                                        {language.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Poster URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="poster"
                                value={newMovie.poster}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetForm}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editMovie ? "Cập Nhật" : "Thêm Phim"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Movie Detail */}
            {/* Modal for Movie Detail */}
            <Modal size="lg" show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedMovie && selectedMovie.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMovie && (
                        <>


                            {/* Status */}
                            <h5>Trạng Thái:</h5>
                            <p>{selectedMovie.status === "active" ? "Đang Chiếu" : "Ngừng Chiếu"}</p>

                            {/* Movie Details */}
                            <h5>Đạo Diễn:</h5>
                            <p>{selectedMovie.director}</p>

                            <h5>Diễn Viên:</h5>
                            <p>{selectedMovie.actor}</p>

                            <h5>Mô Tả:</h5>
                            <p>{selectedMovie.description}</p>

                            <h5>Thể Loại:</h5>
                            <p>{getGenreNames(selectedMovie.genre_ids)}</p>

                            <h5>Ngôn Ngữ:</h5>
                            <p>{getLanguageName(selectedMovie.language_id)}</p>

                            <h5>Thời Lượng:</h5>
                            <p>{selectedMovie.duration} phút</p>

                            <h5>Ngày Chiếu:</h5>
                            <p>{selectedMovie.release_date}</p>
                            {/* Showtimes */}
                            <h5 className="mt-4">Lịch Chiếu:</h5>
                            {selectedMovie.showtimes && selectedMovie.showtimes.length > 0 ? (
                                Object.keys(groupShowtimesByDate(selectedMovie.showtimes)).map((date) => (
                                    <div key={date}>
                                        <h6>{formatDate(date)}</h6>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Giờ Chiếu</th>
                                                    <th>Giờ Kết Thúc</th>
                                                    <th>Phòng</th>
                                                    <th>Rạp</th>
                                                    <th>Giá Vé</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupShowtimesByDate(selectedMovie.showtimes)[date].map((showtime) => (
                                                    <tr key={showtime.id}>
                                                        <td>{formatTime(showtime.start_time)}</td>
                                                        <td>{formatTime(showtime.end_time)}</td>
                                                        <td>{screens.find(screen => screen.id == showtime.screen_id)?.name || "N/A"}</td>
                                                        <td>{cinemas.find(cinema => cinema.id == showtime.cinema_id)?.name || "N/A"}</td>

                                                        <td>{formatPrice(showtime.price)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ))
                            ) : (
                                <p>Không có lịch chiếu.</p>
                            )}
                            <h5>Video Trailer:</h5>
                            <iframe
                                width="100%"
                                height="315"
                                src={selectedMovie.video_url}
                                title="YouTube video"
                                allowFullScreen
                            ></iframe>
                            {/* Banner Image */}
                            <img src={selectedMovie.banner} alt="Banner" className="img-fluid mb-3" />

                            {/* Poster Image */}
                            <div className="text-center mb-3">
                                <img src={selectedMovie.poster} alt="Poster" className="img-fluid" />
                            </div>

                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>



        </Container>
    );
}

export default AdminMovies;
