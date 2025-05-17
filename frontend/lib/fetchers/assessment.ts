import axios from 'axios';

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

export interface TriageData {
  id: string;
  userId: string;
  symptomDescription: string;
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
  predictedInjuryLabel?: string;
  injuryDescriptionSummary?: string;
  severityScore?: number;
  severityReason?: string;
  recommendationStatus?: RecommendationStatus;
  triageRecommendation?: string;
  possibleDiagnoses?: PossibleDiagnosis[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentPayload {
  userId: string;
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
  image?: string;
  imageFileName?: string;
  imageFileType?: string;
}

export const createAssessment = async (payload: CreateAssessmentPayload) => {
  try {
    const processedPayload = {
      ...payload,
      patientAge: payload.patientAge === '' ? undefined : Number(payload.patientAge),
      temperature: payload.temperature === '' ? undefined : Number(payload.temperature),
      hasFever: payload.hasFever || false,
    };

    const response = await axios.post<{ assessmentId: string }>('/api/triage/new', processedPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
};

export const fetchAssessmentById = async (id: string): Promise<TriageData> => {
  try {
    const response = await axios.get<TriageData>(`/api/triage/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
};

export const fetchAllAssessments = async (): Promise<TriageData[]> => {
  try {
    const response = await axios.get<TriageData[]>('/api/triage');
    return response.data;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
};