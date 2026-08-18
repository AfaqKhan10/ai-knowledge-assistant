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
- 

## Tech Stack
- **Framework**: FastAPI
- 
- **Database**: PostgreSQL (for document & chat storage)
- **Vector Store**: FAISS (local, fast & lightweight)
- **LLM**: Groq (llama-3.1-8b-instant)
- **Embeddings**: HuggingFace sentence-transformers
- **Auth**: JWT + bcrypt
- **File Processing**: PyPDF2

## Installation & Run (Local)

1. Go to backend folder:
   ```bash
   
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


# AI Knowledge Assistant Frontend

A modern React frontend for the AI-powered document chat app. Users can login/signup, upload documents, and chat with them using AI in a sleek dark neon UI.

## Features
- Responsive dark neon theme (glassmorphism cards, gradient buttons, neon glow effects)
- User signup/login/logout with JWT authentication
- Dashboard with resume last chat button
- Document upload (PDF/TXT) with auto-redirect to chat
- Real-time chat with streaming replies (typewriter effect)
- Chat history loading & resume
- Sticky navbar with active page indicator
- Show/hide password toggle

## Tech Stack
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **API Calls**: Axios
- **Icons**: lucide-react
- **State Management**: React Context (AuthContext)


## Installation & Run (Local)

1. Go to frontend folder:
   ``bash
   cd frontend
