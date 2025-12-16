"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import api from "@/lib/api";

function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

/**
 * Statistics Section Component
 * Displays company statistics with animated counters
 * Data fetched from backend API
 */
export default function Statistics() {
  const [stats, setStats] = useState([
    {
      id: 1,
      value: 15,
      suffix: "+",
      label: "Years Experience",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      id: 2,
      value: 100,
      suffix: "+",
      label: "Happy Clients",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
    {
      id: 3,
      value: 500,
      suffix: "+",
      label: "Employees Placed",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
    },
    {
      id: 4,
      value: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
  ]);

  // Fetch statistics from backend
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("/statistics");
        if (response.data.success && response.data.data.length > 0) {
          // Map backend data to component format
          const backendStats = response.data.data.map((stat, index) => {
            // Extract number and suffix from value
            const match = stat.value.match(/^(\d+)(.*)$/);
            const value = match ? parseInt(match[1]) : 0;
            const suffix = match ? match[2] : "";

            return {
              ...stats[index], // Keep icons from default
              id: stat.id,
              value: value,
              suffix: suffix,
              label: stat.label,
            };
          });
          setStats(backendStats);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Keep default stats if API fails
      }
    };

    fetchStatistics();
  }, []);

  return (
    <section className="py-20 bg-linear-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Our Achievement</h2>
          <p className="text-xl text-blue-100">Trusted by hundreds of companies across Sumatera</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">{stat.icon}</div>

              {/* Counter */}
              <div className="text-5xl lg:text-6xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <p className="text-lg text-blue-100">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
