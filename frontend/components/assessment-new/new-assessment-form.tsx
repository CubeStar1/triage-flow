"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, AlertTriangle, User, CalendarDays, Droplets, Thermometer, Pill, Plane, Stethoscope, MapPin, Smile } from 'lucide-react';
import { createAssessment, type CreateAssessmentPayload } from '@/lib/fetchers/assessment';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useUser from '@/hooks/use-user';

// Import section components
import { PatientInfoSection } from './form-sections/patient-history';
import { SymptomDescriptionSection } from './form-sections/symptom-description';
import { SymptomDetailsSection } from './form-sections/symptom-details';
import { ImageUploadSection } from './form-sections/image-upload';
import { MedicalHistorySection } from './form-sections/medical-history';

// Form schema matches CreateAssessmentPayload type
const assessmentFormSchema = z.object({
  patientName: z.string().optional(),
  patientAge: z.union([
    z.number().positive("Age must be a positive number").int("Age must be an integer"),
    z.literal('')
  ]).optional(),
  patientSex: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
  symptomDuration: z.string().optional(),
  painLevel: z.string().optional(),
  affectedBodyParts: z.string().optional(),
  hasFever: z.boolean().optional(),
  temperature: z.union([
    z.number().min(35, "Temperature must be at least 35°C").max(42, "Temperature must be at most 42°C"),
    z.literal('')
  ]).optional(),
  knownAllergies: z.string().optional(),
  currentMedications: z.string().optional(),
  recentTravel: z.enum(['yes', 'no']).optional(),
  preExistingConditions: z.string().optional(),
  image: z.string().optional(), // Base64 string for image
  imageFileName: z.string().optional(),
  imageFileType: z.string().optional(),
});

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;

// Helper to convert file to Base64
const fileToDataUrl = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function NewAssessmentForm() {
  const router = useRouter();
  const { data: user } = useUser();
  console.log(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      patientName: "",
      patientAge: '',
      patientSex: undefined,
      symptoms: '',
      symptomDuration: '',
      painLevel: '',
      affectedBodyParts: '',
      hasFever: false,
      temperature: '',
      knownAllergies: '',
      currentMedications: '',
      recentTravel: undefined,
      preExistingConditions: '',
      image: undefined,
      imageFileName: undefined,
      imageFileType: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AssessmentFormData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      let imageUrl, imageStoragePath;
      
      // Handle image upload on client side if image exists
      if (imageFile) {
        const supabase = createSupabaseBrowser();
        const timestamp = new Date().toISOString();
        const path = `${user.id}/${timestamp}-${imageFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assessment-images')
          .upload(path, imageFile);

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        imageStoragePath = uploadData.path;
        const { data: { publicUrl } } = supabase.storage
          .from('assessment-images')
          .getPublicUrl(imageStoragePath);
        
        imageUrl = publicUrl;
      }
      
      const payload: CreateAssessmentPayload = {
        ...data,
        userId: user.id,
        imageUrl,
        imageStoragePath
      };
      
      return createAssessment(payload);
    },
    onSuccess: (data) => {
      router.push(`/assessment/${data.assessmentId}`);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let submissionData = { ...data };

      // Handle image upload if present
      if (imageFile) {
        try {
          const base64Image = await fileToDataUrl(imageFile);
          submissionData = {
            ...submissionData,
            image: base64Image,
            imageFileName: imageFile.name,
            imageFileType: imageFile.type
          };
        } catch (error) {
          console.error('Error converting image to Base64:', error);
          setError('Could not process image file.');
          setIsSubmitting(false);
          return;
        }
      }

      // Validate that either symptoms or image is provided
      if (!submissionData.symptoms && !imageFile) {
        setError('Please describe your symptoms or upload an image.');
        setIsSubmitting(false);
        return;
      }

      // Convert empty strings to undefined for numeric fields
      if (submissionData.patientAge === '') submissionData.patientAge = undefined;
      if (submissionData.temperature === '') submissionData.temperature = undefined;

      await mutation.mutateAsync(submissionData);
    } catch (error) {
      // Error handling is done in mutation callbacks
      console.error('Form submission error:', error);
    }
  }

  // Redirect to login if no user
  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>New Assessment</CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help us assess your condition accurately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Patient Information Section */}
            <PatientInfoSection form={form} />

            {/* Symptom Description Section */}
            <SymptomDescriptionSection form={form} />

            {/* Symptom Details Section */}
            <SymptomDetailsSection form={form} />

            {/* Image Upload Section */}
            <ImageUploadSection form={form} imageFile={imageFile} setImageFile={setImageFile} />

            {/* Medical History Section */}
            <MedicalHistorySection form={form} />

            {error && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Assessment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
} 