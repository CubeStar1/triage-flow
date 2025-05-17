"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AssessmentHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <Skeleton className="h-8 w-1/3" /> 
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm bg-card">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
              <Skeleton className="h-5 w-3/5 sm:w-2/5 mb-2 sm:mb-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm text-muted-foreground">
              <Skeleton className="h-4 w-1/2 sm:w-1/3 mb-1 sm:mb-0" />
              <Skeleton className="h-4 w-1/4 sm:w-1/6" />
            </div>
            <div className="mt-3 text-right">
                <Skeleton className="h-9 w-28 inline-block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 