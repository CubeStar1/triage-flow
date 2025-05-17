"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement<{ className?: string }>;
  description?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, iconBgColor = "bg-white/20", iconColor = "text-white" }) => {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.02] border-0", iconBgColor)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-white">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-white/20">
          {React.cloneElement(icon, { 
            className: cn(icon.props.className, "h-5 w-5", "text-white/90") 
          })}
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <div className="text-3xl font-bold text-white">{value}</div>
        {description && <p className="text-sm text-white/90 pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export function StatsCards() {
  const { data: stats, isLoading, error } = useDashboardStats();

  // Define gradient backgrounds for each card
  const cardStyles = [
    { bg: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" },  // Total Assessments
    { bg: "bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700" },    // High Risk
    { bg: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" },  // Completed Today
    { bg: "bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700" },  // Pending Review
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className={cn("shadow-lg border-0 animate-pulse", cardStyles[i].bg)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <div className="h-4 w-24 bg-white/20 rounded" />
              <div className="p-2 rounded-lg bg-white/20">
                <Loader2 className="h-5 w-5 text-white/90 animate-spin" />
              </div>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="h-8 w-16 bg-white/20 rounded mb-2" />
              <div className="h-4 w-32 bg-white/20 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
        <p className="text-sm">Error loading dashboard statistics.</p>
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Assessments", 
      value: stats.totalAssessments.toLocaleString(), 
      icon: <Activity />, 
      description: `${stats.totalChange >= 0 ? '+' : ''}${stats.totalChange}% from last month`
    },
    { 
      title: "High Risk", 
      value: stats.highRiskCount.toLocaleString(), 
      icon: <AlertTriangle />, 
      description: `${stats.highRiskChange >= 0 ? '+' : ''}${stats.highRiskChange} from last week`
    },
    { 
      title: "Completed Today", 
      value: stats.completedToday.toLocaleString(), 
      icon: <CheckCircle />, 
      description: "Today's assessments"
    },
    { 
      title: "Pending Review", 
      value: stats.pendingReview.toLocaleString(), 
      icon: <Users />, 
      description: stats.pendingReview === 1 ? "1 case needs review" : `${stats.pendingReview} cases need review`
    },
  ];

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => (
        <StatCard
          key={stat.title}
          {...stat}
          iconBgColor={cardStyles[i].bg}
        />
      ))}
    </div>
  );
}