from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.job_model import Jobs
from fastapi import Header, Depends
from models.user_model import Users
from models.userdetails_model import UserDetails




router = APIRouter(
    prefix="/job",
    tags=["job"],
)

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]


class JobSearchRequest(BaseModel):
    query: str

@router.post("/search")
async def search(request: JobSearchRequest, token: str = Depends(get_token)):
    try:

        job = Jobs()
        if request.query == "":
            users = Users()
            payload = users.verify_jwt(token)
            userdetails = UserDetails()
            userdetails = userdetails.get_user_details(payload['username'])
            details = (
                str(userdetails['education']) +
                str(userdetails['experience']) +
                str(userdetails['projects']) +
                str(userdetails['technical_skills'])
            )
            return job.search_jobs_vector(details)
            # userdetails = payload['education']+payload['experience']+payload['projects']+payload['technical_skills']
            # print(userdetails)
        return job.search_jobs_vector(request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id}")
async def get_job_by_id(id: str):
    job = Jobs()
    job_data = job.get_job_by_id(id)
    return job_data