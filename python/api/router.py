from fastapi import APIRouter
from api import itinerary

api_router = APIRouter()
api_router.include_router(itinerary.router, prefix="/v1", tags=["Itinerary"])
