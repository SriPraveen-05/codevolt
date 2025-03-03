from fastapi import APIRouter, HTTPException, Depends, Body
from typing import Dict, Any, List
from app.models.vehicle import IssueSeverity, VehicleIssue
from app.services.llm_service import llm_service
from app.services.db_service import mongodb_service
from app.routes.auth import get_current_user
from app.models.user import User
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/diagnostics", tags=["diagnostics"])

class DiagnosticRequest(BaseModel):
    vehicle_id: str
    issue_description: str
    obd_codes: List[str] = []

class DiagnosticResponse(BaseModel):
    diagnosis: Dict[str, Any]
    issue_id: str = None

@router.post("/", response_model=DiagnosticResponse)
async def diagnose_issue(
    request: DiagnosticRequest,
    current_user: User = Depends(get_current_user)
):
    # Get vehicle information
    vehicle = await mongodb_service.get_vehicle(request.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    # Check if vehicle belongs to user
    if vehicle.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this vehicle")
    
    # Prepare vehicle info for diagnosis
    vehicle_info = {
        "make": vehicle.make,
        "model": vehicle.model,
        "year": vehicle.year,
        "mileage": vehicle.mileage,
        "type": vehicle.type
    }
    
    # Get diagnosis from LLM
    diagnosis = await llm_service.diagnose_vehicle_issue(
        vehicle_info, 
        request.issue_description
    )
    
    # Create a new vehicle issue
    severity = IssueSeverity.medium  # Default
    try:
        severity = IssueSeverity(diagnosis.get("severity", "medium"))
    except ValueError:
        pass
        
    new_issue = VehicleIssue(
        title=f"Issue on {datetime.now().strftime('%Y-%m-%d')}",
        description=request.issue_description,
        severity=severity,
        diagnostic_codes=diagnosis.get("diagnostic_codes", []) + request.obd_codes
    )
    
    # Add issue to vehicle
    issue_id = await mongodb_service.add_issue_to_vehicle(vehicle.id, new_issue)
    
    return DiagnosticResponse(
        diagnosis=diagnosis,
        issue_id=issue_id
    )

@router.get("/repair-guide/{issue_id}")
async def get_repair_guide(
    issue_id: str,
    vehicle_id: str,
    current_user: User = Depends(get_current_user)
):
    # Get vehicle information
    vehicle = await mongodb_service.get_vehicle(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    # Check if vehicle belongs to user
    if vehicle.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this vehicle")
    
    # Find the issue
    issue = next((i for i in vehicle.issues if i.id == issue_id), None)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    # Generate repair guide using LLM
    system_prompt = """You are an automotive repair expert. 
    Create a detailed step-by-step repair guide for the given vehicle issue.
    Include safety precautions, tools needed, and estimated time for each step."""
    
    prompt = f"""
    Vehicle Information:
    - Make: {vehicle.make}
    - Model: {vehicle.model}
    - Year: {vehicle.year}
    
    Issue Description:
    {issue.description}
    
    Diagnostic Codes:
    {', '.join(issue.diagnostic_codes) if issue.diagnostic_codes else 'None'}
    
    Create a detailed repair guide with the following sections:
    1. Safety Precautions
    2. Tools Required
    3. Parts Required (if applicable)
    4. Step-by-Step Instructions
    5. Estimated Time
    6. Tips and Warnings
    
    Format the response in JSON with these sections as keys.
    """
    
    response = await llm_service.generate_response(prompt, system_prompt)
    
    # Extract JSON from response
    try:
        # Find JSON in the response
        json_start = response.find('{')
        json_end = response.rfind('}') + 1
        if json_start >= 0 and json_end > json_start:
            json_str = response[json_start:json_end]
            repair_guide = json.loads(json_str)
            return repair_guide
        else:
            # If no JSON found, return the raw response
            return {"raw_guide": response}
    except json.JSONDecodeError:
        return {"raw_guide": response}