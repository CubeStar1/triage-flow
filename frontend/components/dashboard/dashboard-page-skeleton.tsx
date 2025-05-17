"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardPageSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-12 space-y-8">
      {/* Welcome Banner Skeleton */}
      <Card className="p-6 md:p-8 bg-slate-200 dark:bg-slate-700 rounded-lg shadow-md">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 mr-4 rounded-full" />
          <div>
            <Skeleton className="h-8 md:h-10 w-60 md:w-80 mb-2" />
            <Skeleton className="h-5 md:h-6 w-72 md:w-96" />
          </div>
        </div>
      </Card>

      {/* Quick Actions Skeleton */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
            <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
        </CardContent>
      </Card>

      {/* Recent Assessments Skeleton */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg shadow-sm bg-card space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <Skeleton className="h-6 w-3/5 sm:w-2/5" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-1/2 sm:w-1/3" /> 
                <Skeleton className="h-10 w-full" /> 
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full col-span-2" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-9 w-32 inline-block" />
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 