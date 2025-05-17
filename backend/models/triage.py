from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class PatientSex(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class RecentTravel(str, Enum):
    YES = "yes"
    NO = "no"
    UNKNOWN = "unknown"

class RecommendationStatus(str, Enum):
    EMERGENCY = "emergency"
    URGENT = "urgent"
    ROUTINE = "routine"
    SELF_CARE = "self_care"

class PossibleDiagnosis(BaseModel):
    id: UUID
    assessment_id: UUID
    name: str
    confidence: float
    description: Optional[str] = None
    created_at: datetime

class TriageData(BaseModel):
    id: UUID
    user_id: UUID
    symptom_description: str
    image_file_name: Optional[str] = None
    image_file_type: Optional[str] = None
    image_url: Optional[str] = None
    image_storage_path: Optional[str] = None
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    symptom_duration: Optional[str] = None
    pain_level: Optional[int] = Field(None, ge=0, le=10)
    affected_body_parts: Optional[List[str]] = None
    has_fever: bool = False
    temperature_celsius: Optional[float] = None
    known_allergies: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
    recent_travel: Optional[str] = None
    pre_existing_conditions: Optional[List[str]] = None
    predicted_injury_label: Optional[str] = None
    injury_description_summary: Optional[str] = None
    severity_score: Optional[float] = Field(None, ge=1, le=5)
    severity_reason: Optional[str] = None
    recommendation_status: Optional[str] = None
    triage_recommendation: Optional[str] = None
    possible_diagnoses: List[PossibleDiagnosis] = []
    created_at: datetime
    updated_at: datetime 