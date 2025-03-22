from fastapi import APIRouter
from models.scrape_model import Jobs

router = APIRouter(
    prefix="/scrape",
    tags=["scrape"],
)



@router.post("/")
async def do_scrape():
    job = Jobs()
    return job.scrape()

