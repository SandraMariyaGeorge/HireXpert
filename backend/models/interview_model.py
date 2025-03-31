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
from models.userdetails_model import UserDetails
import uuid
from bson import ObjectId
from models.interviewresult_model import InterviewResult_entry, InterviewResult


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

class Question(BaseModel):
    question: str

class InterviewQuestions(BaseModel):
    questions: list[Question]



# Directory to save uploaded files
UPLOAD_DIR = Path("uploaded_audio")
UPLOAD_DIR.mkdir(exist_ok=True)

# OpenAI API Key
openai.api_key = "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"  # Replace with your actual API key

# ElevenLabs API Key and Voice ID
ELEVENLABS_API_KEY = "sk_9140701c6a1baac4124a0c2d7fb6231444a1b4a1b8a0f0a8"
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
    
    def generate_summary(self, username):
        """Generate a formal summary of the interview conversation."""
        conversation_memory = self.load_memory(username)
        
        if not conversation_memory:
            return "No interview history found."

        conversation_text = "\n".join([
            f"Interviewer: {question}" + (
            f"\nCandidate: {conversation_memory.get(f'response_{i}', '')}" 
            if f"response_{i}" in conversation_memory else ""
            )
            for i, question in enumerate(conversation_memory.get("questions", []))
        ])

        print(f"Conversation text for summary: {conversation_text}")
        
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
            memory = self.load_memory(username)
            if memory["interviewId"]:
                inteviewresult = InterviewResult_entry(
                    interview_id=memory["interviewId"],
                    user_id=username,
                    score=10,
                    feedback=summary
                )
                interviewresult = InterviewResult()
                interviewresult.add_interview_result(inteviewresult)
            return summary
        except Exception as e:
            return f"Error generating summary: {e}"

    # def process_audio(self, file, session_id):
    #     """
    #     Process the uploaded audio file:
    #     1. Transcribe the audio to text.
    #     2. Generate a follow-up question using OpenAI.
    #     3. Convert the follow-up question to speech using ElevenLabs.
    #     4. Save the conversation to memory.
    #     5. Return the generated audio file.
    #     """
    #     try:
    #         # Save the uploaded file
    #         file_path = UPLOAD_DIR / file.filename
    #         with file_path.open("wb") as buffer:
    #             shutil.copyfileobj(file.file, buffer)

    #         # Validate and convert the audio file to PCM WAV format
    #         wav_file_path = file_path.with_suffix(".wav")
    #         try:
    #             audio = AudioSegment.from_file(file_path)
    #             audio.export(wav_file_path, format="wav")
    #         except Exception as e:
    #             return JSONResponse({"error": f"Audio conversion error: {e}"}, status_code=400)

    #         # Step 1: Transcribe the audio to text
    #         recognizer = sr.Recognizer()
    #         with sr.AudioFile(str(wav_file_path)) as source:
    #             audio = recognizer.record(source)
    #             try:
    #                 transcription = recognizer.recognize_google(audio)
    #             except sr.UnknownValueError:
    #                 return JSONResponse({"error": "Could not understand the audio."}, status_code=400)
    #             except sr.RequestError as e:
    #                 return JSONResponse({"error": f"Speech recognition service error: {e}"}, status_code=500)

    #         # Load conversation memory
    #         conversation_memory = self.load_memory(session_id)
            
    #         # Add candidate's response to memory
    #         conversation_memory.append({"role": "user", "content": transcription})
            
    #         # Step 2: Generate a follow-up question using OpenAI
    #         prompt = f"""
    #                     You are an interviewer conducting a professional job interview. Your task is to ask a follow-up question based on the candidate's response and the qn generated beforehand.
    #                     Only return the qn only without formating.
    #                     Candidate's response: {transcription}
    #                     Memory : {conversation_memory}
    #                     """

    #         print(prompt)
    #         try:
    #             response = openai.chat.completions.create(
    #                 model="gpt-3.5-turbo",
    #                 messages=[
    #                     {"role": "system", "content": "You are a helpful assistant that generates interview questions."},
    #                     {"role": "user", "content": prompt},
    #                 ],
    #                 max_tokens=100,
    #                 temperature=0.7,
    #             )
    #             follow_up_question = response.choices[0].message.content.strip()
                
    #             # Add interviewer's question to memory
    #             conversation_memory.append({"role": "assistant", "content": follow_up_question})
                
    #             # Save updated conversation memory
    #             self.save_memory(conversation_memory, session_id)
                
    #         except Exception as e:
    #             return JSONResponse({"error": f"OpenAI API error: {e}"}, status_code=500)

    #         # Step 3: Convert the follow-up question to speech using ElevenLabs
    #         API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    #         headers = {
    #             "Accept": "audio/mpeg",
    #             "xi-api-key": ELEVENLABS_API_KEY,
    #             "Content-Type": "application/json",
    #         }
    #         data = {
    #             "text": follow_up_question,
    #             "voice_settings": {
    #                 "stability": 0.5,
    #                 "similarity_boost": 0.75,
    #             },
    #         }
    #         try:
    #             tts_response = requests.post(API_URL, headers=headers, json=data)
    #             tts_response.raise_for_status()
    #             output_audio_path = UPLOAD_DIR / "follow_up.mp3"
    #             with open(output_audio_path, "wb") as f:
    #                 f.write(tts_response.content)
    #         except requests.exceptions.RequestException as e:
    #             return JSONResponse({"error": f"Text-to-speech service error: {e}"}, status_code=500)

    #         # Step 4: Return the generated audio file along with transcription and question
    #         response_data = {
    #             "audio_file": str(output_audio_path),
    #             "transcription": transcription,
    #             "follow_up_question": follow_up_question
    #         }
            
    #         # Check if the interview should end (for example, after a certain number of exchanges)
    #         if len(conversation_memory) >= 10:  # For example, after 5 back-and-forth exchanges
    #             summary = self.generate_summary(session_id)
    #             response_data["summary"] = summary
    #             response_data["interview_complete"] = True
            
    #         return FileResponse(
    #             output_audio_path, 
    #             media_type="audio/mpeg", 
    #             filename="follow_up.mp3",
    #             headers={"X-Interview-Data": json.dumps(response_data)}
    #         )

    #     except Exception as e:
    #         return JSONResponse({"error": f"An unexpected error occurred: {e}"}, status_code=500)
        
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

    def get_interview(self, interview_id, email):
        try:
            interview = self.db.find_one({"_id": ObjectId(interview_id)})
            if not interview:
                return JSONResponse({"error": "Interview not found."}, status_code=404)
            if email in interview.get("emails", []):
                return JSONResponse({"message": "Interview retrieved successfully."})
            else:
                return JSONResponse({"error": "Email not found in interview."}, status_code=404)
        except Exception as e:
            return JSONResponse({"error": f"Error retrieving interview: {e}"}, status_code=500)
        


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

    # def start_interview(self, request, username):
    #     session_id = str(uuid.uuid4())
    #     user = UserDetails()
    #     user_details = user.get_user_details(username)
    #     if request.jobDescription:
    #         job_description = request.jobDescription
    #         print(job_description)
    #     else:
    #         interviewid = request.interviewId
    #         interview = self.db.find_one({"_id": ObjectId(interviewid)})
    #         if not interview:
    #             return JSONResponse({"error": "Interview not found."}, status_code=404)
    #         job_description = interview.get("desc", "")
        
    #     prompt = f"""
    #                 Generate 3 questions to test the candidate's 
    #                 knowledge and skills based on the job description and candidate's profile provided.
    #                 1. The questions should be relevant to the job title and qualities.
    #                 2. The questions should be clear and concise.
    #                 3. The questions should be open-ended to encourage detailed responses.
    #                 Job Description: {job_description}
    #                 Candidate's Profile: {user_details}
    #              """
    #     print(prompt)
    #     try:
    #         response = openai.beta.chat.completions.parse(
    #             model="gpt-4o",
    #             messages=[
    #                     {"role": "system", "content": "You are a professional interviewer conducting a job interview"},
    #                     {"role": "user", "content": prompt},
    #                 ],
    #             response_format=InterviewQuestions,
    #         )
    #         questions = response.choices[0].message.parsed
    #         questions_list = [question.question for question in questions.questions]
    #         print(questions_list)
    #         # Save the initial questions to the session memory
    #         self.save_memory(questions_list, session_id)
    #         return session_id
            
    #     except Exception as e:
    #         return f"Error: {e}"

    def start_interview(self, request, username):
        user = UserDetails()
        user_details = user.get_user_details(username)

        if request.jobDescription:
            job_description = request.jobDescription
        else:
            interviewid = request.interviewId
            interview = self.db.find_one({"_id": ObjectId(interviewid)})
            if not interview:
                return JSONResponse({"error": "Interview not found."}, status_code=404)
            job_description = interview.get("desc", "") + " " + interview.get("qualities", "")
            print(job_description)

        prompt = f"""
                    Generate exactly 3 questions tailored to the candidate based on their profile and the job description.
                    - Ensure they are open-ended and logically sequenced.
                    - The first question should be introductory, while the last should be the most complex.

                    Job Description: {job_description}
                    Candidate's Profile: {user_details}
                """

        try:
            response = openai.beta.chat.completions.parse(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a professional interviewer conducting a job interview."},
                    {"role": "user", "content": prompt},
                ],
                response_format=InterviewQuestions,
            )
            
            questions = response.choices[0].message.parsed
            questions_list = [question.question for question in questions.questions]  # Extract questions

            if len(questions_list) != 3:
                return JSONResponse({"error": "Failed to generate exactly 3 questions."}, status_code=500)

            # Save the three questions in session memory
            self.save_memory({"interviewId": interviewid,"questions": questions_list, "index": 0}, username)

            # Convert the first question to speech
            first_question = questions_list[0]
            audio_file = UPLOAD_DIR / "questionfirst.mp3"
            if not audio_file.exists():
                raise Exception("Welcome audio file is missing.")

            return FileResponse(
                audio_file,
                media_type="audio/mpeg",
                filename="question_1.mp3",
                headers={"X-Interview-Data": json.dumps({
                    "question": first_question
                })}
            )
        
        except Exception as e:
            return JSONResponse({"error": f"OpenAI API error: {e}"}, status_code=500)
    
    def process_audio(self, file,username):
        print("Processing audio file...")
        try:
            file_path = UPLOAD_DIR / file.filename
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Convert to WAV format
            wav_file_path = file_path.with_suffix(".wav")
            try:
                audio = AudioSegment.from_file(file_path)
                audio.export(wav_file_path, format="wav")
            except Exception as e:
                return JSONResponse({"error": f"Audio conversion error: {e}"})

            # Transcribe audio
            recognizer = sr.Recognizer()
            with sr.AudioFile(str(wav_file_path)) as source:
                audio = recognizer.record(source)
                try:
                    transcription = recognizer.recognize_google(audio)
                    print(f"Transcription: {transcription}")
                except sr.UnknownValueError:
                    return JSONResponse({"error": "Could not understand the audio."}, status_code=400)
                except sr.RequestError as e:
                    return JSONResponse({"error": f"Speech recognition service error: {e}"}, status_code=500)

            # Load stored interview memory
            print(f"Loading memory for session")
            memory = self.load_memory(username)
            print(f"Loaded memory for session {username}: {memory}")
            questions_list = memory["questions"]
            index = memory["index"]


            # If all three questions have been asked, conclude the interview
            if index >= 3:
                print("All questions have been asked. Ending interview.")
                summary = self.generate_summary(username)
                return JSONResponse({
                    "message": "Interview complete.",
                    "summary": summary
                })

            # Store the candidate's response
            memory[f"response_{index}"] = transcription

            # Retrieve next question (if any)
            next_question = questions_list[index]

            # Modify the next question slightly based on the candidate's response
            refinement_prompt = f"""
                        You are a job interviewer. Modify the following question slightly based on the candidate's response, making it more relevant.
                        
                        Original Question: {next_question}
                        Candidate's Response: {transcription}

                        Provide only the improved question.
                    """

            try:
                response = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a professional interviewer refining questions."},
                        {"role": "user", "content": refinement_prompt},
                    ],
                    max_tokens=100,
                    temperature=0.7,
                )
                refined_question = response.choices[0].message.content.strip()
                print(f"Refined question: {refined_question}")
            except Exception as e:
                refined_question = next_question  # Fallback to original if refinement fails

            # Store updated index
            memory["index"] += 1
            self.save_memory(memory, username)

            print(f"Refined question: {refined_question}")

            # Convert refined question to speech
            # audio_file = self.convert_text_to_speech(refined_question)
            audio_file = UPLOAD_DIR / "questionfirst.mp3"

            # Return the generated audio file with next question
            return FileResponse(
                audio_file,
                media_type="audio/mpeg",
                filename=f"question_{index+1}.mp3",
                headers={"X-Interview-Data": json.dumps({
                    "audio_file": str(audio_file),
                    "transcription": transcription,
                    "follow_up_question": refined_question,
                })}
            )

        except Exception as e:
            return JSONResponse({"error": f"An unexpected error occurred: {e}"}, status_code=500)

    def convert_text_to_speech(self, text):
        print(f"Converting text to speech: {text}")
        API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {
            "Accept": "audio/mpeg",
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
        }
        data = {
            "text": text,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
        }

        try:
            response = requests.post(API_URL, headers=headers, json=data)
            response.raise_for_status()
            output_audio_path = UPLOAD_DIR / f"question.mp3"
            
            # Write the audio file
            with open(output_audio_path, "wb") as f:
                f.write(response.content)
            
            # Verify the file size
            if not output_audio_path.exists() or output_audio_path.stat().st_size == 0:
                raise Exception("Generated audio file is empty or missing.")
            
            return output_audio_path
        except requests.exceptions.RequestException as e:
            raise Exception(f"Text-to-speech service error: {e}")



