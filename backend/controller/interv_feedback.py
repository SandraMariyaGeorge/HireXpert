from fastapi import APIRouter, File, Form, UploadFile
import shutil
import os
from models.resumeeval_model import calculate_ats_score

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/interview-feedback",
    tags=["interview-feedback"],
    
)

@router.post("/interview-eval/")
