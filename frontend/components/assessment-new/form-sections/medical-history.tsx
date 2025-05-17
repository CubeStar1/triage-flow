"use client";

import { UseFormReturn } from 'react-hook-form';
import { AssessmentFormData } from '../new-assessment-form'; // Adjust path as needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Droplets, AlertTriangle, Pill, Plane } from 'lucide-react';

interface MedicalHistorySectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function MedicalHistorySection({ form }: MedicalHistorySectionProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900">
      <CardHeader className="pb-2">
        <div className="flex items-center"> <Droplets className="h-6 w-6 mr-3 text-emerald-500" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Medical History & Lifestyle</CardTitle>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-300">This information can help provide a more accurate assessment.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/50 dark:bg-slate-900/50 rounded-b-xl">
        <FormField 
          control={form.control} 
          name="knownAllergies" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center"><AlertTriangle size={16} className="mr-2 text-emerald-500"/>Known Allergies (Optional)</FormLabel>
              <FormControl><Textarea placeholder="E.g., Penicillin, peanuts" {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name="currentMedications" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center"><Pill size={16} className="mr-2 text-emerald-500"/>Current Medications (Optional)</FormLabel>
              <FormControl><Textarea placeholder="E.g., Metformin 500mg, Aspirin 81mg" {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name="preExistingConditions" 
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="font-medium">Pre-existing Conditions (Optional)</FormLabel>
              <FormControl><Textarea placeholder="E.g., Asthma, Hypertension" {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name="recentTravel" 
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-medium flex items-center"><Plane size={16} className="mr-2 opacity-70"/>Recent Intl. Travel (30 Days)?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-1">
                  <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal cursor-pointer">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal cursor-pointer">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
} 