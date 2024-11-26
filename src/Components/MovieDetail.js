import React, { useState } from "react";
import "../CSS/MovieDetail.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const MovieDetail = () => {
  const schedule = [
    {
      date: "25/11 - T2",
      times: [
        "11:30",
        "13:30",
        "15:30",
        "16:20",
        "17:30",
        "19:30",
        "20:30",
        "21:30",
      ],
    },
    {
      date: "26/11 - T3",
      times: [
        "09:30",
        "10:00",
        "14:00",
        "18:00",
        "19:00",
        "21:00",
        "22:30",
        "23:30",
      ],
    },
    {
      date: "27/11 - T4",
      times: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "15:00",
        "19:00",
        "22:00",
      ],
    },
  ];

  const [selectedDate, setSelectedDate] = useState(schedule[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (date) => {
    const newDate = schedule.find((d) => d.date === date);
    setSelectedDate(newDate);
    setSelectedTime(""); // Reset thời gian khi chọn ngày mới
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setShowModal(true); // Hiển thị thông báo đã chọn thoi gian
  };

  const handleConfirm = () => {
    setShowModal(false); // ��n thông báo đã chọn thoi gian
    alert("ban da xac nhan dat ve thanh cong");
  };

  const handleCancel = () => {
    setShowModal(false); // ��n thông báo đã hủy chọn thoi gian
  };

  return (
    <div className="movie-detail">
      <main className="content">
        <div className="breadcrumb">
          <a href="#">Home</a> &gt; Linh Miêu
        </div>

        <div className="movie-info">
          <div className="poster">
            <img
              src="../assets/Banner/linhmieu_poster.jpg"
              alt="Linh Miêu Poster"
            />
          </div>
          <div className="details">
            <h1>Linh Miêu</h1>
            <p>
              Linh Miêu: Quỷ Nhập Tràng lấy cảm hứng từ truyền thuyết dân gian
              về “quỷ nhập tràng” để xây dựng cốt truyện. Phim lồng ghép những
              nét văn hóa đặc trưng của Huế như nghệ thuật khảm sành - một văn
              hóa đặc sắc của thời nhà Nguyễn, đề cập đến các vấn đề về giai cấp
              và quan điểm trọng nam khinh nữ. Đặc biệt, hình ảnh rước kiệu thây
              ma và những hình nhân giấy không chỉ biểu trưng cho tai ương hay
              điềm dữ mà còn là hiện thân của nghiệp quả.
            </p>
            <ul class="list-unstyled row">
              <li class="col-md-3 col-sm-5">
                <strong>ĐẠO DIỄN:</strong>
              </li>
              <li class="col-md-9 col-sm-7">Lưu Thành Luân</li>

              <li class="col-md-3 col-sm-5">
                <strong>DIỄN VIÊN:</strong>
              </li>
              <li class="col-md-9 col-sm-7">
                Hồng Đào, Thiên An, Thùy Tiên, Văn Anh, Samuel An,...
              </li>

              <li class="col-md-3 col-sm-5">
                <strong>THỂ LOẠI:</strong>
              </li>
              <li class="col-md-9 col-sm-7">Kinh dị</li>

              <li class="col-md-3 col-sm-5">
                <strong>THỜI LƯỢNG:</strong>
              </li>
              <li class="col-md-9 col-sm-7">109 phút</li>

              <li class="col-md-3 col-sm-5">
                <strong>NGÔN NGỮ:</strong>
              </li>
              <li class="col-md-9 col-sm-7">Tiếng Việt</li>

              <li class="col-md-3 col-sm-5">
                <strong>NGÀY KHỞI CHIẾU:</strong>
              </li>
              <li class="col-md-9 col-sm-7">22/11/2024</li>
            </ul>
          </div>
        </div>

        <div className="schedule">
          <h2>Chọn Lịch Chiếu</h2>

          <div className="dates">
            {schedule.map((item) => (
              <button
                key={item.date}
                className={`date ${
                  item.date === selectedDate.date ? "active" : ""
                }`}
                onClick={() => handleDateChange(item.date)}
              >
                {item.date}
              </button>
            ))}
          </div>

          <div className="times">
            {selectedDate.times.map((time) => (
              <button
                key={time}
                className={`time ${time === selectedTime ? "active" : ""}`}
                onClick={() => handleTimeChange(time)}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedTime && (
            <p className="selected">
              Bạn đã chọn: <strong>{selectedDate.date}</strong> lúc{" "}
              <strong>{selectedTime}</strong>
            </p>
          )}
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Bạn đang đặt vé xem phim</h3>
              <p>
                <strong>Tên phim:</strong> Linh Miêu
              </p>
              <p>
                <strong>Ngày chiếu:</strong> {selectedDate.date}
              </p>
              <p>
                <strong>Giờ chiếu:</strong> {selectedTime}
              </p>
              <div className="modal-actions">
                <button className="confirm" onClick={handleConfirm}>
                  Đồng ý
                </button>
                <button className="cancel" onClick={handleCancel}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieDetail;
