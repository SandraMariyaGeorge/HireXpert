from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.chat_model import Chat, ChatRequest, ChatResponse

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        chat_instance = Chat()
        bot_response = chat_instance.process_chat(request.user_input)
        return ChatResponse(bot_response=bot_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")


@router.post("/summarize")
async def summarize():
    try:
        chat_instance = Chat()
        conversation_memory = chat_instance.load_memory()
        summary = chat_instance.generate_summary(conversation_memory)
        return {"message": "Resume generated and saved successfully", "resume": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation error: {str(e)}")


@router.post("/clear")
async def clear_chat():
    try:
        chat_instance = Chat()
        chat_instance.clear_memory()
        return {"message": "Chat history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing chat history: {str(e)}")

