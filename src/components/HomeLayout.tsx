import React from "react";
import { motion } from "framer-motion";

interface HomeLayoutProps {
  children?: React.ReactNode;
}

const HomeLayout = ({ children = null }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-[#FBF0E9]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* Logo */}
        <div className="w-32 h-32 mb-4 rounded-full bg-white flex items-center justify-center shadow-md p-2">
          <img
            src="/logo-lolly.png"
            alt="Lolly"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-playfair text-[#805050] mb-12 text-center">
          Le Compas Olfactif
        </h1>
      </motion.div>
      {/* Access Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-2xl mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#CE8F8A] hover:bg-[#B87B76] text-white font-montserrat font-semibold py-6 px-4 rounded-lg shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
            onClick={() => (window.location.href = "/client")}
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <span className="text-base">Espace Client</span>
            <span className="text-xs opacity-90">Découvrir nos parfums</span>
          </motion.button>

          {/* Conseillère Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#D4C2A1] hover:bg-[#C4B291] text-[#805050] font-montserrat font-semibold py-6 px-4 rounded-lg shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
            onClick={() => (window.location.href = "/conseillere")}
          >
            <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <span className="text-xl">💼</span>
            </div>
            <span className="text-base">Espace Conseillère</span>
            <span className="text-xs opacity-90">Gérer les conseils</span>
          </motion.button>

          {/* Admin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#805050] hover:bg-[#704040] text-white font-montserrat font-semibold py-6 px-4 rounded-lg shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
            onClick={() => (window.location.href = "/admin")}
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">⚙️</span>
            </div>
            <span className="text-base">Espace Admin</span>
            <span className="text-xs opacity-90">Administration</span>
          </motion.button>
        </div>
      </motion.div>
      {/* Content area */}
      <div className="w-full max-w-4xl">{children}</div>
      {/* Footer */}
      <footer className="mt-auto pt-8 pb-4 text-center text-[#AD9C92] font-montserrat text-sm">
        <p>
          © {new Date().getFullYear()} Le Compas Olfactif. Tous droits
          réservés.
        </p>
      </footer>
    </div>
  );
};

export default HomeLayout;
