"use client";

import { HeartPulse, ShieldCheck, User } from 'lucide-react';
import useUser from '@/hooks/use-user';

export function WelcomeBanner() {
  const { data: user } = useUser();
  
  // Get time of day for greeting
  const hour = new Date().getHours();
  const timeOfDay = 
    hour < 12 ? "morning" :
    hour < 17 ? "afternoon" :
    "evening";

  // Get user's name from email if available
  const name = user?.email;
  const formattedName = name || "there";
  
  const greeting = `Good ${timeOfDay}, ${formattedName}`;

  // Role-specific content
  const isHealthcareWorker = user?.role === "healthcare_worker";
  const RoleIcon = isHealthcareWorker ? ShieldCheck : User;
  const roleText = isHealthcareWorker ? "Healthcare Professional" : "Patient";
  const roleDescription = isHealthcareWorker
    ? "You're equipped to provide critical care and assessment."
    : "Your health and safety are our top priority.";

  return (
    <div className="relative p-6 md:p-8 bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 rounded-xl shadow-xl mb-8 md:mb-10 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <HeartPulse size={40} className="flex-shrink-0 mt-1 text-white/90" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{greeting}</h1>
            <p className="mt-1 text-sm md:text-base text-rose-100 dark:text-rose-100">
              Every moment counts in emergency care. Let&apos;s prioritize and save lives together.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
          <div className="p-2 rounded-full bg-white/20">
            <RoleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white/80">Your Role</div>
            <div className="text-white font-semibold">{roleText}</div>
            <div className="text-xs text-rose-100 mt-0.5 max-w-[200px]">
              {roleDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}