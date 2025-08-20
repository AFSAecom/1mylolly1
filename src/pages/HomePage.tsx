import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo-lolly.png";
import background from "/home-bg.svg";

const HomePage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-xs w-full p-4 text-center bg-white/80 rounded-lg shadow-md sm:max-w-md sm:p-8">
        <img
          src={logo}
          alt="Lolly"
          className="w-24 h-24 mx-auto mb-4 sm:w-32 sm:h-32"
        />
        <h1 className="text-xl font-bold mb-6 sm:text-3xl">Bienvenue sur Lolly</h1>
        <nav className="flex flex-col gap-4">
          <Link
            to="/advisor"
            className="px-4 py-2 rounded bg-advisor text-white text-sm sm:text-base"
          >
            Espace Conseiller
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 rounded bg-admin text-white text-sm sm:text-base"
          >
            Espace Admin
          </Link>
          <Link
            to="/client"
            className="px-4 py-2 rounded bg-client text-white text-sm sm:text-base"
          >
            Espace Client
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
