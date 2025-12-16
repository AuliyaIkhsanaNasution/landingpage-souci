"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollReveal from "@/components/ScrollReveal";
import api from "@/lib/api";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article from backend
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/news/${slug}`);
        if (response.data.success) {
          setArticle(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Article not found");
        // Fallback to default article
        setArticle(getDefaultArticle(slug));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Fallback data jika API gagal
  const getDefaultArticle = (slug) => {
    const newsData = {
      "penghargaan-best-hr-provider-2024": {
        id: 1,
        title: "PT. Souci Indoprima Raih Penghargaan Best HR Provider 2024",
        image: "/building.png",
        published_at: "2024-10-15",
        category: "achievement",
        content: `
        <p>Jakarta, 15 Oktober 2024 - PT. Souci Indoprima dengan bangga mengumumkan pencapaian luar biasa sebagai penerima penghargaan <strong>Best HR Provider 2024</strong> untuk kategori Sumatera Area.</p>

        <h2>Pencapaian Membanggakan</h2>
        <p>Penghargaan ini merupakan pengakuan atas dedikasi dan komitmen kami dalam memberikan layanan outsourcing SDM berkualitas tinggi kepada klien-klien di seluruh wilayah Sumatera. Dengan pengalaman lebih dari 15 tahun, kami terus berinovasi dalam menghadirkan solusi HR yang efektif dan efisien.</p>

        <h2>Komitmen Berkelanjutan</h2>
        <p>Penghargaan ini semakin memotivasi kami untuk terus berkembang dan memberikan layanan terbaik. Kami akan terus berinvestasi dalam teknologi, pelatihan SDM, dan pengembangan layanan untuk memastikan kepuasan klien tetap menjadi prioritas utama.</p>

        <p>PT. Souci Indoprima mengucapkan terima kasih kepada seluruh klien, partner, dan stakeholder yang telah mendukung perjalanan kami hingga saat ini.</p>
      `,
        tags: ["Penghargaan", "Achievement", "HR Provider", "Best Company"],
      },
    };
    return newsData[slug] || null;
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

  // Loading state
  if (loading) {
    return (
      <>
        <ScrollProgressBar />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
        <FloatingWhatsApp />
      </>
    );
  }

  // Error or article not found
  if (error || !article) {
    return (
      <>
        <ScrollProgressBar />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Artikel Tidak Ditemukan</h1>
            <Link href="/news" className="text-blue-600 hover:text-blue-800 font-semibold">
              Kembali ke Halaman Berita
            </Link>
          </div>
        </div>
        <Footer />
        <FloatingWhatsApp />
      </>
    );
  }

  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      {/* Hero Image */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image src={article.image || "/building.png"} alt={article.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal direction="up">
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">{formatCategory(article.category)}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{article.title}</h1>
              <div className="flex items-center text-white/90 text-lg">
                <span>{formatDate(article.published_at || article.date)}</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <article className="prose prose-lg max-w-none">
              <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>
          </ScrollReveal>

          {/* Tags */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags &&
                  Array.isArray(article.tags) &&
                  article.tags.map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 transition-colors">
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Share Buttons */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bagikan Artikel:</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </button>

                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`, "_blank")}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
                >
                  Twitter
                </button>

                <button
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(document.title + " " + window.location.href)}`, "_blank")}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </button>

                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Back to News */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-12 text-center">
              <Link href="/news" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group">
                <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                </svg>
                Kembali ke Semua Berita
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      {/* Custom styles for article content */}
      <style jsx global>{`
        .article-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .article-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #4b5563;
        }

        .article-content ul {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
          list-style: disc;
        }

        .article-content li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          line-height: 1.7;
        }

        .article-content blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .article-content strong {
          font-weight: 700;
          color: #1f2937;
        }

        .article-content em {
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </>
  );
}
