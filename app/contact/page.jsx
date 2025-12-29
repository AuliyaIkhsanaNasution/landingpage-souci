"use client";

import { useState, useEffect, useRef } from "react"; // DITAMBAHKAN: Import useRef
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import api from "@/lib/api";

// DITAMBAHKAN: Hook Kustom untuk On-Scroll Animation
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.unobserve(ref.current); // Hentikan pengamatan setelah terlihat
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // Pengecekan diperlukan karena ref.current bisa menjadi null saat unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
    // Opsi array dependency dihilangkan untuk menghindari masalah eslint
    // karena ref dan options seharusnya stabil.
  }, [ref, options]); 

  return isIntersecting;
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // DITAMBAHKAN: Ref untuk Contact Section
  const contactSectionRef = useRef(null); 
  const showContactSection = useIntersectionObserver(contactSectionRef, {
    threshold: 0.2, // Mulai animasi ketika 20% bagian terlihat
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      const data = response?.data?.data || [];

      const settingsObj = {};
      if (Array.isArray(data)) {
        data.forEach((item) => {
          settingsObj[item.key_name] = item.value || "";
        });
      }

      setSettings(settingsObj);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit to backend API
      const response = await api.post("/contact", formData);

      if (response.data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");

      // Auto hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      {/* DITAMBAHKAN: class animasi fade-in pada Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden animate-fade-in">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/kontak.png')] bg-cover bg-center"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl md:text-2xl font-medium">Kami siap menjadi mitra strategis Anda. Kirimkan pesan atau kunjungi kantor kami.</p>
        </div>
      </section>

      {/* Contact Section */}
      {/* DITAMBAHKAN: Ref dan conditional class untuk animasi on-scroll */}
      <section ref={contactSectionRef} className="py-20 bg-gray-50">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            showContactSection
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10" // Efek slide-up dan fade-in
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Card - Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Kirim Pesan Kepada Kami</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama :
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Nama Lengkap Anda"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email :
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon :
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="08123456789"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek :
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Subjek pesan"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan :
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan Sekarang"}
                </button>

                {/* Status Messages */}
                {submitStatus === "success" && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">✓ Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.</div>}
                {submitStatus === "error" && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">✗ Terjadi kesalahan. Silakan coba lagi atau hubungi kami melalui email.</div>}
              </form>
            </div>

            {/* Right Card - Company Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Kantor PT. Souci Indoprima</h2>

              <div className="space-y-6">
                {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Alamat :</p>
                      <p className="text-gray-600 whitespace-pre-line">{settings.contact_address || "Jl Sei Serayu No.87\nBabura, Medan Baru"}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email :</p>
                      <p className="text-gray-600">{settings.contact_email || "customer.service@souci.co.id"}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Phone :</p>
                      <p className="text-gray-600">{settings.contact_phone || "+6261 4533869"}</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  {settings.contact_whatsapp && (
                    <div className="flex items-start space-x-4">
                      <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">WhatsApp :</p>
                        <p className="text-gray-600">+{settings.contact_whatsapp}</p>
                      </div>
                    </div>
                  )}

                {/* Office Hours */}
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Jam kerja :</p>
                    <p className="text-gray-600">Senin - Jumat, 08.00 - 17.00 WIB</p>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.044365716604!2d98.64295807403415!3d3.577277350373672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312e3a9c7cb633%3A0x52afcf5ba68b0d3!2sPT.%20Souci%20Indoprima!5e0!3m2!1sid!2sid!4v1765772787499!5m2!1sid!2sid"
                    className="w-full h-64 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}