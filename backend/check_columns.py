"""Check actual column names in possible_diagnoses table"""
import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

# Fetch existing diagnoses
result = supabase.table("possible_diagnoses").select("*").limit(1).execute()
print("COLUMN NAMES:", list(result.data[0].keys()) if result.data else "NO DATA")
print("SAMPLE DATA:", result.data[0] if result.data else "NO DATA")
