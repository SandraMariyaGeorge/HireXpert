from models.base_model import Base
from fastapi import HTTPException

from pydantic import BaseModel

class InterviewResult_entry(BaseModel):
    id: str
    interview_id: str
    user_id: str
    score: int
    feedback: str


class InterviewResult(Base):
    def get_interview_result_by_id(self, id: str):
        """
        Get interview result by id.
        """
        try:
            interviews = []
            interviewresult = self.db.find({"interview_id": id})
            for result in interviewresult:
                result["_id"] = str(result["_id"])  # Convert ObjectId to string
                interviews.append(result)
            return interviews
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def add_interview_result(self, interviewresult_entry: InterviewResult_entry):
        """
        Add interview result.
        """
        print(interviewresult_entry)
        try:
            self.db.insert_one(interviewresult_entry.model_dump())
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))