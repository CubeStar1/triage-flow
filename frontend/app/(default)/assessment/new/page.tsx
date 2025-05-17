"use client";

import { NewAssessmentForm } from "@/components/assessment-new/new-assessment-form";
import { FileText, Activity, ShieldCheck, Users, MessageCircleQuestion } from "lucide-react"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewAssessmentPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
      <header className="mb-10 md:mb-12 text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <FileText size={40} className="text-primary" /> 
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          New Triage Assessment
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Please provide detailed information below. The more accurate and complete your input, the better our Smart Triage Assistant can guide you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <NewAssessmentForm />
        </div>

        <aside className="lg:col-span-1 order-1 lg:order-2 space-y-6 lg:sticky lg:top-24">
          <Card className="shadow-lg bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Activity size={24} className="mr-3 text-primary" />
                <CardTitle className="text-xl">How It Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>1. Describe:</strong> Fill in your details and symptoms.</p>
              <p><strong>2. Upload (Optional):</strong> Add an image if relevant.</p>
              <p><strong>3. Submit:</strong> Our AI will analyze the information.</p>
              <p><strong>4. Get Guidance:</strong> Receive an initial assessment and next steps.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-green-500/5 via-transparent to-transparent dark:from-green-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <ShieldCheck size={24} className="mr-3 text-green-600 dark:text-green-500" />
                <CardTitle className="text-xl">Data Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Your information is handled securely and used solely for providing your triage assessment. We prioritize your privacy.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-gradient-to-br from-blue-500/5 via-transparent to-transparent dark:from-blue-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <MessageCircleQuestion size={24} className="mr-3 text-blue-600 dark:text-blue-500" />
                <CardTitle className="text-xl">Need Help?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>If you are experiencing a medical emergency, please call your local emergency number immediately or visit the nearest emergency room.</p>
            </CardContent>
          </Card>

        </aside>
      </div>
    </div>
  );
} 