"use client";

import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface ProfileHeaderProps {
  user: User & { role?: string };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 h-48 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      <div className="relative container pt-20 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-28 w-28 border-4 border-white/90 shadow-xl ring-2 ring-black/5 transition-transform hover:scale-105">
            <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-white to-blue-50 text-blue-600">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                {user.email}
              </h1>
              <Badge 
                variant="secondary" 
                className="capitalize bg-white/90 text-blue-600 hover:bg-white shadow-sm self-start"
              >
                {user.role || 'User'}
              </Badge>
            </div>
            <div className="text-sm text-white/90 font-medium">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
