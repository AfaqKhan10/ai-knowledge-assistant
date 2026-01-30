# AI Knowledge Assistant Backend

A modern AI-powered backend that lets users upload PDF/TXT documents and ask intelligent questions about them using **Retrieval-Augmented Generation (RAG)**.  
Answers are generated only from uploaded content with the help of local FAISS vector search + fast Groq LLM.

## Features
- Secure user signup & login with JWT
- Upload PDF or TXT files (text extraction + chunking)
- Local vector embeddings (sentence-transformers/all-MiniLM-L6-v2)
- Fast similarity search using FAISS
- Ask questions in chat – AI answers strictly from your documents
- Chat history saved per user
- Simple dashboard with stats (documents, chats, messages)

## Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL (for document & chat storage)
- **Vector Store**: FAISS (local, fast & lightweight)
- **LLM**: Groq (llama-3.1-8b-instant)
- **Embeddings**: HuggingFace sentence-transformers
- **Auth**: JWT + bcrypt
- **File Processing**: PyPDF2

## Installation & Run (Local)

1. Go to backend folder:
   ```bash
   cd ai-knowledge-assistant/backend


Activate virtual env
:Bash.\venv\Scripts\activate   # Windows


Install packages:
Bashpip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv langchain-groq PyPDF2 pydantic jose[cryptography] passlib[bcrypt] python-multipart faiss-cpu langchain-huggingface

Create PostgreSQL database:
Name: Ai_knowledge_Assistant


Create .env file in backend folder:
textDATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/Ai_knowledge_Assistant
JWT_SECRET_KEY=supersecretkey123aaffaaqqkkhhaann
GROQ_API_KEY=your_groq_key_here


Start the server:
Bashuvicorn app.main:app --reload

Swagger docs:
http://127.0.0.1:8000/docs



backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── utils.py
│   └── rag/             
├── uploads/             
└── .env