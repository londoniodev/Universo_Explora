import React from "react";
import { Link } from "react-router-dom";
import Footer from "../pages/Home_components/Footer.jsx";
import Nav from "../pages/Home_components/Home_navbar.jsx";

const NotFoundPage = () => {
  return (
    <div id="container" className="flex flex-col justify-between min-h-screen bg-[#101010] text-white m-0 p-0">
      <Nav />
      <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mt-[4%] tracking-tight text-cyan-400">
          404
        </h1>
        <p className="mt-4 text-lg md:text-xl font-light text-gray-300">
          Lo sentimos, no pudimos encontrar la página que buscabas.
        </p>
        <p className="mt-2 text-sm md:text-md lg:text-lg text-gray-400">
          Tal vez escribiste mal la URL o la página fue movida.
        </p>
        <Link
          to="/api/auth/login"
          className="mt-8 px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105"
        >
          Regresar al Inicio
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;