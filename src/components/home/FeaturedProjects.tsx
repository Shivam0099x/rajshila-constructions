import React from "react";
import Link from "next/link";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { IProject } from "@/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface FeaturedProjectsProps {
  projects: IProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <section className="py-24 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeader
            eyebrow="Portfolio & Delivery"
            title="Featured Completed Projects"
            description="Explore selected residences and commercial spaces crafted with architectural fidelity, calculated timeline tracking, and superior material standards."
            dark
            className="mb-0 max-w-2xl"
          />

          <div className="mt-6 md:mt-0">
            <Link
              href="/projects"
              className="inline-flex items-center text-xs tracking-widest uppercase text-amber-400 hover:text-white transition-colors border-b border-amber-400/60 pb-1"
            >
              <span>Explore All Projects</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Project Grid or Empty State */}
        {completedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-stone-800 bg-stone-900/40 p-12">
            <FolderOpen className="w-10 h-10 text-stone-600 mx-auto mb-4" />
            <h3 className="text-lg font-light text-stone-300 mb-2">
              No Completed Projects Displayed Yet
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
              Projects will appear here once published from the Rajshila Construction database.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-xs uppercase tracking-wider text-amber-400 border-b border-amber-400 pb-0.5"
            >
              Contact Us for Custom Portfolios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
