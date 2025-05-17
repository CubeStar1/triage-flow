"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/hooks/use-user";

export interface DashboardStats {
  totalAssessments: number;
  highRiskCount: number;
  completedToday: number;
  pendingReview: number;
  highRiskChange: number;
  totalChange: number;
}

export function useDashboardStats() {
  const { data: user } = useUser();
  const supabase = createSupabaseBrowser();

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Get total assessments and today's count
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('id, created_at, recommendation_status, predicted_injury_label')
      .order('created_at', { ascending: false });

    if (assessmentsError) throw assessmentsError;

    if (!assessments) {
      return {
        totalAssessments: 0,
        highRiskCount: 0,
        completedToday: 0,
        pendingReview: 0,
        highRiskChange: 0,
        totalChange: 0
      };
    }

    // Calculate stats
    const totalAssessments = assessments.length;
    
    // Get completed assessments (those with a predicted injury label)
    const completedAssessments = assessments.filter(a => 
      a.predicted_injury_label !== null && a.predicted_injury_label !== ''
    );

    // Calculate completed today
    const completedToday = completedAssessments.filter(a => 
      new Date(a.created_at) >= today
    ).length;

    // Calculate high risk cases
    const highRiskCases = completedAssessments.filter(a => 
      a.recommendation_status === 'severe' || a.recommendation_status === 'critical'
    );

    const highRiskCount = highRiskCases.length;

    const lastWeekHighRisk = completedAssessments.filter(a => 
      (a.recommendation_status === 'severe' || a.recommendation_status === 'critical') &&
      new Date(a.created_at) >= lastWeek
    ).length;

    const lastMonthTotal = completedAssessments.filter(a => 
      new Date(a.created_at) >= lastMonth
    ).length;

    // Calculate pending reviews (assessments without a predicted injury label)
    const pendingReview = assessments.length - completedAssessments.length;

    // Calculate changes
    const highRiskChange = highRiskCount - lastWeekHighRisk;
    const totalChange = totalAssessments > 0 
      ? ((totalAssessments - lastMonthTotal) / lastMonthTotal) * 100 
      : 0;

    return {
      totalAssessments,
      highRiskCount,
      completedToday,
      pendingReview,
      highRiskChange,
      totalChange: Math.round(totalChange * 10) / 10 // Round to 1 decimal place
    };
  };

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: fetchDashboardStats,
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000 // 2 minutes
  });
}
