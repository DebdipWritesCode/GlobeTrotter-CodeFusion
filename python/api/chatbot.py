# api/chatbot.py
from fastapi import APIRouter
from models.chatbot import ChatRequest, ChatResponse
from services.chatbot_service import generate_chat_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Receives a list of chat messages and returns a chatbot reply.
    """
    return await generate_chat_response(request)
