import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge } from "react-bootstrap";

function AdminMovies() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMovie, setEditMovie] = useState(null);
    const [newMovie, setNewMovie] = useState({
        title: "",
        director: "",
        actor: "",
        description: "",
        genre_ids: [],
        duration: "",
        rating: "",
        language_id: [],
        poster: [],
    });
    useEffect(() => {
        fetch("http://localhost:3001/movies")
            .then((response) => response.json())
            .then((data) => setMovies(data))
            .catch((error) => console.error("Error fetching movies:", error));

        fetch("http://localhost:3001/genres")
            .then((response) => response.json())
            .then((data) => setGenres(data))
            .catch((error) => console.error("Error fetching genres:", error));

        fetch("http://localhost:3001/languages")
            .then((response) => response.json())
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
            fetch(`http://localhost:3001/movies/${editMovie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieToSubmit),
            })
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
            fetch("http://localhost:3001/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...movieToSubmit, id: movies.length + 1 }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setMovies([...movies, data]);
                    resetForm();
                })
                .catch((error) => console.error("Error adding movie:", error));
        }
    };
    const handleDelete = (id) => {
        fetch(`http://localhost:3001/movies/${id}`, {
            method: "DELETE",
        })
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

    return (
        <div className="container my-5">
            <h1>Quản Lý Phim</h1>
            <Button variant="primary" className="mb-3" onClick={handleCreate}>
                Thêm Phim Mới
            </Button>
            <Table striped bordered hover>
                <thead>
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
                                    src={movie.poster[0]}
                                    alt={movie.title}
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </td>
                            <td>{movie.title}</td>
                            <td>
                                <Badge bg="info">{getGenreNames(movie.genre_ids)}</Badge>
                            </td>
                            <td>{getLanguageName(movie.language_id)}</td>
                            <td>{movie.duration} phút</td>
                            <td>
                                <Button variant="warning" className="me-2" onClick={() => handleEdit(movie)}>
                                    Sửa
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(movie.id)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
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
                            <Form.Label>Thời Lượng</Form.Label>
                            <Form.Control
                                type="number"
                                name="duration"
                                value={newMovie.duration}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="text"
                                name="rating"
                                value={newMovie.rating}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngôn Ngữ</Form.Label>
                            <Form.Select
                                name="language_id"
                                value={newMovie.language_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Chọn Ngôn Ngữ</option>
                                {languages.map((language) => (
                                    <option key={language.id} value={language.id}>
                                        {language.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thể Loại (IDs, cách nhau bởi dấu phẩy)</Form.Label>
                            <Form.Control
                                type="text"
                                name="genre_ids"
                                value={newMovie.genre_ids.join(", ")}
                                onChange={(e) =>
                                    setNewMovie({
                                        ...newMovie,
                                        genre_ids: e.target.value.split(",").map(Number),
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Poster (URLs, cách nhau bởi dấu phẩy)</Form.Label>
                            <Form.Control
                                type="text"
                                name="poster"
                                value={newMovie.poster.join(", ")}
                                onChange={(e) =>
                                    setNewMovie({ ...newMovie, poster: e.target.value.split(",") })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetForm}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editMovie ? "Lưu Thay Đổi" : "Thêm Phim"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminMovies;
