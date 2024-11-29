import React, { useEffect, useState } from "react";
import "../../CSS/MovieDetail.css";
import { useParams } from "react-router-dom";
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3001/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie:", error));
  }, [id]);
  if (!movie) {
    return <div>Đang tải thông tin phim...</div>;
  }
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

          <div className="dates"></div>

          <div className="times"></div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
