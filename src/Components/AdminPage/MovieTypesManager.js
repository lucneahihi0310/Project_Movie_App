import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const MovieTypesManager = () => {
  const [movieTypes, setMovieTypes] = useState([]);
  const [currentMovieType, setCurrentMovieType] = useState(null);
  const [newMovieType, setNewMovieType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchMovieTypes = async () => {
    try {
      const data = await fetchData("movietypes");
      setMovieTypes(data);
    } catch (error) {
      console.error("Không thể lấy danh sách loại phim:", error);
    }
  };

  const addMovieType = async () => {
    if (!newMovieType) return;
    try {
      const added = await postData("movietypes", { name: newMovieType });
      setMovieTypes((prev) => [...prev, added]);
      setNewMovieType("");
      setShowModal(false);
    } catch (error) {
      console.error("Không thể thêm loại phim:", error);
    }
  };

  const editMovieType = async () => {
    if (!currentMovieType || !currentMovieType.name) return;
    try {
      const updated = await updateData("movietypes", currentMovieType.id, {
        name: currentMovieType.name,
      });
      setMovieTypes((prev) =>
        prev.map((movieType) =>
          movieType.id === updated.id ? updated : movieType
        )
      );
      setCurrentMovieType(null);
      setShowModal(false);
    } catch (error) {
      console.error("Không thể cập nhật loại phim:", error);
    }
  };

  const deleteMovieType = async (id) => {
    try {
      await deleteData("movietypes", id);
      setMovieTypes((prev) => prev.filter((movieType) => movieType.id !== id));
    } catch (error) {
      console.error("Không thể xóa loại phim:", error);
    }
  };

  useEffect(() => {
    fetchMovieTypes();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Loại Phim</h2>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Loại Phim</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {movieTypes.map((movieType) => (
            <tr key={movieType.id}>
              <td>{movieType.id}</td>
              <td>{movieType.name}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentMovieType(movieType);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteMovieType(movieType.id)}
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
          setCurrentMovieType(null);
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Loại Phim
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentMovieType ? "Sửa Loại Phim" : "Thêm Loại Phim"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formMovieTypeName">
              <Form.Label>Tên Loại Phim</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên loại phim"
                value={currentMovieType ? currentMovieType.name : newMovieType}
                onChange={(e) =>
                  currentMovieType
                    ? setCurrentMovieType({
                        ...currentMovieType,
                        name: e.target.value,
                      })
                    : setNewMovieType(e.target.value)
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
            onClick={currentMovieType ? editMovieType : addMovieType}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MovieTypesManager;
