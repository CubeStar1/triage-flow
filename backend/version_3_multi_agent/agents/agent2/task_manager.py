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
from typing import List, Dict, Any, Optional  # Type hints for better code clarity
import json

# 🔁 Import the shared in-memory task manager from the server
from server.task_manager import InMemoryTaskManager, TaskManager

# 🤖 Import the actual agent we're using (Gemini-powered DescriptionFetcher)
from agents.agent1.agent import DescriptorAgent

# 📦 Import data models used to structure and return tasks
from models.request import SendTaskRequest, SendTaskResponse, GetTaskRequest, GetTaskResponse
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

    # -------------------------------------------------------------------------
    # 🧠 Main logic to handle and complete a task
    # -------------------------------------------------------------------------
    async def on_send_task(self, request: SendTaskRequest) -> SendTaskResponse:
        """
        This is the heart of the task manager.

        It does the following:
        1. Save the task into memory (or update it)
        2. Ask the Gemini agent for medical descriptions
        3. Format that reply as a message
        4. Save the agent's reply into the task history
        5. Return the updated task to the caller
        """

        logger.info(f"Processing new task: {request.params.id}")
        self.request_count += 1

        try:
            # Step 1: Save the task using the base class helper
            task = await self.upsert_task(request.params)

            # Step 2: Get what the user asked
            query = self._get_user_query(request)

            # Step 3: Ask the Gemini agent to respond (synchronous call here)
            result_text = self.agent.invoke(query, request.params.sessionId)

            # Step 4: Turn the agent's response into a Message object
            agent_message = Message(
                role="agent",                       # The role is "agent" not "user"
                parts=[TextPart(text=result_text)]  # The reply text is stored inside a TextPart
            )

            # Step 5: Update the task state and add the message to history
            async with self.lock:                   # Lock access to avoid concurrent writes
                task.status = TaskStatus(state=TaskState.COMPLETED)  # Mark task as done
                task.history.append(agent_message)  # Append the agent's message to the task history

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

class TriageTaskManager(TaskManager):
    def __init__(self, agent, agent1: Optional[DescriptorAgent] = None):
        super().__init__()
        self.agent = agent
        self.agent1 = agent1
        self.tasks: Dict[str, Task] = {}

    async def create_task(self, task_data: Dict[str, Any]) -> Task:
        """Create a new task and process it through both agents"""
        task_id = task_data.get("id", "task_" + str(len(self.tasks)))
        task = Task(id=task_id, status=TaskStatus(state=TaskState.SUBMITTED), history=[])
        self.tasks[task_id] = task

        try:
            # First, get description from Agent 1
            if self.agent1:
                agent1_response = self.agent1.invoke(
                    query=json.dumps(task_data),
                    session_id=task_id
                )
                # Use Agent 1's response as input for Agent 2
                task_data["description"] = agent1_response

            # Then process with Agent 2
            response = await self.agent.invoke(
                query=json.dumps(task_data),
                session_id=task_id
            )

            task.status = TaskStatus(state=TaskState.COMPLETED)
            task.result = response
            return task

        except Exception as e:
            logger.error(f"Error processing task {task_id}: {str(e)}")
            task.status = TaskStatus(state=TaskState.FAILED)
            task.error = str(e)
            return task

    async def get_task(self, task_id: str) -> Optional[Task]:
        """Get task status and result"""
        return self.tasks.get(task_id)

    async def list_tasks(self) -> Dict[str, Task]:
        """List all tasks"""
        return self.tasks

    async def on_send_task(self, request: SendTaskRequest) -> SendTaskResponse:
        task = await self.create_task(request.params.dict())
        return SendTaskResponse(id=request.id, result=task)

    async def on_get_task(self, request: GetTaskRequest) -> GetTaskResponse:
        task = await self.get_task(request.params.id)
        return GetTaskResponse(id=request.id, result=task) 