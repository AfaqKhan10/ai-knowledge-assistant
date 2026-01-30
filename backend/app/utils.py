import os
import shutil
import PyPDF2
from langchain_groq import ChatGroq
from sqlalchemy.orm import Session
from sqlalchemy import text
from .models import Chunk
from .config import settings
from .rag.embeddings import get_embedding
from .rag.faiss_store import faiss_store

# Groq LLM configuration
llm = ChatGroq(
    groq_api_key=settings.GROQ_API_KEY,
    model_name="llama-3.1-8b-instant",  # Fast and good quality model
    temperature=0.5,                    # Lower temperature = more accurate / factual
    max_tokens=700,
)

def extract_text(file_path: str, file_type: str) -> str:
    """
    Extract text from PDF or TXT file.
    """
    try:
        if file_type.lower() == "pdf":
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text.strip()
        elif file_type.lower() == "txt":
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read().strip()
        return ""
    except Exception as e:
        print(f"Error extracting text: {str(e)}")
        return ""

def chunk_text(text: str, chunk_size: int = 600) -> list[str]:
    """
    Split text into smaller chunks for embedding.
    """
    if not text:
        return []
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size]
        if chunk.strip():
            chunks.append(chunk)
    return chunks

def store_chunks(db: Session, document_id: int, chunks: list[str]):
    """
    Save chunks to DB (text) and FAISS (vectors).
    """
    # 1. First save all chunks to DB to get IDs
    chunk_objects = []
    for idx, text_content in enumerate(chunks):
        new_chunk = Chunk(
            document_id=document_id,
            # chunk_index=idx,
            chunk_text=text_content
        )
        db.add(new_chunk)
        chunk_objects.append(new_chunk)
    
    db.commit()
    
    # 2. Refresh to get IDs
    for chunk in chunk_objects:
        db.refresh(chunk)
    
    # 3. Generate embeddings and add to FAISS
    try:
        embeddings = []
        ids = []
        for chunk in chunk_objects:
            emb = get_embedding(chunk.chunk_text)
            embeddings.append(emb)
            ids.append(chunk.id)
        
        faiss_store.add_vectors(embeddings, ids)
        print(f"Added {len(ids)} chunks to FAISS for doc {document_id}")
    except Exception as e:
        print(f"Error adding to FAISS: {e}")

def retrieve_chunks(db: Session, query: str, document_ids: list[int], top_k: int = 5) -> list[str]:
    """
    Find most relevant chunks using FAISS + DB lookup.
    """
    if not document_ids:
        return []

    try:
        # 1. Embed query
        query_emb = get_embedding(query)
        
        # 2. Search FAISS (Global search first)
        # We might search for more candidates (e.g. 3*k) to filter by document_id later
        candidate_ids, distances = faiss_store.search(query_emb, k=top_k * 3)
        
        if not candidate_ids:
            return []

        # 3. Filter by document ownership (using DB query for efficiency)
        # Fetch only chunks that are in the user's document list AND in candidate list
        valid_chunks = db.query(Chunk).filter(
            Chunk.id.in_(candidate_ids),
            Chunk.document_id.in_(document_ids)
        ).all()
        
        # 4. Sort results to match FAISS relevance order
        # Create a map for quick lookup
        chunk_map = {c.id: c.chunk_text for c in valid_chunks}
        
        sorted_texts = []
        for cid in candidate_ids:
            if cid in chunk_map:
                sorted_texts.append(chunk_map[cid])
                if len(sorted_texts) >= top_k:
                    break
        
        return sorted_texts

    except Exception as e:
        print(f"Error retrieving chunks: {str(e)}")
        return []

def generate_response(query: str, contexts: list[str]) -> str:
    """
    Generate answer using retrieved context and Groq LLM.
    """
    if not contexts:
        return "Sorry, I couldn't find any relevant information in your uploaded documents. Please upload relevant files or ask a different question."

    # Join contexts with numbering
    context_str = "\n\n".join([f"Excerpt {i+1}:\n{c.strip()}" for i, c in enumerate(contexts)])

    # Prompt for the LLM
    prompt = f"""You are a helpful and accurate AI knowledge assistant.
Answer the user's question using **only** the provided context excerpts.
Do not invent or assume information that is not in the context.
If the context does not contain the answer, reply: "I don't have enough information from your documents to answer this question."

Context:
{context_str}

Question: {query}

Concise, clear and accurate answer:"""

    try:
        response = llm.invoke(prompt)
        return response.content.strip()
    except Exception as e:
        print(f"Error generating response from Groq: {str(e)}")
        return "Sorry, there was an error generating the answer. Please try again."