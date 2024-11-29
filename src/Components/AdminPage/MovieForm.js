import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

function MovieForm({ movie, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    actor: "",
    description: "",
    genre_ids: [],
    language_id: "",
    duration: "",
    rating: "",
    release_date: "",
  });
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchData();
    if (movie) {
      setFormData(movie);
    }
  }, [movie]);

  const fetchData = async () => {
    try {
      const genresRes = await fetch("http://localhost:3001/genres");
      const languagesRes = await fetch("http://localhost:3001/languages");
      setGenres(await genresRes.json());
      setLanguages(await languagesRes.json());
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = movie ? "PUT" : "POST";
      const url = movie
        ? `http://localhost:3001/movies/${movie.id}`
        : "http://localhost:3001/movies";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu phim:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Tên Phim</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Đạo Diễn</Form.Label>
        <Form.Control
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Thể Loại */}
      <Form.Group className="mb-3">
        <Form.Label>Thể Loại</Form.Label>
        <Form.Select
          multiple
          name="genre_ids"
          value={formData.genre_ids}
          onChange={(e) =>
            setFormData({
              ...formData,
              genre_ids: [...e.target.selectedOptions].map((o) => o.value),
            })
          }
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Ngôn Ngữ */}
      <Form.Group className="mb-3">
        <Form.Label>Ngôn Ngữ</Form.Label>
        <Form.Select
          name="language_id"
          value={formData.language_id}
          onChange={handleChange}
        >
          <option value="">Chọn ngôn ngữ</option>
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button type="submit" variant="success">
        Lưu
      </Button>
    </Form>
  );
}

export default MovieForm;
