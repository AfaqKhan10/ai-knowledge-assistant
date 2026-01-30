from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated
from ..schemas.chat import Chat, ChatCreate
from ..schemas.message import MessageCreate
from ..models.chat import Chat as ChatModel
from ..models.message import Message as MessageModel
from ..models.document import Document as DocumentModel
from ..database import get_db
from ..utils import retrieve_chunks, generate_response
from ..routers.auth import get_current_user
from ..models.user import User as UserModel

router = APIRouter(prefix="/chats", tags=["chats"])

@router.post("/", response_model=Chat)
def create_chat(
    chat: ChatCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    new_chat = ChatModel(
        user_id=current_user.id,
        title=chat.title
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@router.post("/{chat_id}/ask")
def ask_question(
    chat_id: int,
    message: MessageCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    # Check if chat exists and belongs to user
    chat = db.query(ChatModel).filter(
        ChatModel.id == chat_id,
        ChatModel.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or not yours")

    # Save user message
    user_message = MessageModel(
        chat_id=chat_id,
        role="user",
        content=message.content
    )
    db.add(user_message)
    db.commit()

    # Get all user's document IDs
    user_docs = db.query(DocumentModel.id).filter(DocumentModel.user_id == current_user.id).all()
    document_ids = [doc[0] for doc in user_docs]

    # Retrieve relevant chunks (RAG)
    contexts = retrieve_chunks(db, message.content, document_ids)

    # Generate response from Groq
    ai_response = generate_response(message.content, contexts)

    # Save assistant message
    assistant_message = MessageModel(
        chat_id=chat_id,
        role="assistant",
        content=ai_response
    )
    db.add(assistant_message)
    db.commit()

    # Return the AI response
    return {"response": ai_response}


@router.get("/")
def get_user_chats(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = db.query(ChatModel).filter(ChatModel.user_id == current_user.id).all()
    return chats




@router.get("/{chat_id}/messages")
def get_chat_messages(
    chat_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if chat exists and belongs to user
    chat = db.query(ChatModel).filter(
        ChatModel.id == chat_id,
        ChatModel.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or not yours")
    
    # Fetch all messages for this chat
    messages = db.query(MessageModel).filter(MessageModel.chat_id == chat_id).order_by(MessageModel.created_at).all()
    return messages