
from models.base_model import Base


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



