import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import MovieForm from "./MovieForm";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3001/movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await fetch(`http://localhost:3001/movies/${id}`, { method: "DELETE" });
      fetchMovies();
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
    }
  };

  const handleEdit = (movie) => {
    setEditMovie(movie);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditMovie(null);
    setShowModal(true);
  };

  return (
    <div className="movie-list-container">
      <h2 className="text-center my-4">Quản Lý Phim</h2>
      <Button className="mb-3" onClick={handleCreate}>
        Tạo Phim Mới
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Phim</th>
            <th>Thể Loại</th>
            <th>Ngôn Ngữ</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>
                {movie.genre_ids.map((id) => (
                  <span key={id} className="badge bg-primary me-1">
                    {id}
                  </span>
                ))}
              </td>
              <td>{movie.language_id}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(movie)}
                >
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => deleteMovie(movie.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMovie ? "Chỉnh Sửa Phim" : "Tạo Phim Mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MovieForm
            movie={editMovie}
            onClose={() => setShowModal(false)}
            onRefresh={fetchMovies}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MovieList;
