import HomePage from "../pages/HomePage.js";
import MovieDetail from "../pages/MovieDetail.js";

const publicRoutes = [
  { path: "/", component: HomePage },
  { path: "/movie/:id", component: MovieDetail },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
