"use client";

import type { TriageData } from "@/lib/fetchers/assessment";
// import { AssessmentListItem } from "@/components/assessment-history/assessment-list-item"; // Old import
import { DashboardAssessmentListItem } from "./dashboard-assessment-list-item"; // New import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListChecks, ArrowRight, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentAssessmentsSummaryProps {
  assessments: TriageData[];
  maxItems?: number;
  onAssessmentSelect?: (id: string) => void;
  selectedAssessmentId?: string | null;
}

export function RecentAssessmentsSummary({
  assessments,
  maxItems = 5,
  onAssessmentSelect,
  selectedAssessmentId,
}: RecentAssessmentsSummaryProps) {
  const recentAssessments = assessments.slice(0, maxItems);

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4 md:px-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div>
          <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-purple-500" />
            Recent Activity
          </CardTitle>
        </div>
        {assessments.length > 0 && (
          <Button asChild variant="ghost" size="sm" className="text-xs text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 h-auto px-2 py-1">
            <Link href="/assessment">View All <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className={cn(
        "p-3 md:p-4 flex-grow", 
        recentAssessments.length === 0 && "flex items-center justify-center"
      )}>
        {recentAssessments.length > 0 ? (
          <div className="space-y-2"> {/* Slightly increased spacing for new items */}
            {recentAssessments.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => onAssessmentSelect?.(String(assessment.id))}
                className={cn(
                  "cursor-pointer rounded-lg", // Wrapper for click, item itself handles visual selection state
                )}
              >
                <DashboardAssessmentListItem 
                  assessment={assessment} 
                  isSelected={selectedAssessmentId === String(assessment.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">No Recent Assessments</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              New assessments will appear here.
            </p>
            <Button asChild className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white text-xs">
              <Link href="/assessment/new">Start First Assessment</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 