import os
from fastapi import FastAPI
# from api.routes import router as hackrx

app = FastAPI()

# app.include_router(hackrx)

@app.get("/")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))