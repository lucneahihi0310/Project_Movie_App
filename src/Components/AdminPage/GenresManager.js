import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const GenresManager = () => {
  const [genres, setGenres] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchGenres = async () => {
    try {
      const data = await fetchData("genres");
      setGenres(data);
    } catch (error) {
      console.error("Không thể lấy dữ liệu thể loại:", error);
    }
  };

  const addGenre = async () => {
    if (!newGenre) return;
    try {
      const added = await postData("genres", { name: newGenre });
      setGenres((prev) => [...prev, added]);
      setNewGenre("");
      setShowModal(false);
    } catch (error) {
      console.error("Không thể thêm thể loại:", error);
    }
  };

  const editGenre = async () => {
    if (!currentGenre || !currentGenre.name) return;
    try {
      const updated = await updateData("genres", currentGenre.id, {
        name: currentGenre.name,
      });
      setGenres((prev) =>
        prev.map((genre) =>
          genre.id === updated.id ? updated : genre
        )
      );
      setCurrentGenre(null);
      setShowModal(false);
    } catch (error) {
      console.error("Không thể cập nhật thể loại:", error);
    }
  };

  const deleteGenre = async (id) => {
    try {
      await deleteData("genres", id);
      setGenres((prev) => prev.filter((genre) => genre.id !== id));
    } catch (error) {
      console.error("Không thể xóa thể loại:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Thể Loại</h2>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Thể Loại</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentGenre(genre);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteGenre(genre.id)}
                >
                  <i className="bi bi-trash"></i> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        variant="primary"
        className="mt-3"
        onClick={() => {
          setCurrentGenre(null);
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Thể Loại
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentGenre ? "Sửa Thể Loại" : "Thêm Thể Loại"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGenreName">
              <Form.Label>Tên Thể Loại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên thể loại"
                value={currentGenre ? currentGenre.name : newGenre}
                onChange={(e) =>
                  currentGenre
                    ? setCurrentGenre({
                        ...currentGenre,
                        name: e.target.value,
                      })
                    : setNewGenre(e.target.value)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={currentGenre ? editGenre : addGenre}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GenresManager;
