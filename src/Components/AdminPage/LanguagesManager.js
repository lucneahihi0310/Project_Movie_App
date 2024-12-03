import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";
import "../../CSS/LanguagesManager.css";

const LanguagesManager = () => {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchLanguages = async () => {
    try {
      const data = await fetchData("languages");
      setLanguages(data);
    } catch (error) {
      console.error("Không thể lấy dữ liệu ngôn ngữ:", error);
    }
  };

  const addLanguage = async () => {
    if (!newLanguage) return;
    try {
      const added = await postData("languages", { name: newLanguage });
      setLanguages((prev) => [...prev, added]);
      setNewLanguage("");
      setShowModal(false);
    } catch (error) {
      console.error("Không thể thêm ngôn ngữ:", error);
    }
  };

  const editLanguage = async () => {
    if (!currentLanguage || !currentLanguage.name) return;
    try {
      const updated = await updateData("languages", currentLanguage.id, {
        name: currentLanguage.name,
      });
      setLanguages((prev) =>
        prev.map((lang) =>
          lang.id === updated.id ? updated : lang
        )
      );
      setCurrentLanguage(null);
      setShowModal(false);
    } catch (error) {
      console.error("Không thể cập nhật ngôn ngữ:", error);
    }
  };

  const deleteLanguage = async (id) => {
    try {
      await deleteData("languages", id);
      setLanguages((prev) => prev.filter((lang) => lang.id !== id));
    } catch (error) {
      console.error("Không thể xóa ngôn ngữ:", error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Ngôn Ngữ</h2>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Ngôn Ngữ</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang) => (
            <tr key={lang.id}>
              <td>{lang.id}</td>
              <td>{lang.name}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentLanguage(lang);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteLanguage(lang.id)}
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
          setCurrentLanguage(null);
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Ngôn Ngữ
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentLanguage ? "Sửa Ngôn Ngữ" : "Thêm Ngôn Ngữ"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formLanguageName">
              <Form.Label>Tên Ngôn Ngữ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên ngôn ngữ"
                value={currentLanguage ? currentLanguage.name : newLanguage}
                onChange={(e) =>
                  currentLanguage
                    ? setCurrentLanguage({
                        ...currentLanguage,
                        name: e.target.value,
                      })
                    : setNewLanguage(e.target.value)
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
            onClick={currentLanguage ? editLanguage : addLanguage}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LanguagesManager;
