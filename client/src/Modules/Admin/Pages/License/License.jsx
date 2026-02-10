// client/src/Modules/Admin/Pages/License/License.jsx

import React, { useEffect, useState } from "react";
import API from "../../../../api";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle,
  Trash2,
  Download,
  Clock,
  Search,
  User,
  Phone,
  MapPin
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function LicenseAdmin() {
  const API_URL = `/dmm/`;

  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* -------- Fetch Data -------- */
  const fetchLicenses = async () => {
    try {
      const res = await API.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : [];
      setLicenses(data);
      setFilteredLicenses(data);
    } catch (err) {
      toast.error("❌ Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  /* -------- ✅ FIXED Search Logic -------- */
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();

    const filtered = licenses.filter((item) => {
      // Safely convert fields to string before checking
      const name = String(item.name || "").toLowerCase();
      const phone = String(item.phone || "");
      const aadhar = String(item.aadhar_number || "");

      return (
        name.includes(lowerTerm) ||
        phone.includes(searchTerm) ||
        aadhar.includes(searchTerm)
      );
    });

    setFilteredLicenses(filtered);
  }, [searchTerm, licenses]);

  /* -------- Actions -------- */
  const handleApprove = (license) => {
    window.location.href = `/#/admin/dmm/pdf/${license._id}`;
  };

  const confirmDelete = (license) => setDeleteTarget(license);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`${API_URL}${deleteTarget._id}/`);
      toast.success("🗑️ Deleted successfully!");
      setDeleteTarget(null);
      fetchLicenses();
    } catch (err) {
      toast.error("❌ Failed to delete");
    }
  };

  return (
    <div className="relative">

      {/* 🏁 Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

      <ToastContainer position="top-right" autoClose={2000} transition={Slide} />

      {/* 📝 Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 relative z-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Membership <span className="text-[#0056b3]">Requests</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage ID card applications and approvals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0056b3] focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 📊 Content Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative z-10">

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-10 h-10 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No membership requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLicenses.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">

                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100">
                          {item.photo ? (
                            <img src={item.photo} alt="user" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-2 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.name || "Unknown Name"}</p>
                          <p className="text-xs text-slate-500">ID: {item.aadhar_number || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone size={14} className="text-[#0056b3]" /> {item.phone || "N/A"}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-2 truncate max-w-[200px]" title={item.address}>
                          <MapPin size={14} className="text-[#dc2626]" /> {item.address || "No Address"}
                        </p>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {item.is_approved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle size={14} /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">

                        {!item.is_approved ? (
                          <button
                            onClick={() => handleApprove(item)}
                            className="px-4 py-2 rounded-lg bg-[#0056b3] text-white text-xs font-bold hover:bg-[#004494] shadow-md transition-all flex items-center gap-2"
                          >
                            Generate Card
                          </button>
                        ) : (
                          <a
                            href={item.certificate_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-lg bg-slate-100 text-[#0056b3] text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                          >
                            <Download size={14} /> Download
                          </a>
                        )}

                        <button
                          onClick={() => confirmDelete(item)}
                          className="p-2 rounded-lg bg-red-50 text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all"
                          title="Delete Request"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <button
                          onClick={() => {
                            const message = item.is_approved 
                              ? `Hello ${item.name}, here is your membership certificate: ${item.certificate_pdf}`
                              : `Hello ${item.name}, your membership application is under review.`;
                            const url = `https://api.whatsapp.com/send?phone=91${item.phone}&text=${encodeURIComponent(message)}`;
                            window.open(url, "_blank");
                          }}
                          className="p-2 rounded-lg bg-green-50 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                          title="Share on WhatsApp"
                        >
                          <FaWhatsapp size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
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
                  <Trash2 size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Reject Application?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to delete the request for <br/>
                  <span className="font-bold text-slate-900">"{deleteTarget.name}"</span>?
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
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
