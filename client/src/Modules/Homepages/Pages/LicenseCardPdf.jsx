import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API from "../../../api";
import { toast } from "react-toastify";
import signature from "../../../assets/banner/Untitled design (4).png";
import personImage from "../../../assets/npf_hero.png";
import qrcode from "../../../assets/banner/qrcode.svg";
import logo from "../../../assets/npf-logo.jpeg";

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

  // FIXED: Both circles now share this exact size variable
  const CIRCLE_SIZE = 58;

  const downloadPdf = async () => {
    try {
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        windowWidth: 1920,
        x: 0,
        y: 0
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [CARD_WIDTH, CARD_HEIGHT] });
      pdf.addImage(imgData, "JPEG", 0, 0, CARD_WIDTH, CARD_HEIGHT);
      pdf.save(`dmm_${safeName}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed");
    }
  };

  const approveAndUpload = async () => {
    try {
      setLoading(true);
      const element = cardRef.current;
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, width: CARD_WIDTH, height: CARD_HEIGHT, windowWidth: 1920 });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [CARD_WIDTH, CARD_HEIGHT] });
      pdf.addImage(imgData, "JPEG", 0, 0, CARD_WIDTH, CARD_HEIGHT);
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("pdf_file", pdfBlob, `dmm_${safeName}.pdf`);

      const res = await API.post(`/dmm/${license._id}/upload_pdf/`, formData, { headers: { "Content-Type": "multipart/form-data" } });

      const whatsLink = res.data?.whatsapp_link;
      toast.success("Approved successfully!");
      if (whatsLink) {
        try { navigator.clipboard.writeText(whatsLink); toast.info("WhatsApp link copied!"); } catch {}
        setTimeout(() => window.open(whatsLink, "_blank", "noopener,noreferrer"), 200);
      }
    } catch (err) {
      toast.error("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --- SHARED STYLE FOR BOTH CIRCLES ---
  // This ensures identical appearance for Logo (left) and Founder (right)
  const headerCircleStyle = {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: "50%",
    background: "#ffffff",
    border: "3px solid #ffffff", // Thick white border
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)", // Subtle shadow
    flexShrink: 0, // Prevents shrinking
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-100 min-h-screen">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap'); .dmm-card-render { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }`}
      </style>

      {/* --- CARD CONTAINER --- */}
      <div
        ref={cardRef}
        className="dmm-card-render"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, background: "#ffffff", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", borderRadius: "8px" }}
      >
        {/* --- HEADER --- */}
        <div style={{ height: 90, background: BRAND_BLUE, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "relative", zIndex: 10 }}>

          {/* Left: Logo */}
          <div style={headerCircleStyle}>
             <img src={logo} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="logo" />
          </div>

          {/* Center: Text Title */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 15 }}>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#ffffff", textTransform: "uppercase", lineHeight: 1.1 }}>
              Desiya Makkal Munnani
            </h1>
            <p style={{ margin: "3px 0 0 0", fontSize: 8, fontWeight: 600, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>
              National People's Front
            </p>
          </div>

          {/* Right: Founder Image */}
          <div style={headerCircleStyle}>
             <img src={personImage} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="founder" />
          </div>
        </div>

        {/* --- BODY --- */}
        <div style={{ flex: 1, display: "flex", position: "relative", padding: "20px 25px" }}>

          {/* Watermark */}
          <div style={{ position: "absolute", top: "55%", left: "65%", transform: "translate(-50%, -50%)", opacity: 0.04, zIndex: 0 }}>
             <img src={logo} style={{ width: 220 }} alt="watermark" />
          </div>

          {/* LEFT COLUMN: Photo & QR */}
          <div style={{ width: "32%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5, paddingRight: 15 }}>
            <div style={{ width: 105, height: 125, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", marginBottom: 12, border: `2px solid ${BRAND_BLUE}`, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <img src={license.photo || "/static/default_photo.jpg"} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="member" />
            </div>
            <img src={qrcode} crossOrigin="anonymous" style={{ width: 50, height: 50 }} alt="QR" />
          </div>

          {/* RIGHT COLUMN: Fields */}
          <div style={{ width: "68%", display: "flex", flexDirection: "column", zIndex: 5, paddingLeft: 10, position: "relative" }}>

            <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a2b48", textTransform: "uppercase", marginBottom: 6 }}>
              {license.name || "Member Name"}
            </h2>

            <div style={{ background: BRAND_RED, padding: "3px 12px", borderRadius: "50px", marginBottom: 18, width: "fit-content" }}>
              <p style={{ margin: 0, color: "#ffffff", fontSize: 8, fontWeight: 900, textTransform: "uppercase" }}>Official Member</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ width: 80, fontSize: 10, fontWeight: 700, color: BRAND_BLUE, textTransform: "uppercase" }}>Phone</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{license.phone || "9xxxxxxxxx"}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ width: 80, fontSize: 10, fontWeight: 700, color: BRAND_BLUE, textTransform: "uppercase" }}>Constituency</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", textTransform: "uppercase" }}>{license.constituency || "Unknown"}</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <span style={{ width: 80, fontSize: 10, fontWeight: 700, color: BRAND_BLUE, textTransform: "uppercase" }}>Address</span>
                <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: "#1e293b", lineHeight: 1.3, textTransform: "uppercase" }}>
                  {license.address || "No Address Provided"}
                </span>
              </div>
            </div>

            {/* Signature */}
            <div style={{ position: "absolute", bottom: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src={signature} style={{ width: 60, marginBottom: -4, mixBlendMode: "multiply" }} alt="signature" />
                <div style={{ width: 70, height: 1, background: "#1a2b48", opacity: 0.2 }}></div>
                <span style={{ fontSize: 6, fontWeight: 700, color: "#1a2b48", marginTop: 2 }}>GENERAL SECRETARY</span>
            </div>

          </div>
        </div>

        {/* --- FOOTER --- */}
        <div style={{ width: "100%", height: 28, background: BRAND_RED, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <p style={{ margin: 0, color: "#ffffff", fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>
                Identification Membership Card
            </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button onClick={downloadPdf} className="px-8 py-3 bg-[#ff0000] text-white rounded hover:bg-red-700 font-bold uppercase text-xs tracking-wider shadow-lg">Download PDF</button>
        <button onClick={approveAndUpload} disabled={loading} className="px-8 py-3 bg-[#1a2b48] text-white rounded hover:bg-slate-800 font-bold uppercase text-xs tracking-wider shadow-lg disabled:bg-slate-400">{loading ? "Processing..." : "Approve & Upload"}</button>
      </div>
    </div>
  );
}
