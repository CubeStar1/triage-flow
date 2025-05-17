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
          <Card className="p-6 bg-card border border-border/70 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Stethoscope className="h-7 w-7 mr-3 text-blue-500" />
              <h2 className="text-xl font-semibold text-card-foreground">Describe Your Symptoms</h2>
            </div>
            <FormLabel htmlFor="symptoms-textarea" className="text-sm font-medium text-muted-foreground">
              Please provide as much detail as possible about what you are experiencing.
            </FormLabel>
            <FormControl>
              <Textarea
                id="symptoms-textarea"
                placeholder="E.g., I have a rash on my arm that is red and itchy, and I've had a slight fever for two days..."
                rows={6}
                className="resize-none focus:ring-2 focus:ring-blue-400 border-border/80 rounded-md p-3 mt-2 w-full"
                {...field}
              />
            </FormControl>
            <FormDescription className="mt-3 text-xs text-muted-foreground">
              The more information you provide, the better our assistant can help.
            </FormDescription>
            <FormMessage className="mt-2" />
          </Card>
        </FormItem>
      )}
    />
  );
} 