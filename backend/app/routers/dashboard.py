from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.document import Document as DocumentModel
from ..models.chat import Chat as ChatModel
from ..models.message import Message as MessageModel
from ..database import get_db
from ..models.user import User as UserModel
from ..routers.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
def get_user_stats(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get basic statistics for the current logged-in user.
    """
    total_documents = db.query(DocumentModel).filter(
        DocumentModel.user_id == current_user.id
    ).count()

    total_chats = db.query(ChatModel).filter(
        ChatModel.user_id == current_user.id
    ).count()

    total_messages = db.query(func.count(MessageModel.id)).join(ChatModel).filter(
        ChatModel.user_id == current_user.id
    ).scalar() or 0

    return {
        "total_documents": total_documents,
        "total_chats": total_chats,
        "total_messages": total_messages
    }