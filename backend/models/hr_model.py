
from models.base_model import Base
from pydantic import BaseModel

class Interview_entry(BaseModel):
    interview_title: str
    username: str
    desc: str
    qualities: str
    job_type: str
    csv: str  # Define csv with an appropriate type, e.g., str


class Interview_Details(Base):
    def create_interview(self, interview):
        self.db.insert_one




class UserDetails(Base):
    def get_user_details(self, username):
        user = self.db.find_one({"username": username})
        print(user)
        if user:
            return user
        return {"error": "User not found"}

    def save_to_mongo(self, resume):
        """Save the generated resume to MongoDB."""
        print("going to upload")
        print(resume)
        self.db.insert_one(resume)



