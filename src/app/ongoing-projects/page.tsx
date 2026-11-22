import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Activity, Clock, ShieldCheck, FolderOpen } from "lucide-react";
import { getProjects } from "@/lib/data-fetchers";
import { OngoingProjectCard } from "@/components/projects/OngoingProjectCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ongoing Interior & Construction Projects | Live Site Tracker",
  description:
    "Track active turnkey interior design fit-outs and residential construction projects currently under execution by Rajshila Construction in Bhopal.",
};

export default async function OngoingProjectsPage() {
  const ongoingProjects = await getProjects({ status: "ongoing" });

  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24 min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-stone-900 border border-stone-800 text-amber-400 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Real-time On-site Execution</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            Active Sites. <br />
            <span className="font-serif-luxury italic text-stone-300">
              Transparent Progress Tracking.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-400 font-light leading-relaxed">
            At Rajshila Construction, transparency is not an afterthought. Here we document active interior fit-outs and civil construction sites across Bhopal, detailing milestone completions, execution percentages, and latest on-site advancements.
          </p>
        </div>

        {/* Accountability Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-stone-800">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-stone-900 text-amber-400 border border-stone-800 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-200">
                Weekly Audit Milestones
              </h4>
              <p className="text-xs text-stone-400 mt-0.5 font-light">
                Progress bars updated according to physical site audits.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-stone-900 text-amber-400 border border-stone-800 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-200">
                Target Date Discipline
              </h4>
              <p className="text-xs text-stone-400 mt-0.5 font-light">
                Agreed project duration maintained with rigorous oversight.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-stone-900 text-amber-400 border border-stone-800 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-200">
                Verified Material Staging
              </h4>
              <p className="text-xs text-stone-400 mt-0.5 font-light">
                Authentic branded timber, fixtures, and structural cement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {ongoingProjects.length > 0 ? (
          ongoingProjects.map((project) => (
            <OngoingProjectCard key={project.slug} project={project} />
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-stone-800 bg-stone-900/40 p-12 max-w-xl mx-auto">
            <FolderOpen className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="text-lg font-light text-stone-200 mb-2">
              No Active Sites Listed
            </h3>
            <p className="text-xs text-stone-500 mb-6 font-mono">
              Active projects will appear here as ongoing site contracts are initiated and logged.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-xs uppercase tracking-wider text-amber-400 border-b border-amber-400 pb-0.5"
            >
              Consult Us for Your Upcoming Project
            </Link>
          </div>
        )}
      </section>

      {/* Bottom Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-stone-900 border border-stone-800 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-stone-100">
              Planning a New Construction or Turnkey Interior?
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-light">
              Receive a transparent timeline schedule and structural milestone breakdown.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs tracking-widest uppercase font-medium transition-colors shrink-0"
          >
            Start Project Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
