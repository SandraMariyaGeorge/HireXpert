from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.job_model import Jobs
from fastapi import Header, Depends
import uuid
from models.interviewresult_model import InterviewResult, InterviewResult_entry
from models.user_model import Users

router = APIRouter(
    prefix="/interviewresult",
    tags=["interviewresult"],
)

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]

@router.get("/{id}")
async def get_interview_result_by_id(id: str):
    interviewresult = InterviewResult()
    interviewresult_data = interviewresult.get_interview_result_by_id(id)
    return interviewresult_data

@router.post("/add")
async def add_interview_result(interview_id: str, user_id: str, score: int, feedback: str):
    interviewresult = InterviewResult()
    interviewresult_entry = InterviewResult_entry(interview_id=interview_id, user_id=user_id, score=score, feedback=feedback)
    interviewresult.add_interview_result(interviewresult_entry)
    return interviewresult_entry

@router.post("/get")
async def get_interview_result(token: str = Depends(get_token)):
    user = Users()
    payload = user.verify_jwt(token)
    email = payload["email"]
    username = payload["username"]
    print(email)
    print(username)
    interviewresult = InterviewResult()
    interviewresult_data = interviewresult.get_interviews(email, username)
    return interviewresult_data
