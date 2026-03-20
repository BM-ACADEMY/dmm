import React, { useState } from "react";
import { User, RotateCw, X } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { teamData } from "../../../data/ourteam";

// ✅ Images
import SwaminathanImg from "../../../assets/team/Swaminathan.jpeg";
import DrQInnacyRockImg from "../../../assets/team/Dr.Q.Innacy Rock.jpeg";
import JebinLazarusImg from "../../../assets/team/Jebin Lazarus.jpeg";
import SureshKumarImg from "../../../assets/team/Suresh Kumar.jpeg"; // ID: 4
import DrSBabuImg from "../../../assets/team/DRS.Babu.jpeg"; // ID: 5
import ABanumathiImg from "../../../assets/team/A.Banumathi.jpeg"; // ID: 6
import GRajeshImg from "../../../assets/team/G.Rajesh.jpeg"; // ID: 7
import YvoneChristineImg from "../../../assets/team/Yvone Christine.jpeg"; // ID: 8
import DReginaMaryImg from "../../../assets/team/D.Regina Mary.jpeg"; // ID: 9
import AarumugamImg from "../../../assets/team/Aarumugam.jpeg"; // ID: 10
import VimalImg from "../../../assets/team/Vimal.jpeg"; // ID: 11
import BKamarudeenImg from "../../../assets/team/B.Kamarudeen.jpeg"; // ID: 12
import Logo from "../../../assets/npf-logo.jpeg";

