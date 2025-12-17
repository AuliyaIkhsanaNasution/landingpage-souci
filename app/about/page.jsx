"use client";

import { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    visiMisi: false,
    prinsip: false,
  });

  const visiMisiRef = useRef(null);
  const prinsipRef = useRef(null);

  useEffect(() => {
    // Hero animation on mount
    setIsVisible((prev) => ({ ...prev, hero: true }));

    // Intersection Observer untuk section lainnya
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === visiMisiRef.current) {
              setIsVisible((prev) => ({ ...prev, visiMisi: true }));
            }
            if (entry.target === prinsipRef.current) {
              setIsVisible((prev) => ({ ...prev, prinsip: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (visiMisiRef.current) observer.observe(visiMisiRef.current);
    if (prinsipRef.current) observer.observe(prinsipRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/building.png')] bg-cover bg-center"></div>
        </div>

        {/* Content */}
        <div className={`relative z-20 text-center text-white px-4 transition-all duration-1000 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">PT SOUCI INDOPRIMA</h1>
          <p className="text-xl md:text-2xl font-medium">Create Service To BUILD UP People</p>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section ref={visiMisiRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visi Card */}
            <div className={`bg-blue-100 rounded-2xl p-8 shadow-lg transition-all duration-700 delay-100 ${isVisible.visiMisi ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Visi</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">Menjadi yang terbaik</p>
            </div>

            {/* Misi Card */}
            <div className={`bg-blue-100 rounded-2xl p-8 shadow-lg transition-all duration-700 delay-300 ${isVisible.visiMisi ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Misi</h2>
              </div>
              <ol className="text-gray-700 leading-relaxed text-lg space-y-2 list-decimal list-inside">
                <li>- asdasdfas</li>
                <li>- sdmiasmdf </li>
                <li>Sed ut perspiciatis unde omnis iste</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Prinsip Kami Section */}
      <section ref={prinsipRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl lg:text-5xl font-bold text-center text-blue-600 mb-16 transition-all duration-700 ${isVisible.prinsip ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>Prinsip Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Segmentation */}
            <div className={`bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-700 delay-100 ${isVisible.prinsip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Segmentation</h3>
                <h6 className="text-center">Corporate Services adalah segmen utama PT Souci Indoprima, dengan pengalaman penempatan dari tenaga kerja standar hingga level Managerial.</h6>
              </div>
            </div>

            {/* Commitment */}
            <div className={`bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-700 delay-200 ${isVisible.prinsip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Commitment</h3>
                <h6 className="text-center">Client satisfaction adalah budaya dasar Souci, diwujudkan melalui komitmen formal dalam Service Level Agreement sebagai acuan bagi organisasi dan rujukan bagi client.</h6>
              </div>
            </div>

            {/* Experience */}
            <div className={`bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-700 delay-300 ${isVisible.prinsip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Experience</h3>
                <h6 className="text-center">Financial Services, government services, dan NGO internasional baik berafiliasi maupun independen menjadi bagian dari pengalaman dan layanan Souci.</h6>
              </div>
            </div>

            {/* Business Process */}
            <div className={`bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-700 delay-400ms ${isVisible.prinsip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Business Process</h3>
                <h6 className="text-center">Akuntabilitas dan aksesibilitas tercermin kuat dalam setiap proses bisnis, menjadikan Souci sebagai specific corporate outsourcing.</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />

      <Footer />
    </>
  );
}
