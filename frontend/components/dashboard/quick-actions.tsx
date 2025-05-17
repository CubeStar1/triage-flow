"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, History, Bot, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const actions = [
    {
      href: "/assessment/new",
      label: "New Assessment",
      icon: PlusCircle,
      className: "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white",
      iconColor: "text-purple-100"
    },
    {
      href: "/assessment",
      label: "View History",
      icon: History,
      className: "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white",
      iconColor: "text-pink-100"
    },
    {
      href: "/voice-assistant",
      label: "Voice Assistant",
      icon: Bot,
      className: "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white",
      iconColor: "text-orange-100"
    },
    {
      href: "/dashboard",
      label: "Manage Settings",
      icon: LayoutDashboard,
      className: "bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white",
      iconColor: "text-sky-100"
    }
  ];

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              className={cn(
                "w-full h-auto py-4 px-2.5 text-xs font-semibold flex flex-col items-center justify-center space-y-1 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 ease-in-out", 
                "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                action.className 
              )}
            >
              <Link href={action.href} className="flex flex-col items-center justify-center h-full w-full">
                <action.icon size={20} className={cn("mb-1", action.iconColor)} /> 
                <span className="text-center leading-tight">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 