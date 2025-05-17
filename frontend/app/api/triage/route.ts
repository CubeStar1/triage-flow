import { NextResponse } from 'next/server';
import type { TriageData } from '@/lib/fetchers/assessment';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // First get all assessments
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (assessmentError) {
      console.error('Error fetching assessments:', assessmentError);
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }

    if (!assessments) {
      return NextResponse.json([]);
    }

    // Get all possible diagnoses for these assessments
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from('possible_diagnoses')
      .select('*')
      .in('assessment_id', assessments.map(a => a.id))
      .order('confidence_score', { ascending: false });

    if (diagnosesError) {
      console.error('Error fetching diagnoses:', diagnosesError);
      return NextResponse.json({ error: 'Failed to fetch diagnoses' }, { status: 500 });
    }

    // Group diagnoses by assessment ID
    const diagnosesMap = (diagnoses || []).reduce((acc, diagnosis) => {
      const assessmentId = diagnosis.assessment_id;
      if (!acc[assessmentId]) {
        acc[assessmentId] = [];
      }
      acc[assessmentId].push({
        id: diagnosis.id,
        assessmentId: diagnosis.assessment_id,
        name: diagnosis.diagnosis_name,
        confidence: diagnosis.confidence_score,
        description: diagnosis.description,
        createdAt: diagnosis.created_at
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Map the data to TriageData format
    const triageDataList: TriageData[] = assessments.map(assessment => ({
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
      predictedInjuryLabel: assessment.predicted_injury_label,
      injuryDescriptionSummary: assessment.injury_description_summary,
      severityScore: assessment.severity_score,
      severityReason: assessment.severity_reason,
      recommendationStatus: assessment.recommendation_status,
      triageRecommendation: assessment.triage_recommendation,
      possibleDiagnoses: diagnosesMap[assessment.id] || [],
      createdAt: assessment.created_at,
      updatedAt: assessment.updated_at
    }));

    return NextResponse.json(triageDataList);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}