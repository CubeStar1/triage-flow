import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { CreateAssessmentPayload } from '@/lib/fetchers/assessment';


export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateAssessmentPayload;
    
    // Initialize Supabase client
    const supabase = await createSupabaseServer();

    const {
      symptoms,
      image,
      imageFileName,
      imageFileType,
      userId,
      patientName,
      patientAge,
      patientSex,
      symptomDuration,
      painLevel,
      affectedBodyParts,
      hasFever,
      temperature,
      knownAllergies,
      currentMedications,
      recentTravel,
      preExistingConditions
    } = body;

    if (!symptoms && !image) {
      return NextResponse.json(
        { error: 'At least symptoms or an image must be provided.' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Upload image to Supabase Storage if provided
    let imageUrl, imageStoragePath;
    if (image && imageFileName && imageFileType) {
      const base64Data = image.split(',')[1]; // Remove data URL prefix
      const buffer = Buffer.from(base64Data, 'base64');

      const { data, error: uploadError } = await supabase.storage
        .from('assessment-images')
        .upload(
          `${userId}/${new Date().toISOString()}-${imageFileName}`,
          buffer,
          { contentType: imageFileType }
        );

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image.' },
          { status: 500 }
        );
      }

      imageStoragePath = data.path;
      const { data: { publicUrl } } = supabase.storage
        .from('assessment-images')
        .getPublicUrl(imageStoragePath);
      
      imageUrl = publicUrl;
    }

    // Create assessment in database
    const { data: assessment, error: dbError } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: userId,
          symptom_description: symptoms,
          image_file_name: imageFileName,
          image_file_type: imageFileType,
          image_url: imageUrl,
          image_storage_path: imageStoragePath,
          patient_name: patientName,
          patient_age: patientAge,
          patient_sex: patientSex,
          symptom_duration: symptomDuration,
          pain_level: painLevel,
          affected_body_parts: affectedBodyParts,
          has_fever: hasFever,
          temperature_celsius: temperature,
          known_allergies: knownAllergies,
          current_medications: currentMedications,
          recent_travel: recentTravel,
          pre_existing_conditions: preExistingConditions,
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create assessment.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      assessmentId: assessment.id,
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
