import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { getProjectBySlug, getProjects } from "@/lib/data-fetchers";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { Badge } from "@/components/ui/Badge";
import {
  calculateDeliveryStatus,
  calculateDuration,
  formatDate,
} from "@/lib/project-utils";
import { DEMO_NOTICE } from "@/constants/demo-data";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Rajshila Construction",
    };
  }

  return {
    title: `${project.title} | ${project.location}`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} | Rajshila Construction Bhopal`,
      description: project.description,
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isCompleted = project.status === "completed";
  const deliveryStatus =
    isCompleted && project.actualCompletionDate
      ? calculateDeliveryStatus(
          project.expectedCompletionDate,
          project.actualCompletionDate
        )
      : null;

  const durationStr =
    isCompleted && project.actualCompletionDate
      ? calculateDuration(project.startDate, project.actualCompletionDate)
      : calculateDuration(project.startDate, project.expectedCompletionDate);

  const deliveryBadgeVariant =
    deliveryStatus === "Early"
      ? "success"
      : deliveryStatus === "Delayed"
      ? "warning"
      : "gold";

  return (
    <div className="bg-stone-950 text-stone-100 pt-28 pb-24 min-h-screen">
      {/* Top Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Main Project Overview Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="stone">{project.category}</Badge>
          {deliveryStatus && (
            <Badge variant={deliveryBadgeVariant}>
              {deliveryStatus} Handover
            </Badge>
          )}
          <span className="text-xs text-stone-500 font-mono">
            ID: {project.slug}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight mb-4">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400 font-mono">
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 text-stone-500 mr-1.5" />
            <span>
              {isCompleted
                ? `Completed ${formatDate(project.actualCompletionDate || project.expectedCompletionDate)}`
                : `Target ${formatDate(project.expectedCompletionDate)}`}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 text-stone-500 mr-1.5" />
            <span>Execution Duration: {durationStr}</span>
          </div>
        </div>
      </section>

      {/* Full-width Hero Cover Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900 border border-stone-800">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <p className="mt-2 text-right text-[11px] text-stone-500 font-mono">
          {DEMO_NOTICE}
        </p>
      </section>

      {/* Narrative & Timeline Presentation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Project Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-light text-stone-100">
              Architectural Concept & Civil Scope
            </h2>
            <p className="text-stone-300 text-base leading-relaxed font-light">
              {project.description}
            </p>
            <p className="text-stone-300 text-base leading-relaxed font-light">
              Engineered by Rajshila Construction under strict quality protocols in Bhopal. The project required meticulous planning, rigorous structural calculation for soil conditions, and comprehensive interior execution from framing to final illumination testing.
            </p>
          </div>

          <div className="lg:col-span-4 bg-stone-900 border border-stone-800 p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-amber-400 font-mono">
              Project Specification Card
            </h3>
            <div className="space-y-3 text-xs text-stone-300 font-mono divide-y divide-stone-800">
              <div className="pt-2 flex justify-between">
                <span className="text-stone-500">Execution Firm</span>
                <span className="text-stone-200">Rajshila Construction</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-stone-500">Category</span>
                <span className="capitalize text-stone-200">{project.category}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-stone-500">Location</span>
                <span className="text-stone-200">{project.location}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-stone-500">Commencement</span>
                <span className="text-stone-200">{formatDate(project.startDate, true)}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-stone-500">Contract Target</span>
                <span className="text-stone-200">{formatDate(project.expectedCompletionDate, true)}</span>
              </div>
              {project.actualCompletionDate && (
                <div className="pt-2 flex justify-between">
                  <span className="text-stone-500">Handover Date</span>
                  <span className="text-amber-400 font-bold">
                    {formatDate(project.actualCompletionDate, true)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Project Timeline Presentation */}
        <ProjectTimeline project={project} />

        {/* Supporting Photographic Gallery */}
        {project.images && project.images.length > 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-light text-stone-100">
              Project Architectural Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] w-full bg-stone-900 border border-stone-800 overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt={`${project.title} detail ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <p className="text-right text-[11px] text-stone-500 font-mono">
              {DEMO_NOTICE}
            </p>
          </div>
        )}

        {/* Bottom CTA for Similar Projects */}
        <div className="bg-stone-900 border border-stone-800 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-stone-100">
              Interested in a Similar Architectural Execution?
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-light">
              Connect with Rajshila Construction for structural and interior site quotes in Bhopal.
            </p>
          </div>

          <Link
            href={`/contact?projectRef=${encodeURIComponent(project.title)}`}
            className="px-6 py-3.5 bg-[#B58D54] hover:bg-[#A37B43] text-stone-950 text-xs tracking-widest uppercase font-medium transition-colors shrink-0"
          >
            Enquire About This Spec
          </Link>
        </div>
      </section>
    </div>
  );
}
