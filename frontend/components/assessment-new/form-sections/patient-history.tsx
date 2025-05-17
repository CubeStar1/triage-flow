"use client";

import { Control, UseFormReturn } from 'react-hook-form';
import { AssessmentFormData } from '../new-assessment-form'; // Adjust path as needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { User } from 'lucide-react';

interface PatientInfoSectionProps {
  form: UseFormReturn<AssessmentFormData>; // Pass the entire form object
}

export function PatientInfoSection({ form }: PatientInfoSectionProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <User className="h-6 w-6 mr-3 text-purple-500" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Patient Information</CardTitle>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-300">Please provide some basic information about the patient.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white/50 dark:bg-slate-900/50 rounded-b-xl">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Full Name</FormLabel>
              <FormControl><Input placeholder="E.g., John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Age</FormLabel>
              <FormControl><Input type="number" placeholder="E.g., 30" {...field} min="0" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="patientSex"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Sex/Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select sex/gender" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
} 