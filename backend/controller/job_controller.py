from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.job_model import Jobs
from fastapi import Header, Depends

router = APIRouter(
    prefix="/job",
    tags=["job"],
)

def get_token(authorization: str = Header(...)):
    return authorization.split(" ")[1]

# Define request body model
class JobSearchRequest(BaseModel):
    query: str

@router.post("/search")
async def search(token: str = Depends(get_token)):
    job = Jobs()
    return job.search_jobs_vector("")
    # return job.search_jobs_vector(request.query)

@router.get("/{id}")
async def get_job_by_id(id: str):
    job = Jobs()
    job_data = job.get_job_by_id(id)
    return job_data