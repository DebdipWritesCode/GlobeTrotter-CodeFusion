from fastapi import APIRouter
from models.activity import ActivityCreate
from services.activity_service import generate_activities_for_city, ActivitiesResponseModel
from pydantic import BaseModel

router = APIRouter()

class ActivitiesRequest(BaseModel):
    city_name: str

@router.post("/activities", response_model=ActivitiesResponseModel)
async def create_activities(request: ActivitiesRequest):
    """
    Generate up to 12 activities for a given city name using GPT.
    """
    return await generate_activities_for_city(request.city_name)
