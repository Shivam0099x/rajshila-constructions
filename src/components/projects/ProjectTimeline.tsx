import React from "react";
import { CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react";
import { IProject } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  calculateDeliveryStatus,
  calculateDuration,
  formatDate,
} from "@/lib/project-utils";

interface ProjectTimelineProps {
  project: IProject;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const isCompleted = project.status === "completed";
  const agreedDuration = calculateDuration(
    project.startDate,
    project.expectedCompletionDate
  );
  const actualDuration =
    isCompleted && project.actualCompletionDate
      ? calculateDuration(project.startDate, project.actualCompletionDate)
      : null;

  const deliveryStatus =
    isCompleted && project.actualCompletionDate
      ? calculateDeliveryStatus(
          project.expectedCompletionDate,
          project.actualCompletionDate
        )
      : null;

  const deliveryBadgeVariant =
    deliveryStatus === "Early"
      ? "success"
      : deliveryStatus === "Delayed"
      ? "warning"
      : "gold";

  return (
    <div className="bg-stone-900 border border-stone-800 p-8 sm:p-10 space-y-8">
      {/* Header & Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono block mb-1">
            Contract & Milestone Verification
          </span>
          <h3 className="text-2xl font-light text-stone-100">
            Project Delivery & Execution Timeline
          </h3>
        </div>

        {deliveryStatus && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-400 font-mono">Performance:</span>
            <Badge variant={deliveryBadgeVariant} size="md">
              {deliveryStatus} Handover
            </Badge>
          </div>
        )}
      </div>

      {/* 4-Box Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Start Date */}
        <div className="bg-stone-950 p-4 border border-stone-800">
          <div className="flex items-center text-xs text-stone-500 font-mono mb-1">
            <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
            <span>Project Initiation</span>
          </div>
          <div className="text-base font-medium text-stone-200">
            {formatDate(project.startDate, true)}
          </div>
        </div>

        {/* Metric 2: Agreed Target */}
        <div className="bg-stone-950 p-4 border border-stone-800">
          <div className="flex items-center text-xs text-stone-500 font-mono mb-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
            <span>Client Agreed Target</span>
          </div>
          <div className="text-base font-medium text-stone-200">
            {formatDate(project.expectedCompletionDate, true)}
          </div>
        </div>

        {/* Metric 3: Actual Handover */}
        <div className="bg-stone-950 p-4 border border-stone-800">
          <div className="flex items-center text-xs text-stone-500 font-mono mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>{isCompleted ? "Actual Handover" : "Current Status"}</span>
          </div>
          <div className="text-base font-medium text-amber-300">
            {isCompleted && project.actualCompletionDate
              ? formatDate(project.actualCompletionDate, true)
              : `In Progress (${project.progressPercentage || 0}%)`}
          </div>
        </div>

        {/* Metric 4: Duration Analysis */}
        <div className="bg-stone-950 p-4 border border-stone-800">
          <div className="flex items-center text-xs text-stone-500 font-mono mb-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
            <span>Duration (Agreed / Actual)</span>
          </div>
          <div className="text-sm font-mono text-stone-200">
            {agreedDuration}
            {actualDuration && (
              <span className="text-stone-400 block text-xs">
                Actual: {actualDuration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Milestone Sequence */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="pt-4">
          <h4 className="text-xs uppercase tracking-widest text-stone-400 font-mono mb-6">
            Detailed Structural & Architectural Milestones
          </h4>

          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-800">
            {project.milestones.map((milestone, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border-2 ${
                    milestone.isCompleted
                      ? "bg-amber-400 border-amber-400"
                      : "bg-stone-900 border-stone-600"
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h5 className="text-base font-medium text-stone-200">
                    {milestone.title}
                  </h5>

                  <div className="flex items-center space-x-3 text-xs font-mono text-stone-400">
                    {milestone.completedDate ? (
                      <span className="text-emerald-400">
                        Achieved: {formatDate(milestone.completedDate)}
                      </span>
                    ) : milestone.targetDate ? (
                      <span>Target: {formatDate(milestone.targetDate)}</span>
                    ) : null}

                    {milestone.isCompleted ? (
                      <Badge variant="stone" size="sm">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline" size="sm">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                {milestone.description && (
                  <p className="text-sm text-stone-400 font-light mt-1">
                    {milestone.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architectural Guarantee Note */}
      <div className="p-4 bg-stone-950 border-l-2 border-amber-400 text-xs text-stone-400 font-light flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Every project timeline at Rajshila Construction is established under contract before site work commences, protecting clients against unjustified cost inflations or project stalling.
        </span>
      </div>
    </div>
  );
}
