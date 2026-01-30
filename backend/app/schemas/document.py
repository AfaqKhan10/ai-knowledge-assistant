from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentCreate(BaseModel):
    filename: str
    file_type: str

class Document(BaseModel):
    id: int
    user_id: int
    filename: str
    file_type: str
    created_at: datetime
    extracted_text: Optional[str] = None

    class Config:
        from_attributes = True