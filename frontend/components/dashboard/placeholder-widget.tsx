"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface PlaceholderWidgetProps {
  title: string;
  icon?: LucideIcon;
  bgColorClass?: string; // e.g., "bg-sky-500"
  textColorClass?: string; // e.g., "text-sky-50"
  heightClass?: string; // e.g., "min-h-[200px]"
  children?: React.ReactNode;
  className?: string;
}

export function PlaceholderWidget({
  title,
  icon: Icon,
  bgColorClass = "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800",
  textColorClass = "text-slate-700 dark:text-slate-200",
  heightClass = "min-h-[200px]",
  children,
  className
}: PlaceholderWidgetProps) {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-200 ${heightClass} ${bgColorClass} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-xl font-semibold flex items-center ${textColorClass}`}>
          {Icon && <Icon className="mr-3 h-6 w-6 opacity-80" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${textColorClass} opacity-90 text-sm`}>
        {children || (
            <div className="flex items-center justify-center h-full pt-4">
                 <p>Content for {title} will be displayed here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
} 