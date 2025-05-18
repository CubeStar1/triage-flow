import { NextResponse } from 'next/server';
import type { TriageData, PossibleDiagnosis } from '@/lib/fetchers/assessment';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const supabase = await createSupabaseServer();

    // Fetch the main assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (assessmentError) throw assessmentError;
    if (!assessment) {
      return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
    }

    // Fetch possible diagnoses for this assessment
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from('possible_diagnoses')
      .select('*')
      .eq('assessment_id', id)
      .order('confidence_score', { ascending: false });

    if (diagnosesError) throw diagnosesError;

    // Transform the data to match the TriageData interface
    const triageData: TriageData = {
      id: assessment.id,
      userId: assessment.user_id,
      symptomDescription: assessment.symptom_description,
      imageFileName: assessment.image_file_name,
      imageFileType: assessment.image_file_type,
      imageUrl: assessment.image_url,
      imageStoragePath: assessment.image_storage_path,
      patientName: assessment.patient_name,
      patientAge: assessment.patient_age,
      patientSex: assessment.patient_sex,
      symptomDuration: assessment.symptom_duration,
      painLevel: assessment.pain_level,
      affectedBodyParts: assessment.affected_body_parts,
      hasFever: assessment.has_fever || false,
      temperatureCelsius: assessment.temperature_celsius,
      knownAllergies: assessment.known_allergies,
      currentMedications: assessment.current_medications,
      recentTravel: assessment.recent_travel === 'yes' ? 'yes' : 'no',
      preExistingConditions: assessment.pre_existing_conditions,
      predictedInjuryLabel: assessment.predicted_injury_label || 'Unknown',
      injuryDescriptionSummary: assessment.injury_description_summary || 'No description available',
      severityScore: assessment.severity_score || 0,
      severityReason: assessment.severity_reason || 'No severity reason provided',
      triageRecommendation: assessment.triage_recommendation || 'No recommendation available',
      recommendationStatus: assessment.recommendation_status || 'mild',
      possibleDiagnoses: diagnoses?.map(d => ({
        id: d.id,
        assessmentId: d.assessment_id,
        name: d.diagnosis_name,
        confidence: d.confidence_score,
        description: d.description,
        createdAt: d.created_at
      })) as PossibleDiagnosis[],
      createdAt: assessment.created_at || new Date().toISOString(),
      updatedAt: assessment.updated_at || new Date().toISOString()
    };

    return NextResponse.json(triageData);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { message: 'Error fetching assessment data' },
      { status: 500 }
    );
  }
}
