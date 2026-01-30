from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import relationship
from ..database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    extracted_text = Column(Text, nullable=True)

    user = relationship("User", back_populates="documents")
    chunks = relationship("Chunk", back_populates="document")