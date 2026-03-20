import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import API from "../../../api";
import { toast } from "react-toastify";
import { formatDate, formatAddress } from "../../../utils/formatUtils";

const membershipBg = "/membership/membership.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert any URL (local or remote) to a base64 data-URL */
const urlToBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null); // silently ignore broken photos
    img.src = url;
  });

const sanitize = (str) =>
  !str || typeof str !== "string"
    ? "Member"
    : str.replace(/[^a-zA-Z0-9 _-]/g, "").replace(/\s+/g, "_");

// ─── PDF builder ──────────────────────────────────────────────────────────────
//
// Card aspect ratio: 800 × 500 px  →  210 × 131.25 mm  (A5-landscape-ish)
// All positions are percentages of the original 800×500 layout, applied to mm.
//
const W = 210;   // mm
const H = 131.25; // mm

const buildPdf = async (license, bgBase64) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [W, H],
  });

  // 1. Full-bleed background at original quality
  if (bgBase64) {
    pdf.addImage(bgBase64, "PNG", 0, 0, W, H, undefined, "NONE");
  }

  // 2. Member photo
  //    Original position in 800×500: left 4%, top 43.75%, w 15.7%, h 28.5%
  if (license.photo) {
    const photoB64 = await urlToBase64(license.photo);
    if (photoB64) {
      pdf.addImage(
        photoB64,
        "PNG",
        W * 0.04,        // x
        H * 0.4375,      // y
        W * 0.157,       // width
        H * 0.285,       // height
        undefined,
        "NONE"
      );
    }
  }

  // 3. Text fields
  //    Original position: left 48.5%, top 43.2%, line height ~27px → ~7.1mm
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8.5);

  const textX   = W * 0.485;
  const startY  = H * 0.432 + 5.5; // top of first text baseline (mm)
  const lineH   = H * 0.054;        // ≈ 27 px scaled to mm

  const fields = [
    (license.name               || "").toUpperCase(),
    (license.father_husband_name|| "").toUpperCase(),
    (formatDate(license.date_of_joining) || ""),
    (license.constituency       || "").toUpperCase(),
    (license.phone              || ""),
    (formatAddress(license.address) || "").toUpperCase(),
  ];

  fields.forEach((val, i) => {
    if (i === 5) {
      // Address: force wrap sooner to match the visual split in the mockup
      // 45mm width is approximately half of the remaining right-side space
      const lines = pdf.splitTextToSize(val, 45); 
      pdf.text(lines.slice(0, 2), textX, startY + i * lineH);
    } else {
      pdf.text(val, textX, startY + i * lineH, { maxWidth: W * 0.48 });
    }
  });

  return pdf;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LicenseCardPdf({ license = {} }) {
  const [loading, setLoading]   = useState(false);
  const [bgBase64, setBgBase64] = useState(null);

  // Pre-load the background once
  useEffect(() => {
    urlToBase64(membershipBg).then(setBgBase64);
  }, []);

  const safeName = sanitize(license.name);

  // ── Download locally
  const downloadPdf = async () => {
    try {
      const pdf = await buildPdf(license, bgBase64);
      pdf.save(`dmm_${safeName}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed");
    }
  };

  // ── Approve & upload to server
  const approveAndUpload = async () => {
    try {
      setLoading(true);
      const pdf     = await buildPdf(license, bgBase64);
      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("pdf_file", pdfBlob, `dmm_${safeName}.pdf`);

      const res = await API.post(
        `/dmm/${license._id}/upload_pdf/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Approved & certificate uploaded!");

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

  // ────────────────────────────────────────────────────────────────────────────
  // The card preview is kept for the admin to visually confirm before approving
  // ────────────────────────────────────────────────────────────────────────────
  const CARD_W = 800;
  const CARD_H = 500;

  return (
    <div className="flex flex-col items-center p-8 bg-gray-200 min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        .dmm-card { font-family: 'Inter', sans-serif; }
        .field-value {
          font-size: 13.5px; font-weight: 900; color: #000;
          text-transform: uppercase; height: 21.5px;
          display: flex; align-items: center;
        }
      `}</style>

      {/* ── Card preview ── */}
      <div
        className="dmm-card"
        style={{
          width: CARD_W,
          height: CARD_H,
          backgroundImage: `url('${bgBase64 || membershipBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Member photo */}
        <div
          style={{
            position: "absolute",
            top: "43.75%", left: "4%",
            width: "15.7%", height: "28.5%",
            backgroundColor: "#f1f5f9",
            overflow: "hidden", borderRadius: 4,
          }}
        >
          <img
            src={license.photo || ""}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="member"
          />
        </div>

        {/* Text fields */}
        <div
          style={{
            position: "absolute",
            top: "43.2%", left: "48.5%", width: "48%",
            display: "flex", flexDirection: "column", gap: "5.5px",
          }}
        >
          <div className="field-value">{license.name || ""}</div>
          <div className="field-value">{license.father_husband_name || ""}</div>
          <div className="field-value">{formatDate(license.date_of_joining) || ""}</div>
          <div className="field-value">{license.constituency || ""}</div>
          <div className="field-value">{license.phone || ""}</div>
          <div style={{
            fontSize: 11, fontWeight: 900, color: "#000",
            textTransform: "uppercase",
            lineHeight: 1.3,
            alignItems: "flex-start",
            paddingTop: 1.0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            width: "55%", // Match the narrower wrap width
          }}>
            {formatAddress(license.address) || ""}
          </div>
        </div>
      </div>

      {/* ── Buttons ── */}
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