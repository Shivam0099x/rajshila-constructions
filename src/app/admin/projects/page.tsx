"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { IProject, DeliveryStatus } from "@/types";
import {
  calculateDuration,
  calculateDeliveryStatus,
  formatDate,
} from "@/lib/project-utils";
import { ImageUploadField, MultiImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/ToastContext";

type ProjectCategory = "residential" | "interior" | "commercial" | "renovation";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    category: ProjectCategory;
    location: string;
    coverImage: string;
    coverImagePublicId: string;
    images: string[];
    imagesPublicIds: string[];
    startDate: string;
    expectedCompletionDate: string;
    actualCompletionDate: string;
    status: "completed";
    featured: boolean;
    published: boolean;
  }>({
    title: "",
    slug: "",
    description: "",
    category: "residential",
    location: "Bhopal, Madhya Pradesh",
    coverImage: "",
    coverImagePublicId: "",
    images: [],
    imagesPublicIds: [],
    startDate: "",
    expectedCompletionDate: "",
    actualCompletionDate: "",
    status: "completed",
    featured: false,
    published: true,
  });

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/projects?status=completed");
      const json = await res.json();
      if (res.ok && json.success) {
        setProjects(json.data);
      }
    } catch (err) {
      console.error("Error loading completed projects:", err);
      showToast("Failed to load projects", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/projects?status=completed")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success) {
          setProjects(json.data);
        }
      })
      .catch((err) => {
        console.error("Error loading completed projects:", err);
        if (isMounted) showToast("Failed to load projects", "error");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      category: "residential",
      location: "Bhopal, Madhya Pradesh",
      coverImage: "",
      coverImagePublicId: "",
      images: [],
      imagesPublicIds: [],
      startDate: new Date().toISOString().split("T")[0],
      expectedCompletionDate: new Date(Date.now() + 180 * 24 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      actualCompletionDate: new Date().toISOString().split("T")[0],
      status: "completed",
      featured: false,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: IProject) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category as ProjectCategory,
      location: p.location,
      coverImage: p.coverImage,
      coverImagePublicId: p.coverImagePublicId || "",
      images: p.images || [],
      imagesPublicIds: p.imagesPublicIds || [],
      startDate: p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : "",
      expectedCompletionDate: p.expectedCompletionDate
        ? new Date(p.expectedCompletionDate).toISOString().split("T")[0]
        : "",
      actualCompletionDate: p.actualCompletionDate
        ? new Date(p.actualCompletionDate).toISOString().split("T")[0]
        : "",
      status: "completed",
      featured: p.featured,
      published: p.published,
    });
    setIsModalOpen(true);
  };

  // Mandatory Timeline Calculations
  const timelineMetrics = useMemo(() => {
    if (!formData.startDate || !formData.expectedCompletionDate) {
      return null;
    }

    const agreed = calculateDuration(formData.startDate, formData.expectedCompletionDate);
    const actual = formData.actualCompletionDate
      ? calculateDuration(formData.startDate, formData.actualCompletionDate)
      : "Pending Actual Date";

    const deliveryStatus: DeliveryStatus = formData.actualCompletionDate
      ? calculateDeliveryStatus(formData.expectedCompletionDate, formData.actualCompletionDate)
      : "On Time";

    const expTime = new Date(formData.expectedCompletionDate).getTime();
    const actTime = formData.actualCompletionDate
      ? new Date(formData.actualCompletionDate).getTime()
      : expTime;
    const diffDays = Math.round((expTime - actTime) / (1000 * 3600 * 24));

    let diffText = "Exactly on Schedule";
    if (diffDays > 0) {
      diffText = `Handed over ${diffDays} days Ahead of Schedule (Early)`;
    } else if (diffDays < 0) {
      diffText = `Completed ${Math.abs(diffDays)} days Past Contract Target (Delayed)`;
    }

    return {
      agreedDuration: agreed,
      actualDuration: actual,
      deliveryStatus,
      differenceText: diffText,
      diffDays,
    };
  }, [formData.startDate, formData.expectedCompletionDate, formData.actualCompletionDate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.coverImage || !formData.description) {
      showToast("Please fill in title, description and cover image.", "error");
      return;
    }

    if (!formData.startDate || !formData.expectedCompletionDate || !formData.actualCompletionDate) {
      showToast(
        "Mandatory Timeline Error: Start Date, Agreed Expected Date, and Actual Handover Date are required for completed projects.",
        "error"
      );
      return;
    }

    setIsSaving(true);

    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject._id}`
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save project");
      }

      showToast(
        editingProject ? "Project updated successfully" : "Project published successfully",
        "success"
      );
      setIsModalOpen(false);
      setIsLoading(true);
      loadProjects();
    } catch (err) {
      console.error("Save project error:", err);
      showToast(err instanceof Error ? err.message : "Error saving project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete project");
      }
      showToast("Project removed permanently", "success");
      setDeleteConfirmId(null);
      setIsLoading(true);
      loadProjects();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete project", "error");
    }
  };

  const toggleFeatured = async (p: IProject) => {
    try {
      await fetch(`/api/admin/projects/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      showToast(`Project ${!p.featured ? "marked as featured" : "unmarked from featured"}`);
      loadProjects();
    } catch (err) {
      console.error("Toggle featured error:", err);
    }
  };

  const togglePublished = async (p: IProject) => {
    try {
      await fetch(`/api/admin/projects/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !p.published }),
      });
      showToast(`Project ${!p.published ? "published" : "hidden"}`);
      loadProjects();
    } catch (err) {
      console.error("Toggle published error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Execution Records
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Completed Projects Portfolio
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            All finished projects require audited start, expected, and actual completion dates.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Completed Project</span>
        </button>
      </div>

      {/* Projects Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : projects.length > 0 ? (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-900 border-b border-stone-800 text-[11px] font-mono uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Timeline / Handover</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {projects.map((p) => {
                const delivery =
                  p.actualCompletionDate && p.expectedCompletionDate
                    ? calculateDeliveryStatus(p.expectedCompletionDate, p.actualCompletionDate)
                    : null;

                const durationStr =
                  p.actualCompletionDate && p.startDate
                    ? calculateDuration(p.startDate, p.actualCompletionDate)
                    : "N/A";

                return (
                  <tr key={p._id || p.slug} className="hover:bg-stone-900/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-9 bg-stone-900 shrink-0 border border-stone-800 overflow-hidden">
                          <Image
                            src={p.coverImage}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-stone-100 block">
                            {p.title}
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {p.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono capitalize text-stone-400">
                      {p.category}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="block text-stone-200">
                        {formatDate(p.actualCompletionDate || p.expectedCompletionDate, true)}
                      </span>
                      <span className="text-stone-500 block">
                        Duration: {durationStr}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {delivery ? (
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                            delivery === "Early"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : delivery === "Delayed"
                              ? "bg-amber-950 text-amber-400 border border-amber-800"
                              : "bg-stone-900 text-stone-300 border border-stone-700"
                          }`}
                        >
                          {delivery}
                        </span>
                      ) : (
                        <span className="text-stone-600 font-mono text-[11px]">
                          Pending Audit
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p)}
                        className={`p-1.5 transition-colors ${
                          p.featured
                            ? "text-amber-400 hover:text-amber-300"
                            : "text-stone-600 hover:text-stone-400"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${p.featured ? "fill-amber-400" : ""}`} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => togglePublished(p)}
                        className={`inline-flex items-center text-[11px] font-mono px-2 py-0.5 border ${
                          p.published
                            ? "text-emerald-400 border-emerald-900/60 bg-emerald-950/40"
                            : "text-stone-500 border-stone-800 bg-stone-900"
                        }`}
                      >
                        {p.published ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-400 hover:text-white"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p._id || "")}
                          className="p-1.5 text-rose-500 hover:text-rose-400"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-stone-950 border border-stone-800 p-12 text-center">
          <p className="text-xs text-stone-500 font-mono">
            No completed projects found in database. Click &ldquo;New Completed Project&rdquo; to create your first record.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-light text-stone-100">
              Confirm Permanent Deletion
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Are you sure you want to permanently delete this project? Associated photographs will also be cleaned up from storage.
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

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-light text-stone-100">
                {editingProject ? "Edit Completed Project" : "Add Completed Project"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. The Stone & Glass Villa"
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="residential">Residential Construction</option>
                    <option value="interior">Bespoke Interiors</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="renovation">Structural Renovation</option>
                  </select>
                </div>
              </div>

              {/* Location & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Location in Bhopal *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g. Arera Colony, Bhopal, MP"
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-if-blank"
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                  Architectural Concept & Civil Scope Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Detail the built-up area, foundation techniques, structural framing, and turnkey materials used..."
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* MANDATORY TIMELINE AUDIT SECTION */}
              <div className="bg-stone-900/90 border border-stone-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-xs uppercase tracking-widest text-amber-400 font-mono flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Mandatory Project Timeline & Delivery Verification
                  </h4>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Audit Certified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-mono mb-1">
                      Project Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="w-full bg-stone-950 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-mono mb-1">
                      Agreed Target Date *
                    </label>
                    <input
                      type="date"
                      value={formData.expectedCompletionDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expectedCompletionDate: e.target.value })
                      }
                      required
                      className="w-full bg-stone-950 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-mono mb-1">
                      Actual Handover Date *
                    </label>
                    <input
                      type="date"
                      value={formData.actualCompletionDate}
                      onChange={(e) =>
                        setFormData({ ...formData, actualCompletionDate: e.target.value })
                      }
                      required
                      className="w-full bg-stone-950 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Read-Only Automatic Calculations */}
                {timelineMetrics && (
                  <div className="bg-stone-950 border border-stone-800 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-stone-500 block">Agreed Duration:</span>
                      <span className="text-stone-200 font-medium">
                        {timelineMetrics.agreedDuration}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Actual Duration:</span>
                      <span className="text-stone-200 font-medium">
                        {timelineMetrics.actualDuration}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Delivery Status:</span>
                      <span
                        className={`font-bold ${
                          timelineMetrics.deliveryStatus === "Early"
                            ? "text-emerald-400"
                            : timelineMetrics.deliveryStatus === "Delayed"
                            ? "text-amber-400"
                            : "text-stone-200"
                        }`}
                      >
                        {timelineMetrics.deliveryStatus} ({timelineMetrics.differenceText})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <ImageUploadField
                label="Cover Photograph *"
                value={formData.coverImage}
                folder="projects"
                onChange={(url, publicId) =>
                  setFormData({
                    ...formData,
                    coverImage: url,
                    coverImagePublicId: publicId || "",
                  })
                }
                helperText="Primary architectural showcase image displayed in portfolios."
              />

              {/* Multi Gallery Images */}
              <MultiImageUploadField
                label="Project Photographic Gallery"
                images={formData.images}
                publicIds={formData.imagesPublicIds}
                folder="projects"
                onChange={(images, publicIds) =>
                  setFormData({
                    ...formData,
                    images,
                    imagesPublicIds: publicIds || [],
                  })
                }
              />

              {/* Featured & Published */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs uppercase font-mono text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded-none border-stone-800"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center space-x-2 text-xs uppercase font-mono text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded-none border-stone-800"
                  />
                  <span>Publish to Public Website</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs uppercase tracking-widest flex items-center disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProject ? "Update Project" : "Publish Project"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
