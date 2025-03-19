from fastapi import APIRouter, HTTPException, Body
from models.interview_model import Interview
from models.user_model import Users
from pydantic import BaseModel
from typing import Optional

router = APIRouter(
    prefix="/interview",
    tags=["interview"],
)

# New model for interview creation request
class InterviewCreateRequest(BaseModel):
    token: str
    title: str
    description: str
    participants_csv: Optional[str] = None

class InterviewRequest(BaseModel):
    audio_file: str  # Base64 encoded audio file


@router.post("/ask",)
async def interview(request: InterviewRequest = Body(...)):
    """Process interview audio input and return AI-generated audio response."""
    try:
        interview_instance = Interview()
        bot_audio = interview_instance.generate_interview_response(request.audio_file)
        return {"audio": bot_audio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview processing error: {str(e)}")


@router.post("/clear")
async def clear_interview():
    """Clear interview conversation memory."""
    try:
        interview_instance = Interview()
        interview_instance.clear_memory()
        return {"message": "Interview history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing interview history: {str(e)}")
    

@router.post("/create")
async def create_interview(request: InterviewCreateRequest = Body(...)):
    """Create a new interview with optional participants from CSV."""
    try:
        users = Users()
        payload = users.verify_jwt(request.token)
        username = payload["username"]
        interview_instance = Interview()
        result = interview_instance.create_interview(
            username=username,
            title=request.title,
            desc=request.description,
            participants_csv=request.participants_csv
        )
        return {
            "message": "Interview created successfully",
            "interview_id": result["interview_id"],
            "participants_count": result.get("participants_count", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating interview: {str(e)}")


