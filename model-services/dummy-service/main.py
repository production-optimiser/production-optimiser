
import datetime
import time
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import json
# Variables for def machine_util

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/service")
async def optimize(file: UploadFile = File(...)) -> JSONResponse:
    """
    Endpoint to process returns dummy response.
    """
    try:
        time.sleep(5)

        dt = datetime.datetime.now()
     
        return JSONResponse(content={
            "timestamp": "{day}-{month}-{year} {hours}:{minutes}".format(day = dt.day, month = dt.month, year = dt.year, hours = dt.hour, minutes = dt.minute),
            "filename": file.filename,
            "size": file.size
        })
    
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
    
@app.get("/actuator/health")
async def health_check() -> JSONResponse:
    """
    Health check endpoint.
    """
    return JSONResponse(content={"status": "UP"})