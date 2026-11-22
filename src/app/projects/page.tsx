import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import { getProjects } from "@/lib/data-fetchers";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PROJECT_CATEGORIES } from "@/constants/demo-data";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Completed Projects | Architecture & Turnkey Interiors Portfolio",
  description:
    "Explore completed residential construction, civil architecture, and luxury interior projects executed by Rajshila Construction in Bhopal, MP.",
};

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentCategory = resolvedSearchParams?.category || "all";

  const allProjects = await getProjects({
    status: "completed",
    category: currentCategory !== "all" ? currentCategory : undefined,
  });

  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24 min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-mono block mb-3">
            Execution Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            Completed Works. <br />
            <span className="font-serif-luxury italic text-stone-300">
              Delivered with Precision.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-400 font-light leading-relaxed">
            A showcase of completed residential villas, interior fit-outs, and commercial spaces. Every project features transparent milestone verification and calculated delivery tracking.
          </p>
        </div>
      </section>

      {/* Category Filter Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-4">
          {PROJECT_CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/projects" : `/projects?category=${cat.id}`}
                className={cn(
                  "px-4 py-2 text-xs uppercase tracking-widest transition-colors font-medium border",
                  isActive
                    ? "bg-[#B58D54] text-stone-950 border-[#B58D54]"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white hover:border-stone-700"
                )}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-stone-800 bg-stone-900/40 p-12 max-w-xl mx-auto">
            <FolderOpen className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="text-lg font-light text-stone-200 mb-2">
              No Projects Found in this Category
            </h3>
            <p className="text-xs text-stone-500 mb-6 font-mono">
              Either no projects have been tagged with this category or they are currently pending publication.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center text-xs uppercase tracking-wider text-amber-400 border-b border-amber-400 pb-0.5"
            >
              Reset Category Filters
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
