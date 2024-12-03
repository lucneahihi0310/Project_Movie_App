import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import { publicRoutes } from "./Components/router/index.js";
import CinemaInfo from "./Components/pages/CinemaInfo";
import TicketPricing from "./Components/pages/TicketPricing";
import LoginRegister from "./Components/pages/LoginRegister.js";
import AdminMovies from "./Components/AdminPage/AdminMovies.js";
import MoviePage from "./Components/pages/Movie.js";
import LanguagesManager from "./Components/AdminPage/LanguagesManager.js";
import GenresManager from "./Components/AdminPage/GenresManager.js";
import MovieTypesManager from "./Components/AdminPage/MovieTypesManager.js";
import ScreensManager from "./Components/AdminPage/ScreensManager.js";
import Page404 from "./Components/pages/Page404.js";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        {publicRoutes.map((route, index) => {
          const Component = route.component;
          return (
            <Route key={index} path={route.path} element={<Component />} />
          );
        })}
        <Route path="/moviene" element={<MoviePage />} />
        <Route path="/info" element={<CinemaInfo />} />
        <Route path="/price" element={<TicketPricing />} />
        <Route path="/managermovies" element={<AdminMovies />} />
        <Route path="/languages" element={<LanguagesManager />} />
        <Route path="/genres" element={<GenresManager />} />
        <Route path="/movietypes" element={<MovieTypesManager />} />
        <Route path="/screens" element={<ScreensManager />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
