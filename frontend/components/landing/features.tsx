"use client"

import { motion } from "framer-motion"
import { Stethoscope, Brain, Camera, FileText, MessageSquareText, Scale, Bot, Database, Shield, Zap } from "lucide-react"
import SectionBadge from "@/components/ui/section-badge"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Multimodal Analysis",
    info: "Advanced AI that combines both image analysis and text symptoms for more accurate triage decisions",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Image Classification",
    info: "ResNet-powered deep learning model trained on DermNet dataset for accurate skin condition analysis",
    icon: Camera,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "RAG-Based Knowledge",
    info: "Retrieval-augmented generation using structured medical knowledge base for accurate condition descriptions",
    icon: FileText,
    gradient: "from-purple-500 to-violet-500",
  },
  {
    title: "Agent-Driven Insights",
    info: "Gemini ADK agents work together to analyze conditions and provide detailed medical explanations",
    icon: Bot,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    title: "Severity Scoring",
    info: "AI agent assigns evidence-based severity scores with clear reasoning and confidence levels",
    icon: Scale,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Explainable AI",
    info: "Transparent decision-making process with detailed reasoning for each triage recommendation",
    icon: MessageSquareText,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Medical Knowledge Base",
    info: "Structured database of medical conditions and protocols ensuring accurate and up-to-date information",
    icon: Database,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Secure Processing",
    info: "End-to-end encrypted processing of sensitive medical data with HIPAA compliance",
    icon: Shield,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Real-time Pipeline",
    info: "Fast, modular processing pipeline from image upload to final triage recommendation",
    icon: Zap,
    gradient: "from-pink-500 to-rose-500",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Features() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="text-center">
        <SectionBadge title="Features" />
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          AI-Powered Triage Agents
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Multimodal analysis combining vision and language AI with Gemini ADK agents for accurate medical triage
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-8",
                "ring-1 ring-foreground/10 backdrop-blur-xl transition-all duration-300 hover:ring-foreground/20",
                "dark:from-muted/30 dark:to-background/80"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                  feature.gradient,
                  "ring-1 ring-foreground/10"
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                {feature.info}
              </p>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                feature.gradient,
                "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              )} />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  )
} 