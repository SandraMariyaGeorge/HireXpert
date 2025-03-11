from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import openai
import requests
import speech_recognition as sr
from pydub import AudioSegment
from io import BytesIO
import tempfile
import uuid

app = FastAPI()

# OpenAI API Key
client = openai.OpenAI(api_key="sk-proj-XXXXXX")  # Replace with actual key

# ElevenLabs API Key
ELEVENLABS_API_KEY = "sk_XXXXXX"  # Replace with actual key
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Example voice ID

# In-memory storage for sessions
sessions: Dict[str, List[Dict[str, str]]] = {}

class SessionResponse(BaseModel):
    session_id: str
    text_response: str
    audio_response: bytes

class ReportResponse(BaseModel):
    session_id: str
    report: str

def transcribe_audio(audio_file: BytesIO) -> str:
    """
    Convert an audio file into text using OpenAI Whisper.
    """
    try:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
        return response["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")

def text_to_speech(text: str) -> bytes:
    """
    Convert text to speech using ElevenLabs API.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    
    data = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8
        }
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.content
    else:
        raise HTTPException(status_code=500, detail="Text-to-Speech conversion failed")

@app.post("/interview/audio", response_model=SessionResponse)
async def process_audio(file: UploadFile = File(...), session_id: str = None):
    """
    Receive audio from frontend, transcribe it, generate a response, and return audio.
    """
    try:
        if session_id is None:
            session_id = str(uuid.uuid4())
            sessions[session_id] = []

        # Convert audio file to required format
        audio_bytes = await file.read()
        audio_file = BytesIO(audio_bytes)

        # Transcribe speech to text
        user_text = transcribe_audio(audio_file)
        
        # Get AI response
        messages = [
            {"role": "system", "content": "You are an AI interviewer evaluating candidates."}
        ] + sessions[session_id] + [{"role": "user", "content": user_text}]
        
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )
        ai_response = completion.choices[0].message.content

        # Store the conversation context
        sessions[session_id].append({"role": "user", "content": user_text})
        sessions[session_id].append({"role": "assistant", "content": ai_response})

        # Convert AI response to speech
        audio_response = text_to_speech(ai_response)

        return {
            "session_id": session_id,
            "text_response": ai_response,
            "audio_response": audio_response
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/interview/report", response_model=ReportResponse)
async def get_report(session_id: str):
    """
    Generate a report for the given session.
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    conversation = sessions[session_id]
    report = "Interview Report:\n\n"
    for message in conversation:
        role = "Interviewer" if message["role"] == "assistant" else "Candidate"
        report += f"{role}: {message['content']}\n\n"

    return {
        "session_id": session_id,
        "report": report
    }
