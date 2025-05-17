import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { AssessmentApiPayload } from '@/lib/fetchers/assessment';


export async function POST(request: Request) {
  try {
    const body = await request.json() as AssessmentApiPayload;
    
    // Initialize Supabase client
    const supabase = await createSupabaseServer();

    const {
      symptoms,
      userId,
      imageUrl,
      imageStoragePath,
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

    if (!symptoms) {
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

    // Image upload is now handled on the client side

    // Create assessment in database
    const { data: assessment, error: dbError } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: userId,
          symptom_description: symptoms,
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
          pre_existing_conditions: preExistingConditions
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
