"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

type UserWithRole = User & {
  role?: 'healthcare_worker' | 'patient';
};

export default function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createSupabaseBrowser();
      const { data: authData } = await supabase.auth.getUser();
      
      if (authData.user) {
        // Fetch user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id)
          .single();

        // Combine user data with role
        return {
          ...authData.user,
          role: roleData?.role
        } as UserWithRole;
      }
      
      return {} as UserWithRole;
    },
  });
}
