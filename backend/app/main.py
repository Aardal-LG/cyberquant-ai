from fastapi import FastAPI

app = FastAPI(title="CyberQuant AI Backend")

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "CyberQuant AI Backend is running successfully!"
    }
