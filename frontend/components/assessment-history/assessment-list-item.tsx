"use client";

import type { AssessmentSummary } from "@/lib/fetchers/assessment";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, AlertTriangle, CheckCircle, Activity, User, CalendarDays, Thermometer, Stethoscope, Edit3, MessageSquare 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AssessmentListItemProps {
  assessment: AssessmentSummary;
}

const statusIcons: Record<AssessmentSummary['recommendationStatus'], React.ReactNode> = {
  mild: <CheckCircle className="h-5 w-5 text-green-500" />,
  moderate: <Activity className="h-5 w-5 text-yellow-500" />,
  severe: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  critical: <AlertTriangle className="h-5 w-5 text-red-600" />,
};

const statusColors: Record<AssessmentSummary['recommendationStatus'], string> = {
    mild: "border-green-500/50 bg-green-50 text-green-700 dark:border-green-500/60 dark:bg-green-900/30 dark:text-green-300",
    moderate: "border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:border-yellow-500/60 dark:bg-yellow-900/30 dark:text-yellow-300",
    severe: "border-orange-500/50 bg-orange-50 text-orange-700 dark:border-orange-500/60 dark:bg-orange-900/30 dark:text-orange-300",
    critical: "border-red-600/50 bg-red-50 text-red-700 dark:border-red-600/60 dark:bg-red-900/30 dark:text-red-400",
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });
};

export function AssessmentListItem({ assessment }: AssessmentListItemProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out dark:border-slate-700">
      <CardHeader className="p-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
          <CardTitle className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-100">{assessment.injuryType}</CardTitle>
          <Badge variant="outline" className={`px-3 py-1 text-xs font-medium capitalize flex items-center gap-1.5 ${statusColors[assessment.recommendationStatus]}`}>
            {statusIcons[assessment.recommendationStatus]}
            {assessment.recommendationStatus}
          </Badge>
        </div>
        {assessment.patientIdentifier && (
          <CardDescription className="text-xs text-slate-600 dark:text-slate-400 pt-1 flex items-center">
            <User className="h-3 w-3 mr-1.5" /> {assessment.patientIdentifier}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {assessment.keySymptomsSnippet && (
            <div className="text-sm text-slate-700 dark:text-slate-300">
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-1 flex items-center"><MessageSquare className="h-4 w-4 mr-2 text-primary/80" />Key Symptoms:</p>
                <p className="pl-1 text-xs leading-relaxed line-clamp-2 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-md border border-slate-200 dark:border-slate-700">{assessment.keySymptomsSnippet}</p>
            </div>
        )}
        <Separator className="my-3 dark:bg-slate-700"/>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
                <Stethoscope className="h-4 w-4 mr-2 text-blue-500/80" />
                <span>Severity: <strong className="font-semibold text-slate-700 dark:text-slate-200">{assessment.severityScore} / 5</strong></span>
            </div>
            <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-purple-500/80" />
                <span>Assessed: <strong className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(assessment.date)}</strong></span>
            </div>
            <div className="flex items-center col-span-2">
                <Edit3 className="h-4 w-4 mr-2 text-teal-500/80" />
                <span>Last Update: <strong className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(assessment.lastUpdated)}</strong></span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 flex justify-end">
        <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/assessment/${assessment.id}`}>
            View Full Report <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 