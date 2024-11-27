import "./App.css";
import Footer from "./Components/pages/Footer";
import Header from "./Components/pages/Header";
import HomePage from "./Components/pages/HomePage";
import React from "react";
import MovieDetail from "./Components/pages/MovieDetail";

function App() {
  return (
    <>
      <Header />
      {/* <HomePage /> */}
      <Footer />
      <MovieDetail />
    </>
  );
}

export default App;
