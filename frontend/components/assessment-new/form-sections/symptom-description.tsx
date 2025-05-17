"use client";

import { UseFormReturn } from 'react-hook-form';
import { AssessmentFormData } from '../new-assessment-form'; // Adjust path as needed
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Stethoscope } from 'lucide-react'; // Changed Icon for consistency with original form block

interface SymptomDescriptionSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function SymptomDescriptionSection({ form }: SymptomDescriptionSectionProps) {
  return (
    <FormField
      control={form.control}
      name="symptoms"
      render={({ field }) => (
        <FormItem>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center mb-2">
                <Stethoscope className="h-6 w-6 mr-3 text-blue-500" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Describe Your Symptoms</h2>
              </div>
              <FormLabel htmlFor="symptoms-textarea" className="text-slate-600 dark:text-slate-300">
                Please provide as much detail as possible about what you are experiencing.
              </FormLabel>
            </div>
            <div className="p-4 bg-white/50 dark:bg-slate-900/50">
              <FormControl>
                <Textarea
                  id="symptoms-textarea"
                  placeholder="E.g., I have a rash on my arm that is red and itchy, and I've had a slight fever for two days..."
                  rows={6}
                  className="resize-none focus:ring-2 focus:ring-blue-400 border-slate-200 dark:border-slate-700 rounded-lg p-3 w-full bg-white dark:bg-slate-900"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                The more information you provide, the better our assistant can help.
              </FormDescription>
              <FormMessage className="mt-2" />
            </div>
          </Card>
        </FormItem>
      )}
    />
  );
} 