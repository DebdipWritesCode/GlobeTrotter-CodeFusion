from models.itinerary import ItineraryRequest, ItineraryResponse
from utils.prompts import itinerary_prompt
from services.openai_service import get_structured_output

async def generate_itinerary(data: ItineraryRequest) -> ItineraryResponse:
    prompt = itinerary_prompt(
        name=data.name,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date,
        activities=[a.dict() for a in data.activities]
    )

    itinerary = await get_structured_output(
        prompt=prompt,
        response_model=ItineraryResponse
    )

    return itinerary
