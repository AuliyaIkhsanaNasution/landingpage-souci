"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollReveal from "@/components/ScrollReveal";
import api from "@/lib/api";

export default function NewsPage() {
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news", {
          params: { limit: 50 },
        });
        if (response.data.success) {
          setAllNews(response.data.data);
          setFilteredNews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        // Fallback to default news
        const defaultNews = [
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
        ];
        setAllNews(defaultNews);
        setFilteredNews(defaultNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filterNews = (category) => {
    setActiveFilter(category);
    if (category === "all") {
      setFilteredNews(allNews);
    } else {
      setFilteredNews(allNews.filter((item) => item.category === category));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatCategory = (category) => {
    const categoryMap = {
      achievement: "Achievement",
      company_news: "Company News",
      tips: "Tips & Insights",
      event: "Event",
    };
    return categoryMap[category] || category;
  };

  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/building.png')] bg-cover bg-center"></div>
        </div>

        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Berita & Artikel
          </h1>
          <p className="text-xl md:text-2xl font-medium">
            Update Terkini Seputar PT. Souci Indoprima
          </p>
        </div>
      </section>

      {/* News Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Categories */}
          <ScrollReveal direction="up">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => filterNews("all")}
                className={`px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => filterNews("achievement")}
                className={`px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg ${
                  activeFilter === "achievement"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Achievement
              </button>
              <button
                onClick={() => filterNews("company_news")}
                className={`px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg ${
                  activeFilter === "company_news"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Company News
              </button>
              <button
                onClick={() => filterNews("tips")}
                className={`px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg ${
                  activeFilter === "tips"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Tips & Insights
              </button>
              <button
                onClick={() => filterNews("event")}
                className={`px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg ${
                  activeFilter === "event"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Event
              </button>
            </div>
          </ScrollReveal>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          )}

          {/* News Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <ScrollReveal
                  key={article.id}
                  direction="up"
                  delay={index * 0.05}
                >
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
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {formatCategory(article.category)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
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

                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>

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
                  </motion.article>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Tidak ada berita untuk kategori ini.
              </p>
            </div>
          )}

          {/* Pagination - Optional */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex justify-center gap-2 mt-12">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full font-semibold transition-all ${
                    page === 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
