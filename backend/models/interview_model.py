from fastapi import File
import shutil
from pathlib import Path
import speech_recognition as sr
import openai
import requests
from pydub import AudioSegment
import json
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import csv
import io
from fastapi import UploadFile
from fastapi import HTTPException
from models.base_model import Base
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import io

load_dotenv()

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

class Interview_entry(BaseModel):
    interview_title: str
    desc: str
    qualities: str
    job_type: str
    username: str

# Directory to save uploaded files
UPLOAD_DIR = Path("uploaded_audio")
UPLOAD_DIR.mkdir(exist_ok=True)

# OpenAI API Key
openai.api_key = "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"  # Replace with your actual API key

# ElevenLabs API Key and Voice ID
ELEVENLABS_API_KEY = "sk_709ae82286f467cb97d0f50ab65ba80dce143d625e913a94"
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Example voice ID

class Interview(Base):
        
    def upload_audio(self,file):
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return FileResponse(file_path, media_type="audio/mpeg", filename=file.filename)
    
    def clear_memory(self, session_id):
        """Clears the conversation memory for a specific interview session."""
        memory_file = f"interview_memory_{session_id}.txt"
        with open(memory_file, "w", encoding="utf-8") as file:
            json.dump([], file)

    def load_memory(self, session_id):
        """Load conversation history from memory file specific to an interview session."""
        memory_file = f"interview_memory_{session_id}.txt"
        try:
            with open(memory_file, "r", encoding="utf-8") as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_memory(self, memory, session_id):
        """Save conversation history to memory file specific to an interview session."""
        memory_file = f"interview_memory_{session_id}.txt"
        with open(memory_file, "w", encoding="utf-8") as file:
            json.dump(memory, file, indent=4)
    
    def generate_summary(self, session_id):
        """Generate a formal summary of the interview conversation."""
        conversation_memory = self.load_memory(session_id)
        
        if not conversation_memory:
            return "No interview history found."

        conversation_text = "\n".join([f"{'Interviewer' if msg['role'] == 'assistant' else 'Candidate'}: {msg['content']}" for msg in conversation_memory])
        
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert interview analyzer. Provide a comprehensive summary of the interview, including the quality of answers, strengths, weaknesses, and overall performance."},
                    {"role": "user", "content": conversation_text},
                ],
                max_tokens=500,
                temperature=0.7,
            )
            summary = response.choices[0].message.content.strip()
            return summary
        except Exception as e:
            return f"Error generating summary: {e}"

    def process_audio(self, file, session_id="default"):
        """
        Process the uploaded audio file:
        1. Transcribe the audio to text.
        2. Generate a follow-up question using OpenAI.
        3. Convert the follow-up question to speech using ElevenLabs.
        4. Save the conversation to memory.
        5. Return the generated audio file.
        """
        try:
            # Save the uploaded file
            file_path = UPLOAD_DIR / file.filename
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Validate and convert the audio file to PCM WAV format
            wav_file_path = file_path.with_suffix(".wav")
            try:
                audio = AudioSegment.from_file(file_path)
                audio.export(wav_file_path, format="wav")
            except Exception as e:
                return JSONResponse({"error": f"Audio conversion error: {e}"}, status_code=400)

            # Step 1: Transcribe the audio to text
            recognizer = sr.Recognizer()
            with sr.AudioFile(str(wav_file_path)) as source:
                audio = recognizer.record(source)
                try:
                    transcription = recognizer.recognize_google(audio)
                except sr.UnknownValueError:
                    return JSONResponse({"error": "Could not understand the audio."}, status_code=400)
                except sr.RequestError as e:
                    return JSONResponse({"error": f"Speech recognition service error: {e}"}, status_code=500)

            # Load conversation memory
            conversation_memory = self.load_memory(session_id)
            
            # Add candidate's response to memory
            conversation_memory.append({"role": "user", "content": transcription})
            
            # Step 2: Generate a follow-up question using OpenAI
            prompt = f"""
                        You are an interviewer conducting a professional job interview. Your task is to ask a follow-up question based on the candidate's response
                        1. The follow-up question naturally builds on the candidate's previous response.
                        2. The question remains concise, professional, and directly relevant.
                        Only return the qn only without formating.
                        Candidate's response: {transcription}
                        """

            print(prompt)
            try:
                response = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that generates interview questions."},
                        {"role": "user", "content": prompt},
                    ],
                    max_tokens=100,
                    temperature=0.7,
                )
                follow_up_question = response.choices[0].message.content.strip()
                
                # Add interviewer's question to memory
                conversation_memory.append({"role": "assistant", "content": follow_up_question})
                
                # Save updated conversation memory
                self.save_memory(conversation_memory, session_id)
                
            except Exception as e:
                return JSONResponse({"error": f"OpenAI API error: {e}"}, status_code=500)

            # Step 3: Convert the follow-up question to speech using ElevenLabs
            API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
            headers = {
                "Accept": "audio/mpeg",
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
            }
            data = {
                "text": follow_up_question,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                },
            }
            try:
                tts_response = requests.post(API_URL, headers=headers, json=data)
                tts_response.raise_for_status()
                output_audio_path = UPLOAD_DIR / "follow_up.mp3"
                with open(output_audio_path, "wb") as f:
                    f.write(tts_response.content)
            except requests.exceptions.RequestException as e:
                return JSONResponse({"error": f"Text-to-speech service error: {e}"}, status_code=500)

            # Step 4: Return the generated audio file along with transcription and question
            response_data = {
                "audio_file": str(output_audio_path),
                "transcription": transcription,
                "follow_up_question": follow_up_question
            }
            
            # Check if the interview should end (for example, after a certain number of exchanges)
            if len(conversation_memory) >= 10:  # For example, after 5 back-and-forth exchanges
                summary = self.generate_summary(session_id)
                response_data["summary"] = summary
                response_data["interview_complete"] = True
            
            return FileResponse(
                output_audio_path, 
                media_type="audio/mpeg", 
                filename="follow_up.mp3",
                headers={"X-Interview-Data": json.dumps(response_data)}
            )

        except Exception as e:
            return JSONResponse({"error": f"An unexpected error occurred: {e}"}, status_code=500)
        
    def end_interview(self, session_id="default"):
        """End the interview and generate a summary."""
        try:
            summary = self.generate_summary(session_id)
            return JSONResponse({
                "summary": summary,
                "interview_complete": True
            })
        except Exception as e:
            return JSONResponse({"error": f"Error ending interview: {e}"}, status_code=500)
        
    def create_interview(self, interview_entry, csv):
        extracted_emails = self.extract_emails_from_csv(csv)
        interview_entry = interview_entry.dict()
        interview_entry["emails"] = extracted_emails
        self.db.insert_one(interview_entry)
        self.send_email(extracted_emails)
        return JSONResponse({"message": "Interview created successfully."})



    def extract_emails_from_csv(self, file: UploadFile):
        try:
            contents = file.file.read().decode("utf-8")
            file.file.seek(0)  # Reset file pointer
            reader = csv.reader(io.StringIO(contents))
            emails = []
            
            for row in reader:
                for cell in row:
                    # Check if the cell contains a valid email address
                    if "@" in cell and "." in cell:
                        emails.append(cell.strip())
            
            return emails
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading CSV file: {e}")
        
    def get_interviews(self,username):
        interviews = self.db.find({"username": username})
        interview_list = []
        for interview in interviews:
            interview["_id"] = str(interview["_id"])
            interview_list.append(interview)
        return interview_list


    def send_email(self,receivers):
        """Send email to multiple recipients."""
        if not receivers:
            return "No recipients found."
        
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = ", ".join(receivers)
        msg['Subject'] = "Test Email from FastAPI"
        
        body="""
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interview Invitation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                }
                .header img {
                    max-width: 150px;
                    height: auto;
                }
                .content {
                    padding: 20px 0;
                }
                .footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    color: #777;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #007BFF;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header with Company Logo -->
                <div class="header">
                    <img src="https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tcGFueSUyMGxvZ298ZW58MHx8MHx8fDA%3D" alt="Company Logo">
                    <h2>Interview Invitation</h2>
                </div>

                <!-- Email Content -->
                <div class="content">
                    <p><strong>Dear Candidate,</strong></p>
                    <p>We are pleased to inform you that you have been shortlisted for the position of <strong>Full Stack Developer</strong> at <strong>Google</strong>. After reviewing your application, we are excited to learn more about your qualifications and experience.</p>

                    <h3>Interview Details:</h3>
                    <ul>
                        <li><strong>Date:</strong> 16/03/2025</li>
                        <li><strong>Time:</strong> 10 a.m</li>
                        <li><strong>Platform:</strong> [Insert Platform Name, e.g., Zoom, Microsoft Teams]</li>
                        <li><strong>Meeting Link:</strong> <a href="https://meet.google.com/wqe-rjeg-xdr">Click here to join</a></li>
                        <li><strong>Interviewer(s):</strong> [Insert Name(s) and Title(s)]</li>
                    </ul>

                    <h3>What to Expect:</h3>
                    <p>The interview will be conducted online and will last approximately 15 min. It will include a discussion of your background, skills, and how they align with the role. We may also explore your problem-solving abilities and cultural fit within our organization.</p>

                    <h3>Preparation Tips:</h3>
                    <ul>
                        <li>Ensure you have a stable internet connection and a quiet environment.</li>
                        <li>Test your camera and microphone beforehand.</li>
                        <li>Have a copy of your resume and any relevant documents ready.</li>
                    </ul>

                    <h3>Next Steps:</h3>
                    <p>Kindly confirm your availability for the scheduled interview by replying to this email. If the proposed time is inconvenient, please let us know, and we will do our best to accommodate your schedule.</p>

                    <p>We look forward to speaking with you and learning more about how you can contribute to the success of <strong>[Company Name]</strong>.</p>

                    <a href="https://github.com/vishnuhari17/HireXpert" class="button">Confirm Attendance</a>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>Best regards,</p>
                    <p><strong>Google</strong><br>
                    Human Resources Department<br>
                    Google<br>
                    [Contact Information]</p>
                    <p><img src="https://media.istockphoto.com/id/1963649343/photo/handwritten-type-lettering-of-thank-you.webp?a=1&b=1&s=612x612&w=0&k=20&c=t25IJpg75PjwWInH61AqjnGIGoKZGyevTy0xOFijSMk=" alt="Team Photo" style="border-radius: 50%;"></p>
                </div>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))
        
        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, receivers, msg.as_string())
            server.quit()
            
            return "Emails sent successfully!"
        except Exception as e:
            return f"Error: {e}"








