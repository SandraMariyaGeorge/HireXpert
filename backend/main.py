from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from controller import user_controller, job_controller, chat_controller, resumeeval_controller, interviewresult_controller, interview_controller, userdetails_controller, generate_controller, scraping_controller

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router)
app.include_router(job_controller.router)
app.include_router(chat_controller.router)
app.include_router(interview_controller.router)
app.include_router(userdetails_controller.router)
app.include_router(generate_controller.router)
app.include_router(scraping_controller.router)
app.include_router(resumeeval_controller.router)
app.include_router(interviewresult_controller.router)