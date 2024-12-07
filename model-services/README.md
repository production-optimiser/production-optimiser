# Running in local environment

Run the following commands in a terminal:

- sudo apt install python3-tk
- pip install uvicorn pandas matplotlib fastapi python-multipart openpyxl
- uvicorn main:app --port 5000

It is possible to change port by modifying the port parameter. By default, the app will be available on http://127.0.0.1:8000