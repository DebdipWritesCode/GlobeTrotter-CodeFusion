def itinerary_prompt(name: str, description: str, start_date: str, end_date: str, activities: list) -> str:
    activity_list = "\n".join(
        [f"- {a['name']} ({a['category']}) in city {a['cityId']}" for a in activities]
    )

    return f"""
    You are a travel planner AI. Based on the given trip details, create a structured itinerary.

    Trip Name: {name}
    Description: {description}
    Start Date: {start_date}
    End Date: {end_date}

    Available activities you can choose from:
    {activity_list}

    Rules:
    - Use only activities from the given list.
    - Distribute activities logically across days/sections.
    - Each section should have a budget (approximation).
    - Output in valid JSON matching the given schema exactly.
    """
