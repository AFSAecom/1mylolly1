import React from "react";
import HomeLayout from "./HomeLayout";

const Home = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF0E9] flex flex-col items-center justify-center p-4">
      <div
        className={`w-full max-w-4xl h-[600px] transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        <HomeLayout />
      </div>
    </div>
  );
};

export default Home;
