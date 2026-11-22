"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { IService } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    deliverables: [] as string[],
    newDeliverableInput: "",
    icon: "Home",
    coverImage: "",
    coverImagePublicId: "",
    order: 0,
    published: true,
  });

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const json = await res.json();
      if (res.ok && json.success) {
        setServices(json.data);
      }
    } catch (err) {
      console.error("Error loading services:", err);
      showToast("Failed to load services", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success) {
          setServices(json.data);
        }
      })
      .catch((err) => {
        console.error("Error loading services:", err);
        if (isMounted) showToast("Failed to load services", "error");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      deliverables: [
        "Soil bearing capacity testing & foundation engineering",
        "Grade M25/M30 certified concrete casting",
        "Itemized BOQ with documented milestones",
      ],
      newDeliverableInput: "",
      icon: "Home",
      coverImage: "",
      coverImagePublicId: "",
      order: services.length,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: IService) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription || "",
      deliverables: s.deliverables || [],
      newDeliverableInput: "",
      icon: s.icon || "Home",
      coverImage: s.coverImage || "",
      coverImagePublicId: s.coverImagePublicId || "",
      order: s.order || 0,
      published: s.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleAddDeliverable = () => {
    if (!formData.newDeliverableInput.trim()) return;
    setFormData({
      ...formData,
      deliverables: [...formData.deliverables, formData.newDeliverableInput.trim()],
      newDeliverableInput: "",
    });
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription) {
      showToast("Service title and short description are required.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save service");
      }

      showToast(editingService ? "Service updated" : "Service created successfully", "success");
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      console.error("Save service error:", err);
      showToast(err instanceof Error ? err.message : "Error saving service", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete service");
      }
      showToast("Service deleted", "success");
      setDeleteConfirmId(null);
      loadServices();
    } catch (err) {
      console.error("Delete service error:", err);
      showToast("Failed to delete service", "error");
    }
  };

  const togglePublished = async (s: IService) => {
    try {
      await fetch(`/api/admin/services/${s._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: s.published === false ? true : false }),
      });
      showToast("Service visibility updated");
      loadServices();
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
            Capabilities & Offerings
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Services Management
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            Create, edit, or configure civil construction and turnkey interior services.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Service</span>
        </button>
      </div>

      {/* Services Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : services.length > 0 ? (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-900 border-b border-stone-800 text-[11px] font-mono uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Short Description</th>
                <th className="py-3.5 px-4">Deliverables</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {services.map((s) => (
                <tr key={s._id} className="hover:bg-stone-900/40">
                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    #{s.order || 0}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-stone-100 block">
                      {s.title}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      /{s.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-stone-400 font-light truncate">
                    {s.shortDescription}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-stone-400 text-[11px]">
                    {s.deliverables?.length || 0} items
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => togglePublished(s)}
                      className={`text-xs font-mono inline-flex items-center space-x-1 ${
                        s.published !== false ? "text-emerald-400" : "text-stone-500"
                      }`}
                    >
                      {s.published !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-stone-400 hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(s._id || "")}
                        className="p-1.5 text-rose-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-stone-950 border border-stone-800 p-12 text-center">
          <p className="text-xs text-stone-500 font-mono">
            No services configured in database. Click &ldquo;New Service&rdquo; to add offerings.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-light text-stone-100">
              Confirm Delete Service
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Are you sure you want to remove this service from Rajshila Construction?
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

      {/* Create / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-light text-stone-100">
                {editingService ? "Edit Service" : "Add Service"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Turnkey Interior Architecture"
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Order Index
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
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  required
                  placeholder="Summary for cards and homepage overview..."
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                  Full Technical Scope Description
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, fullDescription: e.target.value })
                  }
                  placeholder="Detailed specifications, structural codes, material grades..."
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Deliverables List */}
              <div className="bg-stone-900 p-4 border border-stone-800 space-y-3">
                <label className="block text-xs uppercase tracking-wider text-amber-400 font-mono">
                  Verified Technical Deliverables ({formData.deliverables.length})
                </label>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.newDeliverableInput}
                    onChange={(e) =>
                      setFormData({ ...formData, newDeliverableInput: e.target.value })
                    }
                    placeholder="e.g. M30 certified RMC concrete casting"
                    className="flex-1 bg-stone-950 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs uppercase font-mono"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {formData.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-stone-950 px-3 py-1.5 border border-stone-800 text-xs text-stone-300"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-stone-500 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <ImageUploadField
                label="Service Showcase Photograph"
                value={formData.coverImage}
                folder="services"
                onChange={(url, publicId) =>
                  setFormData({
                    ...formData,
                    coverImage: url,
                    coverImagePublicId: publicId || "",
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
                  <span>Published on Public Website</span>
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
                  {isSaving ? "Saving..." : editingService ? "Update Service" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
