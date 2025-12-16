"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import api from "@/lib/api";

/**
 * NewsSection Component
 * Displays latest company news and updates
 * Data fetched from backend API
 */
export default function NewsSection() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news/latest/3");
        if (response.data.success) {
          setNewsArticles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        // Fallback to default news if API fails
        setNewsArticles([
          {
            id: 1,
            title: "PT. Souci Indoprima Raih Penghargaan Best HR Provider 2024",
            excerpt:
              "Kami bangga mengumumkan bahwa PT. Souci Indoprima telah meraih penghargaan sebagai Best HR Provider 2024 untuk kategori Sumatera Area.",
            image: "/building.png",
            published_at: "2024-10-15",
            category: "achievement",
            slug: "penghargaan-best-hr-provider-2024",
          },
          {
            id: 2,
            title: "Ekspansi Layanan ke Sumatera Selatan",
            excerpt:
              "Melengkapi jangkauan kami di Sumatera, kini PT. Souci Indoprima membuka kantor cabang baru di Palembang untuk melayani kebutuhan HR perusahaan di Sumatera Selatan.",
            image: "/services.png",
            published_at: "2024-09-28",
            category: "company_news",
            slug: "ekspansi-layanan-sumatera-selatan",
          },
          {
            id: 3,
            title: "Tips Memilih Outsourcing Partner yang Tepat",
            excerpt:
              "Dalam artikel ini, kami berbagi 5 tips penting yang perlu dipertimbangkan perusahaan Anda saat memilih mitra outsourcing untuk kebutuhan SDM.",
            image: "/kontak.png",
            published_at: "2024-09-10",
            category: "tips",
            slug: "tips-memilih-outsourcing-partner",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Format date to Indonesian format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Format category name
  const formatCategory = (category) => {
    const categoryMap = {
      achievement: "Achievement",
      company_news: "Company News",
      tips: "Tips & Insights",
      event: "Event",
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Berita & Artikel Terbaru
            </h2>
            <p className="text-xl text-gray-600">
              Update terkini seputar PT. Souci Indoprima dan dunia HR
            </p>
          </div>
        </ScrollReveal>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <ScrollReveal key={article.id} direction="up" delay={index * 0.1}>
              <motion.article
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.image || "/building.png"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {formatCategory(article.category)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Date & Author */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg
                      className="w-4 h-4 mr-2"
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
                      {formatDate(article.published_at || article.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  {/* Read More Button */}
                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
                  >
                    Baca Selengkapnya
                    <svg
                      className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
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

                {/* Hover Border Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-blue-600 rounded-2xl opacity-0 pointer-events-none"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.article>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Button */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/news"
              className="inline-block px-8 py-3 rounded-lg bg-linear-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Lihat Semua Berita
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
