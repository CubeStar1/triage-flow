"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAssessments } from '@/lib/fetchers/assessment';
import type { TriageData } from '@/lib/fetchers/assessment';
import { AssessmentList } from '@/components/assessment-history/assessment-list';
import { AssessmentHistorySkeleton } from '@/components/assessment-history/assessment-history-skeleton';
import { AssessmentTable } from '@/components/assessment-history/assessment-table';
import { AssessmentTableSkeleton } from '@/components/assessment-history/assessment-table-skeleton';
import { ViewToggle } from '@/components/assessment-history/view-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ListChecks } from 'lucide-react';

export default function AssessmentHistoryPage() {
  const [currentView, setCurrentView] = useState<'card' | 'table'>('card');

  const { 
    data: assessments, 
    isLoading, 
    isError, 
    error 
  } = useQuery<TriageData[], Error>({
    queryKey: ['assessments'],
    queryFn: fetchAllAssessments,
    // staleTime: 5 * 60 * 1000, // Example: 5 minutes
  });

  const renderContent = () => {
    if (isLoading) {
      return currentView === 'card' ? <AssessmentHistorySkeleton /> : <AssessmentTableSkeleton />;
    }

    if (isError) {
      return (
        <div className="text-destructive p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Error Loading Assessments</h3>
          <p>{error?.message || "An unknown error occurred."}</p>
        </div>
      );
    }

    if (assessments) {
      return currentView === 'card' ? (
        <AssessmentList assessments={assessments} />
      ) : (
        <AssessmentTable assessments={assessments} />
      );
    }
    return null; // Should not happen if not loading and not error, but good practice
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
      <header className="mb-8 md:mb-10 pb-4 border-b flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center">
          <ListChecks size={36} className="mr-3 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Assessment History
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
            <Button asChild className="w-full sm:w-auto">
                <Link href="/assessment/new">
                    <PlusCircle size={18} className="mr-2" />
                    New Assessment
                </Link>
            </Button>
        </div>
      </header>
      {renderContent()}
    </div>
  );
} 