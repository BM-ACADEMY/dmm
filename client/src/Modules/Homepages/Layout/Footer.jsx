import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/npf-logo.jpeg";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

// ✅ 1. Import Context and Data
import { useLanguage } from "../../../context/LanguageContext";
import { footerData } from "../../../data/Footer";

// Subtle Grid Background
const SimpleFooterBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="simple-footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 0h40v40H0z" fill="none"/>
          <path d="M0 40L40 0" stroke="#fff" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#simple-footer-grid)" />
    </svg>
  </div>
);

const Footer = () => {
  const { language, t: navTranslations } = useLanguage();
  const f = footerData[language] || footerData['en'];
  const isTamil = language === 'ta';

  const menuItems = [
    { name: navTranslations.nav.home, path: "/" },
    { name: navTranslations.nav.about, path: "/about" },
    { name: navTranslations.nav.Ourteam, path: "/our-team" },
    { name: navTranslations.nav.gallery, path: "/gallery" },
    { name: navTranslations.nav.blog, path: "/blog" },
    { name: navTranslations.nav.contact, path: "/contact" },
    { name: navTranslations.nav.downloadId, path: "/license/download" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, link: "https://www.facebook.com/swaminathan1105" },
    { icon: <FaTwitter />, link: "https://x.com/c_pondy?t=kaIyholWlGDvDTB5xGFqQ&s=09" },
    { icon: <FaInstagram />, link: "https://www.instagram.com/c.s.swamynathan/" },
    { icon: <FaYoutube />, link: "https://www.youtube.com/@swaminathan506" },
  ];

  return (
    <footer className="relative bg-[#0F224A] text-slate-300 pt-16 pb-8 overflow-hidden border-t border-slate-800">

      {/* Tamil Font Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700;800&display=swap');
          .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }
        `}
      </style>

      {/* Background Pattern */}
      <SimpleFooterBackground />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* === 1. Brand Section === */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-4 group">
              {/* ✅ UPDATED: Round Logo Fix */}
              <div className="w-14 h-14 bg-white p-0.5 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div>
                <h2 className={`font-bold text-white text-xl leading-none group-hover:text-slate-200 transition-colors ${isTamil ? 'font-tamil' : 'uppercase tracking-tight'}`}>
                  {navTranslations.nav.menuTitle}
                </h2>
                <p className={`text-xs text-slate-500 mt-1 uppercase tracking-widest ${isTamil ? 'font-tamil' : ''}`}>
                  {f.subtitle || "Official Portal"}
                </p>
              </div>
            </Link>

            <p className={`text-slate-400 text-sm leading-relaxed max-w-md ${isTamil ? 'font-tamil' : ''}`}>
              {f.description}
            </p>

            {/* Clean Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* === 2. Quick Links === */}
          <div>
            <h3 className={`text-white font-bold mb-6 ${isTamil ? 'font-tamil text-base' : 'uppercase tracking-widest text-xs'}`}>
              {f.quickLinksTitle}
            </h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 text-sm hover:text-white hover:pl-1 transition-all duration-300 ${isTamil ? 'font-tamil' : ''}`}
                  >
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* === 3. Actions / Get Involved === */}
          <div>
            <h3 className={`text-white font-bold mb-6 ${isTamil ? 'font-tamil text-base' : 'uppercase tracking-widest text-xs'}`}>
              {f.getInvolvedTitle}
            </h3>

            <div className="flex flex-col gap-3">
                <Link
                to="/license"
                className={`block text-center bg-white hover:bg-slate-200 text-[#0F224A] px-5 py-3 rounded-md font-bold transition shadow-sm ${isTamil ? 'font-tamil text-sm' : 'uppercase tracking-wide text-xs'}`}
                >
                {f.memberBtn}
                </Link>

                <Link
                to="/complaint"
                className={`block text-center border border-slate-600 hover:border-white text-slate-300 hover:text-white px-5 py-3 rounded-md font-bold transition ${isTamil ? 'font-tamil text-sm' : 'uppercase tracking-wide text-xs'}`}
                >
                {f.complaintBtn}
                </Link>
            </div>
          </div>

        </div>

        {/* === Footer Bottom === */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

          {/* ✅ UPDATED: Copyright Text */}
          <p className={`text-slate-500 text-xs ${isTamil ? 'font-tamil' : ''}`}>
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">bmtechx.in</span>. All Rights Reserved.
          </p>

          <p className={`text-slate-500 text-xs ${isTamil ? 'font-tamil' : ''}`}>
            Developed by{" "}
            <a
              href="https://bmtechx.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors uppercase tracking-wider font-semibold"
            >
              bmtechx.in
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
