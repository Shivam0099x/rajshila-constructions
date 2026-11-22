"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  publicId?: string;
  folder?: "projects" | "gallery" | "business" | "services";
  onChange: (url: string, publicId?: string) => void;
  helperText?: string;
}

export function ImageUploadField({
  label,
  value,
  folder = "projects",
  onChange,
  helperText,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url, data.publicId);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    onChange("", undefined);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-stone-300 font-mono block">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center"
        >
          <LinkIcon className="w-3 h-3 mr-1" />
          <span>{showUrlInput ? "Upload File" : "Paste Direct URL"}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex space-x-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or Cloudinary URL"
            className="flex-1 bg-stone-950 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-stone-800 text-stone-200 text-xs uppercase tracking-wider hover:bg-stone-700"
          >
            Apply
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="relative aspect-[16/9] w-full max-w-sm bg-stone-950 border border-stone-800 overflow-hidden group">
              <Image
                src={value}
                alt={label}
                fill
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-stone-800 text-white text-xs uppercase tracking-wider hover:bg-stone-700"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-rose-900 text-white text-xs uppercase tracking-wider hover:bg-rose-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-stone-800 hover:border-amber-400/80 bg-stone-950/60 p-6 flex flex-col items-center justify-center cursor-pointer transition-colors max-w-sm"
            >
              {isUploading ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-2" />
                  <span className="text-xs text-stone-400 font-mono">
                    Uploading to Cloudinary...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Upload className="w-6 h-6 text-stone-500 mb-2" />
                  <span className="text-xs text-stone-300 font-medium">
                    Upload Photograph
                  </span>
                  <span className="text-[10px] text-stone-500 mt-1 font-mono">
                    PNG, JPG, WEBP up to 10MB
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
      {helperText && (
        <p className="text-[11px] text-stone-500 font-mono">{helperText}</p>
      )}
    </div>
  );
}

interface MultiImageUploadFieldProps {
  label: string;
  images: string[];
  publicIds?: string[];
  folder?: "projects" | "gallery" | "business" | "services";
  onChange: (images: string[], publicIds?: string[]) => void;
}

export function MultiImageUploadField({
  label,
  images,
  publicIds = [],
  folder = "projects",
  onChange,
}: MultiImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...images];
    const newPublicIds = [...publicIds];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          newImages.push(data.url);
          if (data.publicId) newPublicIds.push(data.publicId);
        }
      }

      onChange(newImages, newPublicIds);
    } catch (err) {
      console.error("Multi upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPublicIds = publicIds.filter((_, i) => i !== index);
    onChange(updatedImages, updatedPublicIds);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-stone-300 font-mono block">
          {label} ({images.length} uploaded)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-xs uppercase tracking-wider text-amber-400 hover:text-amber-300 font-mono disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "+ Add Photographs"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFiles}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] w-full bg-stone-950 border border-stone-800 overflow-hidden group"
          >
            <Image
              src={url}
              alt={`Photo ${idx + 1}`}
              fill
              sizes="200px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-black/80 text-rose-400 hover:text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[4/3] border border-dashed border-stone-800 hover:border-amber-400/80 bg-stone-950/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
          ) : (
            <div className="text-center p-2">
              <ImageIcon className="w-5 h-5 text-stone-500 mx-auto mb-1" />
              <span className="text-[11px] text-stone-400 font-mono block">
                Add Images
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
