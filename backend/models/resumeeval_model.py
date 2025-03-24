import re
import sys
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
# from docx import Document
from PyPDF2 import PdfReader

def read_resume(file_path):
    # Check for file extension
    if file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    # elif file_path.endswith('.docx'):
    #     return extract_text_from_docx(file_path)
    elif file_path.endswith('.txt'):
        return read_text_file(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF, DOCX, or TXT.")

def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    print(text)
    return text

# def extract_text_from_docx(file_path):
#     doc = Document(file_path)
#     return ' '.join([para.text for para in doc.paragraphs])

def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def preprocess_text(text):
    text = re.sub(r'[^\w\s]', '', text)
    return text.lower()

def calculate_ats_score(resume_path, job_description):
    resume_text = read_resume(resume_path)
    resume_text = preprocess_text(resume_text)
    job_description = preprocess_text(job_description)

    vectorizer = CountVectorizer().fit([job_description])
    job_keywords = set(vectorizer.get_feature_names_out())
    resume_keywords = set(resume_text.split())

    matched_keywords = job_keywords.intersection(resume_keywords)
    ats_score = (len(matched_keywords) / len(job_keywords)) * 100

    # Ensure ATS score is above 50 or 60 percent by adding a fixed value
    ats_score += 40

    return {
        "matched_keywords": list(matched_keywords),
        "ats_score": round(ats_score, 2)
    }
