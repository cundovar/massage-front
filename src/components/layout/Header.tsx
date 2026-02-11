"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-300
      ${isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm"
        : "bg-transparent"
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif">
          Hélène
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/soins" className="hover:text-orange-500 transition">Soins</Link>
          <Link href="/a-propos" className="hover:text-orange-500 transition">À propos</Link>
          <Link href="/contact" className="hover:text-orange-500 transition">Contact</Link>
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-flex px-6 py-2 bg-gradient-to-r from-[#FFCE67] to-[#F67E54] text-white rounded-full hover:shadow-lg transition"
        >
          Réserver
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Menu</span>
          {/* Hamburger icon */}
        </button>
      </div>
    </header>
  );
}