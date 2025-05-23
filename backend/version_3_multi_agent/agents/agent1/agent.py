from datetime import datetime 
from typing import Dict, List, Any, Tuple, Optional
import json
import os
import io
import tempfile
from pathlib import Path
import gdown

# Data processing and model imports
import numpy as np
import cv2
import requests
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
from PIL import Image
from sentence_transformers import SentenceTransformer
import faiss

# Google imports
from google.adk.agents.llm_agent import LlmAgent
from google.adk.sessions import InMemorySessionService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.artifacts import InMemoryArtifactService
from google.adk.runners import Runner
from google.genai import types

# Environment configuration
from dotenv import load_dotenv
load_dotenv()

# Configure API keys
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
os.environ["GOOGLE_API_KEY"] = API_KEY

# Google Drive configuration
MODEL_FILENAME = 'resnet152.h5'
# Replace this with your Google Drive file ID
MODEL_GDRIVE_ID = os.getenv('MODEL_GDRIVE_ID')

import google.generativeai as genai

# Path configurations
BASE_DIR = Path(__file__).parent.parent.parent.parent
RAG_DATA_PATH = BASE_DIR / "rag" / "ragData.json"
MODEL_DIR = BASE_DIR / "weights"
MODEL_PATH = MODEL_DIR / MODEL_FILENAME

def download_model_if_needed():
    """Download the model from Google Drive if it doesn't exist locally"""
    if MODEL_PATH.exists():
        return True
        
    if not MODEL_GDRIVE_ID:
        raise ValueError("MODEL_GDRIVE_ID not found in environment variables")
        
    try:
        # Create weights directory if it doesn't exist
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        
        # Download from Google Drive
        url = f'https://drive.google.com/uc?id={MODEL_GDRIVE_ID}'
        gdown.download(url, str(MODEL_PATH), quiet=False)
        
        if MODEL_PATH.exists():
            return True
        return False
    except Exception as e:
        print(f"Error downloading model: {e}")
        return False

# Classification mappings
CLASS_MAPPING = {
    0: "Acne and Rosacea",
    1: "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions",
    2: "Atopic Dermatitis",
    3: "Bullous Disease",
    4: "Cellulitis Impetigo and other Bacterial Infections",
    5: "Eczema",
    6: "Exanthems and Drug Eruptions",
    7: "Hair Loss Alopecia and other Hair Diseases",
    8: "Herpes HPV and other STDs",
    9: "Light Diseases and Disorders of Pigmentation",
    10: "Lupus and other Connective Tissue diseases",
    11: "Melanoma Skin Cancer Nevi and Moles",
    12: "Nail Fungus and other Nail Disease",
    13: "Poison Ivy and other Contact Dermatitis",
    14: "Psoriasis Lichen Planus and related diseases",
    15: "Scabies Lyme Disease and other Infestations and Bites",
    16: "Seborrheic Keratoses and other Benign Tumors",
    17: "Systemic Disease",
    18: "Tinea Ringworm Candidiasis and other Fungal Infections",
    19: "Urticaria Hives",
    20: "Vascular Tumors",
    21: "Vasculitis",
    22: "Warts Molluscum and other Viral Infections"
}

# Default model configuration
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'
TOP_K_RESULTS = 3
IMAGE_SIZE = (224, 224)

