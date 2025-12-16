"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import api from "@/lib/api";

export default function CareerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    jobListings: false,
  });

  const jobListingsRef = useRef(null);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs?status=all");
        if (response.data.success) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Fallback to default jobs
        setJobs([
          {
            id: 1,
            title: "Staff Administrasi",
            company: "PT. Souci Indoprima",
            location: "Medan, Sumatera Utara",
            type: "full_time",
            salary_range: "Rp 4.500.000 - Rp 6.000.000",
            description:
              "Dibutuhkan staff administrasi yang teliti, mampu bekerja dengan tim, dan memiliki pengalaman minimal 1 tahun di bidang administrasi.",
            slug: "staff-administrasi",
          },
          {
            id: 2,
            title: "Web Developer",
            company: "PT. Souci Indoprima",
            location: "Medan, Sumatera Utara",
            type: "full_time",
            salary_range: "Rp 7.000.000 - Rp 12.000.000",
            description:
              "Kami mencari web developer yang memiliki pengalaman dengan teknologi web modern. Menguasai HTML, CSS, JavaScript, dan framework seperti React/Vue.",
            slug: "web-developer",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Animation effect
  useEffect(() => {
    // Hero animation on mount
    setIsVisible(prev => ({ ...prev, hero: true }));

    // Intersection Observer untuk section lainnya
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === jobListingsRef.current) {
              setIsVisible(prev => ({ ...prev, jobListings: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (jobListingsRef.current) observer.observe(jobListingsRef.current);

    return () => observer.disconnect();
  }, []);

  const formatJobType = (type) => {
    const typeMap = {
      full_time: "Full Time",
      part_time: "Part Time",
      contract: "Contract",
      internship: "Internship",
    };
    return typeMap[type] || type;
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/lowongan.png')] bg-cover bg-center"></div>
        </div>

        {/* Content */}
        <div 
          className={`relative z-20 text-center text-white px-4 transition-all duration-1000 ${
            isVisible.hero 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Info Lowongan Pekerjaan
          </h1>
          <p className="text-xl md:text-2xl font-medium">
            Temukan Karir Impian Anda Bersama Souci Indoprima.
          </p>
        </div>
      </section>

      {/* Job Listings Section */}
      <section ref={jobListingsRef} className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job listings...</p>
            </div>
          )}

          {/* Jobs List */}
          {!loading && (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200 duration-700 ${
                    isVisible.jobListings 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {job.title}
                        </h2>
                        {job.status === "closed" && (
                          <span className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                            DITUTUP
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-semibold text-lg">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Location & Type */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
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
                      <span>{job.salary_range}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>
                        {job.created_at
                          ? `Diposting ${Math.floor(
                              (new Date() - new Date(job.created_at)) /
                                (1000 * 60 * 60 * 24)
                            )} Hari Lalu`
                          : "Baru Diposting"}
                      </span>
                    </div>

                    {/* Apply Button */}
                    <Link
                      href={`/carrier/${job.slug}`}
                      className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg inline-flex items-center"
                    >
                      Lihat Detail
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State (if no jobs) */}
          {!loading && jobs.length === 0 && (
            <div 
              className={`text-center py-16 transition-all duration-700 ${
                isVisible.jobListings 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <svg
                className="w-24 h-24 mx-auto text-gray-400 mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak Ada Lowongan Saat Ini
              </h3>
              <p className="text-gray-500">
                Silakan cek kembali nanti atau hubungi kami untuk informasi
                lebih lanjut.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />

      <Footer />
    </>
  );
}