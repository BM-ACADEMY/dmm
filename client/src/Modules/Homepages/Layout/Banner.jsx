// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Banner = () => {
//   const [banner, setBanner] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   const API_URL = `${import.meta.env.VITE_API_BASE_URL}/banners/`;
//   const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data && res.data.length > 0) {
//           setBanner(res.data[res.data.length - 1]);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load banner.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanner();
//   }, []);

//   // ✅ Light Theme Loading
//   if (loading) {
//     return (
//       <section className="w-full h-[50vh] md:h-screen bg-white flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 md:mb-6"></div>
//           <p className="text-gray-500 text-sm md:text-base font-medium tracking-wide animate-pulse">LOADING CONTENT...</p>
//         </div>
//       </section>
//     );
//   }

//   // ✅ Light Theme Error
//   if (error || !banner) {
//     return (
//       <section className="w-full h-[40vh] md:h-[50vh] bg-white flex items-center justify-center">
//         <p className="text-gray-500 text-sm md:text-base">No banner available.</p>
//       </section>
//     );
//   }

//   const imageSrc = banner.image_url
//     ? banner.image_url
//     : `${MEDIA_URL}${banner.image}`;

//   return (
//     // ✅ KEY FIX: Removed fixed height for mobile.
//     // It is now 'h-auto' by default (fits image), and 'md:h-screen' on desktop.
//     <section className="relative w-full h-auto md:h-[calc(100vh-80px)] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-white">

//       {/* 🖼️ Background Image */}
//       <div className="relative md:absolute inset-0 w-full h-full">
//         <img
//           src={imageSrc}
//           alt={banner.title}
//           // ✅ KEY FIX: 'object-contain' for mobile ensures the WHOLE poster is seen.
//           // 'md:object-cover' for desktop keeps the big immersive look.
//           className="w-full h-auto md:h-full object-contain md:object-cover object-center"
//         />

//         {/* Gradient Overlay - Only visible on Desktop where we might have overlay text */}
//         <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
//       </div>

//       {/* 📝 Central Content - HIDDEN ON MOBILE */}
//       {/* Since your poster image already has text, we hide this HTML text on mobile so it doesn't double up or cover the image. */}
//       <div className="hidden md:block relative z-10 container mx-auto px-6 text-center max-w-5xl mt-10">

//         {/* Main Title */}
//         <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-tight mb-6 drop-shadow-lg animate-fadeInUp delay-200">
//           {banner.title}
//         </h2>

//         {/* Subtitle */}
//         {banner.subtitle && (
//           <p className="text-lg md:text-2xl text-gray-800 mb-16 font-medium leading-relaxed max-w-3xl mx-auto animate-fadeInUp delay-300 drop-shadow-md">
//             {banner.subtitle}
//           </p>
//         )}
//       </div>

//       {/* ✨ CSS Animations */}
//       <style>
//         {`
//           @keyframes fadeInUp {
//             0% { opacity: 0; transform: translateY(40px); }
//             100% { opacity: 1; transform: translateY(0); }
//           }
//           .animate-fadeInUp {
//             animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
//           }
//           .delay-200 { animation-delay: 0.2s; }
//           .delay-300 { animation-delay: 0.3s; }
//         `}
//       </style>
//     </section>
//   );
// };

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ IMPORT YOUR BANNER IMAGES
import BannerImg1 from "../../../assets/banner/dmmbanner1.jpeg";
import BannerImg2 from "../../../assets/banner/dmmbanner2.jpeg";
import BannerImg3 from "../../../assets/banner/dmmbanner3.jpeg";
import BannerImg4 from "../../../assets/banner/dmmbanner4.jpeg";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: BannerImg1,
      alt: "National People's Front Banner 1",
    },
    {
      id: 2,
      image: BannerImg3,
      alt: "National People's Front Banner 2",
    }, // <--- FIXED: Added missing comma here
    {
      id: 3,
      image: BannerImg2, // <--- FIXED: Added missing comma here
      alt: "National People's Front Banner 3",
    },
    {
      id: 4,
      image: BannerImg4,
      alt: "National People's Front Banner 4",
    }
  ];

  // ✅ Auto-Slide Logic
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    // Outer Section: Full Width
    <section className="relative w-full bg-[#050505] overflow-hidden group">
      {/* ✅ HEIGHT CONTROLS
          Adjust these values to change how tall the banner area is
      */}
      <div className="relative w-full h-[250px] md:h-[450px] lg:h-[600px] xl:h-[700px]">
        {/* --- NAVIGATION ARROWS --- */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-white transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-white transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronRight size={28} />
        </button>

        {/* --- SLIDES --- */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* 1. BACKGROUND LAYER (Blurred) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover blur-3xl scale-110 brightness-50 opacity-80"
              />
            </div>

            {/* 2. MAIN CONTAINER LAYER (Sharp Image) */}
            <div className="relative z-20 w-full h-full flex items-center justify-center p-4 md:p-8">
              <div className="relative w-full max-w-[1400px] h-full shadow-2xl rounded-xl overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-fill md:object-contain"
                />
              </div>
            </div>
          </div>
        ))}

        {/* --- PAGINATION DOTS --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 shadow-md ${
                currentSlide === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
