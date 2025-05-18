import { motion } from "framer-motion"
import { Camera, Brain, FileText, Bot, Scale, MessageSquareText } from "lucide-react"
import Image from "next/image"

const flowSteps = [
  {
    title: "Image Upload",
    description: "Upload photos of skin conditions or injuries. Our ResNet model analyzes the images for accurate condition classification",
    icon: Camera,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    shadowColor: "shadow-blue-500/25",
  },
  {
    title: "Symptom Analysis",
    description: "Describe your symptoms in natural language. Our AI processes both text and images for comprehensive understanding",
    icon: Brain,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    shadowColor: "shadow-green-500/25",
  },
  {
    title: "Knowledge Retrieval",
    description: "Our RAG system searches medical knowledge bases to find relevant condition information and protocols",
    icon: FileText,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    shadowColor: "shadow-purple-500/25",
  },
  {
    title: "Agent Processing",
    description: "Gemini ADK agents work together to analyze conditions and generate clear medical explanations",
    icon: Bot,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    shadowColor: "shadow-orange-500/25",
  },
  {
    title: "Severity Assessment",
    description: "AI assigns evidence-based severity scores with detailed reasoning and confidence levels",
    icon: Scale,
    gradient: "from-red-500 via-rose-500 to-pink-500",
    shadowColor: "shadow-red-500/25",
  },
  {
    title: "Triage Results",
    description: "Get clear recommendations with next steps, whether it's home care, doctor visit, or urgent care",
    icon: MessageSquareText,
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    shadowColor: "shadow-cyan-500/25",
  },
]

export function SystemFlow() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          How Our{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#0070F3] bg-clip-text text-transparent">
            AI Works
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Experience our advanced multimodal triage system powered by Gemini ADK agents and deep learning
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {flowSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative group"
          >
            <div 
              className={`
                h-full rounded-2xl p-1 transition-all duration-300 
                bg-gradient-to-br ${step.gradient} opacity-75 hover:opacity-100
                hover:scale-[1.02] hover:-translate-y-1
              `}
            >
              <div className="h-full rounded-xl bg-background/90 p-6 backdrop-blur-xl">
                <div className={`
                  size-14 rounded-lg bg-gradient-to-br ${step.gradient}
                  flex items-center justify-center ${step.shadowColor}
                  shadow-lg transition-shadow duration-300 group-hover:shadow-xl
                `}>
                  <step.icon className="size-7 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative mx-auto mt-16 sm:mt-20 lg:mt-24"
      >
        <div className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80">
          <Image
            src="/landing/triage_architecture.png"
            alt="Smart Triage System Architecture"
            width={1200}
            height={800}
            quality={100}
            className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
          />
        </div>
      </motion.div>
    </section>
  )
}