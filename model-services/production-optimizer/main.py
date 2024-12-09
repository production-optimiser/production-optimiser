
from Optimizer import *
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import Dict, Any
import json
# Variables for def machine_util

origins = [
    "http://localhost",
    "http://localhost:8080",
    "https://dsd.commanderkowalski.uk/"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize")
async def optimize(file: UploadFile = File(...)) -> JSONResponse:
    """
    Endpoint to process the uploaded Excel file and return optimization results.
    """
    try:
        # Step 1: Read the uploaded Excel file into a DataFrame
        excel = await file.read()

        # Step 2: Run optimization logic
        pallet_var = 0
        optimized_data = run_optimization(excel, None, None, None, pallet_var)

        return JSONResponse(content=optimized_data)
    
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