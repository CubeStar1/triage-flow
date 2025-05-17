"use client";

import type { AssessmentSummary } from "@/lib/fetchers/assessment";
// Removed: import { AssessmentTableRow } from "./assessment-table-row";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle, Activity, User, CalendarDays } from "lucide-react"; // Removed Edit3 as it's not used in table row context here
import { Badge } from "@/components/ui/badge";
import { FileQuestion } from "lucide-react";

interface AssessmentTableProps {
  assessments: AssessmentSummary[];
}

// Helper constants and functions moved from assessment-table-row.tsx
const statusIcons: Record<AssessmentSummary['recommendationStatus'], React.ReactNode> = {
  mild: <CheckCircle className="h-4 w-4 text-green-500" />,
  moderate: <Activity className="h-4 w-4 text-yellow-500" />,
  severe: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  critical: <AlertTriangle className="h-4 w-4 text-red-600" />,
};

const statusColors: Record<AssessmentSummary['recommendationStatus'], string> = {
    mild: "border-green-500/50 bg-green-50 text-green-700 dark:border-green-500/60 dark:bg-green-900/30 dark:text-green-300",
    moderate: "border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:border-yellow-500/60 dark:bg-yellow-900/30 dark:text-yellow-300",
    severe: "border-orange-500/50 bg-orange-50 text-orange-700 dark:border-orange-500/60 dark:bg-orange-900/30 dark:text-orange-300",
    critical: "border-red-600/50 bg-red-50 text-red-700 dark:border-red-600/60 dark:bg-red-900/30 dark:text-red-400",
};

const formatDate = (isoString: string, options?: Intl.DateTimeFormatOptions) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric' 
  };
  return new Date(isoString).toLocaleString('en-US', options || defaultOptions);
};

export function AssessmentTable({ assessments }: AssessmentTableProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card shadow-sm">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Assessments Found</h3>
        <p className="text-muted-foreground">
          No assessment records match the current criteria for table view. 
          <Link href="/assessment/new" className="text-primary hover:underline">
            Start a new assessment.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="border dark:border-slate-700 rounded-lg shadow-sm overflow-hidden"> {/* Wrapper for rounded corners and border */}
      <Table className="min-w-full">
        <TableCaption className="py-3 text-xs text-muted-foreground mt-2">A list of recent triage assessments. Displaying {assessments.length} record(s).</TableCaption>
        <TableHeader className="bg-slate-100 dark:bg-slate-800">
          <TableRow>
            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-[200px]">Patient/ID</TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Injury Type</TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">Key Symptoms</TableHead>
            <TableHead className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-[140px]">Status</TableHead>
            <TableHead className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell w-[90px]">Severity</TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell w-[110px]">Assessed</TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell w-[110px]">Last Update</TableHead>
            <TableHead className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-[90px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
          {assessments.map((assessment) => (
            <TableRow key={assessment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150">
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-100">
                <div className="flex items-center">
                  {assessment.patientIdentifier ? (
                    <User className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  ) : null}
                  <span className="truncate" title={assessment.patientIdentifier || `ID: ${assessment.id}`}>{assessment.patientIdentifier || `ID: ${assessment.id}`}</span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{assessment.injuryType}</TableCell>
              <TableCell className="px-4 py-3 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400">
                <span className="line-clamp-2" title={assessment.keySymptomsSnippet}>{assessment.keySymptomsSnippet || "N/A"}</span>
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <Badge variant="outline" className={`px-2 py-0.5 text-xs capitalize flex items-center justify-center gap-1 ${statusColors[assessment.recommendationStatus]}`}>
                    {statusIcons[assessment.recommendationStatus]}
                    {assessment.recommendationStatus}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-center hidden lg:table-cell text-sm font-semibold text-slate-700 dark:text-slate-200">{assessment.severityScore}/5</TableCell>
              <TableCell className="px-4 py-3 hidden sm:table-cell text-xs text-slate-500 dark:text-slate-400">{formatDate(assessment.date)}</TableCell>
              <TableCell className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500 dark:text-slate-400">{formatDate(assessment.lastUpdated)}</TableCell>
              <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 py-1 text-primary hover:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20">
                  <Link href={`/assessment/${assessment.id}`}>
                    Details <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 