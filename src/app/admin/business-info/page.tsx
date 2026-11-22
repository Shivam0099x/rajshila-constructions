"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, Building2, Phone, Globe, Sparkles } from "lucide-react";
import { IBusinessSettings } from "@/types";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminBusinessInfoPage() {
  const [formData, setFormData] = useState<Partial<IBusinessSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/business-info");
        const json = await res.json();
        if (isMounted && res.ok && json.success) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/business-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update business settings");
      }

      showToast("Business information updated successfully", "success");
    } catch (err) {
      console.error("Save settings error:", err);
      showToast(err instanceof Error ? err.message : "Error saving settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Global Configuration
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Business Information & Settings
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            Updates to these settings propagate dynamically across the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center px-5 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          <span>{isSaving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Business Identity */}
        <div className="bg-stone-950 border border-stone-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider font-mono flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            Core Business Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Business Legal Name
              </label>
              <input
                type="text"
                value={formData.businessName || ""}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagline || ""}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              Short Business Description (Hero & Meta)
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription || ""}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              About Section Editorial Text
            </label>
            <textarea
              rows={3}
              value={formData.aboutText || ""}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Section 2: Contact Channels & Location */}
        <div className="bg-stone-950 border border-stone-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider font-mono flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Verified Contact Channels & Office Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                WhatsApp Clean Number (e.g. 918109515701)
              </label>
              <input
                type="text"
                value={formData.whatsapp || ""}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Inquiry Email Address
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Street Address in Bhopal
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Operating Hours Display
              </label>
              <input
                type="text"
                value={formData.openingHours || ""}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Google Maps Listing URL
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl || ""}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Google Places Place ID
              </label>
              <input
                type="text"
                value={formData.placeId || ""}
                onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                placeholder="Optional Place ID"
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Homepage Hero & Marketing Texts */}
        <div className="bg-stone-950 border border-stone-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider font-mono flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Homepage Hero Headline & Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline || ""}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={formData.heroCtaText || ""}
                onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              Hero Paragraph Description
            </label>
            <textarea
              rows={2}
              value={formData.heroDescription || ""}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Section 4: SEO Metadata */}
        <div className="bg-stone-950 border border-stone-800 p-6 space-y-4">
          <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider font-mono flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Search Engine Optimization (SEO)
          </h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              Global Title Tag
            </label>
            <input
              type="text"
              value={formData.seoTitle || ""}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
              Global Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.seoDescription || ""}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span>Update Business Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
