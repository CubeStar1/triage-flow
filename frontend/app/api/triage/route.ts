import { NextResponse } from 'next/server';
import type { AssessmentSummary } from '@/lib/fetchers/assessment';

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const mockAssessmentSummaries: AssessmentSummary[] = [
  {
    id: 123,
    date: new Date(now - 2 * day).toISOString(),
    patientIdentifier: 'PID-00123',
    injuryType: 'Laceration, Forearm',
    keySymptomsSnippet: 'Deep cut, heavy bleeding initially, pain level 7/10.',
    severityScore: 4,
    recommendationStatus: 'severe',
    lastUpdated: new Date(now - 2 * day + 2 * 60 * 60 * 1000).toISOString(), 
  },
  {
    id: 456,
    date: new Date(now - 5 * day).toISOString(),
    patientIdentifier: 'Jane Doe (Self-Reported)',
    injuryType: 'Allergic Contact Dermatitis, Arm',
    keySymptomsSnippet: 'Itchy rash, redness, mild swelling, no fever.',
    severityScore: 2,
    recommendationStatus: 'mild',
    lastUpdated: new Date(now - 5 * day).toISOString(),
  },
  {
    id: Number(String(now - day).slice(-5) + '789'), 
    date: new Date(now - 1 * day).toISOString(), 
    patientIdentifier: 'PID-00789',
    injuryType: 'Minor Bruise, Leg',
    keySymptomsSnippet: 'Discoloration (blue/purple), slight tenderness upon touch, occurred yesterday after fall.',
    severityScore: 1,
    recommendationStatus: 'mild',
    lastUpdated: new Date(now - 1 * day).toISOString(),
  },
  {
    id: Number(String(now - 10 * day).slice(-5) + '101'), 
    date: new Date(now - 10 * day).toISOString(), 
    patientIdentifier: 'John Smith (Via Triage Nurse)',
    injuryType: 'Suspected Sprain, Ankle',
    keySymptomsSnippet: 'Swelling around ankle, pain when attempting to walk, difficulty bearing weight, twisted ankle during sport.',
    severityScore: 3,
    recommendationStatus: 'moderate',
    lastUpdated: new Date(now - 9 * day).toISOString(), 
  },
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));
  return NextResponse.json(mockAssessmentSummaries);
} 