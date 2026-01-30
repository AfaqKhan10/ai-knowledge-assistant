

# app/models/chunk.py
from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    chunk_text = Column(Text, nullable=False)

    document = relationship("Document", back_populates="chunks")
