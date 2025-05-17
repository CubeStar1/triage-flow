"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit3, Maximize, MessageSquare, MoreHorizontal, Share2, UserCircle, ActivityIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fetchAssessmentById, type TriageData } from '@/lib/fetchers/assessment';
import { format } from 'date-fns';

export function AssessmentDetailView({ assessmentId }: { assessmentId?: string | null }) {
  const { 
    data: assessment,
    isLoading,
    isError,
    error
  } = useQuery<TriageData, Error>({
    queryKey: ['assessment', assessmentId],
    queryFn: () => fetchAssessmentById(assessmentId!),
    enabled: !!assessmentId,
  });

  if (!assessmentId) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out dark:border-slate-700 h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 min-h-[400px]">
        <CardHeader className="text-center">
          <Maximize className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-200">Select an Assessment</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Choose an assessment from the list to see details here.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out dark:border-slate-700 h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 min-h-[400px]">
        <CardHeader className="text-center">
          <Loader2 className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4 animate-spin" />
          <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-200">Loading Assessment...</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Please wait while we fetch the assessment details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError || !assessment) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out dark:border-slate-700 h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 min-h-[400px]">
        <CardHeader className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-200">Error Loading Assessment</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">{error?.message || "Could not load assessment details"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const patientDetails = [
    assessment.patientSex,
    assessment.patientAge ? `${assessment.patientAge} Years` : null
  ].filter(Boolean).join(' - ');

  const avatarFallback = assessment.patientName
    ? assessment.patientName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'PT';

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out dark:border-slate-700 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-md font-bold text-slate-800 dark:text-slate-100">{assessment.patientName || 'Anonymous Patient'}</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">{patientDetails || 'No patient details available'}</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {assessment.hasFever && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <ActivityIcon className="h-3.5 w-3.5 text-red-500" />
              Fever
            </Badge>
          )}
          {assessment.predictedInjuryLabel && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <ActivityIcon className="h-3.5 w-3.5 text-orange-500" />
              {assessment.predictedInjuryLabel}
            </Badge>
          )}
          {assessment.recommendationStatus && (
            <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
              <ActivityIcon className="h-3.5 w-3.5 text-yellow-500" />
              {assessment.recommendationStatus}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Last Updated</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(assessment.updatedAt), 'PPpp')}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Symptoms Description</div>
          <div className="text-sm text-muted-foreground">{assessment.symptomDescription}</div>
        </div>

        {assessment.triageRecommendation && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Triage Recommendation</div>
              <div className="text-sm text-muted-foreground">{assessment.triageRecommendation}</div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Edit Assessment
        </Button>
        <Button className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Add Note
        </Button>
      </CardFooter>
    </Card>
  );
} 