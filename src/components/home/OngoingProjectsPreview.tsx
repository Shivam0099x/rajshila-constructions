import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IProject } from "@/types";
import { OngoingProjectCard } from "@/components/projects/OngoingProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface OngoingProjectsPreviewProps {
  projects: IProject[];
}

export function OngoingProjectsPreview({ projects }: OngoingProjectsPreviewProps) {
  const ongoingProjects = projects.filter((p) => p.status === "ongoing");

  if (ongoingProjects.length === 0) {
    return null; // Don't render empty section if none exist
  }

  return (
    <section className="py-24 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeader
            eyebrow="Live Site Execution"
            title="Ongoing Interior & Construction Projects"
            description="Real-time transparency. Monitor active turnkey interior installations and residential projects currently in progress across Bhopal."
            dark
            className="mb-0 max-w-2xl"
          />

          <div className="mt-6 md:mt-0">
            <Link
              href="/ongoing-projects"
              className="inline-flex items-center text-xs tracking-widest uppercase text-amber-400 hover:text-white transition-colors border-b border-amber-400/60 pb-1"
            >
              <span>View All Ongoing Sites</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {ongoingProjects.slice(0, 2).map((project) => (
            <OngoingProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
