import Carousel from "react-bootstrap/Carousel";
import banner1 from "../assets/Banner/banner1.jpg";
import banner2 from "../assets/Banner/banner2.jpg";
import banner3 from "../assets/Banner/banner3.jpg";
import "../assets/HomePage.css";

function HomePage() {
  return (
    <>
      <Carousel slide interval={5000}>
        <Carousel.Item>
          <img className="d-block w-100" src={banner1} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={banner2} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={banner3} alt="Third slide" />
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default HomePage;
