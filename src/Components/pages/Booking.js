import "../../CSS/Booking.css";
import { MdChair } from "react-icons/md";

function Booking() {
  const seats = [
    { id: "A1", status: "reserved" },
    { id: "A2", status: "empty" },
    { id: "A3", status: "empty" },
    { id: "A4", status: "selected" },
    { id: "B1", status: "reserved" },
    { id: "B2", status: "empty" },
    { id: "B3", status: "selected" },
    { id: "B4", status: "empty" },
  ];

  const getSeatClass = (status) => {
    switch (status) {
      case "reserved":
        return "seat-reserved";
      case "empty":
        return "seat-empty";
      case "selected":
        return "seat-selected";
      default:
        return "";
    }
  };

  return (
    <div className="booking-container">
      <div className="seats-container">
        <h3>Sơ đồ ghế</h3>
        <div className="seat-legend">
          <div className="legend-item">
            <MdChair className="seat-icon seat-empty-icon" size={20} />
            <span className="seat empty">Ghế trống</span>
          </div>
          <div className="legend-item">
            <MdChair className="seat-icon seat-selected-icon" size={20} />
            <span className="seat selected">Ghế đang chọn</span>
          </div>
          <div className="legend-item">
            <MdChair className="seat-icon seat-reserved-icon" size={20} />
            <span className="seat reserved">Ghế đã bán</span>
          </div>
          <div className="legend-item">
            <MdChair className="seat-icon seat-booked-icon" size={20} />
            <span className="seat booked">Ghế đặt trước</span>
          </div>
        </div>
        <div className="screen">Màn hình chiếu</div>
        <div className="seats">
          {seats.map((seat) => (
            <div key={seat.id} className={`seat ${getSeatClass(seat.status)}`}>
              <MdChair className="seat-icon" size={20} />
              <span>{seat.id}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ticket">
        <div className="header">
          <span className="rating">T18</span>
          <img src="poster.jpg" alt="Linh Miêu Poster" className="poster" />
        </div>
        <div className="info">
          <h2>Linh Miêu</h2>
          <p>2D Phụ đề</p>
          <ul>
            <li>
              <strong>Thể loại:</strong> Kinh dị
            </li>
            <li>
              <strong>Thời lượng:</strong> 109 phút
            </li>
            <li>
              <strong>Rạp chiếu:</strong> Beta Mỹ Đình
            </li>
            <li>
              <strong>Ngày chiếu:</strong> 06/12/2024
            </li>
            <li>
              <strong>Giờ chiếu:</strong> 22:00
            </li>
            <li>
              <strong>Phòng chiếu:</strong> P6
            </li>
          </ul>
          <button className="continue-button">Tiếp tục</button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
