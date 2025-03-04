from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class VehicleType(str, Enum):
    sedan = "sedan"
    suv = "suv"
    truck = "truck"
    hatchback = "hatchback"
    van = "van"
    coupe = "coupe"
    convertible = "convertible"
    wagon = "wagon"
    other = "other"

class IssueSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class VehicleIssue(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    severity: IssueSeverity
    created_at: datetime = Field(default_factory=datetime.now)
    resolved: bool = False
    resolution: Optional[str] = None
    diagnostic_codes: List[str] = []

class Vehicle(BaseModel):
    id: Optional[str] = None
    user_id: str
    make: str
    model: str
    year: int
    type: VehicleType
    vin: Optional[str] = None
    mileage: Optional[int] = None
    last_service_date: Optional[datetime] = None
    issues: List[VehicleIssue] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)