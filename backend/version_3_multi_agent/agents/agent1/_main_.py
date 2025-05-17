# =============================================================================
# agents/description_fetcher/__main__.py
# =============================================================================
# Purpose:
# This is the main script that starts your DescriptionFetcher server.
# It:
# - Declares the agent's capabilities and skills
# - Sets up the A2A server with a task manager and agent
# - Starts listening on a specified host and port
#
# This script can be run directly from the command line:
#     python -m agents.description_fetcher
# =============================================================================

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------

# Your custom A2A server class
from server.server import A2AServer

# Models for describing agent capabilities and metadata
from models.agent import AgentCard, AgentCapabilities, AgentSkill

# Task manager and agent logic
from agents.agent1.task_manager import DescriptionFetcherTaskManager
from agents.agent1.agent import DescriptorAgent
from server.task_manager import TaskManager

# CLI and logging support
import click           # For creating a clean command-line interface
import logging         # For logging errors and info to the console

# -----------------------------------------------------------------------------
# Setup logging to print info to the console
# -----------------------------------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# Main Entry Function – Configurable via CLI
# -----------------------------------------------------------------------------

@click.command()
@click.option("--host", default="localhost", help="Host to bind the server to")
@click.option("--port", default=8001, help="Port number for the server")
def main(host, port):
    """Start the medical description agent server"""
    
    # Define agent capabilities
    capabilities = AgentCapabilities(streaming=False)

    # Define the medical description skill
    skill = AgentSkill(
        id="medical_descriptions",
        name="Medical Description Provider",
        description="Provides comprehensive medical condition descriptions and explanations",
        tags=["medical", "health", "descriptions"],
        examples=[
            "What is Pneumonia?",
            "Tell me about Bronchitis",
            "Explain the symptoms of Asthma"
        ],
        inputModes=DescriptorAgent.SUPPORTED_CONTENT_TYPES,
        outputModes=DescriptorAgent.SUPPORTED_CONTENT_TYPES
    )

    # Create agent card
    agent_card = AgentCard(
        name="MedicalDescriptionAgent",
        description="An AI agent that provides detailed medical condition descriptions and explanations",
        url=f"http://{host}:{port}/",
        version="1.0.0",
        capabilities=capabilities,
        skills=[skill]
    )

    # Initialize the agent and task manager
    agent = DescriptorAgent()
    task_manager = DescriptionFetcherTaskManager(agent=agent)

    # Start the A2A server
    server = A2AServer(
        host=host,
        port=port,
        agent_card=agent_card,
        task_manager=task_manager
    )

    logger.info(f"Starting Medical Description Agent server on {host}:{port}")
    server.start()

# -----------------------------------------------------------------------------
# This runs only when executing the script directly via `python -m`
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    main() 