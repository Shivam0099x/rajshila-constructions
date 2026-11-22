"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  CheckCheck,
  Loader2,
  X,
  MapPin,
} from "lucide-react";
import { IProject, ProjectMilestone } from "@/types";
import {
  calculateDuration,
  calculateDeliveryStatus,
  formatDate,
} from "@/lib/project-utils";
import { ImageUploadField, MultiImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/ToastContext";

type ProjectCategory = "residential" | "interior" | "commercial" | "renovation";

export default function AdminOngoingProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [completeModalProject, setCompleteModalProject] = useState<IProject | null>(null);
  const [actualCompletionDateInput, setActualCompletionDateInput] = useState(
    new Date().toISOString().split("T")[0]
  );
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
    status: "ongoing";
    progressPercentage: number;
    latestUpdate: string;
    milestones: ProjectMilestone[];
    featured: boolean;
    published: boolean;
  }>({
    title: "",
    slug: "",
    description: "",
    category: "interior",
    location: "Ayodhya Bypass, Bhopal, MP",
    coverImage: "",
    coverImagePublicId: "",
    images: [],
    imagesPublicIds: [],
    startDate: "",
    expectedCompletionDate: "",
    status: "ongoing",
    progressPercentage: 45,
    latestUpdate: "",
    milestones: [],
    featured: false,
    published: true,
  });

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/projects?status=ongoing");
      const json = await res.json();
      if (res.ok && json.success) {
        setProjects(json.data);
      }
    } catch (err) {
      console.error("Error loading ongoing projects:", err);
      showToast("Failed to load ongoing projects", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/projects?status=ongoing")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success) {
          setProjects(json.data);
        }
      })
      .catch((err) => {
        console.error("Error loading ongoing projects:", err);
        if (isMounted) showToast("Failed to load ongoing projects", "error");
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
      category: "interior",
      location: "Bhopal, Madhya Pradesh",
      coverImage: "",
      coverImagePublicId: "",
      images: [],
      imagesPublicIds: [],
      startDate: new Date().toISOString().split("T")[0],
      expectedCompletionDate: new Date(Date.now() + 90 * 24 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      status: "ongoing",
      progressPercentage: 20,
      latestUpdate: "Site mobilization and initial civil survey completed.",
      milestones: [
        { title: "Civil Alterations & Demolition", isCompleted: true },
        { title: "Electrical & Plumbing Rough-in", isCompleted: false },
        { title: "False Ceiling & Drywall Framing", isCompleted: false },
        { title: "Modular Woodwork & Carpentry", isCompleted: false },
        { title: "Surfacing, Fixtures & Client Handover", isCompleted: false },
      ],
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
      status: "ongoing",
      progressPercentage: p.progressPercentage || 0,
      latestUpdate: p.latestUpdate || "",
      milestones: p.milestones || [],
      featured: p.featured,
      published: p.published,
    });
    setIsModalOpen(true);
  };

  const handleAddMilestone = () => {
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        { title: "New Milestone", isCompleted: false },
      ],
    });
  };

  const handleUpdateMilestone = (
    index: number,
    field: keyof ProjectMilestone,
    value: string | boolean
  ) => {
    const updated = [...formData.milestones];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, milestones: updated });
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.coverImage || !formData.description) {
      showToast("Please fill in title, description and cover image.", "error");
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
        editingProject ? "Ongoing site updated" : "Ongoing site created successfully",
        "success"
      );
      setIsModalOpen(false);
      setIsLoading(true);
      loadProjects();
    } catch (err) {
      console.error("Save error:", err);
      showToast(err instanceof Error ? err.message : "Error saving project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!completeModalProject || !actualCompletionDateInput) {
      showToast("Please provide the actual handover date.", "error");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${completeModalProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          actualCompletionDate: actualCompletionDateInput,
          progressPercentage: 100,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to transition project to completed");
      }

      showToast(
        `"${completeModalProject.title}" has been marked Completed and moved to Completed Projects portfolio!`,
        "success"
      );
      setCompleteModalProject(null);
      setIsLoading(true);
      loadProjects();
    } catch (err) {
      console.error("Transition error:", err);
      showToast(err instanceof Error ? err.message : "Failed to mark completed", "error");
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
      showToast("Project deleted", "success");
      setDeleteConfirmId(null);
      setIsLoading(true);
      loadProjects();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete project", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Live Site Execution
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Ongoing Projects Management
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            Track active turnkey fit-outs, milestone checklists, and progress percentages in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Ongoing Project</span>
        </button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const agreedDuration = calculateDuration(p.startDate, p.expectedCompletionDate);
            const progress = p.progressPercentage || 0;

            return (
              <div
                key={p._id || p.slug}
                className="bg-stone-950 border border-stone-800 flex flex-col justify-between overflow-hidden group hover:border-stone-700 transition-colors"
              >
                <div>
                  {/* Visual & Badges */}
                  <div className="relative aspect-[16/9] w-full bg-stone-900">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="inline-flex items-center text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-400 text-stone-950 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-pulse mr-1" />
                        In Progress
                      </span>
                      <span className="inline-block text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-900/90 text-stone-300 border border-stone-700">
                        {p.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 text-[11px] font-mono text-amber-300">
                      Target: {formatDate(p.expectedCompletionDate)}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-light text-stone-100">
                        {p.title}
                      </h3>
                      <div className="flex items-center text-stone-400 text-xs font-mono mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
                        <span>{p.location}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-stone-900 p-3 border border-stone-800/80">
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-stone-300">Execution Progress</span>
                        <span className="text-amber-400 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-800">
                        <div
                          className="h-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {p.latestUpdate && (
                        <p className="text-[11px] text-stone-400 font-light mt-2 line-clamp-1 border-t border-stone-800 pt-1.5">
                          <span className="text-stone-300 font-mono">Latest: </span>
                          {p.latestUpdate}
                        </p>
                      )}
                    </div>

                    {/* Milestones count */}
                    <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                      <span>
                        Milestones:{" "}
                        {p.milestones?.filter((m) => m.isCompleted).length || 0} /{" "}
                        {p.milestones?.length || 0} done
                      </span>
                      <span>Agreed: {agreedDuration}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCompleteModalProject(p)}
                    className="inline-flex items-center px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] uppercase tracking-wider font-mono cursor-pointer transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    <span>Mark Completed</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-stone-400 hover:text-white"
                      title="Edit Ongoing Project"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(p._id || "")}
                      className="p-1.5 text-rose-500 hover:text-rose-400"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-stone-950 border border-stone-800 p-12 text-center">
          <p className="text-xs text-stone-500 font-mono">
            No active ongoing projects recorded. Click &ldquo;New Ongoing Project&rdquo; to begin tracking a live site.
          </p>
        </div>
      )}

      {/* Conversion to Completed Modal */}
      {completeModalProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 p-6 sm:p-8 max-w-md w-full space-y-6">
            <div className="border-b border-stone-800 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono">
                Milestone Finalization
              </span>
              <h3 className="text-lg font-light text-stone-100 mt-1">
                Mark &ldquo;{completeModalProject.title}&rdquo; as Completed
              </h3>
            </div>

            <p className="text-xs text-stone-300 font-light leading-relaxed">
              This action transitions the project to the <strong>Completed Projects</strong> portfolio. The original start date and agreed contract target date are preserved to calculate final delivery fidelity.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                Actual Handover Date *
              </label>
              <input
                type="date"
                value={actualCompletionDateInput}
                onChange={(e) => setActualCompletionDateInput(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Delivery Preview */}
            {actualCompletionDateInput && completeModalProject.expectedCompletionDate && (
              <div className="p-3 bg-stone-900 text-xs font-mono text-stone-400 border border-stone-800">
                <span className="block text-stone-500">Calculated Final Status:</span>
                <span className="font-bold text-amber-300">
                  {calculateDeliveryStatus(
                    completeModalProject.expectedCompletionDate,
                    actualCompletionDateInput
                  )}{" "}
                  Handover
                </span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCompleteModalProject(null)}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkCompleted}
                disabled={isSaving}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs uppercase font-medium"
              >
                {isSaving ? "Transitioning..." : "Confirm & Move to Completed"}
              </button>
            </div>
          </div>
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
              Are you sure you want to delete this ongoing site record?
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

      {/* Create / Edit Ongoing Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-light text-stone-100">
                {editingProject ? "Edit Ongoing Site" : "Add Ongoing Site"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Site / Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Ayodhya Duplex Turnkey Interior"
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
                    <option value="interior">Bespoke Interiors</option>
                    <option value="residential">Residential Construction</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="renovation">Structural Renovation</option>
                  </select>
                </div>
              </div>

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
                    placeholder="e.g. Ayodhya Bypass, Bhopal, MP"
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Progress Percentage (0 - 100%)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="99"
                      value={formData.progressPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          progressPercentage: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-amber-400"
                    />
                    <span className="font-mono text-xs text-amber-400 font-bold w-12 text-right">
                      {formData.progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Start & Expected Completion Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Commencement Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                    Expected Completion Target *
                  </label>
                  <input
                    type="date"
                    value={formData.expectedCompletionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedCompletionDate: e.target.value })
                    }
                    required
                    className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Latest Update Note */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                  Latest On-Site Progress Update (Displayed Publicly)
                </label>
                <input
                  type="text"
                  value={formData.latestUpdate}
                  onChange={(e) => setFormData({ ...formData, latestUpdate: e.target.value })}
                  placeholder="e.g. Wardrobe carcass installation completed; plumbing pressure test verified."
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-mono mb-1.5">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Scope of active site, floor area, turnkey specifications..."
                  className="w-full bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Milestones Checklist Manager */}
              <div className="bg-stone-900 p-5 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-widest text-amber-400 font-mono">
                    Milestones Checklist ({formData.milestones.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-xs text-amber-400 hover:text-white font-mono uppercase"
                  >
                    + Add Milestone
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 bg-stone-950 p-2.5 border border-stone-800"
                    >
                      <input
                        type="checkbox"
                        checked={m.isCompleted}
                        onChange={(e) =>
                          handleUpdateMilestone(idx, "isCompleted", e.target.checked)
                        }
                        className="rounded-none border-stone-700"
                      />
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) =>
                          handleUpdateMilestone(idx, "title", e.target.value)
                        }
                        placeholder="Milestone title"
                        className="flex-1 bg-transparent border-b border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-stone-500 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
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
              />

              {/* Multi Gallery Images */}
              <MultiImageUploadField
                label="On-site Progress Photographs"
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

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs uppercase font-mono text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded-none border-stone-800"
                  />
                  <span>Publish to Ongoing Sites Page</span>
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
                  {isSaving ? "Saving..." : editingProject ? "Update Site" : "Save Ongoing Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
