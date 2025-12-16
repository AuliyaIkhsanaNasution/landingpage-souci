"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollReveal from "@/components/ScrollReveal";
import api from "@/lib/api";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
    coverLetter: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch job details from API
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${slug}`);

        // API returns { success: true, data: {...} }
        const rawJobData = response.data.data || response.data;

        // Parse JSON fields from backend
        const jobData = {
          ...rawJobData,
          responsibilities:
            typeof rawJobData.responsibilities === "string"
              ? JSON.parse(rawJobData.responsibilities)
              : rawJobData.responsibilities,
          requirements:
            typeof rawJobData.requirements === "string"
              ? JSON.parse(rawJobData.requirements)
              : rawJobData.requirements,
          benefits:
            typeof rawJobData.benefits === "string"
              ? JSON.parse(rawJobData.benefits)
              : rawJobData.benefits,
        };

        setJob(jobData);
        setError(null);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Job not found");
        // Set fallback data
        setJob(getDefaultJob());
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchJob();
    }
  }, [slug]);

  // Helper function to format job type
  const formatJobType = (type) => {
    const types = {
      full_time: "Full Time",
      part_time: "Part Time",
      contract: "Contract",
      internship: "Internship",
      freelance: "Freelance",
    };
    return types[type] || type;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Default fallback data
  const getDefaultJob = () => ({
    id: 1,
    title: "Staff Administrasi",
    company: "PT. Souci Indoprima",
    location: "Medan, Sumatera Utara",
    type: "full_time",
    salary_range: "Rp 4.500.000 - Rp 6.000.000",
    salary: "Rp 4.500.000 - Rp 6.000.000",
    experience: "1-2 Tahun",
    education: "Minimal D3",
    deadline: "2024-12-31",
    posted_at: "2024-11-06",
    postedDate: "2024-11-06",
    category: "Administration",
    description: `<p>PT. Souci Indoprima sedang mencari kandidat untuk posisi <strong>Staff Administrasi</strong> yang akan bertanggung jawab dalam mendukung operasional kantor sehari-hari.</p>`,
    responsibilities: [
      "Melakukan input data dan administrasi dokumen perusahaan",
      "Mengelola arsip dan filing dokumen dengan rapi dan terorganisir",
      "Membantu proses rekrutmen dan administrasi karyawan",
      "Membuat laporan bulanan terkait administrasi",
      "Koordinasi dengan berbagai departemen untuk kebutuhan administrasi",
    ],
    requirements: [
      "Pendidikan minimal D3 semua jurusan",
      "Pengalaman kerja minimal 1 tahun di bidang administrasi",
      "Menguasai Microsoft Office (Word, Excel, PowerPoint)",
      "Teliti, detail-oriented, dan terorganisir",
      "Mampu bekerja dalam tim maupun individu",
    ],
    benefits: [
      "Gaji kompetitif sesuai pengalaman",
      "BPJS Kesehatan dan Ketenagakerjaan",
      "Tunjangan makan dan transportasi",
      "Bonus kinerja",
      "Pelatihan dan pengembangan skill",
    ],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("job_id", job.id);
      submitData.append("cover_letter", formData.coverLetter);

      if (formData.cv) {
        submitData.append("cv", formData.cv);
      }

      await api.post("/applications", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        cv: null,
        coverLetter: "",
      });

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error && !job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Lowongan Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, lowongan yang Anda cari tidak tersedia.
            </p>
            <Link
              href="/carrier"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Kembali ke Halaman Lowongan
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      {/* Back Button - Outside Hero Section */}
      <div className="bg-linear-to-br from-blue-900 to-blue-700 pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="left">
            <Link
              href="/carrier"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Kembali ke Semua Lowongan</span>
            </Link>
          </ScrollReveal>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-900 to-blue-700 text-white pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            {/* Job Title */}
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">{job.title}</h1>
              {job.status === "closed" && (
                <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                  DITUTUP
                </span>
              )}
            </div>
            <p className="text-xl text-blue-100 mb-6">{job.company}</p>

            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>{formatJobType(job.type)}</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{job.salary_range || job.salary}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <ScrollReveal direction="up">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Deskripsi Pekerjaan
                  </h2>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              </ScrollReveal>

              {/* Responsibilities */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Tanggung Jawab
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities &&
                      job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Requirements */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Kualifikasi
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements &&
                      job.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Benefits */}
              <ScrollReveal direction="up" delay={0.3}>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Benefit & Fasilitas
                  </h2>
                  <ul className="space-y-3">
                    {job.benefits &&
                      job.benefits.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-6 h-6 text-green-600 mr-3 shrink-0 mt-0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Quick Info & Application */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Info Card */}
                <ScrollReveal direction="right">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Informasi Singkat
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Pendidikan</p>
                        <p className="font-semibold text-gray-800">
                          {job.education || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Pengalaman</p>
                        <p className="font-semibold text-gray-800">
                          {job.experience || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Kategori</p>
                        <p className="font-semibold text-gray-800">
                          {job.category || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Tanggal Posting
                        </p>
                        <p className="font-semibold text-gray-800">
                          {job.created_at ? formatDate(job.created_at) : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Deadline Lamaran
                        </p>
                        <p className="font-semibold text-red-600">
                          {job.deadline ? formatDate(job.deadline) : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Application Form */}
                <ScrollReveal direction="right" delay={0.2}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    {job.status === "closed" ? (
                      <div className="text-center py-8">
                        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Lowongan Ditutup
                        </h3>
                        <p className="text-gray-600">
                          Terima kasih atas antusiasme Anda. Saat ini lowongan
                          untuk posisi ini telah ditutup.
                        </p>
                        <Link
                          href="/carrier"
                          className="inline-block mt-6 text-blue-600 font-medium hover:text-blue-800"
                        >
                          Lihat Lowongan Lain →
                        </Link>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Lamar Sekarang
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Nama Lengkap *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                              placeholder="Nama Anda"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                              placeholder="email@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              No. Telepon *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                              placeholder="08xxxxxxxxxx"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Upload CV (PDF/DOC/DOCX) *
                            </label>
                            <input
                              type="file"
                              name="cv"
                              onChange={handleChange}
                              accept=".pdf,.doc,.docx"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Max 5MB. Format: PDF, DOC, atau DOCX
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Cover Letter (Opsional)
                            </label>
                            <textarea
                              name="coverLetter"
                              value={formData.coverLetter}
                              onChange={handleChange}
                              rows="4"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 bg-white"
                              placeholder="Ceritakan mengapa Anda cocok untuk posisi ini..."
                            ></textarea>
                          </div>

                          {submitStatus === "success" && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                              ✓ Lamaran berhasil dikirim! Kami akan menghubungi
                              Anda segera.
                            </div>
                          )}

                          {submitStatus === "error" && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                              ✗ Gagal mengirim lamaran. Silakan coba lagi.
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 bg-linear-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? "Mengirim..." : "Kirim Lamaran"}
                          </button>

                          <p className="text-xs text-gray-500 text-center">
                            Dengan mengirim lamaran, Anda menyetujui{" "}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              kebijakan privasi
                            </a>{" "}
                            kami.
                          </p>
                        </form>
                      </>
                    )}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
