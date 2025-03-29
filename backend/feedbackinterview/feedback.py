from openai import OpenAI

import openai
from pydantic import BaseModel, Field

api_key = "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"  # Replace with your actual API key

client = openai.Client(api_key=api_key)

def read_transcript(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        print("File not found. Please check the path.")
        return None
    

# Path to the interview transcript file
file_path = "interview_memory_default.txt"
transcript = read_transcript(file_path)

if transcript:
    feedback_prompt = f"""
    You are an experienced interview evaluator. Analyze the following interview transcript and provide feedback on:

    1. **Communication Skills** - Clarity, confidence, and coherence.
    2. **Technical Competency** - Depth of knowledge, problem-solving, and accuracy.
    3. **Behavioral Responses** - Adaptability, decision-making, and cultural fit.
    4. **Overall Impression** - Strengths, weaknesses, and improvement suggestions.
   
    Here is the interview transcript:
    {transcript}

    Provide actionable feedback in a clear and structured format.
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """You are an experienced interview evaluator providing feedback on a candidate's overall performance. 
                                            Start by appreciating the candidate for participating in the mock interview. 
                                            Then, briefly highlight their key strengths, including their technical knowledge, problem-solving abilities, and communication confidence. 
                                        Finally, mention areas for improvement in a polite and constructive manner, offering clear and actionable suggestions. 
                                            Ensure the feedback is limited to just three sentences while maintaining a professional and encouraging tone."""},
            {"role": "user", "content": feedback_prompt}
        ]
    )

    # Access and print only the message content
    print(completion.choices[0].message.content)
else:
    print("No transcript available for analysis.")