class DescriptorAgent:
    """Agent that provides medical condition descriptions and image analysis"""

    def __init__(self):
        self.knowledge_base = self._initialize_knowledge_base()
        self.embedding_model = None  
        self.faiss_index = None
        self.faiss_passages = []
        self.faiss_ids = []
        self.classification_model = None
        self._initialize_models()

    def _initialize_models(self):
        """Initialize the FAISS index and classification model"""
        try:
            self._initialize_faiss()
            self._initialize_classification_model()
        except Exception as e:
            print(f"Warning: Failed to initialize models: {e}")
            raise

    def _initialize_faiss(self):
        """Initialize FAISS index from RAG data"""
        try:
            with open(RAG_DATA_PATH, 'r') as f:
                corpus = json.load(f)
            
            self.faiss_passages = [f"{e['id']}: {e['data']}" for e in corpus]
            self.faiss_ids = [e['id'] for e in corpus]

            self._ensure_embedding_model()
            if not self.embedding_model:
                return

            embeddings = self.embedding_model.encode(
                self.faiss_passages, 
                convert_to_numpy=True, 
                normalize_embeddings=True
            )
            
            dimension = embeddings.shape[1]
            self.faiss_index = faiss.IndexFlatIP(dimension)
            self.faiss_index.add(embeddings)
            
            print(f"FAISS index initialized with {len(self.faiss_passages)} entries")
        except Exception as e:
            print(f"Error initializing FAISS: {e}")
            self.faiss_index = None

    def _initialize_classification_model(self):
        """Initialize the custom ResNet152 model"""
        try:
            # Download model if needed before loading
            if download_model_if_needed():
                self.classification_model = load_model(MODEL_PATH)
            else:
                print("Failed to download model from Supabase")
                self.classification_model = None
        except Exception as e:
            print(f"Error loading classification model: {e}")
            self.classification_model = None

    def _process_image(self, image_url: str) -> List[Dict[str, Any]]:
        """Process an image using the custom ResNet152 model, matching the inference.py pipeline"""
        if not self.classification_model:
            return []

        try:
            response = requests.get(image_url)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                tmp.write(response.content)
                tmp_path = tmp.name

            img = cv2.imread(tmp_path)
            img = cv2.resize(img, IMAGE_SIZE)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img_array = np.expand_dims(img, axis=0)
            img_array = tf.keras.applications.resnet.preprocess_input(img_array)

            predictions = self.classification_model.predict(img_array)

            top_indices = np.argsort(predictions[0])[-5:][::-1]
            top_scores = predictions[0][top_indices]

            return [
                {
                    'class': CLASS_MAPPING.get(idx, f"Unknown_Class_{idx}"),
                    'confidence': float(score),
                    'description': f"Skin condition: {CLASS_MAPPING.get(idx, f'Unknown_Class_{idx}')}"

                }
                for idx, score in zip(top_indices, top_scores)
            ]
        except Exception as e:
            print(f"Error processing image: {e}")
            return []

    def _initialize_knowledge_base(self) -> Dict[str, Dict[str, str]]:
        """Initialize the medical knowledge base with sample data"""
        return {
            "Acne and Rosacea": {
                "overview": "Acne and rosacea are common skin conditions that affect the face.",
                "symptoms": "Acne symptoms include pimples, blackheads, and whiteheads. Rosacea symptoms include facial redness, visible blood vessels, and sometimes pimples.",
                "treatment": "Treatment may include topical medications, antibiotics, and lifestyle changes.",
                "patient_explanation": "These are common skin conditions that can be managed with proper treatment and care."
            },
            "Melanoma Skin Cancer": {
                "overview": "Melanoma is a serious form of skin cancer that develops in melanocytes.",
                "symptoms": "Symptoms include new moles, changes in existing moles, and irregular pigmentation.",
                "treatment": "Treatment typically involves surgical removal and may include additional therapies.",
                "patient_explanation": "This is a serious skin condition that requires immediate medical attention."
            }
        }

    def _ensure_embedding_model(self):
        """Lazy load the embedding model if not already loaded"""
        if self.embedding_model is None:
            try:
                self.embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
            except Exception as e:
                print(f"Warning: Failed to load embedding model: {e}")
                raise

    def _find_relevant_conditions(self, query: str, top_k: int = TOP_K_RESULTS) -> List[Dict[str, Any]]:
        """Find the most relevant medical conditions using FAISS"""
        if not self.faiss_index or not self.embedding_model:
            return []

        try:
            query_embedding = self.embedding_model.encode(
                [query], 
                convert_to_numpy=True, 
                normalize_embeddings=True
            )
            
            scores, indices = self.faiss_index.search(query_embedding, top_k)
            
            return [
                {
                    'id': self.faiss_ids[idx],
                    'data': self.faiss_passages[idx],
                    'score': float(scores[0][i])
                }
                for i, idx in enumerate(indices[0])
            ]
        except Exception as e:
            print(f"Error in FAISS search: {e}")
            return []

    def _update_knowledge_base(self, new_data: Dict[str, Any]):
        """Update the knowledge base with new data"""
        if not new_data:
            return

        try:            
            with open(RAG_DATA_PATH, 'r') as f:
                corpus = json.load(f)
            
            new_entry = {
                'id': str(len(corpus) + 1),
                'data': json.dumps(new_data)
            }
            corpus.append(new_entry)
            
            with open(RAG_DATA_PATH, 'w') as f:
                json.dump(corpus, f, indent=2)
            
            self._initialize_faiss()
            
        except Exception as e:
            print(f"Error updating knowledge base: {e}")

    def invoke(self, query: str, session_id: str, image_url: Optional[str] = None) -> Dict[str, Any]:
        """Process a medical query and return a comprehensive response"""
        try:
            response = {
                'text_analysis': None,
                'image_analysis': None,
                'relevant_conditions': []
            }

            if image_url:
                image_analysis = self._process_image(image_url)
                response['image_analysis'] = image_analysis

                if image_analysis:
                    top_prediction = image_analysis[0]
                    class_label = top_prediction['class']
                    relevant_conditions = self._find_relevant_conditions(class_label)
                    if relevant_conditions:
                        response['relevant_conditions'] = relevant_conditions

            if query:
                text_conditions = self._find_relevant_conditions(query)
                if text_conditions:
                    existing_ids = {c['id'] for c in response['relevant_conditions']}
                    new_conditions = [c for c in text_conditions if c['id'] not in existing_ids]
                    response['relevant_conditions'].extend(new_conditions)

            return response

        except Exception as e:
            return {
                'error': str(e),
                'text_analysis': None,
                'image_analysis': None,
                'relevant_conditions': []
            }

    async def stream(self, query: str, session_id: str, image_url: Optional[str] = None):
        """Streaming response implementation with image support"""
        try:
            response = self.invoke(query, session_id, image_url)
            yield {
                "is_task_complete": True,
                "content": response
            }
        except Exception as e:
            yield {
                "is_task_complete": True,
                "content": f"Error: {str(e)}"
            }