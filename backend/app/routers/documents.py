from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated
from ..schemas.document import Document
from ..models.document import Document as DocumentModel
from ..database import get_db
from ..utils import extract_text, chunk_text, store_chunks
from ..routers.auth import get_current_user  # Reuse the auth dependency
from ..models.user import User as UserModel
import os
import shutil
import uuid  # To make filenames unique and safe

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload", response_model=Document)
async def upload_document(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["pdf", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are allowed")

    # Create safe unique filename to avoid conflicts/overwrites
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    upload_dir = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)

    # Save uploaded file temporarily
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Extract text
    extracted_text = extract_text(file_path, file_extension)

    if not extracted_text.strip():
        os.remove(file_path)  # Clean up empty file
        raise HTTPException(status_code=400, detail="No text could be extracted from the file")

    # Create document record
    new_document = DocumentModel(
        user_id=current_user.id,
        filename=file.filename,  # Original name for user display
        file_type=file_extension,
        extracted_text=extracted_text  # Optional: can be removed later if storage is concern
    )
    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    # Chunk and embed
    chunks = chunk_text(extracted_text)
    if chunks:
        store_chunks(db, new_document.id, chunks)

    # Optional: delete temp file after processing
    try:
        os.remove(file_path)
    except Exception:
        pass  # Ignore cleanup errors

    return new_document