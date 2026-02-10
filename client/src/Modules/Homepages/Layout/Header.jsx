import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, Download } from "lucide-react";
import Logo from "../../../assets/dmmlogo.jpeg";
import { useLanguage } from "../../../context/LanguageContext";
import LanguageToggle from "../../language/LanguageToggle";

// --- NAVIGATION CONFIGURATION ---
const PATHS = {
  HOME: "/",
  ABOUT: "/about",
  OUR_TEAM: "/our-team",
  GALLERY: "/gallery",
  BLOG: "/blog",
  CONTACT: "/contact",
  LICENSE: "/license",
  DOWNLOAD: "/license/download",
};

const NAV_ITEMS = [
  { id: 'Home', path: PATHS.HOME, transKey: 'home' },
  {
    id: 'About',
    path: PATHS.ABOUT,
    transKey: 'about',
    subMenu: ['background', 'vision', 'philosophy', 'ideology']
  },
  {
    id: 'Our Team',
    path: PATHS.OUR_TEAM,
    transKey: 'Ourteam',
    subMenu: ['officeBearer', 'executivecommittee']
  },
  { id: 'Gallery', path: PATHS.GALLERY, transKey: 'gallery' },
  { id: 'Blog', path: PATHS.BLOG, transKey: 'blog' },
  { id: 'Contact', path: PATHS.CONTACT, transKey: 'contact' },
  { id: 'Download', path: PATHS.DOWNLOAD, transKey: 'download' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  // Simple scroll detection for shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path, hash = null) => {
    setIsMenuOpen(false);
    if (hash) {
      navigate(path);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700;900&display=swap');
          .font-dmm-reference { font-family: 'Inter', sans-serif; }
          .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }
        `}
      </style>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-[80px] lg:h-[90px]" />

      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 border-b border-gray-100 ${
          isScrolled ? "shadow-lg py-2" : "shadow-sm py-3 lg:py-4"
        }`}
      >
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="w-1/2 bg-[#0024f8]"></div>
          <div className="w-1/2 bg-[#ff0000]"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">

          {/* --- LEFT: LOGO & BRANDING --- */}
          <Link
            to={PATHS.HOME}
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-3 shrink-0 z-50"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
              <img src={Logo} alt="dmm Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col">
              {/* Responsive Title Logic */}
              <h1 className={`font-black text-[#1a2b48] leading-none ${
                isTamil
                  ? "font-tamil text-sm md:text-lg lg:text-xl" // Tamil Font Size
                  : "text-sm md:text-lg lg:text-2xl uppercase tracking-tighter" // English Font Size
              }`}>
                {isTamil ? "தேசிய மக்கள் முன்னணி" : t.nav.menuTitle}
              </h1>
              <span className={`font-bold text-[#0024f8] ${
                isTamil
                  ? "font-tamil text-[9px] md:text-[10px]"
                  : "text-[9px] md:text-[10px] uppercase tracking-[0.3em] mt-0.5"
              }`}>
                {t.nav.menuSubtitle || "Visionary Leader"}
              </span>
            </div>
          </Link>

          {/* --- CENTER: DESKTOP NAVIGATION --- */}
          <nav className="hidden xl:flex items-center gap-1 ml-auto mr-6">
            {NAV_ITEMS.map((item) => {
              const label = t.nav[item.transKey];
              const isActive = location.pathname === item.path;

              const linkClass = isTamil
                ? `px-3 py-2 font-tamil text-[13px] font-bold transition-colors duration-300 border-b-2 ${isActive ? 'text-[#ff0000] border-[#ff0000]' : 'text-[#1a2b48] border-transparent hover:text-[#ff0000]'}`
                : `px-3 py-2 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 border-b-2 ${isActive ? 'text-[#ff0000] border-[#ff0000]' : 'text-[#1a2b48] border-transparent hover:text-[#ff0000]'}`;

              if (item.subMenu) {
                return (
                  <div key={item.id} className="relative group">
                    <button className={`${linkClass} flex items-center gap-1`}>
                      {label} <ChevronDown size={14} strokeWidth={3} className="group-hover:rotate-180 transition-transform" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full right-0 w-56 bg-white shadow-xl border-t-[3px] border-[#0024f8] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 rounded-b-lg transform translate-y-2 group-hover:translate-y-0">
                      {item.subMenu.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleNavClick(item.path, sub)}
                          className={`block w-full text-left px-5 py-3 hover:bg-gray-50 text-[#1a2b48] transition-colors ${
                            isTamil ? "font-tamil text-sm font-bold" : "text-[11px] font-black uppercase tracking-wider"
                          }`}
                        >
                          {item.id === 'About' ? t.nav.aboutMenu[sub] : t.nav.OurteamMenu[sub]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button key={item.id} onClick={() => handleNavClick(item.path)} className={`${linkClass} flex items-center gap-2`}>
                  {item.id === 'Download' && <Download size={14} />}
                  {label}
                </button>
              );
            })}
          </nav>

          {/* --- RIGHT: ACTIONS --- */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <div className="hidden md:block">
               <LanguageToggle />
            </div>

            {/* Join Us Button */}
            <button
              onClick={() => navigate(PATHS.LICENSE)}
              className="hidden md:flex bg-[#ff0000] text-white px-5 py-2.5 rounded-md font-black uppercase text-[11px] tracking-widest shadow-lg hover:bg-[#0024f8] transition-all items-center gap-2 group"
            >
              <span className={isTamil ? "font-tamil" : ""}>{t.nav.joinUs}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(true)} className="xl:hidden p-1 text-[#1a2b48]">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE OVERLAY DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

          <div className="relative w-[85%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             {/* Drawer Header */}
             <div className="p-6 flex justify-between items-center border-b border-gray-100">
               <div className="flex items-center gap-2">
                 <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
                 <span className="font-black text-[#1a2b48] uppercase text-sm">Menu</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="bg-gray-100 p-1 rounded-full text-gray-500 hover:text-red-600 transition-colors">
                 <X size={24} />
               </button>
             </div>

             {/* Drawer Content */}
             <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => handleNavClick(item.path)}
                     className={`flex items-center gap-3 text-lg font-black text-[#1a2b48] text-left border-b border-gray-50 py-4 hover:pl-2 transition-all ${
                       isTamil ? 'font-tamil' : 'uppercase tracking-tight'
                     }`}
                   >
                     {item.id === 'Download' && <Download size={18} className="text-[#0024f8]" />}
                     {t.nav[item.transKey]}
                   </button>
                ))}

                {/* Mobile Bottom Actions */}
                <div className="mt-8 flex flex-col gap-4">
                   <button
                    onClick={() => handleNavClick(PATHS.LICENSE)}
                    className="w-full bg-[#ff0000] text-white py-4 rounded-xl font-black text-xs uppercase shadow-lg flex justify-center items-center gap-2"
                   >
                     {t.nav.joinUs} <ArrowRight size={16} />
                   </button>
                   <div className="flex justify-center mt-2 border-t pt-4 border-gray-100">
                     <LanguageToggle />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
