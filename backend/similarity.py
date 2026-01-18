import numpy as np
from typing import List, Tuple
from sklearn.metrics.pairwise import cosine_similarity


class SimilarityService:
    """Service for computing similarity between embeddings"""
    
    ALERT_THRESHOLD = 0.75
    RECOMMEND_ICM_THRESHOLD = 0.80
    
    @staticmethod
    def compute_cosine_similarity(
        query_embedding: np.ndarray,
        candidate_embeddings: np.ndarray
    ) -> np.ndarray:
        """
        Compute cosine similarity between query and candidates
        
        Args:
            query_embedding: Single embedding vector (1D array)
            candidate_embeddings: Multiple embedding vectors (2D array)
            
        Returns:
            Array of similarity scores
        """
        # Ensure query is 2D for sklearn
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)
        
        similarities = cosine_similarity(query_embedding, candidate_embeddings)
        return similarities[0]  # Return 1D array
    
    @staticmethod
    def get_top_k_similar(
        similarities: np.ndarray,
        k: int = 5
    ) -> List[Tuple[int, float]]:
        """
        Get indices and scores of top-k most similar items
        
        Args:
            similarities: Array of similarity scores
            k: Number of top results to return
            
        Returns:
            List of (index, score) tuples sorted by score descending
        """
        # Get indices of top-k scores
        top_k_indices = np.argsort(similarities)[::-1][:k]
        
        # Return as list of (index, score) tuples
        return [(int(idx), float(similarities[idx])) for idx in top_k_indices]
    
    @staticmethod
    def should_alert(similarity_score: float) -> bool:
        """Check if similarity score meets alert threshold (0.75)"""
        return similarity_score >= SimilarityService.ALERT_THRESHOLD
    
    @staticmethod
    def should_recommend_icm(similarity_score: float) -> bool:
        """Check if similarity score meets ICM recommendation threshold (0.80)"""
        return similarity_score >= SimilarityService.RECOMMEND_ICM_THRESHOLD
    
    @staticmethod
    def analyze_similarities(similarities: np.ndarray) -> dict:
        """
        Analyze similarity scores and return summary
        
        Returns:
            Dictionary with analysis results
        """
        if len(similarities) == 0:
            return {
                "max_score": 0.0,
                "alert": False,
                "recommend_icm": False,
                "count_above_alert": 0,
                "count_above_icm": 0
            }
        
        max_score = float(np.max(similarities))
        
        return {
            "max_score": max_score,
            "alert": SimilarityService.should_alert(max_score),
            "recommend_icm": SimilarityService.should_recommend_icm(max_score),
            "count_above_alert": int(np.sum(similarities >= SimilarityService.ALERT_THRESHOLD)),
            "count_above_icm": int(np.sum(similarities >= SimilarityService.RECOMMEND_ICM_THRESHOLD))
        }
