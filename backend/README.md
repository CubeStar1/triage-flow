# Triage Flow Backend

This is the backend service for the Triage Flow application, providing medical triage assessment and diagnosis capabilities.

## Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the package:
```bash
pip install -e .
```

3. Run requirements.txt compulsorily inside the same venv after this:
```bash
pip install -r requirements.txt
```


## Project Structure

```
backend/
├── api/
│   └── triage_endpoint.py      # Main FastAPI endpoint for triage assessment
├── models/
│   └── triage.py              # Pydantic models for data validation
├── version_3_multi_agent/
│   ├── agents/
│   │   ├── agent1/            # Descriptor Agent for analysis
|   |   └── agent2/            # reformats based on Agent 1
│   └── models/
│       └── triage.py          # Agent-specific models
└── Similarity Check/
    └── FAISS.py              # FAISS-based similarity search implementation
```

## Features

- Medical triage assessment processing
- Image analysis for injury detection
- Symptom analysis and diagnosis
- Severity scoring and recommendations
- Database integration with Supabase

## API Endpoints

### GET /api/triage/{assessment_id}

Processes a triage assessment and returns analysis results.

**Response Fields:**
- `predicted_injury_label`: Identified injury from image analysis
- `injury_description_summary`: Description of the injury
- `severity_score`: Numerical severity score (1-5)
- `severity_reason`: Explanation of severity assessment
- `recommendation_status`: One of: mild, moderate, severe, critical
- `triage_recommendation`: Detailed recommendation for care
- `possible_diagnoses`: List of potential diagnoses with confidence scores

## Database Schema

### Assessments Table
- `id`: UUID (Primary Key)
- `user_id`: UUID
- `symptom_description`: Text
- `image_url`: Text (optional)
- `predicted_injury_label`: Text
- `injury_description_summary`: Text
- `severity_score`: Float
- `severity_reason`: Text
- `recommendation_status`: Enum (mild, moderate, severe, critical)
- `triage_recommendation`: Text
- Additional patient and symptom fields

### Possible Diagnoses Table
- `id`: UUID (Primary Key)
- `assessment_id`: UUID (Foreign Key)
- `diagnosis_name`: Text
- `confidence_score`: Float
- `description`: Text
- `created_at`: Timestamp

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

3. Run the server:
```bash
uvicorn api.triage_endpoint:app --host 0.0.0.0 --port 8000
```

## Dependencies

- FastAPI
- Supabase
- Pydantic
- Sentence Transformers
- FAISS
- Python-dotenv

## Development

The backend uses FastAPI for the API framework and integrates with Supabase for data storage. The triage analysis is performed by a multi-agent system that can process both text descriptions and images.

### Key Components

1. **Triage Endpoint**: Main API endpoint that processes assessments
2. **Descriptor Agent**: Analyzes symptoms and images
3. **FAISS**: Handles similarity search for diagnosis matching

### Adding New Features

1. Create new endpoints in `api/triage_endpoint.py`
2. Add new models in `models/triage.py`
3. Update agent logic in `version_3_multi_agent/agents/`

## Error Handling

The API includes comprehensive error handling for:
- Invalid UUIDs
- Missing assessments
- Database errors
- Validation errors
- Agent processing errors

## Logging

The application uses Python's logging module to track:
- API requests
- Database operations
- Agent analysis results
- Error conditions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here] 