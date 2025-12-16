import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Statistics from "@/components/Statistics";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import NewsSection from "@/components/NewsSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <About />
      <Statistics />
      <Features />
      <TestimonialCarousel />
      <NewsSection />
      <ContactForm />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
