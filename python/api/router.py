# api/__init__.py or main api router file
from fastapi import APIRouter
from api import chatbot, itinerary

api_router = APIRouter()
api_router.include_router(chatbot.router, prefix="/v1", tags=["Chatbot"])
api_router.include_router(itinerary.router, prefix="/v1", tags=["Itinerary"])
