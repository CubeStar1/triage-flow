import requests
import json

# Read Agent 1's output from a file
with open("agent1_output.json", "r") as f:
    agent1_data = json.load(f)

# Send the data to Agent 2
response = requests.post(
    "http://localhost:8000/task",
    json=agent1_data,
    headers={"Content-Type": "application/json"}
)

print("Agent 2 response:")
print(response.text) 