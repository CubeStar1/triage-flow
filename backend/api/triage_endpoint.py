from fastapi import FastAPI, HTTPException, Depends, Request
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from models.triage import TriageData, PossibleDiagnosis
import sys
from pathlib import Path
import json
from pydantic import ValidationError
from uuid import UUID, uuid4
from datetime import datetime
import logging

# Add the version_3_multi_agent directory to Python path
sys.path.append(str(Path(__file__).parent.parent / "version_3_multi_agent"))
from agents.agent1.agent import DescriptorAgent

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_list_field(value: Optional[str]) -> Optional[List[str]]:
    """Parse a string field into a list, handling various formats."""
    if value is None:
        return None
    if value == "None" or value == "":
        return []
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return [item.strip() for item in value.split(",") if item.strip()]

def parse_uuid(value: Any) -> UUID:
    """Parse a value into UUID, handling string and UUID types."""
    if isinstance(value, UUID):
        return value
    try:
        return UUID(str(value))
    except ValueError as e:
        raise ValueError(f"Invalid UUID format: {value}") from e

def parse_datetime(value: str) -> datetime:
    """Parse a datetime string into datetime object."""
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as e:
        raise ValueError(f"Invalid datetime format: {value}") from e

app = FastAPI(
    title="Triage API",
    description="API for medical triage assessment and diagnosis",
    version="1.0.0",
    docs_url="/docs",  
    redoc_url="/redoc"  
)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

agent = DescriptorAgent()

def get_supabase_client() -> Client:
    """Dependency to get Supabase client"""
    return supabase

