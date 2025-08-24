
import { Link } from "react-router-dom";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import bottle from "/images/bouteille1.webp";

const HomePage = () => {
  const scrollY = useMotionValue(0);
  const smoothScroll = useSpring(scrollY, { stiffness: 100, damping: 15 });

  const bottleRef = useRef<HTMLImageElement>(null);
  const clientButtonRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dropDistance, setDropDistance] = useState(0);
  const [scrollRange, setScrollRange] = useState(1);

  useLayoutEffect(() => {
    const updateRange = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setScrollRange(range > 0 ? range : 1);
    };
    updateRange();
    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
  }, []);

  useLayoutEffect(() => {
    const updateDistance = () => {
      if (bottleRef.current && clientButtonRef.current) {
        const bottleRect = bottleRef.current.getBoundingClientRect();
        const buttonRect = clientButtonRef.current.getBoundingClientRect();
        const distance = buttonRect.top - bottleRect.top - bottleRect.height;
        setDropDistance(distance - 300);
      }
    };
    updateDistance();
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, []);

  useLayoutEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => scrollY.set(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [scrollY]);

  useEffect(() => {
    const enableSound = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play();
      }
      window.removeEventListener("click", enableSound);
    };
    window.addEventListener("click", enableSound);
    return () => window.removeEventListener("click", enableSound);
  }, []);

  const progress = useTransform(smoothScroll, (v) => Math.min(v / scrollRange, 1));
  const bottleY = useTransform(progress, [0, 1], [0, dropDistance]);
  const bottleRotation = useTransform(progress, [0, 1], [-45, 0]);

  return (
    <div className="relative h-[150vh] w-full overflow-hidden">
      <video
        ref={videoRef}
        src="/videos/videobackground1.mp4"
        className="absolute inset-0 h-full w-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      />
      <nav className="absolute top-4 left-0 w-full flex justify-between px-4 text-xs font-montserrat z-10">
        <Link to="/advisor" className="px-3 py-2 rounded bg-advisor text-admin">
          Espace Conseillère
        </Link>
        <Link to="/admin" className="px-3 py-2 rounded bg-admin text-cream">
          Espace Admin
        </Link>
      </nav>

      <div className="pt-24 flex flex-col items-center relative z-10">
        <h1 className="text-3xl text-cream mb-8 font-playfair text-center">
          Le Compas Olfactif
        </h1>
        <motion.img
          ref={bottleRef}
          src={bottle}
          alt="Bouteille"
          className="w-40 h-auto z-10"
          style={{
            y: bottleY,
            rotate: bottleRotation,
            willChange: "transform",
            touchAction: "pan-y",
            transform: "translate3d(0,0,0)",
          }}
        />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <Link
          ref={clientButtonRef}
          to="/client"
          className="px-5 py-3 rounded bg-client text-cream font-montserrat text-sm"
        >
          Espace Client
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
