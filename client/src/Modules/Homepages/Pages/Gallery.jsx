import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowLeft, FaArrowRight, FaPlay, FaVideo } from "react-icons/fa";

// ✅ Import Context and Data
import { useLanguage } from "../../../context/LanguageContext";
import { galleryData } from "../../../data/gallery";

const HomeGallery = ({ limit }) => {
  const [items, setItems] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  const { language } = useLanguage();
  const t = galleryData[language] || galleryData['en'];
  const isTamil = language === 'ta';

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/gallery/images/`;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(API_URL);
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(t.error);
      }
    };
    fetchItems();
  }, [t.error]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
      if (e.key === "ArrowRight") setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, items.length]);

  // Helper to get URL and Type safely
  const getMediaInfo = (item) => {
    const url = item.media_url || item.image_url;
    const isVideo = item.media_type === "video";
    return { url, isVideo };
  };

  // Determine items to show
  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <section className="relative w-full bg-[#f0f0f0] py-20 lg:py-32 overflow-hidden">
      <style>
        {`
          /* Importing Inter for the geometric bold look */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700;900&display=swap');

          .font-dmm-reference { font-family: 'Inter', sans-serif; }
          .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }
        `}
      </style>

      <div className="container mx-auto px-4 relative z-10 font-dmm-reference">
        {/* --- Header Section --- */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className={`text-[#ff0000] font-extrabold uppercase tracking-[0.25em] text-[11px] md:text-xs mb-4 ${isTamil ? 'font-tamil' : ''}`}>
            {limit ? (isTamil ? "சமீபத்திய" : "LATEST") : (t.sub || "Visual Journey")}
          </span>

          <h2 className={`text-4xl md:text-6xl font-black text-[#0024f8] leading-none ${isTamil ? 'font-tamil' : 'tracking-tighter'}`}>
            {limit ? (isTamil ? "புகைப்படத்தொகுப்பு" : "GALLERY HIGHLIGHTS") : t.title}
          </h2>

          <div className="w-[1px] h-20 bg-[#0024f8]/10 mt-12"></div>
        </div>

        {error && <div className="text-red-500 text-center mb-8 font-bold">{error}</div>}

        {/* --- Grid Section --- */}
        <div className="flex flex-wrap items-center justify-center gap-6 max-w-7xl mx-auto">
          {displayItems.map((item, index) => {
            const { url, isVideo } = getMediaInfo(item);

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
              >
                {/* Media Thumbnail */}
                <div className="size-60 md:size-72 relative">
                    {isVideo ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseOver={e => e.target.play()}
                          onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                        />
                    ) : (
                        <img
                          src={url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    )}

                    {/* Video Indicator Overlay */}
                    {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/90 border border-white/20">
                                <FaPlay size={16} className="ml-1" />
                            </div>
                            <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full text-white">
                                <FaVideo size={10} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 pointer-events-none">
                  <h3 className={`text-xl font-black mb-2 ${isTamil ? 'font-tamil' : 'uppercase tracking-tight'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                    {isTamil ? "மேலும் பார்க்க" : "View Details"}
                    <svg width="18" height="18" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* --- View All Button (Only if limit is set) --- */}
        {limit && items.length > limit && (
          <div className="flex justify-center mt-12">
            <a 
              href="#/gallery" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#0024f8] text-white font-bold uppercase tracking-widest rounded hover:bg-[#1a2b48] transition-colors"
            >
              {isTamil ? "எல்லாவற்றையும் பார்க்க" : "View All Gallery"}
              <FaArrowRight />
            </a>
          </div>
        )}

      </div>

      {/* --- Lightbox Section --- */}
      <AnimatePresence>
        {lightboxOpen && items.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#f0f0f0] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Lightbox Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
                <div className={`text-[#1a2b48] font-black text-xl ${isTamil ? 'font-tamil' : 'uppercase tracking-tight'}`}>
                    {items[currentIndex].title}
                </div>
                <button onClick={closeLightbox} className="p-2 hover:bg-[#f0f0f0] rounded-full transition-colors">
                    <FaTimes size={28} className="text-[#1a2b48]/40 hover:text-red-600" />
                </button>
            </div>

            {/* Lightbox Content */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden" onClick={closeLightbox}>
                {(() => {
                    const { url, isVideo } = getMediaInfo(items[currentIndex]);
                    return (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative max-w-full max-h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isVideo ? (
                                <video
                                    src={url}
                                    className="w-auto h-auto max-w-full max-h-[80vh] shadow-2xl rounded-2xl object-contain bg-black"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={url}
                                    alt={items[currentIndex].title}
                                    className="w-auto h-auto max-w-full max-h-[80vh] shadow-2xl rounded-2xl object-contain bg-white p-2"
                                />
                            )}
                        </motion.div>
                    );
                })()}

                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1)); }}
                    className="absolute left-4 md:left-12 p-4 text-[#1a2b48]/30 hover:text-[#0024f8] transition-all"
                >
                    <FaArrowLeft size={40} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1)); }}
                    className="absolute right-4 md:right-12 p-4 text-[#1a2b48]/30 hover:text-[#0024f8] transition-all"
                >
                    <FaArrowRight size={40} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeGallery;
