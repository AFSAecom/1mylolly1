import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import bottle from "/images/bouteille1.png";
import background from "/images/background1.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const bottleY = useTransform(scrollY, [0, 300], [0, 80]);
  const bottleRotate = useTransform(scrollY, [0, 300], [0, 5]);
  const shadowOpacity = useTransform(scrollY, [0, 300], [0.3, 0]);
  const shadowScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <div
      className="relative min-h-[200vh] w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <nav className="absolute top-4 left-0 w-full flex justify-between px-4 text-xs font-montserrat">
        <button
          onClick={() => navigate("/advisor")}
          className="px-3 py-2 rounded bg-advisor text-admin"
        >
          Espace Conseillère
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="px-3 py-2 rounded bg-admin text-cream"
        >
          Espace Admin
        </button>
      </nav>

      <div className="pt-24 flex flex-col items-center">
        <h1 className="text-3xl text-cream mb-8 font-playfair text-center">
          Le Compas Olfactif
        </h1>
        <motion.div style={{ y: bottleY }} className="relative">
          <motion.img
            src={bottle}
            alt="Bouteille"
            className="w-40 h-auto"
            style={{ rotate: bottleRotate }}
          />
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 w-24 h-6 bg-black/30 rounded-full blur-md"
            style={{ opacity: shadowOpacity, scale: shadowScale }}
          />
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <button
          onClick={() => navigate("/client")}
          className="px-5 py-3 rounded bg-client text-cream font-montserrat text-sm"
        >
          Espace Client
        </button>
      </div>
    </div>
  );
};

export default HomePage;
