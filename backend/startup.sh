#!/bin/bash
# Azure Web App startup script for Python FastAPI

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Start the application with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
