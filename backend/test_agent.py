"""Test if agent returns relevant_conditions"""
import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / "version_3_multi_agent"))

from dotenv import load_dotenv
load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

from agents.agent1.agent import DescriptorAgent

print("Initializing agent...")
agent = DescriptorAgent()
print("Agent initialized!")

# Test with a query (no image)
print("\n--- Testing with text symptom ---")
response = agent.invoke(
    query="I have a red rash on my arm that is itchy",
    session_id="test-session"
)

print(f"Response keys: {response.keys()}")
print(f"image_analysis: {response.get('image_analysis')}")
print(f"relevant_conditions: {response.get('relevant_conditions')}")
print(f"Number of conditions: {len(response.get('relevant_conditions', []))}")
