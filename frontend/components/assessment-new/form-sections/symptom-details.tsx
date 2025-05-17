"use client";

import { UseFormReturn } from 'react-hook-form';
import { AssessmentFormData } from '../new-assessment-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Stethoscope, CalendarDays, Smile, MapPin, Thermometer } from 'lucide-react';

interface SymptomDetailsSectionProps {
  form: UseFormReturn<AssessmentFormData>;
}

export function SymptomDetailsSection({ form }: SymptomDetailsSectionProps) {
  const watchHasFever = form.watch("hasFever");

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center">
          <Stethoscope className="h-6 w-6 mr-3 text-primary" />
          <CardTitle className="text-2xl">Symptom Details</CardTitle>
        </div>
        <CardDescription>Help us understand more about the current symptoms.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <FormField 
          control={form.control} 
          name="symptomDuration" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center"><CalendarDays size={16} className="mr-2 opacity-70"/>Symptom Duration</FormLabel>
              <FormControl><Input placeholder="E.g., 2 days, 1 week" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name="painLevel" 
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium flex items-center"><Smile size={16} className="mr-2 opacity-70"/>Pain Level (0-10)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select pain level" /></SelectTrigger></FormControl>
                <SelectContent>
                  {Array.from({ length: 11 }, (_, i) => <SelectItem key={i} value={String(i)}>{i} - {i === 0 ? "No pain" : i <= 3 ? "Mild" : i <= 6 ? "Moderate" : i <=9 ? "Severe" : "Extreme"}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control} 
          name="affectedBodyParts" 
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="font-medium flex items-center"><MapPin size={16} className="mr-2 opacity-70"/>Affected Body Part(s)</FormLabel>
              <FormControl><Input placeholder="E.g., Left arm, stomach area" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2 flex items-center gap-x-3 pt-2 md:col-span-2">
          <FormField 
            control={form.control} 
            name="hasFever" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-medium flex items-center cursor-pointer"><Thermometer size={16} className="mr-2 opacity-70"/>Fever Present?</FormLabel>
              </FormItem>
            )}
          />
          {watchHasFever && (
            <FormField 
              control={form.control} 
              name="temperature" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-medium">Temperature (°C)</FormLabel>
                  <FormControl><Input type="number" placeholder="E.g., 38.5" {...field} step="0.1" onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 