import axios from 'axios';

// Define and export shared Triage types here
export type PatientSex = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
export type RecommendationStatus = 'mild' | 'moderate' | 'severe' | 'critical';
export type RecentTravel = 'yes' | 'no';

export interface PossibleDiagnosis {
  id: string;
  assessmentId: string;
  name: string;
  confidence: number;
  description?: string;
  createdAt: string;
}

export interface TriageOutcome {
  injuryType: string; // Maps to DB predicted_injury_label
  description: string; // Maps to DB injury_description_summary
  severityScore: number; // 1-5 scale, maps to DB severity_score
  severityReason: string; // Maps to DB severity_reason
  triageRecommendation: string; // Maps to DB triage_recommendation
  recommendationStatus: RecommendationStatus; // Maps to DB recommendation_status
  topPossibleDiagnoses?: PossibleDiagnosis[]; // Maps to possible_diagnoses table
}

export interface TriageData {
  id: string; // UUID from DB
  userId: string; // From auth.users
  symptomDescription: string; // From DB symptom_description
  imageFileName?: string;
  imageFileType?: string;
  imageUrl?: string;
  imageStoragePath?: string;

  patientName?: string;
  patientAge?: number;
  patientSex?: PatientSex;
  symptomDuration?: string;
  painLevel?: string;
  affectedBodyParts?: string;
  hasFever: boolean;
  temperatureCelsius?: number;
  
  knownAllergies?: string;
  currentMedications?: string;
  recentTravel?: RecentTravel;
  preExistingConditions?: string;

  // AI processing results are embedded here
  predictedInjuryLabel?: string;
  injuryDescriptionSummary?: string;
  severityScore?: number;
  severityReason?: string;
  recommendationStatus?: RecommendationStatus;
  triageRecommendation?: string;
  
  createdAt: string; // ISO date string from DB
  updatedAt: string; // ISO date string from DB
}

// New type for assessment summaries in a list
export interface AssessmentSummary {
  id: string;
  date: string; // ISO string for initial assessment
  patientIdentifier?: string; // e.g., "Patient ID: P789012" or a name if available
  injuryType: string;
  keySymptomsSnippet?: string;
  severityScore: number;
  recommendationStatus: RecommendationStatus;
  lastUpdated: string; 
}

// Define the expected structure of the data returned by the API after submission
export interface CreateAssessmentResponse {
  assessmentId: string; 
}

// This type should ideally be inferred from your Zod schema or defined consistently
// For now, let's define it based on what NewAssessmentForm sends.
export interface CreateAssessmentPayload {
  userId: string; // From auth.users
  patientName?: string;
  patientAge?: number | string;
  patientSex?: PatientSex;
  symptoms: string;
  symptomDuration?: string;
  painLevel?: string;
  affectedBodyParts?: string;
  hasFever?: boolean;
  temperature?: number | string;
  knownAllergies?: string;
  currentMedications?: string;
  recentTravel?: RecentTravel;
  preExistingConditions?: string;
  imageUrl?: string;
  imageStoragePath?: string;
  imageFileName?: string;
  imageFileType?: string;
}

// This is the type for the payload the /api/triage/assessments route expects
export interface AssessmentApiPayload extends Omit<CreateAssessmentPayload, 'patientSex' | 'recentTravel' | 'imageFileName' | 'imageFileType'> {
  patientSex?: string;
  recentTravel?: string;
}

export const createAssessment = async (payload: CreateAssessmentPayload): Promise<CreateAssessmentResponse> => {
  try {
    // Process numeric fields and handle empty strings
    const processedPayload = {
      ...payload,
      patientAge: payload.patientAge === '' ? undefined : Number(payload.patientAge),
      temperature: payload.temperature === '' ? undefined : Number(payload.temperature),
      hasFever: payload.hasFever || false,
    };

    const response = await axios.post<CreateAssessmentResponse>(
      '/api/triage/new',
      processedPayload
    );

    return response.data;
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
};

export const fetchAssessmentById = async (id: string): Promise<TriageData> => {
  try {
    const response = await axios.get<TriageData>(`/api/triage/assessments/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
};

export const fetchAllAssessments = async (): Promise<AssessmentSummary[]> => {
  try {
    const response = await axios.get<AssessmentSummary[]>('/api/triage');
    return response.data;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
};

// Add other fetcher functions here as needed (e.g., getAssessment, getAssessmentLog) 