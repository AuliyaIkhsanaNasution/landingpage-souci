"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import api from "@/lib/api";

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    content: "",
    rating: 5,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        if (response.data.success && response.data.data.length > 0) {
          setTestimonials(response.data.data);
        } else {
          // Fallback to default testimonials
          setTestimonials([
            {
              id: 1,
              name: "Budi Santoso",
              position: "HR Manager",
              company: "PT. Maju Bersama",
              image: "/logo.jpg",
              rating: 5,
              content:
                "PT. Souci Indoprima sangat profesional dalam mengelola kebutuhan SDM kami. Mereka memberikan kandidat berkualitas tinggi dan layanan yang responsif. Highly recommended!",
            },
            {
              id: 2,
              name: "Siti Nurhaliza",
              position: "Operations Director",
              company: "CV. Sukses Jaya",
              image: "/logo.jpg",
              rating: 5,
              content:
                "Kerjasama dengan Souci Indoprima sangat membantu efisiensi operasional kami. Tim mereka sangat tanggap dan solusi yang diberikan selalu tepat sasaran.",
            },
            {
              id: 3,
              name: "Ahmad Rizki",
              position: "CEO",
              company: "PT. Nusantara Digital",
              image: "/logo.jpg",
              rating: 5,
              content:
                "Lebih dari 3 tahun kami menggunakan jasa outsourcing dari PT. Souci Indoprima. Cost-effective dan kualitas SDM yang konsisten. Partner terbaik untuk pertumbuhan bisnis kami!",
            },
            {
              id: 4,
              name: "Linda Wijaya",
              position: "General Manager",
              company: "Hotel Bintang Lima",
              image: "/logo.jpg",
              rating: 4,
              content:
                "Service level agreement yang jelas dan team support 24/7 membuat kami sangat terbantu. PT. Souci Indoprima adalah mitra yang dapat diandalkan.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback to default testimonials
        setTestimonials([
          {
            id: 1,
            name: "Budi Santoso",
            position: "HR Manager",
            company: "PT. Maju Bersama",
            image: "/logo.jpg",
            rating: 5,
            content:
              "PT. Souci Indoprima sangat profesional dalam mengelola kebutuhan SDM kami. Mereka memberikan kandidat berkualitas tinggi dan layanan yang responsif. Highly recommended!",
          },
          {
            id: 2,
            name: "Siti Nurhaliza",
            position: "Operations Director",
            company: "CV. Sukses Jaya",
            image: "/logo.jpg",
            rating: 5,
            content:
              "Kerjasama dengan Souci Indoprima sangat membantu efisiensi operasional kami. Tim mereka sangat tanggap dan solusi yang diberikan selalu tepat sasaran.",
          },
          {
            id: 3,
            name: "Ahmad Rizki",
            position: "CEO",
            company: "PT. Nusantara Digital",
            image: "/logo.jpg",
            rating: 5,
            content:
              "Lebih dari 3 tahun kami menggunakan jasa outsourcing dari PT. Souci Indoprima. Cost-effective dan kualitas SDM yang konsisten. Partner terbaik untuk pertumbuhan bisnis kami!",
          },
          {
            id: 4,
            name: "Linda Wijaya",
            position: "General Manager",
            company: "Hotel Bintang Lima",
            image: "/logo.jpg",
            rating: 4,
            content:
              "Service level agreement yang jelas dan team support 24/7 membuat kami sangat terbantu. PT. Souci Indoprima adalah mitra yang dapat diandalkan.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change every 5 seconds

      return () => clearInterval(timer);
    }
  }, [currentIndex, testimonials.length]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToTestimonial = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "rating" ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("position", formData.position || "");
      submitData.append("company", formData.company || "");
      submitData.append("content", formData.content);
      submitData.append("rating", formData.rating);
      submitData.append("status", "pending"); // Always pending for public submissions

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await api.post("/testimonials", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success message
      setShowSuccess(true);
      setIsModalOpen(false);
      resetForm();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert(
        "Gagal mengirim testimoni. " +
          (error.response?.data?.message || "Silakan coba lagi.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      company: "",
      content: "",
      rating: 5,
      image: null,
    });
    setImagePreview(null);

    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"][name="image"]'
    );
    if (fileInput) fileInput.value = "";
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  // Early return if loading or no testimonials
  if (loading || testimonials.length === 0) {
    return (
      <section className="py-20 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by leading companies across Sumatera
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by leading companies across Sumatera
            </p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Client Photo */}
                    <div className="shrink-0">
                      <div className="relative w-24 h-24 md:w-32 md:h-32">
                        <Image
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          fill
                          className="object-cover rounded-full border-4 border-blue-200"
                        />
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Star Rating */}
                      <div className="flex justify-center md:justify-start gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${
                              i < testimonials[currentIndex].rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-lg md:text-xl text-gray-700 mb-6 italic leading-relaxed">
                        "
                        {testimonials[currentIndex]?.content ||
                          testimonials[currentIndex]?.text}
                        "
                      </p>

                      {/* Client Info */}
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-gray-600">
                          {testimonials[currentIndex].position} at{" "}
                          <span className="font-semibold">
                            {testimonials[currentIndex].company}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-blue-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-blue-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 hover:bg-blue-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button - Share Your Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              Share Your Experience
            </button>
          </motion.div>
        </div>
      </section>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p className="font-semibold">Testimoni Berhasil Dikirim!</p>
              <p className="text-sm">
                Terima kasih! Testimoni Anda akan ditampilkan setelah disetujui
                admin.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  Share Your Experience
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nama Anda"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jabatan
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Contoh: HR Manager"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Perusahaan
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nama Perusahaan"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, rating: star }))
                          }
                          className="flex items-center gap-1 px-4 py-2 rounded-lg border-2 transition-all"
                          style={{
                            borderColor:
                              formData.rating === star ? "#3B82F6" : "#E5E7EB",
                            backgroundColor:
                              formData.rating === star ? "#EFF6FF" : "white",
                          }}
                        >
                          <span className="font-semibold">{star}</span>
                          <svg
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Testimoni Anda <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Ceritakan pengalaman Anda bekerja sama dengan PT. Souci Indoprima..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Foto Profil (Opsional)
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleInputChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-3 file:px-6
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer border border-gray-300 rounded-lg"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Format: JPG, PNG, WebP (Maksimal 5MB)
                    </p>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-full border-4 border-blue-200"
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Testimoni"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}