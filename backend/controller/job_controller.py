from fastapi import APIRouter, Form
from models.job_model import Jobs

router = APIRouter(
    prefix="/job",
    tags=["job"],
)

@router.post("/search")
async def search(
    query: str = Form(...),
):
    job = Jobs()
    return job.search_jobs_vector(query)
