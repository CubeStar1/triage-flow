import { NextResponse } from 'next/server';
import type { TriageData } from '@/lib/fetchers/assessment';

const mockTriageDataFor123: TriageData = {
  id: 123, 
  patientImageUrl: '/images/skin-laceration.jpg',
  symptomsText: 'Patient reports a deep cut on the forearm (ID: 123), sustained from a kitchen knife. Bleeding was initially heavy but has slowed. Area is painful. This data is returned for ANY requested ID.',
  triageOutcome: {
    injuryType: 'Laceration Wound (Default Mock)',
    description: 'A laceration is a wound that is produced by the tearing of soft body tissue. This type of wound is often irregular and jagged.',
    severityScore: 4,
    severityReason: 'Deep cut with potential for infection and may require stitches. Significant initial bleeding reported.',
    triageRecommendation: 'Seek urgent medical attention (e.g., visit an Urgent Care center or Emergency Room) for wound assessment and possible stitches. Clean the wound gently with soap and water if possible, and apply pressure with a clean cloth if bleeding continues.',
    recommendationStatus: 'severe',
    topPossibleDiagnoses: [
      { name: 'Deep Laceration', confidence: 0.85, description: 'Requires medical evaluation for closure and infection prevention.' },
      { name: 'Superficial Laceration with Complications', confidence: 0.10, description: 'Less likely given depth, but observe for signs of infection.' },
    ],
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paramId } = await params; 

  console.log(`API ROUTE (/api/triage/[id]): Received request for ID: ${paramId}. Returning data for ID 123.`);

  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  if (mockTriageDataFor123) {
    return NextResponse.json(mockTriageDataFor123);
  } else {
    return NextResponse.json({ message: `Critical error: Default mock data for ID 123 is missing.` }, { status: 500 });
  }
}

// POST, PUT, DELETE handlers would go here if needed for a full CRUD API
// For example, a POST to /api/triage (without [id]) could create a new assessment
// and return its ID, which then could be used in /api/triage/[id]
