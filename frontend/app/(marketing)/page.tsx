"use client"

import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { CTA } from "@/components/landing/cta"
import { SystemFlow } from "@/components/landing/system-flow"
import { FeatureDetails } from "@/components/landing/feature-details"
import { cn } from "@/lib/utils"
import { GridPattern } from "@/components/magicui/grid-pattern"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background opacity-90" />
        
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          strokeDasharray={"6 3"}
          className={cn(
            "absolute inset-0 h-full w-full",
            "stroke-foreground/[0.1] dark:stroke-foreground/[0.15]",
            "[mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
          )}
        />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <SystemFlow />
        <FeatureDetails />
        <Features />
        <CTA />
      </div>
    </main>
  )
}