import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container, Alert } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    role: "2",
    status: "active",
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchAccounts = async () => {
    try {
      const data = await fetchData("accounts");
      setAccounts(data);
      setError(null);
    } catch (error) {
      setError("Không thể tải danh sách tài khoản!");
    }
  };

  const addAccount = async () => {
    try {
      const added = await postData("accounts", newAccount);
      setAccounts((prev) => [...prev, added]);
      setNewAccount({
        username: "",
        full_name: "",
        email: "",
        phone: "",
        role: "2",
        status: "active",
      });
      setShowModal(false);
      setSuccess("Thêm tài khoản thành công!");
      setError(null);
    } catch (error) {
      setError("Không thể thêm tài khoản!");
      setSuccess(null);
    }
  };

  const editAccount = async () => {
    if (!currentAccount) return;
  
    try {
      const updated = await updateData("accounts", currentAccount.id, currentAccount);
  
      // Cập nhật danh sách tài khoản trong state
      setAccounts((prev) =>
        prev.map((account) => (account.id === updated.id ? updated : account))
      );
  
      // Cập nhật trong localStorage nếu tài khoản này đang được lưu
      const rememberedAccount = JSON.parse(localStorage.getItem("rememberedAccount"));
      if (rememberedAccount && rememberedAccount.id === updated.id) {
        localStorage.setItem("rememberedAccount", JSON.stringify(updated));
      }
  
      // Cập nhật trong sessionStorage nếu tài khoản này đang được lưu
      const sessionAccount = JSON.parse(sessionStorage.getItem("account"));
      if (sessionAccount && sessionAccount.id === updated.id) {
        sessionStorage.setItem("account", JSON.stringify(updated));
      }
  
      setCurrentAccount(null);
      setShowModal(false);
      setSuccess("Cập nhật tài khoản thành công!");
      setError(null);
    } catch (error) {
      setError("Không thể cập nhật tài khoản!");
      setSuccess(null);
    }
  };
  

  const deleteAccount = async (id) => {
    try {
      await deleteData("accounts", id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      setSuccess("Xóa tài khoản thành công!");
      setError(null);
    } catch (error) {
      setError("Không thể xóa tài khoản!");
      setSuccess(null);
    }
  };

  const toggleAccountStatus = async (account) => {
    try {
      const updatedStatus = account.status === "active" ? "inactive" : "active";
      const updated = await updateData("accounts", account.id, {
        ...account,
        status: updatedStatus,
      });
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id ? updated : acc))
      );
      setSuccess(`Trạng thái tài khoản được cập nhật thành ${updatedStatus === "active" ? "hoạt động" : "vô hiệu"}!`);
      setError(null);
    } catch (error) {
      setError("Không thể thay đổi trạng thái tài khoản!");
      setSuccess(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Tài Khoản</h2>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên Đăng Nhập</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Điện Thoại</th>
            <th>Vai Trò</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.username}</td>
              <td>{account.full_name}</td>
              <td>{account.email}</td>
              <td>{account.phone}</td>
              <td>{account.role === "1" ? "Admin" : "User"}</td>
              <td>
                <Button
                  variant={account.status === "active" ? "success" : "secondary"}
                  onClick={() => toggleAccountStatus(account)}
                >
                  {account.status === "active" ? "Hoạt Động" : "Vô Hiệu"}
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentAccount(account);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button variant="danger" onClick={() => deleteAccount(account.id)}>
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
          setCurrentAccount(null);
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Tài Khoản
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAccount ? "Sửa Tài Khoản" : "Thêm Tài Khoản"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Tên Đăng Nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={currentAccount ? currentAccount.username : newAccount.username}
                onChange={(e) =>
                  currentAccount
                    ? setCurrentAccount({ ...currentAccount, username: e.target.value })
                    : setNewAccount({ ...newAccount, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFullName">
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                value={currentAccount ? currentAccount.full_name : newAccount.full_name}
                onChange={(e) =>
                  currentAccount
                    ? setCurrentAccount({ ...currentAccount, full_name: e.target.value })
                    : setNewAccount({ ...newAccount, full_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={currentAccount ? currentAccount.email : newAccount.email}
                onChange={(e) =>
                  currentAccount
                    ? setCurrentAccount({ ...currentAccount, email: e.target.value })
                    : setNewAccount({ ...newAccount, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                value={currentAccount ? currentAccount.phone : newAccount.phone}
                onChange={(e) =>
                  currentAccount
                    ? setCurrentAccount({ ...currentAccount, phone: e.target.value })
                    : setNewAccount({ ...newAccount, phone: e.target.value })
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
            onClick={currentAccount ? editAccount : addAccount}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AccountManager;
