"use client";

import { NewAssessmentForm } from "@/components/assessment-new/new-assessment-form";
import { FileText, Activity, ShieldCheck, Users, MessageCircleQuestion } from "lucide-react"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientText } from "@/components/global/gradient-text";
export default function NewAssessmentPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
      <header className="relative mb-10 md:mb-12 text-center pb-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        </div>
        <div className="inline-flex items-center justify-center p-3 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 rounded-full blur" />
          <div className="relative bg-white dark:bg-gray-900 rounded-full p-4 shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <FileText size={40} className="text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
          New Triage Assessment
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 mx-auto mb-6 rounded-full" />
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
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