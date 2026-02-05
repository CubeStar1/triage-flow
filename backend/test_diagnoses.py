"""Test script to debug the diagnoses writing flow"""
import os
import sys
from pathlib import Path

# Add paths
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / "version_3_multi_agent"))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client
from uuid import uuid4
from datetime import datetime

# Test Supabase connection
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print(f"Supabase URL: {supabase_url}")
print(f"Supabase Key: {supabase_key[:20]}..." if supabase_key else "No key!")

supabase = create_client(supabase_url, supabase_key)

# First, check existing diagnoses to see the actual column names
print("\n--- Checking existing diagnoses table structure ---")
try:
    existing = supabase.table("possible_diagnoses").select("*").limit(5).execute()
    print(f"Found {len(existing.data)} existing records")
    if existing.data:
        print(f"Actual column names in table: {list(existing.data[0].keys())}")
        print(f"Sample record: {existing.data[0]}")
    else:
        print("No existing records to check structure")
except Exception as e:
    print(f"Failed to fetch: {e}")

# Try to insert a test diagnosis with diagnosis_name/confidence_score
print("\n--- Testing insert with diagnosis_name/confidence_score ---")
test_diagnosis_v1 = {
    'id': str(uuid4()),
    'assessment_id': '00000000-0000-0000-0000-000000000000',
    'diagnosis_name': 'TEST_DIAGNOSIS',
    'confidence_score': 0.95,
    'description': 'Test diagnosis v1',
    'created_at': datetime.now().isoformat()
}
try:
    result = supabase.table("possible_diagnoses").insert(test_diagnosis_v1).execute()
    print(f"SUCCESS with diagnosis_name/confidence_score!")
except Exception as e:
    print(f"FAILED with diagnosis_name/confidence_score: {str(e)[:200]}")

# Try with name/confidence
print("\n--- Testing insert with name/confidence ---")
test_diagnosis_v2 = {
    'id': str(uuid4()),
    'assessment_id': '00000000-0000-0000-0000-000000000000',
    'name': 'TEST_DIAGNOSIS_2',
    'confidence': 0.95,
    'description': 'Test diagnosis v2',
    'created_at': datetime.now().isoformat()
}
try:
    result = supabase.table("possible_diagnoses").insert(test_diagnosis_v2).execute()
    print(f"SUCCESS with name/confidence!")
except Exception as e:
    print(f"FAILED with name/confidence: {str(e)[:200]}")
