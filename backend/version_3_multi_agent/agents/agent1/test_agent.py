import unittest
import os
import tempfile
from pathlib import Path
import numpy as np
from PIL import Image
import asyncio
import sys
sys.path.append('.')  # Add current directory to Python path
from agent import DescriptorAgent

class TestDescriptorAgent(unittest.TestCase):
    def setUp(self):
        """Set up test environment before each test"""
        self.agent = DescriptorAgent()
        self.test_session_id = "test_session_123"
        
        # Create a temporary test image
        self.temp_dir = tempfile.mkdtemp()
        self.test_image_path = "C:\\Users\\pradh\\Documents\\Aventus3\\07Acne081101.jpg"

    def tearDown(self):
        """Clean up after each test"""
        # Remove temporary test image
        if os.path.exists(self.test_image_path):
            os.remove(self.test_image_path)
        os.rmdir(self.temp_dir)

    def _create_test_image(self):
        """Create a simple test image for classification"""
        # Create a 224x224 RGB image (typical size for ResNet)
        img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
        img = Image.fromarray(img_array)
        img.save(self.test_image_path)

    def test_model_loading(self):
        """Test if the model loads successfully"""
        self.assertIsNotNone(self.agent.classification_model, 
            "Model should be loaded successfully")

    def test_image_classification(self):
        """Test if image classification works"""
        # Verify image file exists
        self.assertTrue(os.path.exists(self.test_image_path), 
            f"Test image not found at {self.test_image_path}")

        # Test classification
        predicted_class, probabilities = self.agent.classify_image(self.test_image_path)
        
        # Verify classification results
        self.assertIsNotNone(predicted_class, "Should return a predicted class")
        self.assertIsNotNone(probabilities, "Should return probability distribution")
        self.assertTrue(isinstance(predicted_class, (int, np.integer)), "Predicted class should be an integer (or np.integer)")
        self.assertTrue(isinstance(probabilities, (list, np.ndarray)), "Probabilities should be a list or a numpy array")
        self.assertEqual(len(probabilities), len(self.agent.class_labels), 
            "Number of probabilities should match number of classes")
        
        # Print classification results for verification
        print("\nClassification Results:")
        print(f"Predicted Class: {self.agent.class_labels[predicted_class]}")
        print(f"Confidence: {probabilities[predicted_class]:.2%}")
        
        # Print top 3 predictions
        top_3_idx = probabilities.argsort()[-3:][::-1]
        print("\nTop 3 Predictions:")
        for idx in top_3_idx:
            print(f"{self.agent.class_labels[idx]}: {probabilities[idx]:.2%}")

    def test_invoke_with_image(self):
        """Test the agent's invoke method with image input"""
        query = "What can you tell me about this skin condition?"
        response = self.agent.invoke(query, self.test_session_id, self.test_image_path)
        
        self.assertIsNotNone(response, "Should return a response")
        self.assertIsInstance(response, str, "Response should be a string")
        self.assertGreater(len(response), 0, "Response should not be empty")

    def test_invoke_without_image(self):
        """Test the agent's invoke method without image input"""
        query = "What are the symptoms of eczema?"
        response = self.agent.invoke(query, self.test_session_id)
        
        self.assertIsNotNone(response, "Should return a response")
        self.assertIsInstance(response, str, "Response should be a string")
        self.assertGreater(len(response), 0, "Response should not be empty")

    def test_invalid_image_path(self):
        """Test handling of invalid image path"""
        invalid_path = "nonexistent_image.jpg"
        predicted_class, probabilities = self.agent.classify_image(invalid_path)
        
        self.assertIsNone(predicted_class, "Should return None for invalid image path")
        self.assertIsNone(probabilities, "Should return None for invalid image path")

    async def _run_stream_test(self):
        """Helper method to run the streaming test"""
        query = "What can you tell me about this skin condition?"
        response_generator = self.agent.stream(query, self.test_session_id, self.test_image_path)
        async for response in response_generator:
            return response

    def test_stream_with_image(self):
        """Test the streaming response with image input"""
        # Run the async test
        response = asyncio.run(self._run_stream_test())
        
        self.assertIsInstance(response, dict, "Response should be a dictionary")
        self.assertIn("is_task_complete", response, "Response should include task completion status")
        self.assertIn("content", response, "Response should include content")
        self.assertTrue(response["is_task_complete"], "Task should be complete")
        self.assertIsInstance(response["content"], str, "Content should be a string")
        self.assertGreater(len(response["content"]), 0, "Content should not be empty")

if __name__ == '__main__':
    unittest.main(verbosity=2) 