import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Variables for def machine_util

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    input: str

@app.post("/chatbot")
async def optimize(data: InputData) -> JSONResponse:
    """
    Endpoint to process string input and return dummy response.
    """
    try:
        # Simulating processing time
        dt = datetime.datetime.now()

        return JSONResponse(content={
            "timestamp": "{day}-{month}-{year} {hours}:{minutes}".format(
                day=dt.day, month=dt.month, year=dt.year, hours=dt.hour, minutes=dt.minute
            ),
            "input": data.input,
            "length": len(data.input)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/actuator/health")
async def health_check() -> JSONResponse:
    """
    Health check endpoint.
    """
    return JSONResponse(content={"status": "UP"})
