"use client";

import type { TriageData } from "@/lib/fetchers/assessment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, TrendingUp, AlertOctagon, CheckCircle2, ShieldAlert, ImageIcon } from "lucide-react";
import Image from "next/image";

interface DashboardAssessmentListItemProps {
  assessment: TriageData;
  isSelected?: boolean;
}

const getStatusAttributes = (status: NonNullable<TriageData['recommendationStatus']>) => {
  switch (status) {
    case 'critical':
      return { icon: <AlertOctagon className="h-3.5 w-3.5" />, color: "bg-red-500 text-white", text: "Critical" };
    case 'severe':
      return { icon: <ShieldAlert className="h-3.5 w-3.5" />, color: "bg-orange-500 text-white", text: "Severe" };
    case 'moderate':
      return { icon: <TrendingUp className="h-3.5 w-3.5" />, color: "bg-yellow-400 text-yellow-900", text: "Moderate" };
    case 'mild':
      return { icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "bg-green-500 text-white", text: "Mild" };
    default:
      return { icon: <User className="h-3.5 w-3.5" />, color: "bg-slate-500 text-white", text: "Unknown" };
  }
};

// Function to generate initials from a name or identifier
const getInitials = (name?: string): string => {
  if (!name) return "N/A";
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function DashboardAssessmentListItem({ assessment, isSelected }: DashboardAssessmentListItemProps) {
  const status = assessment.recommendationStatus || 'mild';
  const statusAttributes = getStatusAttributes(status);

  // Create a more concise date/time format (e.g., "9:30 AM" or "Jun 21")
  const formatDateConcise = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-all duration-150 ease-in-out",
        "border border-transparent", // Default transparent border
        isSelected 
          ? "bg-primary/10 dark:bg-primary/20 border-primary/50 shadow-md" 
          : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
      )}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          {assessment.imageUrl ? (
            <div className="absolute inset-0">
              <Image
                src={assessment.imageUrl}
                alt={`Image for ${assessment.predictedInjuryLabel || 'assessment'}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <AvatarFallback 
              className={cn(
                "font-semibold text-sm", 
                isSelected ? "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              {getInitials(assessment.patientName)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-grow min-w-0"> {/* Added min-w-0 to allow truncation */}
          <p className={cn("text-sm font-semibold truncate", isSelected ? "text-primary dark:text-primary-foreground/90" : "text-slate-800 dark:text-slate-100")}>
            {assessment.predictedInjuryLabel || 'Pending Assessment'}
          </p>
          <p className={cn("text-xs truncate", isSelected ? "text-primary/80 dark:text-primary-foreground/70" : "text-slate-500 dark:text-slate-400")}>
            {assessment.patientName || "Unknown Patient"} - {formatDateConcise(assessment.updatedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {assessment.severityScore && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {assessment.severityScore}/5
          </span>
        )}
        <Badge 
          className={cn(
            "flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-full min-w-[90px] justify-center", 
            statusAttributes.color, 
            isSelected && "ring-1 ring-offset-1 ring-offset-background dark:ring-offset-slate-800 ring-white/50"
          )}
        >
          {statusAttributes.icon}
          <span>{statusAttributes.text}</span>
        </Badge>
      </div>
    </div>
  );
}