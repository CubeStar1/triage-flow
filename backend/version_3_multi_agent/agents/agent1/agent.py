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
from typing import Dict, List, Any, Tuple, Optional
import json
import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

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


# -----------------------------------------------------------------------------
# 🕒 TellTimeAgent: Your AI agent that tells the time
# -----------------------------------------------------------------------------
class DescriptorAgent:
    """Agent that combines dermatology image classification with medical condition descriptions"""

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain", "image/jpeg", "image/png"]

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
        # Initialize the knowledge base and embeddings
        self.knowledge_base = self._initialize_knowledge_base()
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self._create_embeddings()
        
        # Initialize the dermatology classification model
        self.classification_model = None
        try:
            # Update model path to match the actual location
            model_path = 'C:\\Users\\pradh\\Documents\\Aventus3\\resnet152.h5'
            self.classification_model = load_model(model_path)
        except Exception as e:
            print(f"Error loading the classification model: {e}")
        
        self.class_labels = [
            'acne', 'actinic keratosis basal cell carcinoma and other malignant lesions',
            'atopic dermatitis photos', 'bullous disease photos',
            'cellulitis impetigo and other bacterial infections', 'eczema photos',
            'exanthems and drug eruptions', 'hair loss photos alopecia and other hair diseases',
            'herpes hpv and other stds photos', 'light diseases and disorders of pigmentation',
            'lupus and other connective tissue diseases', 'melanoma skin cancer nevi and moles',
            'nail fungus and other nail disease', 'poison ivy photos and other contact dermatitis',
            'psoriasis pictures lichen planus and related diseases',
            'scabies lyme disease and other infestations and bites',
            'seborrheic keratoses and other benign tumors', 'systemic disease',
            'tinea ringworm candidiasis and other fungal infections', 'urticaria hives',
            'vascular tumors', 'vasculitis photos', 'warts mollusca and other viral infections'
        ]

    def _initialize_knowledge_base(self) -> Dict[str, Dict[str, str]]:
        """Initialize the medical knowledge base with sample data"""
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

    def _create_embeddings(self):
        """Create embeddings for the knowledge base entries"""
        self.embeddings = {}
        for condition, info in self.knowledge_base.items():
            # Combine all text fields for embedding
            text = f"{condition} {info['overview']} {info['symptoms']} {info['treatment']}"
            self.embeddings[condition] = self.embedding_model.encode(text)

    def _find_relevant_conditions(self, query: str, top_k: int = 2) -> List[tuple[str, float]]:
        """Find the most relevant medical conditions for the query"""
        query_embedding = self.embedding_model.encode(query)
        similarities = {}
        
        for condition, embedding in self.embeddings.items():
            similarity = np.dot(query_embedding, embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(embedding)
            )
            similarities[condition] = similarity
        
        # Sort by similarity and return top k conditions
        return sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:top_k]

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

    def classify_image(self, img_path: str, target_size: Tuple[int, int] = (224, 224)) -> Tuple[Optional[int], Optional[np.ndarray]]:
        """
        Performs inference on an image using the loaded ResNet101 model.

        Args:
            img_path (str): Path to the input image file.
            target_size (tuple): The target size (height, width) for resizing the image.

        Returns:
            tuple: A tuple containing the predicted class index and the probability
                   distribution over all classes. Returns (None, None) if the
                   model is not loaded or if there's an error during processing.
        """
        if self.classification_model is None:
            print("Error: Model not loaded. Please ensure 'resnet152.h5' exists in the correct path.")
            return None, None

        try:
            # Load and preprocess the image
            img = image.load_img(img_path, target_size=target_size)
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
            img_array = tf.keras.applications.resnet.preprocess_input(img_array)

            # Perform inference
            predictions = self.classification_model.predict(img_array)

            # Return the index of the most likely class and the probability distribution
            predicted_class_index = np.argmax(predictions[0])
            probability_distribution = predictions[0]

            return predicted_class_index, probability_distribution

        except Exception as e:
            print(f"Error during inference: {e}")
            return None, None

    def invoke(self, query: str, session_id: str, image_path: Optional[str] = None) -> str:
        """Process a medical query and return a comprehensive response"""
        context = []
        
        # If an image is provided, perform classification
        if image_path and os.path.exists(image_path):
            predicted_class, probabilities = self.classify_image(image_path)
            if predicted_class is not None and predicted_class < len(self.class_labels):
                condition = self.class_labels[predicted_class]
                confidence = probabilities[predicted_class]
                context.append(f"Image Analysis Results:\n"
                             f"Detected Condition: {condition}\n"
                             f"Confidence: {confidence:.2%}\n\n")
        
        # Find relevant conditions using existing RAG functionality
        relevant_conditions = self._find_relevant_conditions(query)
        
        # Prepare context for the agent using existing knowledge base
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

    async def stream(self, query: str, session_id: str, image_path: Optional[str] = None):
        """Streaming response implementation with image support"""
        response = self.invoke(query, session_id, image_path)
        yield {
            "is_task_complete": True,
            "content": response
        }