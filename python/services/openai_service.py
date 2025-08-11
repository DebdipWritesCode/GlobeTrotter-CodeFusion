from openai import AsyncOpenAI
from config.settings import settings
from pydantic import BaseModel

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def get_structured_output(prompt: str, response_model: type[BaseModel]):
    """
    Calls OpenAI GPT model and returns JSON validated against the given Pydantic model.
    Uses the new Chat Completions API.
    """
    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful travel planning assistant."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_schema", "json_schema": response_model.model_json_schema()},
        temperature=0.7
    )

    content = response.choices[0].message.parsed
    return response_model.model_validate(content)