const OurTeam = () => {
  const { language } = useLanguage();
  const t = teamData[language] || teamData["en"];
  const isTamil = language === 'ta';

  const [flippedId, setFlippedId] = useState(null);

  const teamImages = {
    1: SwaminathanImg,
    2: DrQInnacyRockImg,
    3: JebinLazarusImg,
    4: SureshKumarImg,
    5: DrSBabuImg,
    6: ABanumathiImg,
    7: GRajeshImg,
    8: YvoneChristineImg,
    9: DReginaMaryImg,
    10: AarumugamImg,
    11: VimalImg,
    12: BKamarudeenImg
  };

  const handleCardClick = (id) => {
    setFlippedId(flippedId === id ? null : id);
  };

  return (
    <div className="w-full bg-[#f4f4f4] font-dmm-reference min-h-screen relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700;900&display=swap');
        .font-dmm-reference { font-family: 'Inter', sans-serif; }
        .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }

        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* --- SECTION 1: HEADER --- */}
      <div className="relative z-10 bg-white py-20 text-center shadow-sm">
        <span className={`text-[#ff0000] font-black tracking-[0.4em] uppercase text-xs mb-4 block ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil ? "எங்கள் தலைமை" : "Our Leadership"}
        </span>
        <h1 className={`text-4xl md:text-6xl font-black text-[#0024f8] tracking-tighter uppercase leading-none ${isTamil ? 'font-tamil' : ''}`}>
          {t.title}
        </h1>
        <div className="w-20 h-2 bg-[#0024f8] mx-auto rounded-full mt-6"></div>
      </div>

      {/* --- SECTION 2: TEAM GRID --- */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">

        {/* --- OFFICE BEARERS (First 2) --- */}
        <div id="officeBearer" className="scroll-mt-32">
           <div className="mb-12 text-center">
             <h2 className={`text-2xl font-black text-[#1a2b48] uppercase tracking-widest ${isTamil ? 'font-tamil' : ''}`}>
               {isTamil ? "தலைமைக் குழு" : "Office Bearers"}
             </h2>
             <div className="w-12 h-1 bg-[#ff0000] mx-auto mt-2 rounded-full"></div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {t.members.slice(0, 2).map((member) => {
              const isFlipped = flippedId === member.id;
              return (
                <div
                  key={member.id}
                  className="group relative h-[420px] w-full cursor-pointer perspective-1000"
                  onClick={() => handleCardClick(member.id)}
                >
                  <div className={`relative w-full h-full duration-700 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* NEW FRONT SIDE: Full-Bleed Overlay Layout */}
                    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] backface-hidden overflow-hidden hover:shadow-[0_20px_50px_rgba(0,36,248,0.25)] transition-shadow duration-300">
                      
                      {/* Background Image (Full Cover) */}
                      <img 
                        src={teamImages[member.id]} 
                        alt={member.name} 
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:scale-110 transition-transform duration-700" 
                      />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0018a8] via-[#0024f8]/50 to-transparent opacity-90"></div>

                      {/* Top Right Logo */}
                      <div className="absolute top-5 right-5 z-10 bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        <img src={Logo} alt="Logo" className="w-6 h-6 rounded-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                      </div>

                      {/* Bottom Content Area */}
                      <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h2 className={`text-2xl font-black text-white mb-2 leading-tight drop-shadow-md ${isTamil ? 'font-tamil' : ''}`}>{member.name}</h2>
                        <h3 className={`text-blue-50 font-bold uppercase text-xs tracking-widest bg-white/20 backdrop-blur-md py-1.5 px-5 rounded-full inline-block mb-6 border border-white/20 shadow-sm ${isTamil ? 'font-tamil' : ''}`}>{member.role}</h3>
                        
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 group-hover:text-white transition-colors">
                          <RotateCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />{isTamil ? "விபரம் காண்க" : "View Details"}
                        </div>
                      </div>
                    </div>

                    {/* BACK SIDE (Unchanged) */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0024f8] to-[#0018a8] rounded-3xl shadow-xl backface-hidden rotate-y-180 p-8 flex flex-col text-left text-white border border-blue-600/30">
                      <div className="flex justify-between items-start mb-6 border-b border-white/20 pb-4">
                          <div>
                               <h3 className={`font-black text-xl leading-none ${isTamil ? 'font-tamil' : ''}`}>{member.name}</h3>
                              <span className={`text-blue-200 text-xs uppercase tracking-wider font-bold mt-1 block ${isTamil ? 'font-tamil' : ''}`}>{member.role}</span>
                          </div>
                          <button className="text-white/70 hover:text-white transition-colors p-1 bg-white/10 rounded-full"><X size={20} /></button>
                      </div>
                      <div className="flex-grow overflow-y-auto custom-scrollbar">
                           <p className={`text-blue-50 text-sm leading-relaxed font-medium opacity-90 ${isTamil ? 'font-tamil' : ''}`}>{member.bio}</p>
                      </div>
                      <div className="pt-6 mt-2 text-center">
                          <button className="text-[10px] font-black bg-white text-[#0024f8] py-2 px-6 rounded-full uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">{isTamil ? "மூடுக" : "Close"}</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- EXECUTIVE COMMITTEE (Rest) --- */}
        <div id="executivecommittee" className="scroll-mt-32 pt-10 border-t border-gray-200">
          <div className="mb-12 text-center">
             <h2 className={`text-2xl font-black text-[#1a2b48] uppercase tracking-widest ${isTamil ? 'font-tamil' : ''}`}>
               {isTamil ? "செயற்குழு" : "Executive Committee"}
             </h2>
             <div className="w-12 h-1 bg-[#ff0000] mx-auto mt-2 rounded-full"></div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {t.members.slice(2).map((member) => {
              const isFlipped = flippedId === member.id;
              return (
                <div
                  key={member.id}
                  className="group relative h-[420px] w-full cursor-pointer perspective-1000"
                  onClick={() => handleCardClick(member.id)}
                >
                  <div className={`relative w-full h-full duration-700 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* NEW FRONT SIDE: Full-Bleed Overlay Layout */}
                    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] backface-hidden overflow-hidden hover:shadow-[0_20px_50px_rgba(0,36,248,0.25)] transition-shadow duration-300">
                      
                      {/* Background Image (Full Cover) */}
                      <img 
                        src={teamImages[member.id]} 
                        alt={member.name} 
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:scale-110 transition-transform duration-700" 
                      />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0018a8] via-[#0024f8]/50 to-transparent opacity-90"></div>

                      {/* Top Right Logo */}
                      <div className="absolute top-5 right-5 z-10 bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        <img src={Logo} alt="Logo" className="w-6 h-6 rounded-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                      </div>

                      {/* Bottom Content Area */}
                      <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h2 className={`text-2xl font-black text-white mb-2 leading-tight drop-shadow-md ${isTamil ? 'font-tamil' : ''}`}>{member.name}</h2>
                        <h3 className={`text-blue-50 font-bold uppercase text-xs tracking-widest bg-white/20 backdrop-blur-md py-1.5 px-5 rounded-full inline-block mb-6 border border-white/20 shadow-sm ${isTamil ? 'font-tamil' : ''}`}>{member.role}</h3>
                        
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 group-hover:text-white transition-colors">
                          <RotateCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />{isTamil ? "விபரம் காண்க" : "View Details"}
                        </div>
                      </div>
                    </div>

                    {/* BACK SIDE (Unchanged) */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0024f8] to-[#0018a8] rounded-3xl shadow-xl backface-hidden rotate-y-180 p-8 flex flex-col text-left text-white border border-blue-600/30">
                      <div className="flex justify-between items-start mb-6 border-b border-white/20 pb-4">
                          <div>
                               <h3 className={`font-black text-xl leading-none ${isTamil ? 'font-tamil' : ''}`}>{member.name}</h3>
                              <span className={`text-blue-200 text-xs uppercase tracking-wider font-bold mt-1 block ${isTamil ? 'font-tamil' : ''}`}>{member.role}</span>
                          </div>
                          <button className="text-white/70 hover:text-white transition-colors p-1 bg-white/10 rounded-full"><X size={20} /></button>
                      </div>
                      <div className="flex-grow overflow-y-auto custom-scrollbar">
                           <p className={`text-blue-50 text-sm leading-relaxed font-medium opacity-90 ${isTamil ? 'font-tamil' : ''}`}>{member.bio}</p>
                      </div>
                      <div className="pt-6 mt-2 text-center">
                          <button className="text-[10px] font-black bg-white text-[#0024f8] py-2 px-6 rounded-full uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">{isTamil ? "மூடுக" : "Close"}</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;