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

# Directory to save uploaded files
UPLOAD_DIR = Path("uploaded_audio")
UPLOAD_DIR.mkdir(exist_ok=True)

# OpenAI API Key
openai.api_key = "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"  # Replace with your actual API key

# ElevenLabs API Key and Voice ID
ELEVENLABS_API_KEY = "sk_709ae82286f467cb97d0f50ab65ba80dce143d625e913a94"
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Example voice ID

class Interview(BaseModel):
        
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
