from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatCreate(BaseModel):
    title: str

class Chat(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    last_updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True