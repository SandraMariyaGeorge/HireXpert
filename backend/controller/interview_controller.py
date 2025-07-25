from fastapi import APIRouter, HTTPException, Body, UploadFile, File

from pydantic import BaseModel
from typing import Optional
from fastapi import Header

router = APIRouter(
    prefix="/interview",
    tags=["interview"],
)

class Interview_entry(BaseModel):
    interview_title: str
    desc: str
    qualities: str
    job_type: str

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
from models.interview_model import Interview_entry
from fastapi import File, UploadFile, Form
from models.user_model import Users
from models.interviewresult_model import InterviewResult

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]

class StartInterviewRequest(BaseModel):
    interviewId: Optional[str] = None
    jobDescription: Optional[str] = None
    jobId: Optional[str] = None

@router.get("/{interviewId}")
async def get_interview(interviewId: str, token: str = Depends(get_token)):
    """
    Check if the candidate is in the email list or not
    """
    try:
        users = Users()
        payload = users.verify_jwt(token)
        email = payload["email"]
        interview_instance = Interview()
        return interview_instance.get_interview(interviewId, email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/start-interview/")
async def start_interview(request : StartInterviewRequest, token: str = Depends(get_token)):
    """
    Start an interview session.
    """
    print(request)
    try:
        users = Users()
        payload = users.verify_jwt(token)
        username = payload["username"]
        interview_instance = Interview()
        return interview_instance.start_interview(request, username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Replace @app.post with @router.post
@router.post("/process-audio/")
async def process_audio(file: UploadFile = File(...), token: str = Depends(get_token)):
    """
    Process the uploaded audio file:
    1. Transcribe the audio to text.
    2. Generate a follow-up question using OpenAI.
    3. Convert the follow-up question to speech using ElevenLabs.
    4. Return the generated audio file.
    """
    users = Users()
    payload = users.verify_jwt(token)
    username = payload["username"]
    interview = Interview()
    return interview.process_audio(file,username)


@router.post("/create-interview/")
async def create_interview(
    interview_title: str = Form(...),
    desc: str = Form(...),
    qualities: str = Form(...),
    job_type: str = Form(...),
    csv: UploadFile = File(...),
    token: str = Depends(get_token)
    ) -> JSONResponse:
    """
    Create an interview entry.
    """
    try:
        users = Users()
        payload = users.verify_jwt(token)
        username = payload["username"]
        interview_instance = Interview()
        interview_entry = Interview_entry(
            interview_title=interview_title,
            desc=desc,
            qualities=qualities,
            job_type=job_type,
            username=username
        )
        return interview_instance.create_interview(interview_entry, csv)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/get-interviews/")
async def get_interviews(token: str = Depends(get_token)):
    """
    Get all interview entries.
    """
    try:
        users = Users()
        payload = users.verify_jwt(token)
        username = payload["username"]
        interview_instance = Interview()
        return interview_instance.get_interviews(username)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard-insights/")
async def get_dashboard_insights(token: str = Depends(get_token)):
    """
    Get all necessary insights for the HR dashboard.
    """
    try:
        user = Users().verify_jwt(token)
        username = user["username"]

        # Fetch total interviews
        interview_instance = Interview()
        interviews = interview_instance.get_interviews(username)
        total_interviews = len(interviews)

        # Fetch evaluated interviews
        evaluated_count = 0
        for interview_entry in interviews:
            results = InterviewResult().get_interview_result_by_id(interview_entry["_id"])
            evaluated_count += len(results)

        return {
            "total_interviews": total_interviews,
            "evaluated_interviews": evaluated_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard-data/")
async def get_dashboard_data(token: str = Depends(get_token)):
    """
    Fetch combined dashboard data: insights and recent interviews.
    """
    try:
        user = Users().verify_jwt(token)
        username = user["username"]

        # Fetch total interviews and evaluated interviews
        interview_instance = Interview()
        interviews = interview_instance.get_interviews(username)
        total_interviews = len(interviews)

        evaluated_count = 0
        for interview_entry in interviews:
            results = InterviewResult().get_interview_result_by_id(interview_entry["_id"])
            evaluated_count += len(results)

        # Fetch recent interviews (limit to 5)
        recent_interviews = interviews[:5]

        return {
            "insights": {
                "total_interviews": total_interviews,
                "evaluated_interviews": evaluated_count,
            },
            "recent_interviews": recent_interviews,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




