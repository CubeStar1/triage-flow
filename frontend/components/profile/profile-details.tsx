"use client";

import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface ProfileDetailsProps {
  user: User & { role?: string };
}

type DetailItem = {
  label: string;
  value: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
};

export function ProfileDetails({ user }: ProfileDetailsProps) {
  const details: DetailItem[] = [
    {
      label: "Email",
      value: user.email || 'No email provided',
      badge: user.email_confirmed_at ? "Verified" : "Unverified",
      badgeVariant: user.email_confirmed_at ? "secondary" : "destructive"
    },
    {
      label: "Role",
      value: user.role || "Not assigned",
      badge: user.role === "healthcare_worker" ? "Staff" : "Patient",
      badgeVariant: "secondary"
    },
    {
      label: "Account Created",
      value: user.created_at ? new Date(user.created_at).toLocaleString() : 'Not available',
    },
    {
      label: "Last Sign In",
      value: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Not available',
    },
    {
      label: "Account ID",
      value: user.id,
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Account Information */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-white to-blue-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-blue-600">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {details.map((detail, i) => (
            <div key={i} className="space-y-2 relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100 hover:before:bg-blue-300 before:transition-colors">
              <div className="text-sm font-medium text-blue-600/80">
                {detail.label}
              </div>
              <div className="font-medium flex items-center gap-2 text-gray-700">
                {detail.value}
                {detail.badge && (
                  <Badge 
                    variant={detail.badgeVariant || "secondary"} 
                    className={`ml-2 ${detail.badgeVariant === "destructive" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                  >
                    {detail.badge}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Authentication Details */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-white to-blue-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-blue-600">Authentication Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100 hover:before:bg-blue-300 before:transition-colors">
            <div className="text-sm font-medium text-blue-600/80">
              Authentication Provider
            </div>
            <div className="font-medium text-gray-700 capitalize">
              {user.app_metadata?.provider || "Email"}
            </div>
          </div>
          <div className="space-y-2 relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100 hover:before:bg-blue-300 before:transition-colors">
            <div className="text-sm font-medium text-blue-600/80">
              Multi-factor Authentication
            </div>
            <div className="font-medium text-gray-700 flex items-center gap-2">
              Not configured
              <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
                Recommended
              </Badge>
            </div>
          </div>
          <div className="space-y-2 relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-100 hover:before:bg-blue-300 before:transition-colors">
            <div className="text-sm font-medium text-blue-600/80">
              Phone Number
            </div>
            <div className="font-medium text-gray-700">
              {user.phone || "Not added"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
