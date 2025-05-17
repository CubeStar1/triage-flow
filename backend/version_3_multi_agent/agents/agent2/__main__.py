# Set environment variable to handle OpenMP runtime conflict
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# =============================================================================
# agents/agent2/__main__.py
# =============================================================================
# Purpose:
# This is the main script that starts the TriageAnalyst server.
# It:
# - Declares the agent's capabilities and skills
# - Sets up the A2A server with a task manager and agent
# - Starts listening on a specified host and port
#
# This script can be run directly from the command line:
#     python -m agents.agent2
# =============================================================================

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

# Your custom A2A server class
from server.server import A2AServer

# Models for describing agent capabilities and metadata
from models.agent import AgentCard, AgentCapabilities, AgentSkill

# Task manager and agent logic
from agents.agent2.task_manager import TriageTaskManager
from agents.agent2.agent import TriageAgent
from agents.agent1.agent import DescriptorAgent

# CLI and logging support
import click
import logging

# -----------------------------------------------------------------------------
# Setup logging
# -----------------------------------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# Main Entry Function
# -----------------------------------------------------------------------------

@click.command()
@click.option("--host", default="localhost", help="Host to bind the server to")
@click.option("--port", default=8000, help="Port number for the server")
def main(host, port):
    """Start the medical triage agent server"""
    
    # Define agent capabilities
    capabilities = AgentCapabilities(streaming=False)

    # Define the medical triage skill
    skill = AgentSkill(
        id="medical_triage",
        name="Medical Triage Provider",
        description="Provides comprehensive medical triage assessment and recommendations",
        tags=["medical", "health", "triage", "emergency"],
        examples=[
            "Assess symptoms of fever and cough",
            "Evaluate skin rash severity",
            "Determine urgency of breathing difficulty"
        ],
        inputModes=["text", "text/plain", "image", "image/jpeg", "image/png"],
        outputModes=["text", "text/plain"]
    )

    # Create agent card
    agent_card = AgentCard(
        name="MedicalTriageAgent",
        description="An AI agent that provides medical triage assessment and recommendations",
        url=f"http://{host}:{port}/",
        version="1.0.0",
        capabilities=capabilities,
        skills=[skill]
    )

    # Initialize both agents
    agent1 = DescriptorAgent()
    agent2 = TriageAgent()

    # Initialize task manager with both agents
    task_manager = TriageTaskManager(agent=agent2, agent1=agent1)

    # Start the A2A server
    server = A2AServer(
        host=host,
        port=port,
        agent_card=agent_card,
        task_manager=task_manager
    )

    logger.info(f"Starting Medical Triage Agent server on {host}:{port}")
    server.start()

# -----------------------------------------------------------------------------
# This runs only when executing the script directly via `python -m`
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    main() 