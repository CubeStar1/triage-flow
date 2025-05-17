import asyncio
import json
import logging
import pytest
from typing import Dict, Any
import httpx
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test configuration
ORCHESTRATOR_URL = "http://localhost:8000"
DESCRIPTION_FETCHER_URL = "http://localhost:8001"
TRIAGE_ANALYST_URL = "http://localhost:8002"

class TestAgentSystem:
    def __init__(self):
        self.client = httpx.AsyncClient()
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }

    async def make_request(self, url: str, method: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Make a JSON-RPC request to an agent"""
        request_id = int(datetime.now().timestamp())
        data = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params or {},
            "id": request_id
        }
        
        try:
            response = await self.client.post(url, json=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Request failed: {str(e)}")
            raise

    async def test_process_image(self):
        """Test the process_image endpoint with valid data"""
        try:
            params = {
                "patient_id": "TEST123",
                "image_path": "/path/to/test/image.jpg",
                "image_labels": [
                    {
                        "condition": "Pneumonia",
                        "score": 0.92
                    },
                    {
                        "condition": "Bronchitis",
                        "score": 0.75
                    }
                ]
            }
            
            result = await self.make_request(
                f"{ORCHESTRATOR_URL}/triage_orchestrator",
                "process_image",
                params
            )
            
            assert "result" in result
            assert "triage" in result["result"]
            assert len(result["result"]["triage"]) == 2
            
            self.test_results["passed"] += 1
            logger.info("✅ process_image test passed")
        except Exception as e:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"process_image test failed: {str(e)}")
            logger.error(f"❌ process_image test failed: {str(e)}")

    async def test_missing_parameters(self):
        """Test error handling for missing parameters"""
        try:
            params = {
                "patient_id": "TEST123",
                # Missing image_path and image_labels
            }
            
            result = await self.make_request(
                f"{ORCHESTRATOR_URL}/triage_orchestrator",
                "process_image",
                params
            )
            
            assert "error" in result
            assert result["error"]["code"] == -32602
            assert "Missing required parameters" in result["error"]["message"]
            
            self.test_results["passed"] += 1
            logger.info("✅ missing_parameters test passed")
        except Exception as e:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"missing_parameters test failed: {str(e)}")
            logger.error(f"❌ missing_parameters test failed: {str(e)}")

    async def test_invalid_confidence_score(self):
        """Test error handling for invalid confidence score"""
        try:
            params = {
                "patient_id": "TEST123",
                "image_path": "/path/to/test/image.jpg",
                "image_labels": [
                    {
                        "condition": "Pneumonia",
                        "score": 1.5  # Invalid score > 1.0
                    }
                ]
            }
            
            result = await self.make_request(
                f"{ORCHESTRATOR_URL}/triage_orchestrator",
                "process_image",
                params
            )
            
            assert "error" in result
            assert result["error"]["code"] == -32602
            
            self.test_results["passed"] += 1
            logger.info("✅ invalid_confidence_score test passed")
        except Exception as e:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"invalid_confidence_score test failed: {str(e)}")
            logger.error(f"❌ invalid_confidence_score test failed: {str(e)}")

    async def test_health_checks(self):
        """Test health check endpoints for all agents"""
        try:
            # Test orchestrator health
            orchestrator_health = await self.client.get(f"{ORCHESTRATOR_URL}/triage_orchestrator/health")
            assert orchestrator_health.status_code == 200
            assert "status" in orchestrator_health.json()
            
            # Test description fetcher health
            fetcher_health = await self.client.get(f"{DESCRIPTION_FETCHER_URL}/description_fetcher/health")
            assert fetcher_health.status_code == 200
            assert "status" in fetcher_health.json()
            
            # Test triage analyst health
            analyst_health = await self.client.get(f"{TRIAGE_ANALYST_URL}/triage_analyst/health")
            assert analyst_health.status_code == 200
            assert "status" in analyst_health.json()
            
            self.test_results["passed"] += 1
            logger.info("✅ health_checks test passed")
        except Exception as e:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"health_checks test failed: {str(e)}")
            logger.error(f"❌ health_checks test failed: {str(e)}")

    async def run_all_tests(self):
        """Run all test cases"""
        logger.info("Starting test suite...")
        
        await self.test_process_image()
        await self.test_missing_parameters()
        await self.test_invalid_confidence_score()
        await self.test_health_checks()
        
        # Print test summary
        logger.info("\nTest Summary:")
        logger.info(f"Passed: {self.test_results['passed']}")
        logger.info(f"Failed: {self.test_results['failed']}")
        
        if self.test_results["errors"]:
            logger.info("\nErrors:")
            for error in self.test_results["errors"]:
                logger.error(error)
        
        await self.client.aclose()

if __name__ == "__main__":
    test_system = TestAgentSystem()
    asyncio.run(test_system.run_all_tests()) 