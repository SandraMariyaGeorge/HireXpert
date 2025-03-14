from models.base_model import Base
from pydantic import BaseModel
import json
import os
import tempfile
from openai import OpenAI
from pymongo import MongoClient
import speech_recognition as sr
import requests
import base64

api_key = "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"  # Replace with your actual OpenAI API key
client = OpenAI(api_key=api_key)

# MongoDB connection string
mongo_client = MongoClient("mongodb+srv://user:user123@cluster0.q30qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = mongo_client["interview_database"]
collection = db["interview_responses"]

MEMORY_FILE = "interview_memory.txt"


class InterviewRequest(BaseModel):
    audio_file: str  # Base64 encoded audio file


class InterviewResponse(BaseModel):
    bot_audio: str  # Base64 encoded audio response


class Interview:
    def clear_memory(self):
        """Clears the conversation memory."""
        with open(MEMORY_FILE, "w", encoding="utf-8") as file:
            json.dump([], file)

    def load_memory(self):
        """Load conversation history from memory file."""
        try:
            with open(MEMORY_FILE, "r", encoding="utf-8") as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_memory(self, memory):
        """Save conversation history to memory file."""
        with open(MEMORY_FILE, "w", encoding="utf-8") as file:
            json.dump(memory, file, indent=4)

    def transcribe_audio(self, audio_base64: str):
        """Convert base64 encoded audio to text."""
        try:
            audio_data = base64.b64decode(audio_base64)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
                temp_audio.write(audio_data)
                temp_audio_path = temp_audio.name

            recognizer = sr.Recognizer()
            with sr.AudioFile(temp_audio_path) as source:
                audio = recognizer.record(source)
                text = recognizer.recognize_google(audio)

            os.unlink(temp_audio_path)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except Exception as e:
            return f"Error transcribing audio: {str(e)}"

    def generate_interview_response(self, user_audio_base64: str):
        """Process interview input and return AI-generated response as audio."""
        user_text = self.transcribe_audio(user_audio_base64)

        if "Error" in user_text:
            return {"status": "error", "message": user_text}

        conversation_memory = self.load_memory()
        conversation_memory.append({"role": "user", "content": user_text})

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an AI interviewer. Respond with relevant follow-up questions."}
            ] + conversation_memory
        )

        bot_text = completion.choices[0].message.content
        conversation_memory.append({"role": "assistant", "content": bot_text})

        self.save_memory(conversation_memory)

        # Convert bot text response to audio (using ElevenLabs or any TTS API)
        bot_audio_base64 = self.text_to_speech(bot_text)
        return bot_audio_base64

    def text_to_speech(self, text):
        """Convert text to speech using ElevenLabs API."""
        ELEVENLABS_API_KEY = "sk_ecf451558f12317a3c2d0d58d03eadc9942442756bcf0b75"
        VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

        response = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
            headers={"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"},
            json={"text": text}
        )

        if response.status_code == 200:
            return base64.b64encode(response.content).decode("utf-8")
        else:
            return "Error generating audio response"
