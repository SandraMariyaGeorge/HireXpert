from pydantic import BaseModel
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:user123@cluster0.q30qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["resume_database"]
collection = db["resumes"]



class UserDetails(BaseModel):
    def get_user_details(self, username: str):
        user = collection.find_one({"username": username})
        print(user)
        if user:
            return user
        return {"error": "User not found"}




