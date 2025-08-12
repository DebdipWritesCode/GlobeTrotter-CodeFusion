# services/chatbot_service.py
from models.chatbot import ChatRequest, ChatResponse
from services.openai_service import get_structured_output

async def generate_chat_response(data: ChatRequest) -> ChatResponse:
    # Construct prompt from conversation history or adapt as needed
    # Here we join all previous messages for context
    messages_text = "\n".join(
        [f"{msg.role}: {msg.text}" for msg in data.conversation]
    )

    prompt = f"You are a helpful travel planning assistant chatbot.\nConversation history:\n{messages_text}\n\nRespond with a single concise message."

    # Call OpenAI with ChatResponse model to validate the output JSON
    response = await get_structured_output(
        prompt=prompt,
        response_model=ChatResponse
    )

    return response
