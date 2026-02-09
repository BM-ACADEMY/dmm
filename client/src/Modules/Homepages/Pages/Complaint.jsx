import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Slide } from "react-toastify";
import logo from "../../../assets/dmmlogo.jpeg";
import { FaUser, FaPhoneAlt, FaEnvelope, FaEdit, FaPaperPlane, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

// ✅ Import Data
import { useLanguage } from "../../../context/LanguageContext";
import { complaintsData } from "../../../data/complaints";

// ✅ Dynamic URL from .env file
// This will read: http://127.0.0.1:8000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Background Pattern ---
const CampaignBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
    <div className="absolute inset-0 bg-[radial-gradient(#0024f8_1px,transparent_1px)] [background-size:20px_20px]"></div>
  </div>
);

export default function Complaint() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const { language } = useLanguage();
  const t = complaintsData[language] || complaintsData['en'];
  const isTamil = language === 'ta';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const clean = value.replace(/\D/g, "");
      if (clean.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: clean }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return toast.error(t.messages.validation.name);
    if (formData.phone.length !== 10) return toast.error(t.messages.validation.phone);
    if (!formData.subject.trim()) return toast.error(t.messages.validation.required || "Subject is required");
    if (!formData.message.trim()) return toast.error(t.messages.validation.message);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // DEBUG: Check console to ensure the URL is correct
    console.log("Submitting to:", `${API_BASE_URL}/complaints/`);

    try {
      // ✅ Uses the variable from .env
      await axios.post(`${API_BASE_URL}/complaints/`, formData);

      toast.success(t.messages.success);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("API Error:", err);

      // Handle Errors
      if (err.response) {
        if (err.response.status === 404) {
          toast.error(`Error 404: Endpoint not found at ${API_BASE_URL}`);
        } else if (err.response.status === 500) {
          toast.error("Server Error (500): The backend crashed. Please check server logs.");
        } else {
          toast.error(err.response.data?.message || t.messages.fail);
        }
      } else {
        toast.error("Network Error: check your internet connection and ensure backend is running.");
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 md:py-20 px-4 bg-[#f8fafc] relative overflow-hidden font-dmm-reference">
        <ToastContainer position="top-right" transition={Slide} />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700;900&display=swap');
          .font-dmm-reference { font-family: 'Inter', sans-serif; }
          .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }
        `}</style>

        <CampaignBackground />

        <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* --- LEFT: COMPLAINT FORM --- */}
          <div className="lg:col-span-8 bg-white rounded-sm shadow-xl border border-slate-100 overflow-hidden">
            <div className="h-1.5 w-full flex">
              <div className="w-1/2 bg-[#0024f8]"></div>
              <div className="w-1/2 bg-[#ff0000]"></div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-50 shadow-md overflow-hidden shrink-0">
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
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
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaUser size={18} /></div>
                      <div className="flex-1">
                        <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.name}</p>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder={t.placeholders.name}
                          className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg ${isTamil ? 'font-tamil' : ''}`} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaPhoneAlt size={18} /></div>
                      <div className="flex-1">
                        <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.phone}</p>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder={t.placeholders.phone} maxLength={10}
                          className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg ${isTamil ? 'font-tamil' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaEnvelope size={18} /></div>
                      <div className="flex-1">
                        <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.email}</p>
                        <input name="email" value={formData.email} onChange={handleChange} placeholder={t.placeholders.email}
                          className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg ${isTamil ? 'font-tamil' : ''}`} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md"><FaEdit size={18} /></div>
                      <div className="flex-1">
                        <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.subject}</p>
                        <input name="subject" value={formData.subject} onChange={handleChange} placeholder={t.placeholders.subject}
                          className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-lg ${isTamil ? 'font-tamil' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#0024f8] p-2.5 rounded-sm text-white shadow-md mt-1"><FaEdit size={18} /></div>
                    <div className="flex-1">
                      <p className={`text-[10px] text-gray-400 uppercase font-black tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.labels.message}</p>
                      <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder={t.placeholders.message}
                        className={`w-full border-b-2 border-slate-100 py-2 focus:border-[#0024f8] outline-none text-[#1a2b48] font-bold text-md resize-none ${isTamil ? 'font-tamil' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={submitting}
                  className={`w-full py-5 rounded-sm font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0
                    ${submitting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#ff0000] text-white hover:bg-[#0024f8]"}`}>
                  <span className={`flex items-center justify-center gap-3 ${isTamil ? 'font-tamil text-lg' : ''}`}>
                    <FaPaperPlane /> {submitting ? t.buttons.submitting : t.buttons.submit}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* --- RIGHT: CONTACT INFO --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-[#1a2b48] rounded-sm p-8 shadow-2xl relative border-t-4 border-[#ff0000]">
              <div className="flex items-center gap-3 mb-8 justify-center">
                 <FaInfoCircle className="text-white text-xl" />
                 <h3 className={`text-white text-xs font-black uppercase tracking-widest ${isTamil ? 'font-tamil' : ''}`}>{t.infoTitle}</h3>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                   <FaMapMarkerAlt className="text-[#ff0000] text-xl shrink-0 mt-1" />
                   <div>
                      <h4 className={`text-white text-[10px] font-black uppercase tracking-wider mb-1 ${isTamil ? 'font-tamil' : ''}`}>{t.contact.addressLabel}</h4>
                      <p className={`text-white/70 text-sm leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>{t.contact.address}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <FaPhoneAlt className="text-[#ff0000] text-xl shrink-0 mt-1" />
                   <div>
                      <h4 className={`text-white text-[10px] font-black uppercase tracking-wider mb-1 ${isTamil ? 'font-tamil' : ''}`}>{t.contact.phoneLabel}</h4>
                      <p className="text-white/70 text-sm font-bold">{t.contact.phone}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <FaEnvelope className="text-[#ff0000] text-xl shrink-0 mt-1" />
                   <div>
                      <h4 className={`text-white text-[10px] font-black uppercase tracking-wider mb-1 ${isTamil ? 'font-tamil' : ''}`}>{t.contact.emailLabel}</h4>
                      <p className="text-white/70 text-sm break-all">{t.contact.email}</p>
                   </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className={`text-[10px] text-white/40 text-center italic leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>{t.contact.note}</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
