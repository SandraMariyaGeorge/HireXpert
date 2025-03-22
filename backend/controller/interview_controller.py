from fastapi import APIRouter, HTTPException, Body, UploadFile, File

from pydantic import BaseModel
from typing import Optional
from fastapi import Header

router = APIRouter(
    prefix="/interview",
    tags=["interview"],
)

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import shutil
from pathlib import Path
import speech_recognition as sr
import openai
import requests
from pydub import AudioSegment
from models.interview_model import Interview
from fastapi import Depends

# Replace @app.post with @router.post
@router.post("/process-audio/")
async def process_audio(file: UploadFile = File(...),token: str = Depends(get_token)):
    """
    Process the uploaded audio file:
    1. Transcribe the audio to text.
    2. Generate a follow-up question using OpenAI.
    3. Convert the follow-up question to speech using ElevenLabs.
    4. Return the generated audio file.
    """
    interview = Interview()
    return interview.process_audio(file)
