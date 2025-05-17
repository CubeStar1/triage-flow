export interface FooterLink {
  href: string
  label: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterConfig {
  brand: {
    title: string
    description: string
  }
  sections: FooterSection[]
  copyright: string
}

export const footerConfig: FooterConfig = {
  brand: {
    title: "Smart Triage Assistant",
    description: "AI-powered medical triage system combining vision and language understanding"
  },
  sections: [
    {
      title: "Features",
      links: [
        { href: "/assessment/new", label: "New Assessment" },
        { href: "/dashboard", label: "Medical Dashboard" },
        { href: "/assessment", label: "Assessment History" },
        { href: "/pricing", label: "Healthcare Plans" }
      ]
    },
    {
      title: "Solutions",
      links: [
        { href: "#", label: "Emergency Rooms" },
        { href: "#", label: "Primary Care" },
        { href: "#", label: "Rural Healthcare" },
        { href: "#", label: "Telemedicine" }
      ]
    },
    {
      title: "Technology",
      links: [
        { href: "#", label: "Gemini ADK" },
        { href: "#", label: "ResNet Model" },
        { href: "#", label: "RAG System" },
        { href: "#", label: "API Reference" }
      ]
    },
    {
      title: "Compliance",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/hipaa", label: "HIPAA Compliance" },
        { href: "/security", label: "Data Security" }
      ]
    }
  ],
  copyright: `© ${new Date().getFullYear()} Smart Triage Assistant. All rights reserved.`
}
