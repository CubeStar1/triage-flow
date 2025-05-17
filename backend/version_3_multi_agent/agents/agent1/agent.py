# =============================================================================
# agents/google_adk/agent.py
# =============================================================================
# 🎯 Purpose:
# This file defines a very simple AI agent called TellTimeAgent.
# It uses Google's ADK (Agent Development Kit) and Gemini model to respond with the current time.
# =============================================================================


# -----------------------------------------------------------------------------
# 📦 Built-in & External Library Imports
# -----------------------------------------------------------------------------

from datetime import datetime  # Used to get the current system time
from typing import Dict, List, Any, Optional
import json
import os
import logging
from pathlib import Path

# 🧠 Gemini-based AI agent provided by Google's ADK
from google.adk.agents.llm_agent import LlmAgent

# 📚 ADK services for session, memory, and file-like "artifacts"
from google.adk.sessions import InMemorySessionService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.artifacts import InMemoryArtifactService

# 🏃 The "Runner" connects the agent, session, memory, and files into a complete system
from google.adk.runners import Runner

# 🧾 Gemini-compatible types for formatting input/output messages
from google.genai import types

# 🔐 Load environment variables (like API keys) from a `.env` file
from dotenv import load_dotenv
load_dotenv()  # Load variables from .env file

# Get API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

os.environ["GOOGLE_API_KEY"] = api_key

import google.generativeai as genai

import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

# Set up logger
logger = logging.getLogger(__name__)


# -----------------------------------------------------------------------------
# 🕒 TellTimeAgent: Your AI agent that tells the time
# -----------------------------------------------------------------------------
class FAISSKnowledgeBase:
    """Handles similarity-based knowledge base operations using FAISS"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.passages = []
        self.ids = []
        self.dim = None
        
    def initialize_from_dict(self, knowledge_base: Dict[str, Dict[str, str]]):
        """Initialize FAISS index from a knowledge base dictionary"""
        # Convert knowledge base to passages
        self.passages = []
        self.ids = []
        
        for condition, info in knowledge_base.items():
            # Combine all text fields for embedding
            text = f"{condition} {info['overview']} {info['symptoms']} {info['treatment']}"
            self.passages.append(text)
            self.ids.append(condition)
            
        # Create embeddings
        embs = self.model.encode(self.passages, convert_to_numpy=True, normalize_embeddings=True)
        self.dim = embs.shape[1]
        
        # Build FAISS index
        self.index = faiss.IndexFlatIP(self.dim)
        self.index.add(embs)
        
    def find_similar(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Find similar entries in the knowledge base"""
        if not self.index:
            return []
            
        # Embed query
        q_emb = self.model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
        
        # Search
        scores, idxs = self.index.search(q_emb, top_k)
        
        # Collect results
        return [
            {
                'id': self.ids[idx],
                'data': self.passages[idx],
                'score': float(scores[0][i])
            }
            for i, idx in enumerate(idxs[0])
        ]
        
    def add_entry(self, entry_id: str, entry_data: Dict[str, str]):
        """Add a new entry to the knowledge base"""
        # Combine text fields
        text = f"{entry_id} {entry_data['overview']} {entry_data['symptoms']} {entry_data['treatment']}"
        
        # Create embedding
        emb = self.model.encode([text], convert_to_numpy=True, normalize_embeddings=True)
        
        # Add to index
        self.index.add(emb)
        self.passages.append(text)
        self.ids.append(entry_id)

