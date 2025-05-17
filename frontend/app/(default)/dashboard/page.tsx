"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAssessments } from '@/lib/fetchers/assessment';
import type { TriageData } from '@/lib/fetchers/assessment';

import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentAssessmentsSummary } from '@/components/dashboard/recent-assessments-summary';
import { DashboardPageSkeleton } from '@/components/dashboard/dashboard-page-skeleton';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { NotesSection } from '@/components/dashboard/notes-section';
import { AssessmentDetailView } from '@/components/dashboard/assessment-detail-view';

export default function DashboardPage() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  const { 
    data: assessments, 
    isLoading, 
    isError, 
    error 
  } = useQuery<TriageData[], Error>({
    queryKey: ['dashboard-assessments'],
    queryFn: fetchAllAssessments,
    staleTime: 2 * 60 * 1000,
    select: (data) => data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  });

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  const recentAssessmentsData = !isError && assessments ? assessments : [];

  const handleAssessmentSelect = (id: string) => {
    setSelectedAssessmentId(id);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-6 md:space-y-8">
        <WelcomeBanner />
        <StatsCards />

        {isError && (
          <div className="text-destructive p-6 text-center bg-red-100 dark:bg-red-900/30 rounded-lg shadow-md col-span-full">
              <h3 className="text-lg font-semibold mb-1">Error Loading Dashboard Data</h3>
              <p className="text-sm">{error?.message || "Could not fetch required data."}</p>
          </div>
        )}

        {!isError && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
              <QuickActions />
              <NotesSection />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              <RecentAssessmentsSummary 
                assessments={recentAssessmentsData.slice(0,5)}
                onAssessmentSelect={handleAssessmentSelect}
                selectedAssessmentId={selectedAssessmentId}
                maxItems={5} 
              />
              <AssessmentDetailView assessmentId={selectedAssessmentId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
