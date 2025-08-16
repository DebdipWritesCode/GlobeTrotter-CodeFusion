from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import api_router
import os

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",
    "https://globe-trotter-code-fusion-rb2s7f4s3-nishantharkuts-projects.vercel.app",
    "https://globe-trotter-code-fusion.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # allow only this origin
    allow_credentials=True,
    allow_methods=["*"],            # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # allow all headers
)

app.include_router(api_router)

@app.get("/")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
