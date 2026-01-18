from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np


class EmbeddingService:
    """Service for generating embeddings using sentence-transformers"""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        
    def load_model(self):
        """Load the sentence transformer model"""
        if self.model is None:
            print(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            print("Model loaded successfully")
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def encode_text(self, text: str) -> np.ndarray:
        """Generate embedding for a single text"""
        if self.model is None:
            self.load_model()
        return self.model.encode(text, convert_to_numpy=True)
    
    def encode_batch(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for multiple texts"""
        if self.model is None:
            self.load_model()
        return self.model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    
    def create_case_text(
        self,
        title: str,
        description: str,
        product: str = None,
        error_message: str = None,
        stack_trace: str = None
    ) -> str:
        """Create combined text representation of a case for embedding"""
        parts = [f"Title: {title}", f"Description: {description}"]
        
        if product:
            parts.append(f"Product: {product}")
        if error_message:
            parts.append(f"Error: {error_message}")
        if stack_trace:
            # Truncate stack trace to avoid extremely long text
            stack_trace_short = stack_trace[:500] if len(stack_trace) > 500 else stack_trace
            parts.append(f"Stack Trace: {stack_trace_short}")
        
        return " | ".join(parts)


# Global instance
embedding_service = EmbeddingService()
