import faiss
import numpy as np
import os
import pickle

# Path to save the FAISS index
INDEX_FILE = "faiss_index.bin"
DIMENSION = 384  # Dimension for all-MiniLM-L6-v2

class FAISSStore:
    def __init__(self):
        self.index = None
        self.id_map = {}  # Map FAISS ID -> DB Chunk ID (optional if using IndexIDMap)
        self.load_index()

    def _create_index(self):
        """Create a new FAISS index with ID mapping support."""
        # IndexFlatL2 is exact search, L2 distance (Euclidean)
        # IndexIDMap calls add_with_ids allowing us to use DB IDs directly
        self.index = faiss.IndexIDMap(faiss.IndexFlatL2(DIMENSION))

    def load_index(self):
        """Load index from disk or create new if not exists."""
        if os.path.exists(INDEX_FILE):
            try:
                self.index = faiss.read_index(INDEX_FILE)
                print(f"Loaded FAISS index with {self.index.ntotal} vectors.")
            except Exception as e:
                print(f"Error loading index: {e}. Creating new one.")
                self._create_index()
        else:
            print("No existing index found. Creating new FAISS index.")
            self._create_index()

    def save_index(self):
        """Save index to disk."""
        if self.index:
            faiss.write_index(self.index, INDEX_FILE)
            print("FAISS index saved to disk.")

    def add_vectors(self, vectors: list[list[float]], ids: list[int]):
        """
        Add vectors to index with specific IDs.
        ids must be integers (e.g., database Primary Keys).
        """
        if not vectors:
            return
        
        np_vectors = np.array(vectors).astype('float32')
        np_ids = np.array(ids).astype('int64')
        
        self.index.add_with_ids(np_vectors, np_ids)
        self.save_index()

    def search(self, query_vector: list[float], k: int = 5) -> tuple[list[int], list[float]]:
        """
        Search for k nearest neighbors.
        Returns: (ids, distances)
        """
        if self.index.ntotal == 0:
            return [], []

        np_query = np.array([query_vector]).astype('float32')
        distances, ids = self.index.search(np_query, k)
        
        # Filter out -1 which indicates no result in FAISS
        valid_indices = [i for i, idx in enumerate(ids[0]) if idx != -1]
        
        return [int(ids[0][i]) for i in valid_indices], [float(distances[0][i]) for i in valid_indices]

# Global instance
faiss_store = FAISSStore()
