import { LucideIcon } from "lucide-react"

export interface HeaderLink {
  href: string
  label: string
  icon?: LucideIcon
  description?: string
}

export interface HeaderConfig {
  brand: {
    title: string
    icon: string
  }
  navigationLinks: HeaderLink[]
}

export const headerConfig: HeaderConfig = {
  brand: {
    title: "Smart Triage",
    icon: "/logos/health-triage-logo.png"
  },
  navigationLinks: [
    {
      href: "/",
      label: "Home"
    },
    {
      href: "/dashboard",
      label: "Dashboard"
    },
    {
      href: "/assessment/new",
      label: "New Assessment"
    },
    {
      href: "/contact",
      label: "Contact"
    }
  ]
}