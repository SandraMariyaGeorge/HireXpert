from models.base_model import Base
from fastapi import HTTPException

from pydantic import BaseModel
from models.interview_model import Interview
from models.user_model import Users

class InterviewResult_entry(BaseModel):
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

    def get_interviews(self, email: str, username: str):
        """
        Get interviews for a user.
        """
        try:
            interviews = []
            interviewresult = self.db.find({"user_id": username})
            scheduled = Interview().get_scheduled_interviews(email)

            for result in interviewresult:
                result["_id"] = str(result["_id"])  # Convert ObjectId to string
                interviews.append(result)

            print(interviews)
            print(scheduled)
            
            return {
                "results": interviews,
                "scheduled": scheduled
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))