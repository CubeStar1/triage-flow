"use client";

import { useQuery } from '@tanstack/react-query';
import type { TriageData } from '@/lib/fetchers/assessment';
import useUser from '@/hooks/use-user';
import { ArrowLeft, FileText, Image as ImageIconLucideBase, Printer, Download, UserCircle as UserCircleIconBase, Network, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientDetails } from "@/components/assesment-details/patient-details";

// Import actual components
import { PatientImageViewer } from "@/components/assesment-details/patient-image-viewer";
import { TriageAssessmentDetails } from "@/components/assesment-details/triage-assessment-details";
import { DashboardLoadingSkeleton } from "@/components/assesment-details/loading-skeleton";
import { fetchAssessmentById } from '@/lib/fetchers/assessment';
import * as React from 'react'
import { AgentFlowViewer } from "@/components/assesment-details/agent-flow-viewer";
import { CompactVoiceAssistant } from "@/components/voice-assistant/compact-voice-assistant";


// Define props for the page, including params for the dynamic segment


export default function TriagePage({ params }: { params: Promise<{ assessmentId: string }> }) {
    const { assessmentId } = React.use(params)
    const { data: user } = useUser();

  // Use TanStack Query's useQuery hook
  const { 
    data: triageData, 
    isLoading, 
    isError, 
    error 
  } = useQuery<TriageData, Error>({
    queryKey: ['assessment', assessmentId], // Query key includes assessmentId for unique caching
    queryFn: () => fetchAssessmentById(assessmentId),
    enabled: !!assessmentId, // Only run the query if assessmentId is available
    // Optional: Add other TanStack Query options like staleTime, cacheTime, refetchOnWindowFocus, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes 
  });

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (isError) {
    // The error object from useQuery will have a message property if it's an Error instance
    const errorMessage = error?.message || "An unknown error occurred while fetching triage data.";
    return <div className="text-destructive p-8 text-center">Error loading triage data: {errorMessage}</div>;
  }

  if (!triageData) {
    // This case might be hit if the query successfully completes but returns no data (e.g., null/undefined)
    // though fetchAssessmentById should throw an error for not found, which isError would catch.
    return <div className="p-8 text-center">No triage data found.</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex-grow flex flex-col overflow-hidden min-h-0">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-0 flex-shrink-0">
          <div className="flex items-center mb-6 pt-6">
            <button className="p-2 rounded-md hover:bg-muted mr-3" onClick={() => window.history.back()} title="Go Back">
              <ArrowLeft size={24} />
            </button>
            <FileText size={28} className="mr-2 text-primary" />
            <h1 className="text-2xl font-semibold">Smart Triage Assessment (ID: {triageData.id})</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 overflow-hidden min-h-0">
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <Tabs defaultValue="image" className="w-full flex flex-col flex-1 min-h-0">
              <TabsList className={`grid w-full ${user?.role === 'patient' ? 'grid-cols-4' : 'grid-cols-4'} mb-3 shrink-0`}>
                <TabsTrigger value="image">
                  <ImageIconLucideBase className="mr-2 h-4 w-4" /> Image
                </TabsTrigger>
                <TabsTrigger value="details">
                  <UserCircleIconBase className="mr-2 h-4 w-4" /> Details
                </TabsTrigger>
                {user?.role === 'healthcare_worker' && (
                  <TabsTrigger value="flow">
                    <Network className="mr-2 h-4 w-4" /> Agent 
                  </TabsTrigger>
                )}
                {/* {user?.role === 'patient' && ( */}
                  <TabsTrigger value="voice">
                    <Mic className="mr-2 h-4 w-4" /> Voice Assistant
                  </TabsTrigger>
                {/* )} */}
              </TabsList>
              
              <TabsContent value="image" className="flex-1 overflow-y-auto">
                <PatientImageViewer 
                  imageUrl={triageData.imageUrl} 
                  altText={triageData.predictedInjuryLabel || "Patient submitted image"} 
                  caption="Visual input provided for triage."
                />
              </TabsContent>

              <TabsContent value="details" className="">
                <PatientDetails triageData={triageData} />
              </TabsContent>

              {user?.role === 'healthcare_worker' && (
                <TabsContent value="flow" className="flex-1 overflow-y-auto">
                  <AgentFlowViewer triageData={triageData} />
                </TabsContent>
              )}

              {/* {user?.role === 'patient' && ( */}
                <TabsContent value="voice" className="flex-1 overflow-y-auto">
                  <CompactVoiceAssistant triageData={triageData} />
                </TabsContent>
              {/* )} */}
            </Tabs>
          </div>

          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <TriageAssessmentDetails triageData={triageData} />
          </div>
        </div>
      </div>

      {triageData && (
        <div className="sticky bottom-0 left-0 right-0 w-full p-4 bg-card/95 border-t border-border backdrop-blur-sm shadow-md z-10 flex-shrink-0">
          <div className="container mx-auto flex gap-4 justify-center md:justify-end">
            <Button variant="outline" className="w-full md:w-auto min-w-[160px]">
              <Printer size={18} className="mr-2" />
              Print Report
            </Button>
            <Button variant="default" className="w-full md:w-auto min-w-[160px] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
              <Download size={18} className="mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
