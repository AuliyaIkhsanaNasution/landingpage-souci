import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 bg-linear-to-b from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Building Image */}
          <div className="relative animate-fade-in order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative background shape */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-300 to-blue-500 rounded-full opacity-20 blur-2xl"></div>

              {/* Main image container with mask effect */}
              <div className="relative w-full h-full rounded-[60px] overflow-hidden shadow-2xl">
                <Image src="/souci_office.jpeg" alt="PT. Souci Indoprima office building" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>

              {/* Decorative corner element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="space-y-6 animate-fade-in-delay order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">PT. Souci Indoprima</h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Merupakan provider outsourcing terpercaya dengan pengalaman mengelola sumber daya manusia di sektor jasa dengan jangkauan <strong>Sumatera Area</strong>.
              </p>

              <p className="text-lg">
                Dengan pengalaman lebih dari <strong>20 tahun</strong>, kami telah membantu ratusan perusahaan dalam mengelola SDM mereka secara efisien dan profesional.
              </p>

              <p className="text-lg">Kami berkomitmen untuk memberikan solusi HR terbaik yang disesuaikan dengan kebutuhan setiap klien, mulai dari penyediaan tenaga kerja, rekrutmen, hingga konsultasi strategi pengembangan SDM.</p>
            </div>

            {/* Key Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-start space-x-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">20+ Tahun</p>
                  <p className="text-sm text-gray-600">Pengalaman</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Coverage Area</p>
                  <p className="text-sm text-gray-600">Seluruh Sumatera</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Profesional</p>
                  <p className="text-sm text-gray-600">Tim Berpengalaman</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Terpercaya</p>
                  <p className="text-sm text-gray-600">Ratusan Klien</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
