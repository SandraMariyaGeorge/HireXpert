# models/interview_model.py (or a new models/session_model.py)
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from bson import ObjectId
import datetime

# Keep your existing Interview_entry
class Interview_entry(BaseModel):
    interview_title: str
    desc: str
    qualities: str
    job_type: str
    username: str
    emails: Optional[List[str]] = [] # Add emails field
    # Add _id field if you need to map from DB results easily
    # id: Optional[str] = Field(alias="_id", default=None)

class ConversationTurn(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class InterviewSession(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None) # To map MongoDB _id
    session_id: str = Field(..., default_factory=lambda: str(ObjectId())) # Unique Session ID
    interview_base_id: Optional[str] = None # Link to the original Interview_entry's ObjectId
    username: str
    initial_questions: List[str] = []
    conversation_history: List[ConversationTurn] = []
    current_question_index: int = 0
    status: str = "ongoing" # e.g., 'ongoing', 'completed'
    summary: Optional[str] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    job_description_context: Optional[str] = None # Store context if provided directly

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str, datetime.datetime: lambda dt: dt.isoformat()}
        arbitrary_types_allowed = True # Needed for ObjectId if not using alias trick everywhere

# You might want a dedicated collection in your Base class for sessions
# models/base_model.py (Example modification)
# from pymongo import MongoClient
# DB_NAME = "your_db_name"
# MONGO_URI = "your_mongo_uri"
#
# class Base:
#     def __init__(self, collection_name: str):
#         self.client = MongoClient(MONGO_URI)
#         self.db = self.client[DB_NAME][collection_name]

# Then instantiate Interview with 'interviews' and potentially Session with 'sessions'
# interview_db = Base("interviews").db
# session_db = Base("interview_sessions").db