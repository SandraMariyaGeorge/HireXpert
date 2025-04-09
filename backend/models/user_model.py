import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from models.base_model import Base
from pydantic import BaseModel

SECRET_KEY = "your_secret_key" 

class UserBase(BaseModel):
    username: str
    email: str
    password: str
    role: str

class Users(Base):
    def create_user(self, user: UserBase):
        try:
            # Hash the password
            hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
            user_data = user.model_dump()
            user_data['password'] = hashed_password.decode('utf-8')
            user_data['profile_completed'] = False
            
            self.db.insert_one(user_data)
            return {"message": "User created successfully"}
        except Exception as e:
            return {"error": str(e)}

    def update_profile_completion(self, username: str):
        user = self.db.find_one({"username": username})
        if user:
            self.db.update_one({"username": username}, {"$set": {"profile_completed": True}})
            return {"message": "Profile updated successfully"}
        return {"error": "User not found"}

    def verify_user(self, username: str, password: str):
        user = self.db.find_one({"username": username})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return user
        return None

    def generate_jwt(self, user: dict,name):

        payload = {
            "user_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "name": name,
            "role": user["role"],
            "exp": datetime.now(timezone.utc) +timedelta(hours=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return {
            "token": token,
            "role": user.get("role", "N/A"),
            "name": name,
            "profile_completed": user.get("profile_completed", False)
        }

    def verify_jwt(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

class UserLogin(BaseModel):
    username: str
    password: str