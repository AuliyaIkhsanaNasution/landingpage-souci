import type { Metadata } from "next";
import "./globals.css";

// SEO Metadata for the landing page
export const metadata: Metadata = {
  title: "PT. Souci Indoprima - Solusi Outsourcing SDM Terbaik di Sumatera",
  description:
    "Provider outsourcing terpercaya dengan pengalaman lebih dari 15 tahun dalam mengelola sumber daya manusia di sektor jasa dengan coverage Sumatera Area. Efisiensi biaya, layanan 24/7, dan komitmen profesional.",
  keywords:
    "outsourcing, HR, SDM, Sumatera, PT Souci Indoprima, human resources, tenaga kerja, rekrutmen, Indonesia",
  authors: [{ name: "PT. Souci Indoprima" }],
  openGraph: {
    title: "PT. Souci Indoprima - Solusi Outsourcing SDM Terbaik di Sumatera",
    description:
      "Provider outsourcing terpercaya dengan pengalaman lebih dari 15 tahun",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
