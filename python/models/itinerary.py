from typing import List, Optional
from pydantic import BaseModel, Field
from datetime   import datetime

class Activity(BaseModel):
    name: str
    description: Optional[str] = None
    cityId: str = Field(..., description="MongoDB ObjectId as string")
    category: Optional[str] = Field(None, description="One of sightseeing, food, adventure, culture, other")
    cost: Optional[float] = None
    duration: Optional[float] = None  # in hours
    images: Optional[List[str]] = []
    
class Section(BaseModel):
    tripId: str = Field(..., description="MongoDB ObjectId as string")
    name: str
    description: str
    activities: List[Activity]
    budget: Optional[float] = Field(None, description="Budget in INR")
    start_date: datetime = Field(..., description="Start date and time of this section")
    end_date: datetime = Field(..., description="End date and time of this section")

class ItineraryRequest(BaseModel):
    name: str
    description: str
    start_date: str
    end_date: str
    activities: List[Activity]  # Available activities to choose from

class ItineraryResponse(BaseModel):
    sections: List[Section]