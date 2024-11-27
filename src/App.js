import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/pages/Header";
import Footer from "./Components/pages/Footer";
import { publicRoutes } from "./Components/router/index.js";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {publicRoutes.map((route, index) => {
          const Component = route.component;
          return (
            <Route key={index} path={route.path} element={<Component />} />
          );
        })}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
