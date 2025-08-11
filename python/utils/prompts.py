def itinerary_prompt(name: str, description: str, start_date: str, end_date: str, activities: list) -> str:
    activity_list = "\n".join(
        [f"{i}: {a['name']} ({a['category']}) in city {a['cityId']}" for i, a in enumerate(activities)]
    )

    return f"""
You are a travel planner AI. Based on the trip details and list of activities, create a structured itinerary in JSON.

Trip Name: {name}
Description: {description}
Start Date: {start_date}
End Date: {end_date}

Available activities you can choose from (indexed starting at 0):
{activity_list}

Rules:
- Use only activities from the given list.
- Reference activities by their index in the activities list, using the field "activityIndex".
- The index is zero-based (first activity is index 0).
- It is not necessary to include activities in every section; if no activity is suitable, you may omit them.
- You can include multiple activities in a single section if relevant.
- Do NOT use or invent any IDs.
- Distribute activities logically across days/sections.
- Each section should have a budget (approximate number).
- Output valid JSON matching the schema exactly.
- Do NOT include any extra or unknown fields.
- Example for activities inside a section:

"activities": [
    {{"activityIndex": 0, "name": "Visit the museum"}},
    {{"activityIndex": 2, "name": "City walking tour"}}
]

Produce only the JSON output without extra explanation or text.
"""


def activities_prompt(city_name: str) -> str:
    return f"""
You are a travel planner AI. Generate up to 12 unique activities suitable for visitors in the city named "{city_name}".

Each activity should include:
- name (short title),
- optional description,
- category (choose from sightseeing, food, adventure, culture, other),
- approximate cost (in INR),
- approximate duration (in hours).

Return the output as valid JSON with a single key "activities" that maps to an array of activities.

Example output:
{{
  "activities": [
    {{
      "name": "Visit the city museum",
      "description": "Explore historical artifacts and exhibits",
      "category": "sightseeing",
      "cost": 150,
      "duration": 2
    }},
    ...
  ]
}}

Do not include any IDs or city IDs — those will be handled by the backend.
Produce only the JSON output without extra explanation or text.
"""
