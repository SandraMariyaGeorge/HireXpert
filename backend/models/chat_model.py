from models.base_model import Base
from pydantic import BaseModel
import json
from typing import List
from pydantic import BaseModel, Field
from openai import OpenAI
from pymongo import MongoClient

api_key = "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"  # Replace with your actual OpenAI API key
client = OpenAI(api_key=api_key)


class EducationItem(BaseModel):
    institution: str 
    degree: str 
    dates: str 
    percentage:str


class ExperienceItem(BaseModel):
    title: str
    dates: str 
    company: str
    location: str
    responsibilities: List[str] = Field(..., description="List of responsibilities")


class ProjectItem(BaseModel):
    name: str 
    technologies: str 
    dates: str
    description: List[str] = Field(..., description="List of project details")


class ContactInfo(BaseModel):
    age:str
    gender:str
    phone: str 
    email: str 
    linkedin: str
    github: str 


class TechnicalSkills(BaseModel):
    languages: str 
    frameworks: str
    developer_tools: str


class Resume(BaseModel):
    name: str  
    contact_info: ContactInfo = Field(..., description="Contact information")
    education: List[EducationItem] = Field(..., description="List of Education entries")
    experience: List[ExperienceItem] = Field(..., description="List of Experience entries")
    projects: List[ProjectItem] = Field(..., description="List of Project entries")
    technical_skills: TechnicalSkills = Field(..., description="Technical Skills")


class ChatRequest(BaseModel):
    user_input: str


class ChatResponse(BaseModel):
    bot_response: str

class BotResponse(BaseModel):
    bot_response: str
    is_complete: bool


class Chat(Base):
    def clear_memory(self, username):
        """Clears the conversation memory for a specific user at the start of each run."""
        memory_file = f"memory_{username}.txt"
        with open(memory_file, "w", encoding="utf-8") as file:
            json.dump([], file)

    def load_memory(self, username):
        """Load conversation history from memory file specific to a user."""
        memory_file = f"memory_{username}.txt"
        try:
            with open(memory_file, "r", encoding="utf-8") as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_memory(self, memory, username):
        """Save conversation history to memory file specific to a user."""
        memory_file = f"memory_{username}.txt"
        with open(memory_file, "w", encoding="utf-8") as file:
            json.dump(memory, file, indent=4)

    def save_to_mongo(self, resume):
        """Save the generated resume to MongoDB."""
        self.db.insert_one(resume.dict())

    def generate_summary(self, conversation, username):
        """Generate a formal summary of the conversation."""
        if not conversation:
            return "No conversation history found."

        conversation_text = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in conversation])
        
        completion = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert user details summeriser. The chat has ended...let the user know that and give summary"},
                {"role": "user", "content": conversation_text},
            ],
            response_format=Resume,
        )
        optimized_resume = completion.choices[0].message.parsed

        optimized_resume["username"] = username

        # Save the resume to MongoDB
        self.save_to_mongo(optimized_resume)
        return optimized_resume

    def process_chat(self, user_input: str, username):
        # Load existing conversation
        conversation_memory = self.load_memory(username)
        
        # Append user input to memory
        conversation_memory.append({"role": "user", "content": user_input})

        # Get model response
        completion = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": """You are an intelligent and structured AI assistant designed to help candidates build a complete and professional user details.
                Your primary task is to engage in a dynamic conversation to collect all necessary details from the user and organize them into a well-structured user data.
                
                Your approach should be methodical, ensuring that no critical detail is missed while keeping the conversation natural and engaging. 
                You should guide the candidate step by step through various sections of their resume. Only ask about one item at a time and provide clear instructions to the user.

                Here is how you should gather information:

                **1. Personal Details:**  
                - Full Name  
                - Age  
                - Gender  
                - Email Address  
                - Phone Number  
                - GitHub Profile (if available)  
                - LinkedIn Profile (if available)  

                **2. Education Details:**  
                - School Name  
                - Time Period (Start Year - End Year)  
                - Percentage/Grade Achieved  
                - Board Affiliation (CBSE, State, ICSE, etc.)  

                **3. Experience Details:**  
                - First, ask whether the candidate is a fresher or an experienced professional.  
                - If **fresher**, ask about internship experiences (if any). If none, store the value as "N/A".  
                - If **experienced**, ask for:  
                - Previous company names  
                - Duration of employment (Start Year - End Year)  
                - Job role/position  
                - Responsibilities and key contributions  

                **4. Project Details:**  
                - Project Title  
                - Project Description  
                - Duration of the project  
                - Technology stack used  

                **5. Skills Section:**  
                - Frontend Technologies  
                - Backend Technologies  
                - Databases Used  
                - Frameworks Worked With  
                - Cloud Platforms  
                - Generative AI Experience (if any)  

                Your goal is to ensure that the user data collected is complete and structured, making it easy for the candidate to apply for jobs quickly. 
                Keep the conversation interactive, ask for clarification when needed, and provide guidance if the candidate is unsure about what to enter. 
                Your responses should be clear, concise, and supportive to help the candidate present themselves effectively.
                Only ask the questions one by one in a short and breif way
                Once all the data has been received set is_complete to True
                """}
            ] + conversation_memory,
            response_format=BotResponse,
        )
            
        msg = completion.choices[0].message.parsed

        # Append bot response to memory
        conversation_memory.append({"role": "assistant", "content": msg.bot_response})

        # Save updated conversation memory
        self.save_memory(conversation_memory, username)

        if msg.is_complete:
            # Generate a formal summary of the conversation
            summary = self.generate_summary(conversation_memory, username)
            return summary
        
        return msg.bot_response

