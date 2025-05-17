# =============================================================================
# agents/description_fetcher/task_manager.py
# =============================================================================
# 🎯 Purpose:
# This file connects your Gemini-powered agent (DescriptionFetcher) to the task-handling system.
# It inherits from InMemoryTaskManager to:
# - Receive a task from the user
# - Extract the medical conditions to describe
# - Ask the agent to fetch descriptions
# - Save and return the agent's answer
# =============================================================================


# -----------------------------------------------------------------------------
# 📚 Imports
# -----------------------------------------------------------------------------

import logging  # Standard Python module for logging debug/info messages
import time    # For tracking uptime and timing
from typing import List, Dict, Any  # Type hints for better code clarity
import json  # For JSON operations

# 🔁 Import the shared in-memory task manager from the server
from server.task_manager import InMemoryTaskManager

# 🤖 Import the actual agent we're using (Gemini-powered DescriptionFetcher)
from agents.agent1.agent import DescriptorAgent

# 📦 Import data models used to structure and return tasks
from models.request import SendTaskRequest, SendTaskResponse
from models.task import Message, Task, TextPart, TaskStatus, TaskState


# -----------------------------------------------------------------------------
# 🪵 Logger setup
# -----------------------------------------------------------------------------
# This allows us to print nice logs like:
# INFO:agents.description_fetcher.task_manager:Processing new task: 12345
logger = logging.getLogger(__name__)


# -----------------------------------------------------------------------------
# DescriptionFetcherTaskManager
# -----------------------------------------------------------------------------

class DescriptionFetcherTaskManager(InMemoryTaskManager):
    """
    🧠 This class connects the Gemini agent to the task system.

    - It "inherits" all the logic from InMemoryTaskManager
    - It overrides the part where we handle a new task (on_send_task)
    - It uses the Gemini agent to generate medical descriptions
    """

    def __init__(self, agent: DescriptorAgent):
        """Initialize the task manager with a DescriptorAgent"""
        super().__init__()
        self.agent = agent
        self.start_time = time.time()
        self.request_count = 0
        self.error_count = 0

    # -------------------------------------------------------------------------
    # 🔍 Extract the user's query from the incoming task
    # -------------------------------------------------------------------------
    def _get_user_query(self, request: SendTaskRequest) -> str:
        """
        Get the user's text input from the request object.

        Example: If the user says "describe Pneumonia", we pull that string out.

        Args:
            request: A SendTaskRequest object

        Returns:
            str: The actual text the user asked
        """
        return request.params.message.parts[0].text

    def _is_knowledge_base_update(self, request: SendTaskRequest) -> bool:
        """Check if the request is for updating the knowledge base."""
        try:
            data = json.loads(request.params.message.parts[0].text)
            # Check if it's a reload command
            if isinstance(data, dict) and data.get("command") == "reload_knowledge_base":
                return True
            # Check if it's a regular knowledge base update
            return isinstance(data, dict) and all(
                isinstance(v, dict) and all(k in v for k in ['overview', 'symptoms', 'treatment'])
                for v in data.values()
            )
        except (json.JSONDecodeError, AttributeError):
            return False

    # -------------------------------------------------------------------------
    # 🧠 Main logic to handle and complete a task
    # -------------------------------------------------------------------------
    async def on_send_task(self, request: SendTaskRequest) -> SendTaskResponse:
        """
        This is the heart of the task manager.

        It does the following:
        1. Save the task into memory (or update it)
        2. If it's a knowledge base update, update the agent's knowledge
        3. Otherwise, ask the Gemini agent for medical descriptions
        4. Format that reply as a message
        5. Save the agent's reply into the task history
        6. Return the updated task to the caller
        """

        logger.info(f"Processing new task: {request.params.id}")
        self.request_count += 1

        try:
            # Step 1: Save the task using the base class helper
            task = await self.upsert_task(request.params)

            # Step 2: Check if this is a knowledge base update
            if self._is_knowledge_base_update(request):
                data = json.loads(request.params.message.parts[0].text)
                if isinstance(data, dict) and data.get("command") == "reload_knowledge_base":
                    self.agent.reload_knowledge_base()
                    result_text = "Knowledge base reloaded successfully from RAG data file."
                else:
                    self.agent.update_knowledge_base(data)
                    result_text = "Knowledge base updated successfully."
            else:
                # Step 3: Get what the user asked and get response
                query = self._get_user_query(request)
                result_text = self.agent.invoke(query, request.params.sessionId)

            # Step 4: Turn the agent's response into a Message object
            agent_message = Message(
                role="agent",
                parts=[TextPart(text=result_text)]
            )

            # Step 5: Update the task state and add the message to history
            async with self.lock:
                task.status = TaskStatus(state=TaskState.COMPLETED)
                task.history.append(agent_message)

            # Step 6: Return a structured response back to the A2A client
            return SendTaskResponse(id=request.id, result=task)
        except Exception as e:
            self.error_count += 1
            logger.error(f"Error processing task: {str(e)}")
            raise

    async def check_health(self) -> Dict[str, Any]:
        """Check the health status of the agent and knowledge base"""
        try:
            uptime = time.time() - self.start_time
            error_rate = self.error_count / max(self.request_count, 1)
            
            return {
                "status": "healthy",
                "uptime_seconds": uptime,
                "request_count": self.request_count,
                "error_count": self.error_count,
                "error_rate": error_rate,
                "knowledge_base": {
                    "status": "connected",
                    "conditions_count": len(self.agent.knowledge_base)
                }
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            } 