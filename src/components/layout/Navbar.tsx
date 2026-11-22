"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { BUSINESS_INFO } from "@/constants/business";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/ongoing-projects", label: "Ongoing" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-stone-950/95 backdrop-blur-md border-b border-stone-800 py-3.5 shadow-md"
          : "bg-stone-950/80 backdrop-blur-sm border-b border-white/10 py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex flex-col">
            <span className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-white group-hover:text-amber-300 transition-colors">
              RAJSHILA
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-mono">
              CONSTRUCTION • BHOPAL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs tracking-[0.18em] uppercase transition-colors relative py-1",
                    isActive
                      ? "text-amber-300 font-semibold"
                      : "text-stone-300 hover:text-white"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${BUSINESS_INFO.contact.phoneClean}`}
              className="flex items-center text-xs tracking-wider uppercase text-stone-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-amber-400" />
              <span>{BUSINESS_INFO.contact.phoneDisplay}</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase font-medium bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 transition-colors"
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <a
              href={`tel:${BUSINESS_INFO.contact.phoneClean}`}
              className="p-2 text-stone-300 hover:text-white"
              aria-label="Call business"
            >
              <Phone className="w-4 h-4 text-amber-400" />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-6 py-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-sm tracking-widest uppercase py-2 border-b border-stone-900 transition-colors",
                    isActive
                      ? "text-amber-300 font-medium"
                      : "text-stone-300 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 flex flex-col space-y-3">
              <a
                href={BUSINESS_INFO.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 bg-stone-900 text-stone-200 text-xs tracking-widest uppercase border border-stone-800 hover:border-amber-400"
              >
                WhatsApp Inquiry
              </a>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 bg-[#B58D54] text-stone-950 font-medium text-xs tracking-widest uppercase"
              >
                Request a Consultation
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
