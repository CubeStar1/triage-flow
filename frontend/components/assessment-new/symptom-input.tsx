"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquareText } from 'lucide-react'; // Colorful icon for symptoms

interface SymptomInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SymptomInput({ value, onChange }: SymptomInputProps) {
  return (
    <div className="p-6 bg-card border border-border/70 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <MessageSquareText className="h-7 w-7 mr-3 text-blue-500" />
        <h2 className="text-xl font-semibold text-card-foreground">Describe Your Symptoms</h2>
      </div>
      <div className="space-y-2">
        <Label htmlFor="symptoms" className="text-sm font-medium text-muted-foreground">
          Please provide as much detail as possible about what you are experiencing.
        </Label>
        <Textarea
          id="symptoms"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder="E.g., I have a rash on my arm that is red and itchy, and I've had a slight fever for two days..."
          rows={6}
          className="resize-none focus:ring-2 focus:ring-blue-400 border-border/80 rounded-md p-3"
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        The more information you provide, the better our assistant can help.
      </p>
    </div>
  );
} 