from openai import AsyncOpenAI
from config.settings import settings
from pydantic import BaseModel
import json

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def get_structured_output(prompt: str, response_model: type[BaseModel]):
    """
    Calls OpenAI GPT model and returns JSON validated against the given Pydantic model.
    Uses the new Chat Completions API with JSON Schema.
    """
    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful travel planning assistant."},
            {"role": "user", "content": prompt}
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": response_model.__name__,  # <-- required
                "schema": response_model.model_json_schema()  # <-- actual schema
            }
        },
        temperature=0.7
    )

    # Extract JSON from model-parsed response
    content_str = response.choices[0].message.content
    content_dict = json.loads(content_str)  # Convert JSON string to Python dict

    return response_model.model_validate(content_dict)
