import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex-grow flex flex-col overflow-hidden min-h-0">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-0 flex-shrink-0">
          <div className="flex items-center mb-6 pt-6">
            <Skeleton className="h-8 w-8 mr-3 rounded-md" />
            <Skeleton className="h-8 w-60 rounded-md" />
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex-grow grid grid-cols-1 lg:grid-cols-5 gap-6 xl:gap-8 overflow-hidden min-h-0">
          {/* Left Column Skeleton with Tabs indication - simplified */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="grid w-full grid-cols-2 h-10 rounded-md border p-1 gap-1">
              <Skeleton className="h-full w-full rounded-sm" />
              <Skeleton className="h-full w-full rounded-sm bg-transparent" />
            </div>
            {/* Skeleton for the active tab content (e.g., image viewer part) */}
            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            <Skeleton className="h-5 w-3/4 mt-1 rounded-md self-center lg:self-start" />
          </div>
          
          {/* Right Column: Triage Details Skeleton (structure remains, can remove bg-muted from inner skeletons for consistency if desired) */}
          <div className="lg:col-span-3 flex flex-col bg-card shadow-lg rounded-xl border border-border">
            <div className="p-5 flex-grow space-y-5 overflow-y-auto">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center mb-2">
                  <Skeleton className="h-6 w-6 mr-3 rounded-sm" />
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full mb-1 rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
              <div className="p-4 rounded-lg border-l-4 border-primary/20 bg-muted/50">
                <div className="flex items-center mb-2">
                  <Skeleton className="h-7 w-7 mr-3 rounded-full" />
                  <Skeleton className="h-6 w-2/3 rounded-md" />
                </div>
                <Skeleton className="h-4 w-1/2 mb-1 rounded-md" />
                <Skeleton className="h-4 w-full mb-1 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center mb-2">
                  <Skeleton className="h-5 w-5 mr-3 rounded-sm" />
                  <Skeleton className="h-5 w-1/2 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
              <div>
                <div className="flex items-center mb-2 mt-3">
                  <Skeleton className="h-5 w-5 mr-2 rounded-sm" />
                  <Skeleton className="h-5 w-2/5 rounded-md" />
                </div>
                <div className="space-y-1">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/70 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                        <Skeleton className="h-4 w-1/4 rounded-md" />
                      </div>
                      <Skeleton className="h-3 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* No button skeleton here as they are in the main page footer */}
          </div>
        </div>
      </div>
      {/* No sticky footer skeleton needed here as it's part of the actual page when data loads */}
    </div>
  );
} 