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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${slug}`);
        const rawJobData = response.data.data || response.data;

        // Parsing data JSON seperti pada code awal Anda
        const jobData = {
          ...rawJobData,
          responsibilities: typeof rawJobData.responsibilities === "string" ? JSON.parse(rawJobData.responsibilities) : rawJobData.responsibilities,
          requirements: typeof rawJobData.requirements === "string" ? JSON.parse(rawJobData.requirements) : rawJobData.requirements,
          benefits: typeof rawJobData.benefits === "string" ? JSON.parse(rawJobData.benefits) : rawJobData.benefits,
        };

        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Job not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchJob();
  }, [slug]);

  const formatJobType = (type) => {
    const types = { full_time: "Full Time", part_time: "Part Time", contract: "Contract", internship: "Internship", freelance: "Freelance" };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      <section className="bg-linear-to-br from-blue-900 to-blue-700 pt-5 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/carrier" className="inline-flex items-center gap-2 mb-6 text-blue-200 hover:text-white transition-colors">
            ← Kembali ke Semua Lowongan
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{job?.title}</h1>
            {job?.status === "closed" && <span className="px-4 py-1 bg-red-500 text-sm font-bold rounded-full animate-pulse">DITUTUP</span>}
          </div>
          <div className="flex flex-wrap gap-6 text-blue-100 italic">
  {/* Location */}
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
    <span>{job?.location}</span>
  </div>

  {/* Job Type */}
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
    <span>{formatJobType(job?.type)}</span>
  </div>

  {/* Salary */}
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
    <span>{job?.salary_range || job?.salary}</span>
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
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
    <span>{job?.kuota || job?.kuota}</span>
  </div>
  
</div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Deskripsi */}
              <ScrollReveal direction="up">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Deskripsi Pekerjaan</h2>
                  <div className="text-gray-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: job?.description }} />
                </div>
              </ScrollReveal>

              {/* Responsibilities */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tanggung Jawab</h2>
                  <ul className="space-y-3">
                    {job?.responsibilities?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1">✔</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Requirements */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Kualifikasi</h2>
                  <ul className="space-y-3">
                    {job?.requirements?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1">✔</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Section Benefit & Fasilitas */}
<ScrollReveal direction="up" delay={0.3}>
  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      Benefit & Fasilitas
    </h2>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {job?.benefits?.map((item, index) => (
        <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50">
          <span className="text-green-600 mt-1">✦</span>
          <span className="text-gray-700 font-medium">{item}</span>
        </li>
      ))}
    </ul>
  </div>
</ScrollReveal>

{/* Section Call to Action (Tombol Lamar) */}
<ScrollReveal direction="up" delay={0.4}>
  <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 shadow-lg">
    <div className="text-center md:text-left md:flex items-center justify-between gap-6">
      <div className="mb-6 md:mb-0">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Tertarik bergabung dengan kami?</h3>
        <p className="text-blue-700">Pastikan Anda telah membaca semua kualifikasi sebelum mengirim lamaran.</p>
      </div>
      
      <div className="min-w-[250px]">
        {job?.status === "closed" ? (
          <button 
            disabled 
            className="w-full py-4 bg-gray-300 text-gray-600 font-bold rounded-xl cursor-not-allowed shadow-inner"
          >
            Lowongan Ditutup
          </button>
        ) : (
          <Link
            href={`/carrier/${slug}/apply`}
            className="inline-block w-full py-4 bg-linear-to-r from-blue-600 to-blue-800 text-white text-center font-bold rounded-xl shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-1 active:scale-95"
          >
            Lamar Pekerjaan Sekarang
          </Link>
        )}
      </div>
    </div>
  </div>
</ScrollReveal>
            </div>

            {/* Sidebar Informasi Singkat */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <ScrollReveal direction="right">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Singkat</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Pendidikan</p>
                        <p className="font-semibold text-gray-800">{job?.education || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Pengalaman</p>
                        <p className="font-semibold text-gray-800">{job?.experience || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Kategori</p>
                        <p className="font-semibold text-gray-800">{job?.category || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Deadline</p>
                        <p className="font-semibold text-red-600">{job?.deadline ? formatDate(job.deadline) : "-"}</p>
                      </div>
                    </div>
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