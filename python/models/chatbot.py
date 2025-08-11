from pydantic import BaseModel, Field
from typing import List

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the message sender, e.g. 'user' or 'bot'")
    text: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    conversation: List[ChatMessage] = Field(..., description="List of chat messages so far, including user and bot")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Reply from the chatbot")
