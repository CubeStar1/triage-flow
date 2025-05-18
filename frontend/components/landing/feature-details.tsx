import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Multimodal Input Processing",
    description: "Upload images of skin conditions along with text descriptions of symptoms. Our system processes both inputs simultaneously using advanced computer vision and natural language understanding.",
    image: "/landing/postspark/tf-form.png",
    darkImage: "/landing/postspark/tf-form.png",
    alt: "Multimodal input interface",
  },
  {
    title: "ResNet Image Classification",
    description: "Powered by transfer learning on ResNet18, our image classification model is fine-tuned on the DermNet dataset to accurately identify various skin conditions and injuries.",
    image: "/landing/postspark/tf-triage-agentflow.png",
    darkImage: "/landing/postspark/tf-triage-agentflow.png",
    alt: "ResNet classification visualization",
  },
  {
    title: "RAG Knowledge System",
    description: "Our retrieval-augmented generation system uses a structured medical PDF knowledge base to provide accurate, up-to-date information about identified conditions.",
    image: "/landing/postspark/tf-triage-output.png",
    darkImage: "/landing/postspark/tf-triage-output.png",
    alt: "RAG system interface",
  },
  {
    title: "Gemini ADK Agent 1",
    description: "The first AI agent in our pipeline specializes in retrieving and summarizing medical descriptions, translating technical terms into clear, understandable language.",
    image: "/landing/postspark/tf-dashboard.png",
    darkImage: "/landing/postspark/tf-dashboard.png",
    alt: "First agent interface",
  },
  {
    title: "Gemini ADK Agent 2",
    description: "Our second agent analyzes the compiled information to assign evidence-based severity scores (1-5), providing clear reasoning and confidence levels for each assessment.",
    image: "/landing/postspark/tf-history.png",
    darkImage: "/landing/postspark/tf-history.png",
    alt: "Second agent interface",
  },
  {
    title: "Voice Assistant",
    description: "Interact with our AI system through voice commands. Describe your symptoms naturally, and let our voice assistant guide you through the assessment process.",
    image: "/landing/postspark/tf-voice.png",
    darkImage: "/landing/postspark/tf-voice.png",
    alt: "Voice assistant interface",
  },
  {
    title: "Video Consultation",
    description: "Connect with healthcare professionals through secure video calls for remote consultations and follow-up discussions about your assessment results.",
    image: "/landing/postspark/tf-video.png",
    darkImage: "/landing/postspark/tf-video.png",
    alt: "Video consultation interface",
  }
]

export function FeatureDetails() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Powerful{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#0070F3] bg-clip-text text-transparent">
            AI Agents
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Experience our advanced Gemini ADK-powered pipeline combining vision AI, language understanding, and medical knowledge
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col gap-8 lg:items-center ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <button className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80"
              >
                <div className="block dark:hidden">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    quality={100}
                    className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                  />
                </div>
                <div className="hidden dark:block">
                  <Image
                    src={feature.darkImage}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    quality={100}
                    className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 