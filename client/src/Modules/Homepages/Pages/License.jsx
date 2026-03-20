import React, { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import logo from "../../../assets/dmmlogo.jpeg";
import { FaUser, FaPhoneAlt, FaIdCard, FaMapMarkerAlt, FaUpload, FaCheckCircle, FaTimesCircle, FaIdBadge } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import Context and Data
import { useLanguage } from "../../../context/LanguageContext";
import { licenseData } from "../../../data/license";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Custom Background Pattern ---
const CampaignBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
    <div className="absolute inset-0 bg-[radial-gradient(#0024f8_1px,transparent_1px)] [background-size:20px_20px]"></div>
  </div>
);

export default function License() {
  const [formData, setFormData] = useState({
    name: "",
    father_husband_name: "",
    date_of_joining: new Date().toISOString().split('T')[0],
    phone: "",
    address: "",
    constituency: "",
    photo: null,
  });

  const [checking, setChecking] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [phoneAvailable, setPhoneAvailable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const { language } = useLanguage();
  const t = licenseData[language] || licenseData['en'];
  const isTamil = language === 'ta';

  // --- LOGIC (PRESERVED) ---
  const checkPhone = async (number) => {
    if (number.length !== 10) {
      setPhoneAvailable(null);
      setPhoneMessage("");
      return;
    }
    setChecking(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/dmm/check_phone/`, { params: { phone: number } });
      if (res.data.available) {
        setPhoneAvailable(true);
        setPhoneMessage(t.messages.phoneAvailable);
      } else {
        setPhoneAvailable(false);
        setPhoneMessage(t.messages.phoneTaken);
      }
    } catch {
      setPhoneAvailable(false);
      setPhoneMessage(t.messages.serverError);
    }
    setChecking(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "phone") {
      const clean = value.replace(/\D/g, "");
      if (clean.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: clean }));
        checkPhone(clean);
      }
      return;
    }
    if (name === "photo") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, photo: file }));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!(formData.name || "").trim()) { toast.error(t.messages.validation.name); return false; }
    if (!(formData.father_husband_name || "").trim()) { toast.error(t.messages.validation.father_husband_name); return false; }
    if (!formData.date_of_joining) { toast.error(t.messages.validation.date_of_joining); return false; }
    if (!formData.constituency) { toast.error(t.messages.validation.constituency); return false; }
    if ((formData.phone || "").length !== 10) { toast.error(t.messages.validation.phone); return false; }
    if (phoneAvailable === false) { toast.error(t.messages.validation.phoneReg); return false; }
    if (!(formData.address || "").trim()) { toast.error(t.messages.validation.address); return false; }
    if (!formData.photo) { toast.error(t.messages.validation.photo); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v ?? ""));
    try {
      await axios.post(`${API_BASE_URL}/dmm/`, data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(t.messages.success);
      toast.success(t.messages.success);
      setFormData({ 
        name: "", 
        father_husband_name: "", 
        date_of_joining: new Date().toISOString().split('T')[0], 
        phone: "", 
        address: "", 
        constituency: "", 
        photo: null 
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPhoneMessage("");
      setPhoneAvailable(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.error || t.messages.fail);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 bg-[#f8fafc] relative overflow-hidden font-dmm-reference">
      <ToastContainer position="top-right" transition={Slide} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700;900&display=swap');
        .font-dmm-reference { font-family: 'Inter', sans-serif; }
        .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }
      `}</style>

      <CampaignBackground />

      <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* --- LEFT: FORM SECTION --- */}
        <div className="lg:col-span-8 bg-white rounded-sm shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Bar with Blue/Red Accent */}
          <div className="h-1.5 w-full flex">
            <div className="w-1/2 bg-[#0024f8]"></div>
            <div className="w-1/2 bg-[#ff0000]"></div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-50 shadow-md overflow-hidden shrink-0">
                <img src={logo} alt="dmm Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className={`text-2xl md:text-4xl font-black text-[#1a2b48] leading-tight ${isTamil ? 'font-tamil' : 'uppercase tracking-tighter'}`}>
                  {t.title}
                </h1>
                <p className={`text-[#0024f8] text-sm font-bold uppercase tracking-widest mt-1 ${isTamil ? 'font-tamil' : ''}`}>
                  {t.subtitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Row 1: Name & Father/Husband Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaUser size={18} /></div>
                    <div>
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.name}</p>
                      <input
                        name="name" value={formData.name} onChange={handleChange} placeholder={t.placeholders.name}
                        className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg transition-all ${isTamil ? 'font-tamil' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaUser size={18} /></div>
                    <div>
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.father_husband_name}</p>
                      <input
                        name="father_husband_name" value={formData.father_husband_name} onChange={handleChange} placeholder={t.placeholders.father_husband_name}
                        className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg transition-all ${isTamil ? 'font-tamil' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Date and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaIdCard size={18} /></div>
                    <div className="flex-1">
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.date_of_joining}</p>
                      <input
                        type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange}
                        className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg transition-all ${isTamil ? 'font-tamil' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaPhoneAlt size={18} /></div>
                    <div className="flex-1">
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.phone}</p>
                      <div className="relative">
                        <input
                          name="phone" value={formData.phone} onChange={handleChange} placeholder={t.placeholders.phone} maxLength={10}
                          className={`w-full border-b-2 py-2 outline-none font-black text-lg transition-all ${
                            phoneAvailable === false ? "border-red-500 text-red-600" :
                            phoneAvailable === true ? "border-green-500 text-green-600" : "border-slate-100 focus:border-[#0024f8] text-[#1a2b48]"
                          }`}
                        />
                        {checking && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#0024f8] border-t-transparent rounded-full animate-spin"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Constituency & Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaMapMarkerAlt size={18} /></div>
                    <div className="flex-1">
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.constituency}</p>
                      <select
                        name="constituency" value={formData.constituency} onChange={handleChange}
                        className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg bg-transparent transition-all ${isTamil ? 'font-tamil' : ''}`}
                      >
                        <option value="">{t.placeholders.constituency}</option>
                        {licenseData.constituencies.map((c) => (
                          <option key={c.en} value={c.en}>{isTamil ? c.ta : c.en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaUpload size={18} /></div>
                    <div className="flex-1">
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.photo}</p>
                      <div className="relative cursor-pointer py-2 border-b-2 border-slate-100 hover:border-[#0024f8] transition-all">
                        <input type="file" ref={fileInputRef} name="photo" accept="image/*" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <p className={`text-sm font-bold truncate ${formData.photo ? 'text-[#0024f8]' : 'text-slate-300'} ${isTamil ? 'font-tamil' : ''}`}>
                          {formData.photo ? formData.photo.name : t.placeholders.photoDefault}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Address */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md mt-1"><FaMapMarkerAlt size={18} /></div>
                  <div className="flex-1">
                    <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.address}</p>
                    <textarea
                      name="address" value={formData.address} onChange={handleChange} rows="2" placeholder={t.placeholders.address}
                      className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-md resize-none transition-all ${isTamil ? 'font-tamil' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit" disabled={submitting || checking}
                className={`w-full py-5 rounded-sm font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0
                  ${submitting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#ff0000] text-white hover:bg-[#0024f8]"}`}
              >
                <span className={isTamil ? 'font-tamil text-lg' : ''}>{submitting ? t.buttons.submitting : t.buttons.submit}</span>
              </button>
            </form>

          </div>
        </div>

        {/* --- RIGHT: ID CARD PREVIEW (Sticky) --- */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-[#1a2b48] rounded-sm p-8 shadow-2xl relative border-t-4 border-[#ff0000]">
             <h3 className={`text-white text-xs font-black uppercase tracking-widest mb-8 text-center ${isTamil ? 'font-tamil' : ''}`}>{t.previewTitle}</h3>

             {/* Actual Card Mockup using membership.jpeg */}
             <div 
               className="relative mx-auto rounded-lg shadow-2xl overflow-hidden bg-white"
               style={{ 
                 width: "100%", 
                 aspectRatio: "540 / 340",
                 backgroundImage: "url('/membership/membership.png')",
                 backgroundSize: "cover",
                 backgroundPosition: "center"
               }}
             >
                {/* Member Photo Overlay */}
                <div 
                  className="absolute bg-slate-100 overflow-hidden"
                  style={{ 
                    top: "41.5%", 
                    left: "3.5%", 
                    width: "15.5%", 
                    height: "30%",
                    borderRadius: "4px"
                  }}
                >
                   {previewUrl ? (
                     <img src={previewUrl} className="w-full h-full object-cover" alt="Member" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300">
                       <FaUser size={30} />
                     </div>
                   )}
                </div>

                {/* Details Overlay - VALUES ONLY, aligned to background labels */}
                <div 
                  className="absolute font-black"
                  style={{ 
                    top: "43.5%", 
                    left: "48.5%", 
                    width: "48%",
                    color: "#000",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px"
                  }}
                >
                   <div className="h-[6px] flex items-center">
                      <span className="uppercase text-[8px] truncate">{formData.name || ""}</span>
                   </div>
                   <div className="h-[6px] flex items-center">
                      <span className="uppercase text-[8px] truncate">{formData.father_husband_name || ""}</span>
                   </div>
                   <div className="h-[6px] flex items-center">
                      <span className="uppercase text-[8px] truncate">{formData.date_of_joining || ""}</span>
                   </div>
                   <div className="h-[6px] flex items-center">
                      <span className="uppercase text-[8px] truncate">{formData.constituency || ""}</span>
                   </div>
                   <div className="h-[6px] flex items-center">
                      <span className="uppercase text-[8px] truncate">{formData.phone || ""}</span>
                   </div>
                   <div className="flex items-start" style={{ minHeight: "22px" }}>
                      <span className="uppercase text-[8px] font-black leading-[1.3] whitespace-pre-wrap line-clamp-2 break-words w-full text-black">{formData.address || ""}</span>
                   </div>
                </div>

             </div>

             <div className="mt-6 p-4 bg-white/5 rounded-sm">
                <p className={`text-[10px] text-white/60 text-center italic ${isTamil ? 'font-tamil' : ''}`}>"{t.card.note}"</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
