"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { IGalleryImage } from "@/types";
import { GALLERY_CATEGORIES } from "@/constants/demo-data";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<IGalleryImage[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<IGalleryImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    publicId: "",
    category: "living" as const,
    featured: false,
    published: true,
    order: 0,
  });

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const url =
        selectedFilter !== "all"
          ? `/api/admin/gallery?category=${selectedFilter}`
          : "/api/admin/gallery";
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success) {
        setImages(json.data);
      }
    } catch (err) {
      console.error("Error loading gallery:", err);
      showToast("Failed to load gallery images", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFilter, showToast]);

  useEffect(() => {
    let isMounted = true;
    const url =
      selectedFilter !== "all"
        ? `/api/admin/gallery?category=${selectedFilter}`
        : "/api/admin/gallery";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success) {
          setImages(json.data);
        }
      })
      .catch((err) => {
        console.error("Error loading gallery:", err);
        if (isMounted) showToast("Failed to load gallery images", "error");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFilter, showToast]);

  const openCreateModal = () => {
    setEditingImage(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      publicId: "",
      category: "living",
      featured: false,
      published: true,
      order: images.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (img: IGalleryImage) => {
    setEditingImage(img);
    setFormData({
      title: img.title,
      description: img.description || "",
      imageUrl: img.imageUrl,
      publicId: img.publicId || "",
      category: img.category as typeof formData.category,
      featured: img.featured ?? false,
      published: img.published !== false,
      order: img.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      showToast("Title and Image Photograph are required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingImage
        ? `/api/admin/gallery/${editingImage._id}`
        : "/api/admin/gallery";
      const method = editingImage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save image");
      }

      showToast(editingImage ? "Photograph updated" : "Photograph added to gallery", "success");
      setIsModalOpen(false);
      loadImages();
    } catch (err) {
      console.error("Save error:", err);
      showToast(err instanceof Error ? err.message : "Error saving photograph", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete image");
      }
      showToast("Photograph removed from gallery", "success");
      setDeleteConfirmId(null);
      loadImages();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete photograph", "error");
    }
  };

  const togglePublished = async (img: IGalleryImage) => {
    try {
      await fetch(`/api/admin/gallery/${img._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: img.published === false ? true : false }),
      });
      showToast("Visibility updated");
      loadImages();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Visual Assets & Curation
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Interior & Exterior Gallery
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            Organize high-resolution spatial photographs across architectural categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Upload Photograph</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-4">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors border ${
              selectedFilter === cat.id
                ? "bg-amber-400 text-stone-950 border-amber-400 font-bold"
                : "bg-stone-950 text-stone-400 border-stone-800 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="bg-stone-950 border border-stone-800 overflow-hidden flex flex-col justify-between group hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="relative aspect-[4/3] bg-stone-900 w-full">
                  <Image
                    src={img.imageUrl}
                    alt={img.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 bg-black/80 text-[10px] uppercase font-mono text-amber-400 border border-stone-800">
                      {img.category}
                    </span>
                    {img.published === false && (
                      <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 text-[10px] font-mono">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="text-sm font-medium text-stone-100 truncate">
                    {img.title}
                  </h4>
                  {img.description && (
                    <p className="text-xs text-stone-400 font-light line-clamp-2">
                      {img.description}
                    </p>
                  )}
                  <span className="text-[10px] text-stone-500 font-mono block">
                    Order Index: {img.order || 0}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-stone-900 border-t border-stone-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => togglePublished(img)}
                  className={`text-xs font-mono flex items-center space-x-1 ${
                    img.published !== false ? "text-emerald-400" : "text-stone-500"
                  }`}
                  title="Toggle Visibility"
                >
                  {img.published !== false ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(img)}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(img._id || "")}
                    className="p-1 text-rose-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-stone-950 border border-stone-800 p-12 text-center">
          <p className="text-xs text-stone-500 font-mono">
            No gallery photographs in this category. Click &ldquo;Upload Photograph&rdquo; to add images.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-light text-stone-100">
              Delete Photograph
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Are you sure you want to remove this photograph from the gallery?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 max-w-lg w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-light text-stone-100">
                {editingImage ? "Edit Photograph Details" : "Upload New Photograph"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g. Minimalist Master Bedroom Joinery"
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as typeof formData.category,
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="living">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="commercial">Commercial</option>
                    <option value="other">Other</option>
                    <option value="construction">Civil / Structural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Sort Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                  Description / Material Highlights
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Fluted oak paneling, warm ambient cove illumination, acoustic fabric..."
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <ImageUploadField
                label="Photograph Asset *"
                value={formData.imageUrl}
                folder="gallery"
                onChange={(url, publicId) =>
                  setFormData({
                    ...formData,
                    imageUrl: url,
                    publicId: publicId || "",
                  })
                }
              />

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs uppercase font-mono text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="rounded-none border-stone-800"
                  />
                  <span>Published to Gallery</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-800 text-stone-300 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs uppercase tracking-widest flex items-center disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingImage ? "Update" : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
