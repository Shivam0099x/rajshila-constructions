"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Activity,
  Inbox,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { DashboardStats } from "@/types";
import { formatDate } from "@/lib/project-utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load dashboard metrics");
        }
        setStats(json.stats);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err instanceof Error ? err.message : "Error loading dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-4" />
        <span className="text-xs text-stone-400 font-mono">
          Querying MongoDB Live Database Metrics...
        </span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 bg-rose-950/40 border border-rose-900 text-rose-300 max-w-xl mx-auto">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">Failed to Connect to Database</h3>
            <p className="text-xs mt-1 text-rose-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Welcome & Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Rajshila Construction Central Management
          </span>
          <h2 className="text-2xl font-light text-stone-100">
            Operational Overview & Analytics
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs uppercase tracking-wider font-medium transition-colors"
          >
            + New Project
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs uppercase tracking-wider transition-colors"
          >
            Enquiries ({stats.newEnquiriesCount} New)
          </Link>
        </div>
      </div>

      {/* 4-Box Key Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Completed Projects */}
        <div className="bg-stone-950 border border-stone-800 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">
              Completed Projects
            </span>
            <div className="p-2 bg-stone-900 text-amber-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-light text-stone-100 font-mono">
              {stats.totalCompletedProjects}
            </span>
            <span className="block text-[11px] text-stone-500 mt-1">
              Finished residential & commercial sites
            </span>
          </div>
        </div>

        {/* Metric 2: Ongoing Sites */}
        <div className="bg-stone-950 border border-stone-800 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">
              Active Ongoing Sites
            </span>
            <div className="p-2 bg-stone-900 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-light text-amber-400 font-mono">
              {stats.totalOngoingProjects}
            </span>
            <span className="block text-[11px] text-stone-500 mt-1">
              Currently under civil / interior execution
            </span>
          </div>
        </div>

        {/* Metric 3: Delivery Fidelity Rate */}
        <div className="bg-stone-950 border border-stone-800 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">
              On-Time Delivery Rate
            </span>
            <div className="p-2 bg-stone-900 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-light text-emerald-400 font-mono">
              {stats.onTimeDeliveryPercentage}%
            </span>
            <span className="block text-[11px] text-stone-500 mt-1">
              {stats.earlyDeliveryCount} early • {stats.onTimeDeliveryCount} on time • {stats.delayedDeliveryCount} delayed
            </span>
          </div>
        </div>

        {/* Metric 4: Total Enquiries */}
        <div className="bg-stone-950 border border-stone-800 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">
              Total Enquiries
            </span>
            <div className="p-2 bg-stone-900 text-amber-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-light text-stone-100 font-mono">
              {stats.totalEnquiries}
            </span>
            <span className="block text-[11px] text-stone-500 mt-1">
              {stats.newEnquiriesCount} awaiting review
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Projects & Latest Customer Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Projects (7 cols) */}
        <div className="lg:col-span-7 bg-stone-950 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
            <h3 className="text-base font-light text-stone-100">
              Recently Logged Projects
            </h3>
            <Link
              href="/admin/projects"
              className="text-xs uppercase tracking-wider text-amber-400 hover:text-white font-mono flex items-center"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {stats.recentProjects.length > 0 ? (
            <div className="divide-y divide-stone-800/80">
              {stats.recentProjects.map((p) => (
                <div
                  key={p.slug}
                  className="py-3.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="text-sm font-medium text-stone-200">
                      {p.title}
                    </h4>
                    <div className="flex items-center text-stone-500 mt-0.5 space-x-3 font-mono">
                      <span className="capitalize text-amber-400/90">{p.category}</span>
                      <span>•</span>
                      <span>{p.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                        p.status === "completed"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                          : "bg-amber-950/80 text-amber-400 border border-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="block text-[10px] text-stone-500 font-mono mt-1">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 font-mono py-8 text-center">
              No projects recorded in database yet.
            </p>
          )}
        </div>

        {/* Right Column: Latest Enquiries (5 cols) */}
        <div className="lg:col-span-5 bg-stone-950 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
            <h3 className="text-base font-light text-stone-100">
              Latest Enquiries
            </h3>
            <Link
              href="/admin/enquiries"
              className="text-xs uppercase tracking-wider text-amber-400 hover:text-white font-mono flex items-center"
            >
              <span>Inbox ({stats.newEnquiriesCount})</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {stats.latestEnquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.latestEnquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="p-3 bg-stone-900 border border-stone-800/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-stone-200">
                      {enq.name}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] uppercase font-mono ${
                        enq.status === "new"
                          ? "bg-amber-400 text-stone-950 font-bold"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-stone-400 font-light line-clamp-2 leading-relaxed mb-2">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-1 border-t border-stone-800">
                    <span>{enq.phone}</span>
                    <span>{formatDate(enq.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 font-mono py-8 text-center">
              No contact enquiries received yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
