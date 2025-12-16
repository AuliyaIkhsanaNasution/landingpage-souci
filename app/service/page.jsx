// app/service/page.jsx
import ServicePageClient from "./ServicePageClient";

export const metadata = {
  title: "Services - PT. Souci Indoprima | Outsourcing SDM Terintegrasi",
  description: "Layanan outsourcing SDM terintegrasi: Recruitment, Man Power Outsourcing, BPO, dan IT Outsourcing. Solusi HR terpercaya di Sumatera.",
  keywords: "recruitment, man power outsourcing, BPO, IT outsourcing, layanan HR, outsourcing sumatera",
};

export default function ServicePage() {
  return <ServicePageClient />;
}
