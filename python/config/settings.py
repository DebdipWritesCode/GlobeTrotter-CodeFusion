from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    SERPAPI_API_KEY: str = os.getenv("SERPAPI_API_KEY")

settings = Settings()