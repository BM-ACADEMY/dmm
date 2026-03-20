import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import { FaDownload, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/dmmlogo.jpeg";
import "react-toastify/dist/ReactToastify.css";

// ✅ 1. Import Context and Data
import { useLanguage } from "../../../context/LanguageContext";
import { downloadData } from "../../../data/licensedownload";

// Subtle Document Pattern Background using Brand Blue
const OfficialBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="doc-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 0h60v60H0z" fill="none"/>
            <path d="M0 60L60 0" stroke="#0024f8" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#doc-grid)" />
    </svg>
  </div>
);

export default function MembershipDownload() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { language } = useLanguage();
  const t = downloadData[language] || downloadData['en'];
  const isTamil = language === 'ta';

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/dmm/download/`;

  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 90) current = 90;
      setProgress(Math.round(current));
    }, 200);
    return interval;
  };

  const handleDownload = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg(t.errors.invalid);
      toast.error(t.errors.invalid);
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    setProgress(0);

    const interval = simulateProgress();

    try {
      const res = await axios.get(`${API_URL}?phone=${cleanPhone}`, {
        validateStatus: () => true
      });
      clearInterval(interval);
      setProgress(100);

      if (res.status === 200 && res.data?.url) {
        // Open the PDF URL directly — browser handles download
        window.open(res.data.url, "_blank", "noopener,noreferrer");
        toast.success(t.success);
        setSuccessMsg(t.success);
      } else if (res.status === 400) {
        const msg = res.data?.error || t.errors.notApproved;
        setErrorMsg(msg);
        toast.error(msg);
      } else if (res.status === 404) {
        setErrorMsg(t.errors.notFound);
        toast.error(t.errors.notFound);
      } else {
        const msg = res.data?.error || t.errors.server;
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setErrorMsg(t.errors.server);
      toast.error("Server error.");
    } finally {
      setTimeout(() => { setLoading(false); setProgress(0); }, 1000);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f0f0f0] relative overflow-hidden py-10">
      <ToastContainer position="top-center" transition={Slide} />

      <style>
        {`
          /* Geometric bold look from your reference */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700;900&display=swap');

          .font-dmm-reference { font-family: 'Inter', sans-serif; }
          .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }

          .dmm-blue-text {
            color: #0024f8;
          }
        `}
      </style>

      <OfficialBackground />

      {/* Decorative Blur Circles using Brand Blue */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0024f8]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0024f8]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-lg w-full mx-4 font-dmm-reference"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50">

            {/* Header Section */}
            <div className="pt-10 pb-6 px-8 text-center bg-white border-b border-slate-100">
                <div className="inline-block relative mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f0f0f0] shadow-md flex items-center justify-center bg-white">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#0024f8] text-white p-2 rounded-full border-2 border-white shadow-sm z-10">
                        <FaShieldAlt size={14} />
                    </div>
                </div>

                {/* Title in Inter Black 900 */}
                <h1 className={`text-3xl md:text-4xl font-black text-[#0024f8] mb-3 leading-tight ${isTamil ? 'font-tamil' : 'uppercase tracking-tighter'}`}>
                    {t.title}
                </h1>

                <p className={`text-[#1a2b48] text-[11px] font-black uppercase tracking-[0.25em] opacity-60 ${isTamil ? 'font-tamil tracking-wide' : ''}`}>
                    {t.subtitle || "Secure ID Verification"}
                </p>
            </div>

            <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                    <label className={`block text-[#1a2b48] text-xs font-black uppercase tracking-widest mb-4 ${isTamil ? 'font-tamil' : ''}`}>
                        {t.placeholder || "Registered Mobile Number"}
                    </label>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/\D/g, "");
                                if (onlyNums.length <= 10) setPhone(onlyNums);
                                setErrorMsg("");
                            }}
                            maxLength={10}
                            className={`w-full bg-[#f0f0f0]/50 border-2 ${
                                errorMsg ? "border-red-400 bg-red-50" : "border-slate-100 focus:border-[#0024f8] focus:bg-white"
                            } outline-none px-6 py-5 rounded-xl text-center text-3xl font-black tracking-[0.2em] text-[#1a2b48] transition-all duration-300 placeholder-slate-300`}
                        />
                        {phone.length === 10 && !errorMsg && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-pulse">
                                <FaCheckCircle size={26} />
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 flex items-center justify-center gap-2 text-red-600 text-xs font-black uppercase"
                            >
                                <FaExclamationCircle /> {errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {loading && (
                    <div className="w-full bg-[#f0f0f0] rounded-full h-2 mb-8 overflow-hidden">
                        <div className="h-full bg-[#0024f8] rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <button
                    onClick={handleDownload}
                    disabled={loading}
                    /* Button font updated to Inter Black */
                    className={`w-full py-5 rounded-xl font-black text-sm md:text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-3
                        ${loading
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-[#0024f8] hover:bg-[#1a2b48] text-white hover:shadow-blue-200 hover:-translate-y-1 active:translate-y-0"
                        } ${isTamil ? 'font-tamil' : 'uppercase tracking-[0.15em]'}`}
                >
                    {loading ? (
                        <>
                           <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           {t.processing || "Verifying..."}
                        </>
                    ) : (
                        <>
                           <FaDownload size={20} />
                           {t.button || "Download Certificate"}
                        </>
                    )}
                </button>

                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center"
                    >
                        <p className="text-emerald-700 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                            <FaCheckCircle /> {successMsg}
                        </p>
                    </motion.div>
                )}
            </div>

            <div className="bg-[#f0f0f0]/50 p-5 text-center border-t border-slate-100">
                 <p className={`text-[11px] text-[#1a2b48] font-black uppercase tracking-[0.2em] opacity-40 ${isTamil ? 'font-tamil' : ''}`}>
                    {t.footer || "Official dmm Portal"}
                 </p>
            </div>
        </div>
      </motion.div>
    </section>
  );
}
