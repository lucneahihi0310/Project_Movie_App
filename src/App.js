import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import { publicRoutes } from "./Components/router/index.js";
import CinemaInfo from "./Components/pages/CinemaInfo";
import TicketPricing from "./Components/pages/TicketPricing";
import AdminMovies from "./Components/AdminPage/AdminMovies.js";
import LoginRegister from "./Components/pages/LoginRegister.js";
import MovieDetail from "./Components/pages/MovieDetail.js";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginRegister/>} />
        {publicRoutes.map((route, index) => {
          const Component = route.component;
          return (
            <Route key={index} path={route.path} element={<Component />} />
          );
        })}
        <Route path="/info" element={<CinemaInfo />} />
        <Route path="/price" element={<TicketPricing />} />
        <Route path="/managermovies" element={<AdminMovies />} />
        <Route path="/movie" element={<MovieDetail/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
