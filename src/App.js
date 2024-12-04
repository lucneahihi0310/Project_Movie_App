import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import { publicRoutes } from "./Components/router/index.js";
import CinemaInfo from "./Components/pages/CinemaInfo";
import TicketPricing from "./Components/pages/TicketPricing";
import LoginRegister from "./Components/pages/LoginRegister.js";
import MovieDetail from "./Components/pages/MovieDetail.js";
import AdminMovies from "./Components/AdminPage/AdminMovies.js";
import LanguagesManager from "./Components/AdminPage/LanguagesManager.js";
import GenresManager from "./Components/AdminPage/GenresManager.js";
import MovieTypesManager from "./Components/AdminPage/MovieTypesManager.js";
import ScreensManager from "./Components/AdminPage/ScreensManager.js";
import HomePage from "./Components/pages/HomePage.js";

function App() {
  const account = JSON.parse(localStorage.getItem("rememberedAccount")) || JSON.parse(sessionStorage.getItem("account"));
  const userRole = account ? account.role : null;
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }
    return element;
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/info" element={<CinemaInfo />} />
        <Route path="/price" element={<TicketPricing />} />
        <Route
          path="/managermovies"
          element={<ProtectedRoute element={<AdminMovies />} allowedRoles={"1"} />}
        />
        <Route
          path="/languages"
          element={<ProtectedRoute element={<LanguagesManager />} allowedRoles={"1"} />}
        />
        <Route
          path="/genres"
          element={<ProtectedRoute element={<GenresManager />} allowedRoles={"1"} />}
        />
        <Route
          path="/movietypes"
          element={<ProtectedRoute element={<MovieTypesManager />} allowedRoles={"1"} />}
        />
        <Route
          path="/screens"
          element={<ProtectedRoute element={<ScreensManager />} allowedRoles={"1"} />}
        />
        <Route path="/movie" element={<MovieDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
