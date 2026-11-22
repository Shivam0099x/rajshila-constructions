"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Phone,
  MessageSquare,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { IContactEnquiry } from "@/types";
import { formatDate } from "@/lib/project-utils";
import { useToast } from "@/components/admin/ToastContext";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<IContactEnquiry[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<IContactEnquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const url =
        selectedStatus !== "all"
          ? `/api/admin/enquiries?status=${selectedStatus}`
          : "/api/admin/enquiries";
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success) {
        setEnquiries(json.data);
      }
    } catch (err) {
      console.error("Error loading enquiries:", err);
      showToast("Failed to load enquiries", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, showToast]);

  useEffect(() => {
    let isMounted = true;
    const url =
      selectedStatus !== "all"
        ? `/api/admin/enquiries?status=${selectedStatus}`
        : "/api/admin/enquiries";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success) {
          setEnquiries(json.data);
        }
      })
      .catch((err) => {
        console.error("Error loading enquiries:", err);
        if (isMounted) showToast("Failed to load enquiries", "error");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedStatus, showToast]);

  const handleUpdateStatus = async (
    id: string,
    status: IContactEnquiry["status"],
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update status");
      }
      showToast(`Status updated to "${status}"`, "success");
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(json.data);
      }
      loadEnquiries();
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Failed to update enquiry status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete enquiry");
      }
      showToast("Enquiry deleted", "success");
      setDeleteConfirmId(null);
      if (selectedEnquiry?._id === id) setSelectedEnquiry(null);
      loadEnquiries();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete enquiry", "error");
    }
  };

  const openDetailDrawer = (enq: IContactEnquiry) => {
    setSelectedEnquiry(enq);
    setAdminNotes(enq.notes || "");
  };

  const cleanPhoneForWa = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, "");
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Lead Inquiries
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Contact Enquiries & Project Briefs
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1">
            All prospective client requests submitted through the public website.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-4">
        {["all", "new", "contacted", "resolved", "archived"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors border ${
              selectedStatus === status
                ? "bg-amber-400 text-stone-950 border-amber-400 font-bold"
                : "bg-stone-950 text-stone-400 border-stone-800 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Enquiries Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : enquiries.length > 0 ? (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-900 border-b border-stone-800 text-[11px] font-mono uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Phone / WhatsApp</th>
                <th className="py-3.5 px-4">Project Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {enquiries.map((enq) => {
                const waClean = cleanPhoneForWa(enq.phone);

                return (
                  <tr key={enq._id} className="hover:bg-stone-900/40">
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-100 block">
                        {enq.name}
                      </span>
                      {enq.email && (
                        <span className="text-[11px] text-stone-500 font-mono">
                          {enq.email}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${enq.phone}`}
                          className="hover:text-amber-400 transition-colors"
                        >
                          {enq.phone}
                        </a>
                        <a
                          href={`https://wa.me/${waClean}?text=Hello%20${encodeURIComponent(
                            enq.name
                          )},%20thank%20you%20for%20contacting%20Rajshila%20Construction.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                          title="Message on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-300 font-light">
                      {enq.projectType}
                    </td>

                    <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                      {enq.location || "Bhopal"}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                      {formatDate(enq.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            enq._id || "",
                            e.target.value as IContactEnquiry["status"]
                          )
                        }
                        className={`text-[10px] font-mono uppercase px-2 py-1 bg-stone-900 border ${
                          enq.status === "new"
                            ? "text-amber-400 border-amber-800/80 font-bold"
                            : enq.status === "contacted"
                            ? "text-sky-400 border-sky-800/80"
                            : enq.status === "resolved"
                            ? "text-emerald-400 border-emerald-800/80"
                            : "text-stone-500 border-stone-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => openDetailDrawer(enq)}
                          className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] font-mono border border-stone-800"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(enq._id || "")}
                          className="p-1 text-rose-500 hover:text-rose-400"
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
            No contact enquiries in this filter category.
          </p>
        </div>
      )}

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400">
                  Enquiry Details
                </span>
                <h3 className="text-lg font-light text-stone-100">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-stone-500 hover:text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Actions */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="p-3 bg-stone-900 border border-stone-800 flex items-center justify-center space-x-2 text-stone-200 hover:border-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {selectedEnquiry.phone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanPhoneForWa(selectedEnquiry.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-stone-900 border border-stone-800 flex items-center justify-center space-x-2 text-emerald-400 hover:border-emerald-400 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </a>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-400 uppercase">
                Client Project Requirements & Message:
              </span>
              <div className="bg-stone-900 border border-stone-800 p-4 text-xs text-stone-200 font-light leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-stone-400 uppercase">
                Internal Engineering / Follow-up Notes:
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Spoke with client. Site visit scheduled for Saturday at Ayodhya Bypass..."
                className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedEnquiry._id || "", "contacted", adminNotes)
                  }
                  className="px-3 py-1.5 bg-sky-950 text-sky-300 border border-sky-800 text-xs font-mono uppercase"
                >
                  Mark Contacted
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(selectedEnquiry._id || "", "resolved", adminNotes)
                  }
                  className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono uppercase"
                >
                  Mark Resolved
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    selectedEnquiry._id || "",
                    selectedEnquiry.status,
                    adminNotes
                  )
                }
                className="px-4 py-1.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 font-medium text-xs font-mono uppercase"
              >
                Save Notes
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
              Confirm Delete Enquiry
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Are you sure you want to permanently delete this inquiry record?
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
    </div>
  );
}
