// src/Modules/Admin/Pages/GalleryAdmin.jsx

import React, { useState, useEffect, useRef } from "react";
import API from "../../../../api";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaTrash, FaEdit, FaImage, FaVideo, FaCheck, FaTimes, FaPlay } from "react-icons/fa";

/* ----------------------- Gallery Card Component ----------------------- */
const GalleryCard = ({ item, onDelete, onUpdated, API_URL }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [file, setFile] = useState(null);

  // Handle backward compatibility for old items that might only have image_url
  const initialUrl = item.media_url || item.image_url;
  const initialType = item.media_type || "image";

  const [preview, setPreview] = useState(initialUrl);
  const [mediaType, setMediaType] = useState(initialType);

  const fileInputRef = useRef(null);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    // Backend expects 'media' key
    if (file) formData.append("media", file);

    try {
      await API.patch(`${API_URL}${item._id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsEditing(false);
      onUpdated();
      toast.success("✅ Media updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update media.");
    }
  };

  // Helper to determine if we are previewing a video or image
  const isVideo = mediaType === "video";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
    >
      {/* Media Area */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden group flex items-center justify-center">
        {isVideo ? (
          <video
            src={preview}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <img
            src={preview}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Video Indicator Icon (if not editing and is video) */}
        {!isEditing && isVideo && (
           <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm pointer-events-none">
             <FaVideo size={12} />
           </div>
        )}

        {/* Edit Overlay */}
        {isEditing && (
          <div
            onClick={() => fileInputRef.current.click()}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity z-10"
          >
            <FaCloudUploadAlt size={24} />
            <span className="text-xs font-bold mt-1">Change Media</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                const f = e.target.files[0];
                if(f) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                  // Auto-detect type for preview
                  if(f.type.startsWith("video/")) setMediaType("video");
                  else setMediaType("image");
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-3 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#0056b3] outline-none transition-colors"
              placeholder="Media Title"
              autoFocus
            />
            <div className="flex gap-2 mt-auto pt-2">
              <button onClick={handleUpdate} className="flex-1 bg-[#0056b3] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#004494] transition flex items-center justify-center gap-1">
                <FaCheck /> Save
              </button>
              <button onClick={() => {
                setIsEditing(false);
                setTitle(item.title);
                setPreview(initialUrl);
                setMediaType(initialType);
                setFile(null);
              }} className="flex-1 bg-slate-200 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-300 transition flex items-center justify-center gap-1">
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
                {isVideo ? <FaVideo className="text-slate-400 text-xs"/> : <FaImage className="text-slate-400 text-xs"/>}
                <h3 className="font-bold text-slate-800 text-sm truncate flex-1" title={item.title}>{item.title}</h3>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-4">
               ID: {item._id.slice(-6)}
            </p>
            <div className="mt-auto flex gap-2 pt-2 border-t border-slate-100 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-50 text-[#0056b3] py-2 rounded-lg text-xs font-bold hover:bg-[#0056b3] hover:text-white transition flex items-center justify-center gap-1">
                <FaEdit /> Edit
              </button>
              <button onClick={() => onDelete(item._id)} className="flex-1 bg-red-50 text-[#dc2626] py-2 rounded-lg text-xs font-bold hover:bg-[#dc2626] hover:text-white transition flex items-center justify-center gap-1">
                <FaTrash /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

/* ----------------------- Main Page Component ----------------------- */
const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState("image"); // 'image' or 'video'
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const dropRef = useRef(null);
  const API_URL = `/gallery/images/`;

  /* -------- Fetch all items -------- */
  const fetchItems = async () => {
    try {
      const res = await API.get(API_URL);
      setItems(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch gallery items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* -------- File Handler Helper -------- */
  const handleFileSelection = (selectedFile) => {
      if (!selectedFile) return;

      const isImg = selectedFile.type.startsWith("image/");
      const isVid = selectedFile.type.startsWith("video/");

      if (isImg || isVid) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setPreviewType(isVid ? "video" : "image");
      } else {
        toast.warn("⚠️ Unsupported file type. Please upload Image or Video.");
      }
  };

  /* -------- Drag & Drop Logic -------- */
  useEffect(() => {
    const div = dropRef.current;
    if (!div) return;

    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
      e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    };

    div.addEventListener("dragenter", handleDragEnter);
    div.addEventListener("dragleave", handleDragLeave);
    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("drop", handleDrop);

    return () => {
      div.removeEventListener("dragenter", handleDragEnter);
      div.removeEventListener("dragleave", handleDragLeave);
      div.removeEventListener("dragover", handleDragOver);
      div.removeEventListener("drop", handleDrop);
    };
  }, []);

  /* -------- Handle Upload -------- */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      toast.warn("⚠️ Please provide both title and a file.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    // Backend expects 'media' key
    formData.append("media", file);

    try {
      await API.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) =>
          setProgress(Math.round((event.loaded * 100) / event.total)),
      });
      setTitle("");
      setFile(null);
      setPreview(null);
      setProgress(0);
      fetchItems();
      toast.success("✅ Upload successful!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------- Handle Delete -------- */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`${API_URL}${deleteTarget}/`);
      setItems((prev) => prev.filter((item) => item._id !== deleteTarget));
      toast.success("🗑️ Deleted successfully!");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete.");
      fetchItems();
    }
  };

  return (
    <div className="relative">

      {/* 🏁 Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} transition={Slide} />

      {/* 📝 Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-black text-slate-900">
          Media <span className="text-[#0056b3]">Gallery</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Manage event photos and videos.
        </p>
      </div>

      {/* 📤 Upload Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-10 relative z-10">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FaCloudUploadAlt className="text-[#0056b3] text-xl" /> Add New Media
        </h2>

        <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Drop Zone */}
          <div className="lg:col-span-2">
            <div
              ref={dropRef}
              className={`border-3 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden
              ${isDragOver
                ? "border-[#0056b3] bg-blue-50 scale-[1.01]"
                : "border-slate-300 hover:border-[#0056b3] hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileSelection(e.target.files[0])}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="w-full h-full flex flex-col items-center justify-center cursor-pointer z-10">
                {preview ? (
                  previewType === "video" ? (
                    <video
                        src={preview}
                        className="h-full w-full object-contain bg-black"
                        controls
                        autoPlay
                        muted
                        loop
                    />
                  ) : (
                    <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                  )
                ) : (
                  <>
                    <div className="flex gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 text-[#0056b3] rounded-full flex items-center justify-center">
                        <FaImage size={20} />
                        </div>
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                        <FaVideo size={20} />
                        </div>
                    </div>
                    <span className="text-slate-600 font-bold text-lg">Click or Drag Media Here</span>
                    <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG, MP4, MOV</span>
                  </>
                )}
              </label>

              {/* Reset Preview Button */}
              {preview && (
                 <button
                   type="button"
                   onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null); }}
                   className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-white transition z-20 shadow-sm"
                 >
                   <FaTimes />
                 </button>
              )}
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-[#0056b3] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Title & Action */}
          <div className="flex flex-col gap-4">
            <div className="flex-1">
               <label className="block text-sm font-bold text-slate-700 mb-2">Title / Caption</label>
               <input
                 type="text"
                 placeholder="Enter a descriptive title..."
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-[#0056b3] focus:ring-0 outline-none text-slate-800 font-medium transition-colors"
               />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2
              ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-[#0056b3] hover:bg-[#004494]"}`}
            >
              {loading ? `Uploading ${progress}%...` : <><FaCloudUploadAlt size={18}/> Upload Media</>}
            </button>
          </div>

        </form>
      </div>

      {/* 🖼 Gallery Grid */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-[#dc2626] pl-3">
          Gallery Items ({items.length})
        </h3>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
            <p className="text-gray-500">No media found. Upload one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <GalleryCard
                  key={item._id}
                  item={item}
                  onDelete={setDeleteTarget}
                  onUpdated={fetchItems}
                  API_URL={API_URL}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🗑️ Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 text-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Delete Media?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  This will permanently remove this item from the gallery.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 bg-[#dc2626] text-white font-bold rounded-lg hover:bg-[#b91c1c] transition shadow-lg shadow-red-500/30"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminGallery;
