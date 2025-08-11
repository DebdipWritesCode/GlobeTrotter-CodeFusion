from models.activity import ActivityCreate  # your Pydantic model
from utils.prompts import activities_prompt
from services.openai_service import get_structured_output  # your existing OpenAI helper
from models.activity import ActivitiesResponseModel  # your Pydantic model for response

async def generate_activities_for_city(city_name: str) -> ActivitiesResponseModel:
    prompt = activities_prompt(city_name)

    activities_response = await get_structured_output(
        prompt=prompt,
        response_model=ActivitiesResponseModel
    )

    return activities_response
