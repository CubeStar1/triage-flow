"use client";

import { UseFormReturn } from 'react-hook-form';
import type { AssessmentFormData } from '../new-assessment-form'; // Adjust path as needed
import { ImageUploader } from '../image-uploader'; // Adjust path as needed
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

interface ImageUploadSectionProps {
  form: UseFormReturn<AssessmentFormData>;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}

export function ImageUploadSection({ form, imageFile, setImageFile }: ImageUploadSectionProps) {
  return (
    <FormField
      control={form.control}
      name="image" // RHF stores base64 string here, but ImageUploader works with File
      render={({ field }) => ( 
        <FormItem>
          <ImageUploader 
            imageFile={imageFile} 
            onImageChange={(file) => {
              setImageFile(file); 
              // Base64 conversion and RHF update for 'image' field happens in parent NewAssessmentForm's onSubmit
              // If direct RHF update is needed here, it would be:
              // if (file) { fileToDataUrl(file).then(b64 => field.onChange(b64)); } else { field.onChange(undefined); }
              // However, keeping it in onSubmit simplifies this section.
            }}
          />
          <FormMessage className="mt-2" />
        </FormItem>
      )}
    />
  );
} 