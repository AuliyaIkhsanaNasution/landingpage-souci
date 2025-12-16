"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      const data = response?.data?.data || [];

      const settingsObj = {};
      if (Array.isArray(data)) {
        data.forEach((item) => {
          settingsObj[item.key_name] = item.value || "";
        });
      }

      setSettings(settingsObj);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  return (
    <footer id="career" className="bg-blue-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-700 text-sm">
            © {currentYear} {settings.site_title || "PT. Souci Indoprima"}. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
