import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { IProject } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { calculateDuration, formatDate } from "@/lib/project-utils";

interface OngoingProjectCardProps {
  project: IProject;
}

export function OngoingProjectCard({ project }: OngoingProjectCardProps) {
  const progress = project.progressPercentage || 0;
  const agreedDuration = calculateDuration(
    project.startDate,
    project.expectedCompletionDate
  );

  return (
    <div className="bg-stone-900 border border-stone-800 overflow-hidden flex flex-col lg:flex-row transition-all duration-300 hover:border-stone-700 hover:shadow-2xl">
      {/* Cover Visual (40% width on desktop) */}
      <div className="relative aspect-[16/10] lg:aspect-auto lg:w-2/5 min-h-[260px] bg-stone-950">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60" />

        {/* Live Badge */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <Badge variant="gold" size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5" />
            In Progress
          </Badge>
          <Badge variant="stone" size="sm">
            {project.category}
          </Badge>
        </div>
      </div>

      {/* Details & Progress Tracker (60% width on desktop) */}
      <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Location */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center text-xs text-stone-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center text-xs text-stone-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-stone-500 mr-1" />
              <span>Agreed: {agreedDuration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-light text-stone-100 mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-stone-400 font-light leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Progress Bar & Percentage */}
          <div className="bg-stone-950 border border-stone-800 p-4 mb-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="uppercase tracking-widest text-stone-300 font-medium flex items-center">
                <Activity className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                Execution Progress
              </span>
              <span className="font-mono text-amber-300 font-bold text-sm">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-none overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {project.latestUpdate && (
              <div className="mt-3 text-xs text-stone-400 font-light bg-stone-900/80 p-2.5 border-l-2 border-amber-400">
                <span className="font-medium text-stone-200">Latest On-Site Update: </span>
                {project.latestUpdate}
              </div>
            )}
          </div>

          {/* Milestones Preview */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="space-y-2 mb-6">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono block">
                Milestone Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.milestones.slice(0, 4).map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-xs text-stone-300 space-x-2"
                  >
                    {m.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                    )}
                    <span
                      className={
                        m.isCompleted
                          ? "line-through text-stone-500"
                          : "text-stone-300 font-light"
                      }
                    >
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-stone-500" />
              Started: {formatDate(project.startDate)}
            </span>
            <span className="flex items-center">
              Target: {formatDate(project.expectedCompletionDate)}
            </span>
          </div>

          <Link
            href="/ongoing-projects"
            className="inline-flex items-center text-xs uppercase tracking-wider text-amber-400 hover:text-white transition-colors"
          >
            <span>Live Tracker</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
