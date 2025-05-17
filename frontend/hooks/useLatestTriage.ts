"use client";

import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { TriageData } from '@/lib/fetchers/assessment';

export function useLatestTriage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [latestTriage, setLatestTriage] = useState<TriageData | null>(null);

  useEffect(() => {
    async function fetchLatestTriage() {
      try {
        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        // Transform the data to match TriageData interface
        const transformedData: TriageData = {
          id: data.id,
          userId: data.user_id,
          symptomDescription: data.symptom_description,
          imageFileName: data.image_file_name,
          imageFileType: data.image_file_type,
          imageUrl: data.image_url,
          imageStoragePath: data.image_storage_path,
          patientName: data.patient_name,
          patientAge: data.patient_age,
          patientSex: data.patient_sex,
          symptomDuration: data.symptom_duration,
          painLevel: data.pain_level,
          affectedBodyParts: data.affected_body_parts,
          hasFever: data.has_fever,
          temperatureCelsius: data.temperature_celsius,
          knownAllergies: data.known_allergies,
          currentMedications: data.current_medications,
          recentTravel: data.recent_travel,
          preExistingConditions: data.pre_existing_conditions,
          predictedInjuryLabel: data.predicted_injury_label,
          injuryDescriptionSummary: data.injury_description_summary,
          severityScore: data.severity_score,
          severityReason: data.severity_reason,
          recommendationStatus: data.recommendation_status,
          triageRecommendation: data.triage_recommendation,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        setLatestTriage(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch latest triage'));
      } finally {
        setLoading(false);
      }
    }

    fetchLatestTriage();
  }, []);

  const formatTriagePrompt = () => {
    if (!latestTriage) return '';

    return `
Patient Assessment Summary:
-------------------------
Patient: ${latestTriage.patientName || 'Anonymous'}
Age: ${latestTriage.patientAge || 'Not specified'} | Sex: ${latestTriage.patientSex || 'Not specified'}

Primary Complaint:
${latestTriage.symptomDescription}

Vital Information:
- Pain Level: ${latestTriage.painLevel || 'Not specified'}
- Fever: ${latestTriage.hasFever ? 'Yes' : 'No'}${latestTriage.temperatureCelsius ? ` (${latestTriage.temperatureCelsius}°C)` : ''}
- Symptom Duration: ${latestTriage.symptomDuration || 'Not specified'}
- Affected Body Parts: ${latestTriage.affectedBodyParts || 'Not specified'}

Medical Background:
- Allergies: ${latestTriage.knownAllergies || 'None reported'}
- Current Medications: ${latestTriage.currentMedications || 'None reported'}
- Pre-existing Conditions: ${latestTriage.preExistingConditions || 'None reported'}
- Recent Travel: ${latestTriage.recentTravel || 'Not specified'}

Assessment Results:
- Predicted Injury: ${latestTriage.predictedInjuryLabel || 'Pending'}
- Severity: ${latestTriage.recommendationStatus || 'Not assessed'} (Score: ${latestTriage.severityScore || 'N/A'})
- Reason: ${latestTriage.severityReason || 'Not provided'}

Recommendations:
${latestTriage.triageRecommendation || 'Pending medical review'}

Assessment ID: ${latestTriage.id}
Created: ${new Date(latestTriage.createdAt).toLocaleString()}
Last Updated: ${new Date(latestTriage.updatedAt).toLocaleString()}
`.trim();
  };

  return {
    loading,
    error,
    latestTriage,
    formattedPrompt: formatTriagePrompt()
  };
}
