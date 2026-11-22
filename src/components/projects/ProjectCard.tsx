import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ArrowUpRight, Clock } from "lucide-react";
import { IProject } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  calculateDeliveryStatus,
  calculateDuration,
  formatDate,
} from "@/lib/project-utils";

interface ProjectCardProps {
  project: IProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const deliveryStatus =
    project.status === "completed" && project.actualCompletionDate
      ? calculateDeliveryStatus(
          project.expectedCompletionDate,
          project.actualCompletionDate
        )
      : null;

  const durationStr =
    project.status === "completed" && project.actualCompletionDate
      ? calculateDuration(project.startDate, project.actualCompletionDate)
      : calculateDuration(project.startDate, project.expectedCompletionDate);

  const deliveryBadgeVariant =
    deliveryStatus === "Early"
      ? "success"
      : deliveryStatus === "Delayed"
      ? "warning"
      : "gold";

  return (
    <div className="group flex flex-col bg-stone-900 border border-stone-800 overflow-hidden transition-all duration-300 hover:border-stone-600 hover:shadow-xl">
      {/* Cover Image Container */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-stone-950 block"
      >
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category & Status Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge variant="stone" size="sm">
            {project.category}
          </Badge>
          {deliveryStatus && (
            <Badge variant={deliveryBadgeVariant} size="sm">
              {deliveryStatus} Delivery
            </Badge>
          )}
        </div>
      </Link>

      {/* Project Meta & Details */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-xs text-stone-400 mb-2 font-mono">
            <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-light text-stone-100 mb-3 group-hover:text-amber-300 transition-colors">
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>

          {/* Description */}
          <p className="text-sm text-stone-400 font-light line-clamp-2 leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-stone-500" />
              {formatDate(project.actualCompletionDate || project.expectedCompletionDate)}
            </span>
            <span className="inline-flex items-center font-mono text-[11px] text-stone-500">
              <Clock className="w-3 h-3 mr-1" />
              {durationStr}
            </span>
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center font-medium text-xs tracking-wider uppercase text-amber-400 group-hover:text-amber-300 transition-colors"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
