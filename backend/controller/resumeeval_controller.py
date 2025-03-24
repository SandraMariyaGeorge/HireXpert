from fastapi import APIRouter, File, Form, UploadFile
import shutil
import os
from models.resumeeval_model import calculate_ats_score

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/resume-eval",
    tags=["resume-eval"],
)


@router.post("/ats-score/")
async def calculate_score(resume: UploadFile = File(...), job_description: str = Form(...)):
    # Validate file type
    allowed_extensions = ['pdf', 'docx', 'txt']
    file_extension = resume.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_extensions:
        return {"error": "Unsupported file format. Please upload PDF, DOCX, or TXT files."}

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR, resume.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(resume.file, f)

    try:
        # Calculate ATS Score
        result = calculate_ats_score(file_path, job_description)
        return {
            "message": "ATS Score calculated successfully.",
            "score": result["ats_score"],
            "matched_keywords": result["matched_keywords"]
        }
    except Exception as e:
        return {"error": str(e)}
