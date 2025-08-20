
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import bottle from "/images/bouteille1.webp";
import background from "/images/background1.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 15 });

  const bottleRef = useRef<HTMLImageElement>(null);
  const clientButtonRef = useRef<HTMLButtonElement>(null);
  const [dropDistance, setDropDistance] = useState(0);

  useEffect(() => {
    const updateDistance = () => {
      if (bottleRef.current && clientButtonRef.current) {
        const bottleRect = bottleRef.current.getBoundingClientRect();
        const buttonRect = clientButtonRef.current.getBoundingClientRect();
        const distance = buttonRect.top - bottleRect.top - bottleRect.height;

        // Ajout d'une marge plus grande pour stopper plus haut
        setDropDistance(distance - 80); // ← valeur ajustée ici
      }
    };
    updateDistance();
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, []);

  const bottleY = useTransform(smoothProgress, [0, 1], [0, dropDistance]);
  const bottleRotation = useTransform(smoothProgress, [0, 1], [-45, 0]);

  return (
    <div
      className="relative h-[150vh] w-full overflow-hidden bg-cover bg-center"
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
        <motion.img
          ref={bottleRef}
          src={bottle}
          alt="Bouteille"
          className="w-40 h-auto"
          style={{ y: bottleY, rotate: bottleRotation }}
        />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <button
          ref={clientButtonRef}
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
