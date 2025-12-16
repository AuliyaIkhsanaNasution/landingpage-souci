"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Cost Saving",
      description:
        "Efisiensi biaya melalui pengelolaan SDM yang lebih efektif dan terukur.",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "24 Hours Customer Services",
      description:
        "Layanan 24/7 dengan komitmen penuh terhadap kepuasan dan kesuksesan pelanggan.",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      bgColor: "bg-sky-50",
    },
    {
      id: 3,
      title: "Service Level Agreement",
      description:
        "Jaminan kualitas rekrutmen, kompetensi, dan ketersediaan tenaga kerja sebagai bentuk komitmen layanan kami.",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      bgColor: "bg-indigo-50",
    },
    {
      id: 4,
      title: "Business Process",
      description:
        "Penyederhanaan proses kerja melalui business process outsourcing untuk meningkatkan efisiensi dan mobilitas usaha.",
      icon: (
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      bgColor: "bg-cyan-50",
    },
  ];

  return (
    <section id="service" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Mengapa Harus Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              PT. Souci Indoprima merupakan provider human resources
              berpengalaman di sektor jasa dengan jangkauan Sumatera Area. Kerja
              sama dengan kami akan memberikan nilai tambah bagi daya saing dan
              pertumbuhan bisnis Anda melalui pengelolaan SDM yang profesional
              dan terpercaya.
            </p>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.id} direction="up" delay={index * 0.1}>
              <motion.div
                className={`group relative p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${feature.bgColor}`}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated gradient overlay on hover */}
                <motion.div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500" />

                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                />

                <div className="relative flex flex-col items-center text-center space-y-4">
                  {/* Icon with bounce animation */}
                  <motion.div
                    className="p-4 bg-white rounded-full shadow-md"
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-300" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Optional CTA below features */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="text-center mt-16">
            <motion.button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 rounded-lg bg-linear-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Hubungi Kami Sekarang
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
