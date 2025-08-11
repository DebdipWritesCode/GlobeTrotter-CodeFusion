from fastapi import APIRouter
from models.itinerary import ItineraryRequest, ItineraryResponse
from services.itinerary_service import generate_itinerary

router = APIRouter()

@router.post("/itinerary", response_model=ItineraryResponse)
async def create_itinerary(request: ItineraryRequest):
    """
    Generates a structured itinerary using GPT based on trip details and available activities.
    """
    return await generate_itinerary(request)
