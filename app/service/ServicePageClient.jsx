"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function ServicePageClient() {
  const services = [
    {
      id: 1,
      title: "Recruitment",
      description: [
        {
          heading: "Special Hire",
          text: "Pemenuhan Man Power Planning yang cepat dengan kualifikasi khusus dan level tertentu hanya dapat dilakukan bila sebuah corporate memiliki data bank yang cukup atau proses recruitment yang ringkas. Bila tidak, maka anda dapat mempertimbangkan menggunakan jasa kami untuk melakukannya.",
        },
        {
          heading: "General Hire",
          text: "Direct Recruitment yang selama ini dilakukan selain kurang efisien dan cenderung cost extensive juga bukanlahcore business activity. Biarkan anda focus on core business sedangkan rekrutmen sumber daya manusia dapat dipercayakan kepada kami.",
        },
      ],
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Man Power Outsourcing",
      description: [
        {
          heading: "Specific Skill Outsourcing",
          text: "Produktivitas optimum merupakan tujuan utama yang ingin dihasilkan oleh organisasi secara umum. Salah satu tujuan dari Man Power Outsourcing adalah untuk meningkatkan produktivitas dan cost saving. Sudah saatnya organisasi melakukan HR transformation melalui scheme outsourcing untuk posisi supervisory maupun managerial skill.",
        },
        {
          heading: "General Skill Outsourcing",
          text: "Front Liner, Guarding dan beberapa fungsi administrasi dan marketing merupakan ruang lingkup pekerjaan yang memiliki turn over yang cukup tinggi. Cukup banyak waktu dan personil yang dicurahkan untuk mengawasinya, sehingga perhatian untuk tugas-tugas pokok sering tertinggal. Biarkan kami yang menanganinya.",
        },
      ],
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
    },
    {
      id: 3,
      title: "B.P.O",
      description: [
        "Business Process Outsourcing (BPO) merupakan salah satu jasa dan layanan kami yang memungkinkan customer memperoleh hasil yang diinginkan tanpa harus terlibat dalam business process yang terjadi. Jasa-jasa pemasaran seperti call centre, joint marketing dan keuangan seperti payroll system, account receivable serta sebagian besar proses administrasi merupakan bagian dari Business Process Outsourcing.",
        "Organisasi menjadi lebih fleksibel, lincah dan dinamis sesuai dengan tuntutan pasar yang selalu berubah dari waktu ke waktu, disamping akan mampu meningkatkan value atas penggunaan sumber daya yang dimiliki untuk mencapai tujuan perusahaan.",
        "B.P.O masih relatif baru dan belum menjadi kebiasaan di lingkungan bisnis di tanah air, namun model ini merupakan salah satu alat manajemen yang dapat mendorong perusahaan agar dapat bersaing nasional maupun dunia. Sebaiknya gunakan jasa kami untuk memperoleh hasil yang maksimal dari Business Process Outsourcing.",
      ],
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    },
    {
      id: 4,
      title: "IT Outsourcing",
      description: [
        "Kebijakan Cost Reduction maupun zero growth investment membuat perusahaan sangat berhitung dan selektif atas setiap keputusan investasi, khususnya investasi di segmen IT yang memiliki ciri khas cepat dalam perubahan inovasi dan untuk mengadakannya membutuhkan biaya yang relatif mahal. Sementara sangat disadari bahwa percepatan pertumbuhan usaha dan kinerja organisasi sangat didukung oleh implemantasi Information and technology.",
        "Salah satu business solution yang dapat dijadikan sebagai jalan tengah adalah dengan memanfaatkan jasa provider IT Outsourcing. Kami yakin dengan memilih Souci sebagai provider outsourcing untuk kebutuhan perusahaan anda akan meningkatkan value dan daya saing usaha.",
      ],
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
    },
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    services: false,
  });

  const servicesRef = useRef(null);

  useEffect(() => {
    // Hero animation on mount
    setIsVisible((prev) => ({ ...prev, hero: true }));

    // Intersection Observer untuk section lainnya
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === servicesRef.current) {
              setIsVisible((prev) => ({ ...prev, services: true }));
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "-50px" } // ← UBAH THRESHOLD & TAMBAH ROOTMARGIN
    );

    if (servicesRef.current) observer.observe(servicesRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/services.png')] bg-cover bg-center"></div>
        </div>
        <div className={`relative z-20 text-center text-white px-4 transition-all duration-1000 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Product & Services</h1>
          <p className="text-xl md:text-2xl font-medium">Outsourcing SDM Terintegrasi: Jaminan Kualitas dan Kehandalan.</p>
        </div>
      </section>

      {/* Layanan Kami Section */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl lg:text-5xl font-bold text-center text-blue-600 mb-6 transition-all duration-700 ${isVisible.services ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>Layanan Kami</h2>

          <p className={`text-center text-gray-600 text-lg max-w-4xl mx-auto mb-16 transition-all duration-700 delay-100 ${isVisible.services ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <strong>PT. Souci Indoprima</strong> adalah corporate outsourcing yang berfokus pada layanan <strong>Human Resources Integrated</strong>.
            <br />
            Kami mengutamakan keandalan SDM dan kepuasan pelanggan sebagai dasar kekuatan organisasi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden p-4">
            {services.map((service, index) => {
              // Tentukan arah: index 0 & 2 dari kiri (-translate-x), index 1 & 3 dari kanan (translate-x)
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  className={`bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-1000 ease-out ${
                    isVisible.services
                      ? "opacity-100 translate-x-0 translate-y-0" // Posisi akhir (tengah)
                      : `opacity-0 ${isLeft ? "-translate-x-20" : "translate-x-20"} translate-y-10` // Posisi awal (samping & bawah)
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">{service.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                    <button onClick={() => setSelectedService(service)} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                      Selengkapnya...
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Pop-up */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button onClick={() => setSelectedService(null)} className="absolute top-3 right-3 text-gray-600 hover:text-red-600">
              ✕
            </button>

            <h2 className="text-2xl font-bold text-blue-600 mb-4">{selectedService.title}</h2>

            {Array.isArray(selectedService.description) ? (
              selectedService.description.map((item, i) => {
                // Kalau item berupa object {heading, text}
                if (typeof item === "object" && item.heading && item.text) {
                  return (
                    <div key={i} className="mb-6">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">{item.heading}</h3>
                      <p className="text-gray-700">{item.text}</p>
                    </div>
                  );
                }
                // Kalau item berupa string biasa
                return (
                  <p key={i} className="mb-4 text-gray-700">
                    {item}
                  </p>
                );
              })
            ) : (
              <p className="text-gray-700">{selectedService.description}</p>
            )}
          </div>
        </div>
      )}

      <ContactForm />
      <Footer />
    </>
  );
}
