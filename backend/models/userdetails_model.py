from pydantic import BaseModel
from pymongo import MongoClient




class UserDetails(BaseModel):
    def get_user_details(self, username: str):
        user = self.db.find_one({"username": username})
        print(user)
        if user:
            return user
        return {"error": "User not found"}




