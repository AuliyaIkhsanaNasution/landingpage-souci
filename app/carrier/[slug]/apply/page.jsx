"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
    coverLetter: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Ambil data job untuk mendapatkan ID pekerjaan
  useEffect(() => {
    const fetchJobId = async () => {
      try {
        const response = await api.get(`/jobs/${slug}`);
        setJob(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal memuat info pekerjaan", err);
      }
    };
    if (slug) fetchJobId();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return alert("Data pekerjaan belum dimuat, silakan coba lagi.");

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("job_id", job.id); // Sesuai fungsionalitas awal Anda
      submitData.append("cover_letter", formData.coverLetter);

      if (formData.cv) {
        submitData.append("cv", formData.cv);
      }

      await api.post("/applications", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitStatus("success");
      // Reset form
      setFormData({ name: "", email: "", phone: "", cv: null, coverLetter: "" });
      
      // Redirect kembali setelah sukses
      setTimeout(() => router.push(`/carrier/${slug}`), 2500);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-blue-600 font-medium hover:underline">
            ← Kembali ke Detail Pekerjaan
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Form Lamaran</h1>
            <p className="text-gray-500 mb-8">Posisi: <span className="font-semibold text-blue-600">{job?.title || "Memuat..."}</span></p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nama lengkap sesuai identitas"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@anda.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">No. Telepon *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload CV (PDF/DOC) *</label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">Max: 5MB. Format PDF direkomendasikan.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter (Opsional)</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Sampaikan mengapa Anda kandidat yang tepat..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2">
                  <span>✅ Lamaran berhasil dikirim! Anda akan dialihkan...</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2">
                  <span>❌ Gagal mengirim lamaran. Silakan coba lagi.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !job}
                className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Sedang Mengirim..." : "Kirim Lamaran"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}