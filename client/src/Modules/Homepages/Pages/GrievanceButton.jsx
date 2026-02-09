import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBullhorn } from "react-icons/fa";
import { motion } from "framer-motion";

import { useLanguage } from "../../../context/LanguageContext";

const GrievanceButton = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Text based on language
  const label = language === 'ta' ? "குறைகளை தெரிவிக்க" : "Grievance Redressal";

  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/complaint")} // Make sure this matches your route path
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-[#ff0000] text-white rounded-full shadow-2xl border-2 border-white/20 hover:bg-[#d90000] hover:shadow-red-500/50 transition-all group"
    >
      {/* Blinking Dot for Attention */}
      <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 border-2 border-[#ff0000]"></span>
      </span>

      <FaBullhorn className="text-xl group-hover:rotate-[-12deg] transition-transform" />

      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] uppercase opacity-80 font-bold tracking-wider">Click Here</span>
        <span className={`font-black uppercase tracking-wide ${language === 'ta' ? 'text-sm font-tamil' : 'text-xs'}`}>
            {label}
        </span>
      </div>
    </motion.button>
  );
};

export default GrievanceButton;
