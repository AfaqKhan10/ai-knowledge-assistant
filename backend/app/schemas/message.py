from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    content: str  # Note: role backend mein set hoga, user sirf content bhejega

class Message(BaseModel):
    id: int
    chat_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True