import httpx
import json
import logging
from typing import Dict, Any, List, Optional
from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL, HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL
from app.services.vector_db_service import vector_db_service

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self, use_ollama: bool = True):
        self.use_ollama = use_ollama
        self.ollama_url = f"{OLLAMA_BASE_URL}/api/generate"
        self.ollama_model = OLLAMA_MODEL
        self.huggingface_api_key = HUGGINGFACE_API_KEY
        self.huggingface_model = HUGGINGFACE_MODEL
        
    async def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate a response from the LLM"""
        if self.use_ollama:
            return await self._generate_with_ollama(prompt, system_prompt)
        else:
            return await self._generate_with_huggingface(prompt)
            
    async def _generate_with_ollama(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text using Ollama"""
        try:
            payload = {
                "model": self.ollama_model,
                "prompt": prompt,
                "stream": False
            }
            
            if system_prompt:
                payload["system"] = system_prompt
                
            async with httpx.AsyncClient() as client:
                response = await client.post(self.ollama_url, json=payload)
                response.raise_for_status()
                result = response.json()
                return result.get("response", "")
                
        except Exception as e:
            logger.error(f"Error generating text with Ollama: {e}")
            return f"Error: {str(e)}"
            
    async def _generate_with_huggingface(self, prompt: str) -> str:
        """Generate text using Hugging Face API"""
        try:
            url = f"https://api-inference.huggingface.co/models/{self.huggingface_model}"
            headers = {"Authorization": f"Bearer {self.huggingface_api_key}"}
            payload = {"inputs": prompt}
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                result = response.json()
                
                # Handle different response formats
                if isinstance(result, list) and len(result) > 0:
                    if isinstance(result[0], dict) and "generated_text" in result[0]:
                        return result[0]["generated_text"]
                    return str(result[0])
                return str(result)
                
        except Exception as e:
            logger.error(f"Error generating text with Hugging Face: {e}")
            return f"Error: {str(e)}"
            
    async def diagnose_vehicle_issue(self, vehicle_info: Dict[str, Any], issue_description: str) -> Dict[str, Any]:
        """Diagnose a vehicle issue using LLM and vector database"""
        # Get relevant knowledge from vector DB
        relevant_info = vector_db_service.query_collection(
            "automotive_knowledge", 
            f"{vehicle_info['make']} {vehicle_info['model']} {issue_description}"
        )
        
        # Construct context from relevant information
        context = ""
        if relevant_info and "documents" in relevant_info and len(relevant_info["documents"]) > 0:
            context = "\n".join(relevant_info["documents"][0])
        
        # Construct prompt with vehicle info, issue description, and context
        system_prompt = """You are an automotive diagnostic expert. 
        Analyze the vehicle information and issue description to provide a diagnosis.
        Classify the severity as low, medium, high, or critical.
        Provide likely causes and recommended actions."""
        
        prompt = f"""
        Vehicle Information:
        - Make: {vehicle_info['make']}
        - Model: {vehicle_info['model']}
        - Year: {vehicle_info['year']}
        - Mileage: {vehicle_info.get('mileage', 'Unknown')}
        
        Issue Description:
        {issue_description}
        
        Relevant Technical Information:
        {context}
        
        Provide a diagnosis in JSON format with the following fields:
        - likely_causes: list of potential causes
        - severity: severity level (low, medium, high, critical)
        - recommended_actions: list of recommended actions
        - diagnostic_codes: list of potential OBD-II codes (if applicable)
        - explanation: detailed explanation of the diagnosis
        """
        
        # Generate diagnosis
        response = await self.generate_response(prompt, system_prompt)
        
        # Extract JSON from response
        try:
            # Find JSON in the response (it might be surrounded by text)
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                diagnosis = json.loads(json_str)
                return diagnosis
            else:
                # If no JSON found, create a structured response
                return {
                    "likely_causes": ["Unable to parse diagnosis"],
                    "severity": "unknown",
                    "recommended_actions": ["Consult a professional mechanic"],
                    "diagnostic_codes": [],
                    "explanation": response
                }
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from LLM response: {response}")
            return {
                "likely_causes": ["Unable to parse diagnosis"],
                "severity": "unknown",
                "recommended_actions": ["Consult a professional mechanic"],
                "diagnostic_codes": [],
                "explanation": response
            }

# Create a singleton instance
llm_service = LLMService(use_ollama=True)  # Set to False to use Hugging Face