@app.get("/")
async def root():
    """
    Root endpoint that provides basic API information
    """
    return {
        "message": "Welcome to the Triage API",
        "version": "1.0.0",
        "endpoints": {
            "root": "/",
            "triage_assessment": "/api/triage/{assessment_id}",
            "documentation": {
                "swagger": "/docs",
                "redoc": "/redoc"
            }
        }
    }

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors."""
    return {
        "detail": [
            {
                "loc": error["loc"],
                "msg": error["msg"],
                "type": error["type"]
            }
            for error in exc.errors()
        ]
    }

@app.get("/api/triage/{assessment_id}", response_model=TriageData)
async def get_triage_assessment(
    assessment_id: str,
    supabase: Client = Depends(get_supabase_client)
) -> TriageData:
    """
    Get triage assessment data and process it through Agent 1.
    
    Args:
        assessment_id: The UUID of the assessment to retrieve
        
    Returns:
        TriageData: The assessment data with possible diagnoses
        
    Raises:
        HTTPException: If the assessment is not found or there's an error processing it
    """
    try:
        try:
            assessment_uuid = parse_uuid(assessment_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        response = supabase.table("assessments").select("*").eq("id", assessment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Assessment not found")
            
        assessment_data = response.data[0]
        
        diagnoses_response = supabase.table("possible_diagnoses").select("*").eq("assessment_id", assessment_id).execute()
        possible_diagnoses = diagnoses_response.data if diagnoses_response.data else []
        
        diagnoses = []
        for d in possible_diagnoses:
            try:
                diagnosis = PossibleDiagnosis(
                    id=parse_uuid(d["id"]),
                    assessment_id=parse_uuid(d["assessment_id"]),
                    name=str(d["name"]),
                    confidence=float(d["confidence"]),
                    description=d.get("description"),
                    created_at=parse_datetime(d["created_at"])
                )
                diagnoses.append(diagnosis)
            except (ValueError, KeyError) as e:
                logger.warning(f"Skipping invalid diagnosis data: {e}")
                continue
        
        affected_body_parts = parse_list_field(assessment_data.get("affected_body_parts"))
        known_allergies = parse_list_field(assessment_data.get("known_allergies"))
        current_medications = parse_list_field(assessment_data.get("current_medications"))
        pre_existing_conditions = parse_list_field(assessment_data.get("pre_existing_conditions"))
        
        try:
            triage_data = TriageData(
                id=parse_uuid(assessment_data["id"]),
                user_id=parse_uuid(assessment_data["user_id"]),
                symptom_description=str(assessment_data["symptom_description"]),
                image_file_name=assessment_data.get("image_file_name"),
                image_file_type=assessment_data.get("image_file_type"),
                image_url=assessment_data.get("image_url"),
                image_storage_path=assessment_data.get("image_storage_path"),
                patient_name=assessment_data.get("patient_name"),
                patient_age=assessment_data.get("patient_age"),
                patient_sex=assessment_data.get("patient_sex"),
                symptom_duration=assessment_data.get("symptom_duration"),
                pain_level=assessment_data.get("pain_level"),
                affected_body_parts=affected_body_parts,
                has_fever=bool(assessment_data.get("has_fever", False)),
                temperature_celsius=float(assessment_data["temperature_celsius"]) if assessment_data.get("temperature_celsius") is not None else None,
                known_allergies=known_allergies,
                current_medications=current_medications,
                recent_travel=assessment_data.get("recent_travel"),
                pre_existing_conditions=pre_existing_conditions,
                predicted_injury_label=assessment_data.get("predicted_injury_label"),
                injury_description_summary=assessment_data.get("injury_description_summary"),
                severity_score=float(assessment_data["severity_score"]) if assessment_data.get("severity_score") is not None else None,
                severity_reason=assessment_data.get("severity_reason"),
                recommendation_status=assessment_data.get("recommendation_status"),
                triage_recommendation=assessment_data.get("triage_recommendation"),
                possible_diagnoses=diagnoses,
                created_at=parse_datetime(assessment_data["created_at"]),
                updated_at=parse_datetime(assessment_data["updated_at"])
            )
        except ValidationError as e:
            logger.error(f"Validation error for assessment {assessment_id}: {str(e)}")
            raise HTTPException(status_code=422, detail=str(e))
        
        agent_response = agent.invoke(
            query=triage_data.symptom_description,
            session_id=assessment_id,
            image_url=triage_data.image_url
        )
        
        logger.info(f"Agent analysis for assessment {assessment_id}: {agent_response}")
        
        if agent_response:
            update_data = {}
            
            if agent_response.get('image_analysis'):
                image_analysis = agent_response['image_analysis']
                if image_analysis:
                    top_prediction = image_analysis[0]
                    predicted_label = top_prediction['class']
                    confidence = float(top_prediction['confidence'])

                    summary = None
                    if agent_response.get('relevant_conditions') and agent_response['relevant_conditions']:
                        summary = agent_response['relevant_conditions'][0]['data']
                    else:
                        summary = top_prediction['description']

                    triage_data.predicted_injury_label = predicted_label
                    triage_data.injury_description_summary = summary

                    severity_score = min(5, max(1, int(confidence * 5)))  

                    if severity_score >= 4:
                        recommendation_status = "critical"
                        triage_recommendation = f"Seek immediate medical attention for {predicted_label}. {summary}"
                    elif severity_score >= 3:
                        recommendation_status = "severe"
                        triage_recommendation = f"Seek urgent medical care for {predicted_label}. {summary}"
                    elif severity_score >= 2:
                        recommendation_status = "moderate"
                        triage_recommendation = f"Schedule a routine appointment for {predicted_label}. {summary}"
                    else:
                        recommendation_status = "mild"
                        triage_recommendation = f"Monitor {predicted_label} and practice self-care. {summary}"

                    triage_data.severity_score = severity_score
                    triage_data.severity_reason = f"Based on image analysis of {predicted_label} with {confidence:.2%} confidence"
                    triage_data.recommendation_status = recommendation_status
                    triage_data.triage_recommendation = triage_recommendation

                    update_data.update({
                        'predicted_injury_label': predicted_label,
                        'injury_description_summary': summary,
                        'severity_score': severity_score,
                        'severity_reason': f"Based on image analysis of {predicted_label} with {confidence:.2%} confidence",
                        'recommendation_status': recommendation_status,
                        'triage_recommendation': triage_recommendation
                    })

                    logger.info(f"Updated assessment with top prediction - Label: {predicted_label}, Summary: {summary}")
            
            if agent_response.get('relevant_conditions'):
                relevant_conditions = agent_response['relevant_conditions']
                if relevant_conditions:
                    new_diagnoses = []
                    for condition in relevant_conditions:
                        try:
                            diagnosis_id = uuid4()
                            condition_name = condition['data'].split(':')[0].strip()
                            condition_description = condition['data'].split(':')[1].strip() if ':' in condition['data'] else None
                            
                            diagnosis = PossibleDiagnosis(
                                id=diagnosis_id,
                                assessment_id=assessment_uuid,
                                name=condition_name,
                                confidence=float(condition['score']),
                                description=condition_description,
                                created_at=datetime.now()
                            )
                            new_diagnoses.append(diagnosis)
                            
                            logger.info(f"Created new diagnosis: {condition_name} with confidence {condition['score']}")
                            
                            try:
                                diagnosis_data = {
                                    'id': str(diagnosis_id),
                                    'assessment_id': str(assessment_uuid),
                                    'diagnosis_name': condition_name,
                                    'confidence_score': float(condition['score']),
                                    'description': condition_description,
                                    'created_at': datetime.now().isoformat()
                                }
                                supabase.table("possible_diagnoses").insert(diagnosis_data).execute()
                                logger.info(f"Saved diagnosis {condition_name} to database")
                            except Exception as e:
                                logger.error(f"Failed to save diagnosis {condition_name} to database: {str(e)}")
                            
                        except (ValueError, KeyError) as e:
                            logger.warning(f"Skipping invalid diagnosis from agent: {e}")
                            continue
                    
                    existing_ids = {d.id for d in triage_data.possible_diagnoses}
                    triage_data.possible_diagnoses.extend([d for d in new_diagnoses if d.id not in existing_ids])
                    
                    logger.info(f"Total diagnoses after merge: {len(triage_data.possible_diagnoses)}")
                    
                    top_condition = relevant_conditions[0]
                    condition_name = top_condition['data'].split(':')[0].strip()
                    condition_description = top_condition['data'].split(':')[1].strip() if ':' in top_condition['data'] else None
                    
                    confidence = float(top_condition['score'])
                    severity_score = min(5, max(1, int(confidence * 5)))  
                    
                    if severity_score >= 4:
                        recommendation_status = "critical"
                        triage_recommendation = f"Seek immediate medical attention for {condition_name}. {condition_description}"
                    elif severity_score >= 3:
                        recommendation_status = "severe"
                        triage_recommendation = f"Seek urgent medical care for {condition_name}. {condition_description}"
                    elif severity_score >= 2:
                        recommendation_status = "moderate"
                        triage_recommendation = f"Schedule a routine appointment for {condition_name}. {condition_description}"
                    else:
                        recommendation_status = "mild"
                        triage_recommendation = f"Monitor {condition_name} and practice self-care. {condition_description}"
                    
                    triage_data.severity_score = severity_score
                    triage_data.severity_reason = f"Based on analysis of {condition_name} with {confidence:.2%} confidence"
                    triage_data.recommendation_status = recommendation_status
                    triage_data.triage_recommendation = triage_recommendation
                    
                    update_data.update({
                        'severity_score': severity_score,
                        'severity_reason': f"Based on analysis of {condition_name} with {confidence:.2%} confidence",
                        'recommendation_status': recommendation_status,
                        'triage_recommendation': triage_recommendation
                    })
            
            if update_data:
                try:
                    update_response = supabase.table("assessments").update(update_data).eq("id", assessment_id).execute()
                    logger.info(f"Updated assessment {assessment_id} with analysis results")
                except Exception as e:
                    logger.error(f"Failed to update assessment {assessment_id}: {str(e)}")
        
        return triage_data
        
    except Exception as e:
        logger.error(f"Error processing assessment {assessment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 