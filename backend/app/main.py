from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from .database import engine, Base
import app.models  # Register models
from fastapi.middleware.cors import CORSMiddleware
from .routers import (
    auth_router,
    documents_router,
    chats_router,
    dashboard_router
)

app = FastAPI(
    title="AI Knowledge Assistant Backend",
    description="RAG-based document Q&A system with Groq LLM",
    version="1.0.0"
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="AI Knowledge Assistant Backend",
        version="1.0.0",
        description="RAG-based document Q&A system with Groq LLM",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# CORS middleware add karo (frontend ko allow)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend ka address
    allow_credentials=True,
    allow_methods=["*"],  # sab methods allow (GET, POST, OPTIONS etc.)
    allow_headers=["*"],
)

# Tables create (sirf ek baar)
# Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(chats_router)
app.include_router(dashboard_router)

# @app.get("/")
# def root():
#     return {"message": "AI Knowledge Assistant Backend is running"}