from fastapi import APIRouter, Header, Depends
from models.user_model import Users
from models.userdetails_model import UserDetails
from bson import ObjectId

router = APIRouter(
    prefix="/userdetails",
    tags=["userdetails"],
)

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]

@router.post("/")
async def get_user_details(token: str = Depends(get_token)):
# async def get_user_details(token):
    try:
        print(token)
        users = Users()
        payload = users.verify_jwt(token)
        username = payload["username"]
        print(username)
        user_details = UserDetails().get_user_details(username)
        
        if isinstance(user_details, dict) and '_id' in user_details:
            user_details['_id'] = str(user_details['_id'])
        
        return user_details
    except Exception as e:
        return {"error": str(e)}

