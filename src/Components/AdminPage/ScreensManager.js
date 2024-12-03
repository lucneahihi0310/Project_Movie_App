import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ScreensManager = () => {
  const [screens, setScreens] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [newScreen, setNewScreen] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchScreens = async () => {
    try {
      const data = await fetchData("screens");
      setScreens(data);
    } catch (error) {
      console.error("Không thể lấy danh sách màn hình:", error);
    }
  };

  const addScreen = async () => {
    if (!newScreen) return;
    try {
      const added = await postData("screens", { name: newScreen });
      setScreens((prev) => [...prev, added]);
      setNewScreen("");
      setShowModal(false);
    } catch (error) {
      console.error("Không thể thêm màn hình:", error);
    }
  };

  const editScreen = async () => {
    if (!currentScreen || !currentScreen.name) return;
    try {
      const updated = await updateData("screens", currentScreen.id, {
        name: currentScreen.name,
      });
      setScreens((prev) =>
        prev.map((screen) =>
          screen.id === updated.id ? updated : screen
        )
      );
      setCurrentScreen(null);
      setShowModal(false);
    } catch (error) {
      console.error("Không thể cập nhật màn hình:", error);
    }
  };

  const deleteScreen = async (id) => {
    try {
      await deleteData("cinema", id);
      setScreens((prev) => prev.filter((screen) => screen.id !== id));
    } catch (error) {
      console.error("Không thể xóa màn hình:", error);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Màn Hình</h2>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên Màn Hình</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((screen) => (
            <tr key={screen.id}>
              <td>{screen.id}</td>
              <td>{screen.name}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentScreen(screen);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteScreen(screen.id)}
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
          setCurrentScreen(null);
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Màn Hình
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentScreen ? "Sửa Màn Hình" : "Thêm Màn Hình"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formScreenName">
              <Form.Label>Tên Màn Hình</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên màn hình"
                value={currentScreen ? currentScreen.name : newScreen}
                onChange={(e) =>
                  currentScreen
                    ? setCurrentScreen({
                        ...currentScreen,
                        name: e.target.value,
                      })
                    : setNewScreen(e.target.value)
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
            onClick={currentScreen ? editScreen : addScreen}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ScreensManager;
