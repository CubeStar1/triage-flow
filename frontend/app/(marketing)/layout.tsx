import { Metadata } from "next"
import { Header } from "@/components/global/header"
import { headerConfig } from "@/lib/config/header"
import Footer from "@/components/global/footer"
import { footerConfig } from "@/lib/config/footer"

export const metadata: Metadata = {
  title: "NextJS Template",
  description: "NextJS Template",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <main>
            <Header config={headerConfig} />
            {children}
            <Footer config={footerConfig} />
        </main>
  )
} 