"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contactFormSchema, ContactFormData } from "@/lib/validations/contact";
import { BUSINESS_INFO } from "@/constants/business";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      projectType: "Residential Construction",
      location: "Bhopal",
      message: "",
      hp_website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit enquiry");
      }

      setSubmitSuccess(true);
      reset();
    } catch (err: unknown) {
      console.error("Enquiry submission error:", err);
      const errorText =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please contact us directly via phone or WhatsApp.";
      setErrorMessage(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-stone-900 border border-stone-800 p-8 sm:p-10 text-center animate-in fade-in">
        <div className="w-14 h-14 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-light text-stone-100 mb-3">
          Enquiry Received
        </h3>
        <p className="text-sm text-stone-300 font-light leading-relaxed max-w-md mx-auto mb-8">
          Thank you for reaching out to Rajshila Construction. Our architectural and civil engineering team will review your project details and contact you shortly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs uppercase tracking-widest transition-colors"
          >
            Send Another Message
          </button>
          <a
            href={BUSINESS_INFO.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-stone-900 border border-stone-800 p-6 sm:p-10 space-y-6"
      noValidate
    >
      {/* Anti-spam honeypot */}
      <input
        type="text"
        {...register("hp_website")}
        className="opacity-0 absolute -z-10 pointer-events-none h-0 w-0"
        tabIndex={-1}
        autoComplete="off"
      />
      <div className="border-b border-stone-800 pb-4 mb-6">
        <h3 className="text-xl font-light text-stone-100">
          Project Consultation Inquiry
        </h3>
        <p className="text-xs text-stone-400 mt-1 font-light">
          Share your land area, interior vision or civil requirements in Bhopal.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/50 border border-red-900 text-red-300 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
            Full Name <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rajesh Sharma"
            {...register("name")}
            className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          {errors.name && (
            <span className="text-[11px] text-red-400 mt-1 block">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
            Phone Number <span className="text-amber-400">*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g. +91 98765 43210"
            {...register("phone")}
            className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          {errors.phone && (
            <span className="text-[11px] text-red-400 mt-1 block">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
            Email Address (Optional)
          </label>
          <input
            type="email"
            placeholder="e.g. rajesh@example.com"
            {...register("email")}
            className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          {errors.email && (
            <span className="text-[11px] text-red-400 mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Project Scope / Type */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
            Project Type <span className="text-amber-400">*</span>
          </label>
          <select
            {...register("projectType")}
            className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="Residential Construction">Residential Construction (Villa / House)</option>
            <option value="Turnkey Interior Design">Turnkey Interior Design & Fit-out</option>
            <option value="Modular Kitchen & Wardrobes">Modular Kitchen & Custom Joinery</option>
            <option value="Commercial Space">Commercial / Office Fit-out</option>
            <option value="Civil Renovation & Remodeling">Civil Renovation & Remodeling</option>
          </select>
          {errors.projectType && (
            <span className="text-[11px] text-red-400 mt-1 block">
              {errors.projectType.message}
            </span>
          )}
        </div>
      </div>

      {/* Project Site Location */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
          Project Site Location in Bhopal
        </label>
        <input
          type="text"
          placeholder="e.g. Ayodhya Bypass, Arera Colony, Kolar Road, etc."
          {...register("location")}
          className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Message / Brief */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-300 mb-2 font-mono">
          Project Requirements & Dimensions <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Please describe your plot size, built-up area requirements, design aesthetic, or specific timeline constraints..."
          {...register("message")}
          className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
        {errors.message && (
          <span className="text-[11px] text-red-400 mt-1 block">
            {errors.message.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs sm:text-sm tracking-widest uppercase transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 shadow-lg cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Transmitting Consultation Request...</span>
          </>
        ) : (
          <>
            <span>Submit Consultation Request</span>
            <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </button>

      <p className="text-[11px] text-stone-500 text-center font-mono">
        Your enquiry is strictly confidential. Directly handled by Rajshila Construction engineering leadership.
      </p>
    </form>
  );
}
