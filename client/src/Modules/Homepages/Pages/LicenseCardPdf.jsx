import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API from "../../../api";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react"; 

// Assets
import signature from "../../../assets/banner/Untitled design (4).png";
import personImage from "../../../assets/npf_hero.png";
import logo from "../../../assets/dmmlogo.jpeg";

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
  const [base64Images, setBase64Images] = useState({ logo: null, founder: null });

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
      setBase64Images({ logo: l, founder: f });
    };

    loadImages();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-200 min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
          .dmm-card-render { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
          .field-label { width: 95px; font-size: 10px; font-weight: 800; color: ${BRAND_BLUE}; letter-spacing: 0.5px; }
          .field-value { font-size: 11px; font-weight: 700; color: #1e293b; text-transform: uppercase; }
        `}
      </style>

      {/* --- CARD RENDER AREA --- */}
      <div
        ref={cardRef}
        className="dmm-card-render"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
      >
        {/* --- HEADER --- */}
        <div style={{ 
          height: 85, // Reduced from 105
          background: BRAND_BLUE, 
          display: "flex", 
          alignItems: "center", 
          padding: "0 20px", 
          justifyContent: "space-between",
          zIndex: 10 
        }}>
          {/* Logo Left */}
          <div style={headerCircleStyle}>
            <img 
              src={base64Images.logo || logo} 
              style={{ ...imgInsideCircle, objectFit: "contain", padding: "4px" }} 
              alt="logo" 
            />
          </div>

          {/* Center Text */}
          <div style={{ textAlign: "center", flex: 1, padding: "0 10px" }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#ffffff", textTransform: "uppercase", lineHeight: 1.1 }}>
              Desiya Makkal Munnani
            </h1>
            <p style={{ margin: "4px 0 0 0", fontSize: 9, fontWeight: 600, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1.2px" }}>
              National People's Front
            </p>
          </div>

          {/* Founder Right (Fixed Stretching) */}
          <div style={headerCircleStyle}>
            <img 
              src={base64Images.founder || personImage} 
              style={{
                width: "auto",
                height: "auto",
                minWidth: "100%",
                minHeight: "100%",
                maxWidth: "none",
                objectFit: "cover",
                borderRadius: "50%"
              }} 
              alt="founder" 
            />
          </div>
        </div>

        {/* --- BODY --- */}
        <div style={{ flex: 1, display: "flex", padding: "10px 25px", gap: "20px", position: "relative" }}> {/* Padding reduced */}
          
          {/* Watermark */}
          <div style={{ position: "absolute", top: "50%", left: "60%", transform: "translate(-50%, -50%)", opacity: 0.05, zIndex: 0 }}>
            <img src={logo} style={{ width: 220 }} alt="watermark" />
          </div>

          {/* Left Column: Photo & QR */}
          <div style={{ width: "30%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
            <div style={{ 
              width: 115, 
              height: 125, // Reduced from 140
              background: "#fff", 
              border: `2px solid ${BRAND_BLUE}`,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              marginBottom: 10,
              overflow: "hidden"
            }}>
              <img 
                src={license.photo || "/static/default_photo.jpg"} 
                crossOrigin="anonymous" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                alt="member" 
              />
            </div>
            
            {/* Dynamic QR Code */}
            <div style={{ background: "#fff", padding: "4px", borderRadius: "4px" }}>
              <QRCodeSVG value="https://dmmparty.com/" size={50} /> {/* Reduced size */}
            </div>
          </div>

          {/* Right Column: Details */}
          <div style={{ width: "70%", display: "flex", flexDirection: "column", zIndex: 5 }}>
            
            {/* Membership Badge (Added) */}
            <div style={{ 
              alignSelf: "flex-start",
              background: "#1a2b48", // Darker professional blue
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: 9,
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
            }}>
              URUPPINAR ADAYAALA ATTAI
            </div>

            <div style={{ borderBottom: `2px solid ${BRAND_RED}`, marginBottom: 10, paddingBottom: 4 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a2b48", textTransform: "uppercase" }}>
                {license.name || "Member Name"}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex" }}>
                <span className="field-label">PHONE</span>
                <span className="field-value">: {license.phone || "N/A"}</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="field-label">CONSTITUENCY</span>
                <span className="field-value">: {license.constituency || "N/A"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <span className="field-label">ADDRESS</span>
                <span style={{ flex: 1, fontSize: 10, fontWeight: 700, color: "#1e293b", lineHeight: 1.4, textTransform: "uppercase" }}>
                  : {license.address || "No Address Provided"}
                </span>
              </div>
            </div>

            {/* Signature Section */}
            <div style={{ position: "absolute", bottom: 5, right: 0, textAlign: "center" }}>
              <img src={signature} style={{ width: 60, height: "auto", marginBottom: -4, mixBlendMode: "multiply" }} alt="signature" />
              <div style={{ width: 85, height: "1px", background: "#1a2b48", margin: "0 auto" }}></div>
              <p style={{ fontSize: 7, fontWeight: 900, color: "#1a2b48", marginTop: 3, letterSpacing: "1px" }}>PRESIDENT</p>
            </div>
          </div>
        </div>

        {/* --- FOOTER STRIP --- */}
        <div style={{ background: BRAND_RED, width: "100%", padding: "5px 10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ margin: 0, color: "#ffffff", fontSize: 8, fontWeight: 700, textAlign: "center", lineHeight: 1.2, letterSpacing: "0.5px" }}>
            NO1, 2nd Cross, Pothigai Nagar, Nawarkulam, Lawspet Post, Puducherry – 605008
          </p>
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