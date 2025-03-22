from fastapi import APIRouter, Header, Depends
from fastapi.responses import FileResponse
import os
from models.user_model import Users
from models.userdetails_model import UserDetails
from models.generate_model import GenerateResume
from pydantic import BaseModel



router = APIRouter(
    prefix="/generate",
    tags=["generate"],
)

class GenerateResumeRequest(BaseModel):
    job_desc: str

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]

@router.post("/")
async def generate_resume(input: GenerateResumeRequest, token: str = Depends(get_token)):
    try:
        users = Users()
        payload = users.verify_jwt(token)
        
        if not payload or "username" not in payload:
            return {"error": "Invalid or expired token"}
        
        username = payload["username"]
        user_details = UserDetails().get_user_details(username)
        
        if isinstance(user_details, dict) and '_id' in user_details:
            user_details['_id'] = str(user_details['_id'])
        
        print(user_details)
        print(input.job_desc)

        GenerateResume().get_user_details(user_details, input.job_desc)
        # Save the resume as a PDF file in the output folder
        output_folder = "output"
        os.makedirs(output_folder, exist_ok=True)
        file_path = os.path.join(output_folder, "resume.pdf")

        return FileResponse(file_path, media_type='application/pdf', filename="resume.pdf")
    except Exception as e:
        return {"error": str(e)}

