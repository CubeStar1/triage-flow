# A2A Samples with Google ADK Integration

A multi-agent system for processing and analyzing medical images, providing automated triage reports with severity assessments and condition descriptions.

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

## Usage

Start the agents in separate terminals:

1. Start the DescriptionFetcher:
```bash
python -m agents.description_fetcher
```

2. Start the TriageAnalyst:
```bash
python -m agents.triage_analyst
```

3. Start the TriageOrchestrator:
```bash
python -m agents.triage_orchestrator
```

The agents will be available at:
- TriageOrchestrator: http://localhost:8000
- DescriptionFetcher: http://localhost:8001
- TriageAnalyst: http://localhost:8002

## Configuration

Make sure to set up your Google Cloud credentials:
1. Create a service account and download the JSON key file
2. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
```

## Development

To install development dependencies:
```bash
pip install -e ".[dev]"
```