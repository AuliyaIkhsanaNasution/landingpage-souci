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
                      "{testimonials[currentIndex]?.content || testimonials[currentIndex]?.text}"
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
      </div>
    </section>
  );
}
