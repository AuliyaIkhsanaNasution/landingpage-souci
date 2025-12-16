"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const images = [
    { src: "/souci_office.jpeg", alt: "Professional team at PT. Souci Indoprima" },
    { src: "/building.png", alt: "Building 1" },
    { src: "/s1.jpg", alt: "Building 2" },
    { src: "/s2.jpg", alt: "Office" },
  ];

  useEffect(() => {
    if (isPaused) return;

    // Auto scroll ke gambar berikutnya setiap 3 detik
    const autoScrollInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % images.length;
      });
    }, 3000);

    return () => {
      clearInterval(autoScrollInterval);
    };
  }, [isPaused, images.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-blue-50 to-blue-100 -z-10"></div>

      {/* Decorative Blur Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-800">Solusi Outsourcing</span>
              <br />
              <span className="text-blue-600">Sumber Daya Manusia</span>
              <br />
              <span className="text-gray-800">Terbaik di </span>
              <span className="text-blue-600">Sumatera</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              PT. Souci Indoprima adalah provider outsourcing terpercaya dengan pengalaman lebih dari 15 tahun dalam mengelola sumber daya manusia di sektor jasa dengan coverage Sumatera Area.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
    onClick={scrollToAbout}
    className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
  >
    Learn More
  </button>
  <button
      onClick={() => {
        const contactForm = document.getElementById("contact-form");
        if (contactForm) {
        contactForm.scrollIntoView({ behavior: "smooth" });
           }
        }}
         className="px-8 py-3 rounded-lg bg-white text-blue-600 font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
          >
          Contact Us
        </button>
        </div>
          </div>


          {/* Right Side - Hero Image Carousel */}
          <div className="relative animate-fade-in-delay">
            <div className="relative w-full aspect-4/3 lg:aspect-square">
              <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600 rounded-[40px] opacity-10 transform rotate-6"></div>
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`object-cover rounded-[40px] shadow-2xl transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
      `}</style>
    </section>
  );
}