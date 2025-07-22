import React from "react";
import { motion } from "framer-motion";
import HomeLayout from "./HomeLayout";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FBF0E9] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl h-[600px]"
      >
        <HomeLayout />
      </motion.div>
    </div>
  );
};

export default Home;
