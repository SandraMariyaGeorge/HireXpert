import json
from typing import List
from pydantic import BaseModel, Field
from openai import OpenAI
from pymongo import MongoClient  # Add this import

api_key = "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"  # Replace with your actual OpenAI API key
client = OpenAI(api_key=api_key)

# MongoDB connection string
mongo_client = MongoClient("mongodb+srv://user:user123@cluster0.q30qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = mongo_client["resume_database"]
collection = db["resumes"]

MEMORY_FILE = "memory.txt"
SUMMARY_FILE = "summary.txt"
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


def clear_memory():
    """Clears the conversation memory at the start of each run."""
    with open(MEMORY_FILE, "w", encoding="utf-8") as file:
        json.dump([], file)

def load_memory():
    """Load conversation history from memory file."""
    try:
        with open(MEMORY_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_memory(memory):
    """Save conversation history to memory file."""
    with open(MEMORY_FILE, "w", encoding="utf-8") as file:
        json.dump(memory, file, indent=4)

def save_to_mongo(resume):
    """Save the generated resume to MongoDB."""
    collection.insert_one(resume.dict())

def generate_summary(conversation):
    """Generate a formal summary of the conversation."""
    if not conversation:
        return "No conversation history found."

    conversation_text = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in conversation])
    print(conversation_text)
   
    completion = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert user details summeriser. "},
                {"role": "user", "content": conversation_text},
            ],
            response_format=Resume,
        )
    optimized_resume = completion.choices[0].message.parsed
    print(optimized_resume)
    
    # Save the resume to MongoDB
    save_to_mongo(optimized_resume)

def save_summary(summary):
    """Save the generated summary to a file."""
    with open(SUMMARY_FILE, "w", encoding="utf-8") as file:
        file.write(summary)

# Initialize memory at the start
clear_memory()
conversation_memory = []

# Chat loop
while True:
    user_input = input("Enter your input (type 'exit' to end chat, 'summary' to get a conversation summary): ")
    
    if user_input.lower() == "exit":
        print("Chat ended.") 
        generate_summary(conversation_memory)
        break

    # Append user input to memory
    conversation_memory.append({"role": "user", "content": user_input})

    
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": """You are an intelligent and structured AI assistant designed to help candidates build a complete and professional resume. 
        Your primary task is to engage in a dynamic conversation to collect all necessary details from the user and organize them into a well-structured resume.
        
        Your approach should be methodical, ensuring that no critical detail is missed while keeping the conversation natural and engaging. 
        You should guide the candidate step by step through various sections of their resume.

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

        Your goal is to ensure that the resume generated is complete and structured, making it easy for the candidate to apply for jobs quickly. 
        Keep the conversation interactive, ask for clarification when needed, and provide guidance if the candidate is unsure about what to enter. 
        Your responses should be clear, concise, and supportive to help the candidate present themselves effectively.
        """}
    ] + conversation_memory
)
    
        

    bot_response = completion.choices[0].message.content
    print(f"Bot: {bot_response}")

    # Append bot response to memory
    conversation_memory.append({"role": "assistant", "content": bot_response})

    # Save updated conversation memory
    save_memory(conversation_memory)


