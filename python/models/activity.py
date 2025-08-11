from pydantic import BaseModel, Field
from typing import Optional, List

class ActivityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = Field(None, description="One of sightseeing, food, adventure, culture, other")
    cost: Optional[float] = None
    duration: Optional[float] = None  # in hours

class ActivitiesResponseModel(BaseModel):
    activities: List[ActivityCreate]
