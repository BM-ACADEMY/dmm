import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API from "../../../api";
import { toast } from "react-toastify";

// Assets
import signature from "../../../assets/banner/Untitled design (4).png";
import personImage from "../../../assets/npf_hero.png";
import logo from "../../../assets/dmmlogo.jpeg";
const membershipBg = "/membership/membership.jpeg";

export default function LicenseCardPdf({ license = {} }) {
  const cardRef = useRef();
  const [loading, setLoading] = useState(false);

  const sanitize = (str) =>
    !str || typeof str !== "string"
      ? "Member"
      : str.replace(/[^a-zA-Z0-9 _-]/g, "").replace(/\s+/g, "_");
  
  const safeName = sanitize(license.name);

  // --- CONFIGURATION ---
  const CARD_WIDTH = 540;
  const CARD_HEIGHT = 340;
  const BRAND_BLUE = "#0024f8";
  const BRAND_RED = "#ff0000";
  const CIRCLE_SIZE = 60; // Reduced from 70

  // --- GENERATE CANVAS HELPER ---
  const generateCanvas = async () => {
    return await html2canvas(cardRef.current, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      logging: false,
    });
  };

  // --- DOWNLOAD PDF FUNCTION ---
  const downloadPdf = async () => {
    try {
      const canvas = await generateCanvas();
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({ 
        orientation: "landscape", 
        unit: "px", 
        format: [CARD_WIDTH, CARD_HEIGHT] 
      });
      pdf.addImage(imgData, "JPEG", 0, 0, CARD_WIDTH, CARD_HEIGHT);
      pdf.save(`dmm_${safeName}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed");
    }
  };

  // --- APPROVE & UPLOAD FUNCTION (RESTORED) ---
  const approveAndUpload = async () => {
    try {
      setLoading(true);
      const canvas = await generateCanvas();
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [CARD_WIDTH, CARD_HEIGHT] });
      pdf.addImage(imgData, "JPEG", 0, 0, CARD_WIDTH, CARD_HEIGHT);
      
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("pdf_file", pdfBlob, `dmm_${safeName}.pdf`);

      // Make API Call
      const res = await API.post(`/dmm/${license._id}/upload_pdf/`, formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });

      toast.success("Approved successfully!");
      
      // Open WhatsApp link if provided
      if (res.data?.whatsapp_link) {
        window.open(res.data.whatsapp_link, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const headerCircleStyle = {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    padding: "2px", // Acts as the white border
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const imgInsideCircle = {
    width: "100%",
    height: "100%",
    objectFit: "cover", // Fixes the stretching issue
    borderRadius: "50%", // Ensures html2canvas clips it properly
    display: "block"
  };

  // --- IMAGE PRE-LOADING (Fix for PDF) ---
  const [base64Images, setBase64Images] = useState({ logo: null, founder: null, bg: null });

  React.useEffect(() => {
    const convertToBase64 = async (imgUrl) => {
      try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Image conversion failed", e);
        return imgUrl; // Fallback
      }
    };

    const loadImages = async () => {
      const l = await convertToBase64(logo);
      const f = await convertToBase64(personImage);
      const b = await convertToBase64(membershipBg);
      setBase64Images({ logo: l, founder: f, bg: b });
    };

    loadImages();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-200 min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          .dmm-card-render { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
          .field-value { font-size: 9px; font-weight: 900; color: #000; text-transform: uppercase; height: 14.5px; display: flex; align-items: center; }
        `}
      </style>

      {/* --- CARD RENDER AREA --- */}
      <div
        ref={cardRef}
        className="dmm-card-render"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundImage: `url('${base64Images.bg || membershipBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
      >
        {/* Member Photo */}
        <div style={{
          position: "absolute",
          top: "42%",
          left: "4.6%",
          width: "15.75%",
          height: "30%",
          backgroundColor: "#f1f5f9",
          overflow: "hidden",
          borderRadius: "4px"
        }}>
          <img 
            src={license.photo || "/static/default_photo.jpg"} 
            crossOrigin="anonymous" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            alt="member" 
          />
        </div>


        {/* Details Fields */}
        <div style={{
            position: "absolute",
            top: "48.2%",
            left: "48.5%",
            width: "48%",
            display: "flex",
            flexDirection: "column",
            gap: "5.8px"
        }}>
            <div className="field-value">{license.name || ""}</div>
            <div className="field-value">{license.father_husband_name || ""}</div>
            <div className="field-value">{license.date_of_joining || ""}</div>
            <div className="field-value">{license.constituency || ""}</div>
            <div className="field-value">{license.phone || ""}</div>
            <div className="field-value" style={{ fontSize: "6.5px", lineHeight: 1.0, alignItems: "flex-start", paddingTop: "2px", height: "auto" }}>
                {license.address || ""}
            </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS (RESTORED) --- */}
      <div className="flex gap-4 mt-8">
        <button 
          onClick={downloadPdf} 
          className="px-8 py-3 bg-[#ff0000] text-white rounded hover:bg-red-700 font-bold uppercase text-xs tracking-widest shadow-lg transition-colors"
        >
          Download PDF
        </button>
        <button 
          onClick={approveAndUpload} 
          disabled={loading} 
          className="px-8 py-3 bg-[#1a2b48] text-white rounded hover:bg-slate-800 font-bold uppercase text-xs tracking-widest shadow-lg disabled:bg-slate-400 transition-colors"
        >
          {loading ? "Processing..." : "Approve & Upload"}
        </button>
      </div>
    </div>
  );
}