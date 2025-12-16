"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect - add shadow when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if link is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path;
  };

  return (
    <nav
      className={`bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.jpg"
              alt="PT. Souci Indoprima Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                isActive("/about")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              About
            </Link>
            <Link
              href="/service"
              className={`font-medium transition-colors ${
                isActive("/service")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Service
            </Link>
            <Link
              href="/carrier"
              className={`font-medium transition-colors ${
                isActive("/carrier")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Carrier
            </Link>
            <Link
              href="/news"
              className={`font-medium transition-colors ${
                isActive("/news")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              News
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-blue-700 text-white font-medium hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={handleMobileMenuClose}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={handleMobileMenuClose}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                isActive("/about")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              About
            </Link>
            <Link
              href="/service"
              onClick={handleMobileMenuClose}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                isActive("/service")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Service
            </Link>
            <Link
              href="/carrier"
              onClick={handleMobileMenuClose}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                isActive("/carrier")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Carrier
            </Link>
            <Link
              href="/news"
              onClick={handleMobileMenuClose}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                isActive("/news")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              News
            </Link>
            <Link
              href="/contact"
              onClick={handleMobileMenuClose}
              className="block w-full text-left px-3 py-2 mt-2 bg-linear-to-r from-blue-500 to-blue-700 text-white rounded-md font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
