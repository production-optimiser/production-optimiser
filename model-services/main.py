from GUI_Layout import create_main_window
from fastapi import FastAPI, File, UploadFile
import pandas as pd
import json
from tempfile import NamedTemporaryFile
import os

app = FastAPI()

if __name__ == "__main__": # run program ;)
    create_main_window()

@app.post("/process-excel/")
async def process_excel(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_file = NamedTemporaryFile(delete=False, suffix=".xlsx")
    try:
        # Write the uploaded file content to the temporary file
        temp_file.write(await file.read())
        temp_file.close()

        # Process the Excel file (you can modify this part to call your program)
        # Example: Using pandas to read the Excel file
        df = pd.read_excel(temp_file.name)

        # Convert the DataFrame to JSON
        result_json = df.to_dict(orient="records")

        return {"result": json.dumps(result_json)}
    finally:
        # Clean up the temporary file
        os.remove(temp_file.name)