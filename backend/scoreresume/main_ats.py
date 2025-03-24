import openai
import bcrypt
import jwt
import pymongo
import openpyxl
import requests
import SpeechRecognition as sr
import pydub
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import shutil
from ats_score import calculate_ats_score
import os

load_dotenv()

app = FastAPI()
UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/ats-score/")
async def calculate_score(resume: UploadFile = File(...), job_description: str = Form(...)):
    # Validate file type
    allowed_extensions = ['pdf', 'docx', 'txt']
    file_extension = resume.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_extensions:
        return {"error": "Unsupported file format. Please upload PDF, DOCX, or TXT files."}

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR, resume.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(resume.file, f)

    try:
        # Calculate ATS Score
        result = calculate_ats_score(file_path, job_description)
        return {
            "message": "ATS Score calculated successfully.",
            "score": result["ats_score"],
            "matched_keywords": result["matched_keywords"]
        }
    except Exception as e:
        return {"error": str(e)}
