from langchain_huggingface import HuggingFaceEmbeddings

# Initialize the embedding model once
# Using the same model as before: all-MiniLM-L6-v2 (384 dimensions)
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def get_embedding(text: str) -> list[float]:
    """
    Generate embedding for a single string.
    """
    return embedding_model.embed_query(text)

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of strings.
    """
    return embedding_model.embed_documents(texts)
