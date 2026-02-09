import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer, Slide } from "react-toastify";
import { FaShareAlt, FaArrowRight, FaCalendarDay, FaNewspaper } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import Context and Data
import { useLanguage } from "../../../context/LanguageContext";
import { blogData } from "../../../data/blog";

const BlogHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();
  const t = blogData[language] || blogData['en'];
  const isTamil = language === 'ta';

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/blog/posts/`;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(API_URL);
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [t.error]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleShare = async (e, blog) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    const shareData = {
      title: blog.title,
      text: blog.subtitle || `Check out this post: ${blog.title}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        toast.success(t.shareSuccess || "Link copied!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          transition: Slide,
        });
      } catch (err) {
        toast.error(t.shareError || "Failed to copy");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString || Date.now()).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', options);
  };

  return (
    <section className="relative w-full bg-[#f0f0f0] py-20 lg:py-28 overflow-hidden">
      <ToastContainer />

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700;900&display=swap');
          .font-dmm-reference { font-family: 'Inter', sans-serif; }
          .font-tamil { font-family: 'Noto Sans Tamil', sans-serif; }
        `}
      </style>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10 font-dmm-reference">

        {/* --- Header Section from Reference --- */}
        <div className="flex flex-col items-start mb-16">
            <div className="flex items-center gap-3 mb-2">
                {/* Vertical Blue Bar */}
                <div className="w-1.5 h-10 bg-[#0024f8]"></div>
                <span className={`text-[red] font-extrabold uppercase tracking-[0.2em] text-xs ${isTamil ? 'font-tamil' : ''}`}>
                    {t.tag || "Latest Updates"}
                </span>
            </div>
            {/* Massive Geometric Title */}
            <h2 className={`text-5xl md:text-6xl font-black text-[#0024f8] leading-none uppercase ${isTamil ? 'font-tamil' : 'tracking-tighter'}`}>
                {isTamil ? "நிகழ்வுகள்" : "Events"}
            </h2>

        </div>

        {/* --- Card Grid from Reference --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {blogs.map((blog, index) => {
                const isExpanded = expandedId === blog._id;
                return (
                    <motion.div
                        key={blog._id || index}
                        className="bg-white shadow-xl overflow-hidden flex flex-col group border border-slate-100"
                    >
                        {/* Image area with Gradient and Date */}
                        <div className="relative h-64 md:h-80 overflow-hidden bg-slate-100 border-b-4 border-[#0024f8]">
                            {blog.image_url ? (
                                <img
                                    src={blog.image_url}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <FaNewspaper size={48} />
                                </div>
                            )}

                            {/* Date Overlay from Reference */}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
                                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                                    <FaCalendarDay className="text-[#0024f8]" />
                                    {formatDate(blog.created_at || blog.date)}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1 bg-white">
                            {/* Blue Title Link Style */}
                            <h4 className={`text-2xl font-black text-[#0024f8] mb-4 hover:underline cursor-pointer ${isTamil ? 'font-tamil' : ''}`}>
                                #{blog.title.toLowerCase().replace(/\s+/g, '-')}
                            </h4>

                            <div className="relative mb-8">
                                <AnimatePresence initial={false}>
                                    <motion.div
                                        animate={{ height: isExpanded ? "auto" : 60 }}
                                        className={`overflow-hidden text-[#1a2b48]/70 text-base leading-relaxed ${isTamil ? 'font-tamil' : ''}`}
                                    >
                                        {blog.content}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                                {/* Red Show More Button from Reference */}
                                <button
                                    onClick={() => toggleExpand(blog._id)}
                                    className="bg-[#ff0000] text-white px-6 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#1a2b48] transition-colors"
                                >
                                    {isExpanded ? (t.readLess || "Close") : (t.readMore || "Show More")}
                                </button>

                                <button
                                    onClick={(e) => handleShare(e, blog)}
                                    className="text-slate-400 hover:text-[#0024f8] p-2 transition-all"
                                >
                                    <FaShareAlt size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>

      </div>
    </section>
  );
};

export default BlogHome;
