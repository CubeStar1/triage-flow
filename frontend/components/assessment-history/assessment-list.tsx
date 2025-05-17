"use client";

import type { AssessmentSummary } from "@/lib/fetchers/assessment";
import { AssessmentListItem } from "./assessment-list-item";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

interface AssessmentListProps {
  assessments: AssessmentSummary[];
}

export function AssessmentList({ assessments }: AssessmentListProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Assessments Found</h3>
        <p className="text-muted-foreground">
          You haven&apos;t submitted any triage assessments yet. 
          <Link href="/assessment/new" className="text-primary hover:underline">
            Start a new assessment.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <AssessmentListItem key={assessment.id} assessment={assessment} />
      ))}
    </div>
  );
} 