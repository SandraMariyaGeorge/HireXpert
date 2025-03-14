from fastapi import APIRouter, HTTPException
from models.interview_model import Interview, InterviewRequest, InterviewResponse

router = APIRouter(
    prefix="/interview",
    tags=["interview"],
)


@router.post("/ask", response_model=InterviewResponse)
async def interview(request: InterviewRequest):
    """Process interview audio input and return AI-generated audio response."""
    try:
        interview_instance = Interview()
        bot_audio = interview_instance.generate_interview_response(request.audio_file)
        return InterviewResponse(bot_audio=bot_audio)
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