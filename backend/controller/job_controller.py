from fastapi import APIRouter
from pydantic import BaseModel
from models.job_model import Jobs

router = APIRouter(
    prefix="/job",
    tags=["job"],
)

# Define request body model
class JobSearchRequest(BaseModel):
    query: str

@router.post("/search")
async def search(request: JobSearchRequest):
    job = Jobs()
    return job.search_jobs_vector(request.query)