class DescriptorAgent:
    """Agent that fetches medical condition descriptions using RAG-based knowledge base"""

    # Declare which content types this agent accepts by default
    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

    def __init__(self):
        self._agent = self._build_agent()
        self._user_id = "medical_agent_user"
        self._runner = Runner(
            app_name=self._agent.name,
            agent=self._agent,
            artifact_service=InMemoryArtifactService(),
            session_service=InMemorySessionService(),
            memory_service=InMemoryMemoryService(),
        )
        # Initialize the knowledge base and FAISS
        self.knowledge_base = self._initialize_knowledge_base()
        self.faiss_kb = FAISSKnowledgeBase()
        self.faiss_kb.initialize_from_dict(self.knowledge_base)

    def _initialize_knowledge_base(self) -> Dict[str, Dict[str, str]]:
        """Initialize the medical knowledge base from the RAG data JSON file"""
        try:
            # Get the absolute path to the RAG data file
            current_dir = Path(__file__).parent.parent.parent.parent
            rag_data_path = current_dir / 'Similarity Check' / 'ragData.json'
            
            # Load RAG data from JSON file
            with open(rag_data_path, 'r') as f:
                rag_data = json.load(f)
            
            # Convert RAG data format to knowledge base format
            knowledge_base = {}
            for entry in rag_data:
                # Split the data into sections (overview, symptoms, treatment)
                # This is a simple heuristic - you might want to adjust this based on your needs
                data = entry['data']
                sections = data.split('. ')
                
                # Create a structured entry
                knowledge_base[entry['id']] = {
                    "overview": sections[0] if len(sections) > 0 else data,
                    "symptoms": sections[1] if len(sections) > 1 else "",
                    "treatment": sections[2] if len(sections) > 2 else "",
                    "patient_explanation": data  # Use full data as patient explanation
                }
            
            logger.info(f"Successfully loaded {len(knowledge_base)} entries from RAG data")
            return knowledge_base
            
        except Exception as e:
            logger.error(f"Error loading RAG data: {str(e)}")
            # Fallback to sample data if RAG data loading fails
            return {
                "Pneumonia": {
                    "overview": "Pneumonia is an infection that inflames the air sacs in one or both lungs.",
                    "symptoms": "Common symptoms include cough, fever, difficulty breathing, and chest pain.",
                    "treatment": "Treatment typically involves antibiotics, rest, and plenty of fluids.",
                    "patient_explanation": "Pneumonia is a lung infection that can make it hard to breathe. It's like having a bad cold that affects your lungs."
                },
                "Bronchitis": {
                    "overview": "Bronchitis is an inflammation of the lining of the bronchial tubes.",
                    "symptoms": "Symptoms include persistent cough, mucus production, and fatigue.",
                    "treatment": "Treatment may include rest, hydration, and sometimes bronchodilators.",
                    "patient_explanation": "Bronchitis is an inflammation of the airways that can cause coughing and difficulty breathing."
                }
            }

    def _find_relevant_conditions(self, query: str, top_k: int = 2) -> List[tuple[str, float]]:
        """Find the most relevant medical conditions for the query using FAISS"""
        results = self.faiss_kb.find_similar(query, top_k=top_k)
        return [(r['id'], r['score']) for r in results]

    def _build_agent(self) -> LlmAgent:
        """Creates and returns a Gemini agent with medical knowledge capabilities"""
        system_instr = (
            "You are a medical description assistant that provides clear, accurate, "
            "and patient-friendly explanations of medical conditions. Your responses should:\n"
            "1. Be accurate and based on medical knowledge\n"
            "2. Be easy to understand for non-medical professionals\n"
            "3. Include relevant symptoms and treatments\n"
            "4. Use simple language while maintaining medical accuracy"
        )
        return LlmAgent(
            model="gemini-1.5-flash-latest",
            name="medical_description_agent",
            description="Provides medical condition descriptions and explanations",
            instruction=system_instr
        )

    def invoke(self, query: str, session_id: str) -> str:
        """Process a medical query and return a comprehensive response"""
        # Find relevant conditions
        relevant_conditions = self._find_relevant_conditions(query)
        
        # Prepare context for the agent
        context = []
        for condition, _ in relevant_conditions:
            info = self.knowledge_base[condition]
            context.append(f"Condition: {condition}\n"
                         f"Overview: {info['overview']}\n"
                         f"Symptoms: {info['symptoms']}\n"
                         f"Treatment: {info['treatment']}\n"
                         f"Patient Explanation: {info['patient_explanation']}\n")

        # Create the prompt with context
        prompt = f"Based on the following medical information:\n\n{''.join(context)}\n\n"
        prompt += f"Please provide a comprehensive response to: {query}\n"
        prompt += "Include a clear overview, symptoms, and treatment options in patient-friendly language."

        # Get session
        session = self._runner.session_service.get_session(
            app_name=self._agent.name,
            user_id=self._user_id,
            session_id=session_id
        ) or self._runner.session_service.create_session(
            app_name=self._agent.name,
            user_id=self._user_id,
            session_id=session_id,
            state={}
        )

        # Format and send the message
        content = types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)]
        )

        # Get response from the agent
        events = list(self._runner.run(
            user_id=self._user_id,
            session_id=session.id,
            new_message=content
        ))

        if not events or not events[-1].content or not events[-1].content.parts:
            return "I apologize, but I couldn't generate a response at this time."

        return "\n".join([p.text for p in events[-1].content.parts if p.text])

    async def stream(self, query: str, session_id: str):
        """Streaming response implementation"""
        response = self.invoke(query, session_id)
        yield {
            "is_task_complete": True,
            "content": response
        }

    def update_knowledge_base(self, new_entry: Dict[str, Dict[str, str]]) -> None:
        """
        Update the knowledge base with new information.
        
        Args:
            new_entry: Dictionary containing new medical condition information
                      Format: {"condition_name": {"overview": "...", "symptoms": "...", "treatment": "..."}}
        """
        # Update the in-memory knowledge base
        self.knowledge_base.update(new_entry)
        
        # Update FAISS index
        for condition, info in new_entry.items():
            self.faiss_kb.add_entry(condition, info)

    def reload_knowledge_base(self) -> None:
        """
        Reload the knowledge base from the RAG data file and update the FAISS index.
        This can be called when the RAG data file has been updated.
        """
        # Reload knowledge base
        self.knowledge_base = self._initialize_knowledge_base()
        
        # Reinitialize FAISS index with new data
        self.faiss_kb = FAISSKnowledgeBase()
        self.faiss_kb.initialize_from_dict(self.knowledge_base)

    def test_faiss_search(self, query: str = "What are the symptoms of skin conditions?", top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Test method to verify FAISS similarity search functionality.
        
        Args:
            query: The test query to search for
            top_k: Number of top results to return
            
        Returns:
            List of dictionaries containing the search results with their similarity scores
        """
        # Get similar conditions using FAISS
        results = self.faiss_kb.find_similar(query, top_k=top_k)
        
        # Print results for verification
        print("\nFAISS Search Test Results:")
        print(f"Query: {query}")
        print(f"Found {len(results)} similar conditions:")
        
        for i, result in enumerate(results, 1):
            print(f"\n{i}. {result['id']} (similarity score: {result['score']:.3f})")
            print(f"Data: {result['data'][:200]}...")
            
        return results

    def test_knowledge_base_integrity(self) -> Dict[str, Any]:
        """
        Test method to verify the integrity of the knowledge base and FAISS index.
        
        Returns:
            Dictionary containing test results and statistics
        """
        # Get basic statistics
        kb_size = len(self.knowledge_base)
        faiss_size = len(self.faiss_kb.ids)
        
        # Test a few sample queries
        test_queries = [
            "What are common skin conditions?",
            "How to treat infections?",
            "What causes rashes?"
        ]
        
        results = {}
        for query in test_queries:
            results[query] = self.test_faiss_search(query, top_k=2)
        
        # Compile test results
        test_results = {
            "knowledge_base_size": kb_size,
            "faiss_index_size": faiss_size,
            "index_integrity": kb_size == faiss_size,
            "sample_queries": results
        }
        
        # Print summary
        print("\nKnowledge Base Integrity Test Results:")
        print(f"Knowledge Base Size: {kb_size}")
        print(f"FAISS Index Size: {faiss_size}")
        print(f"Index Integrity Check: {'✓' if kb_size == faiss_size else '✗'}")
        
        return test_results