from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import os
from dotenv import load_dotenv

from models import (
    HealthResponse,
    CaseCreate,
    Case,
    RecommendationRequest,
    RecommendationResponse,
    SimilarCase
)
from db import get_db, db_manager
from embedder import embedding_service
from similarity import SimilarityService
from repository import CaseRepository

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="ICM Suggestion System API",
    description="AI-powered incident case management with similarity-based recommendations",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("Initializing database connection...")
    db_manager.initialize()
    
    print("Loading embedding model...")
    embedding_service.load_model()
    
    print("Startup complete!")


@app.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    db_status = "connected"
    try:
        db_manager.test_connection()
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        database=db_status,
        model_loaded=embedding_service.is_loaded()
    )


@app.post("/create_case", response_model=Case)
async def create_case(
    case_data: CaseCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new case in the database
    
    Args:
        case_data: Case information
        
    Returns:
        Created case with CaseID and timestamps
    """
    try:
        case = CaseRepository.create_case(db, case_data)
        return case
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create case: {str(e)}")


@app.post("/recommend_icm", response_model=RecommendationResponse)
async def recommend_icm(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Find similar cases using semantic similarity
    
    Args:
        request: Case information for similarity search
        
    Returns:
        Top-k similar cases with similarity scores and thresholds
    """
    try:
        # Create text representation for the query case
        query_text = embedding_service.create_case_text(
            title=request.case_title,
            description=request.case_description,
            product=request.product,
            error_message=request.error_message,
            stack_trace=request.stack_trace
        )
        
        # Generate embedding for query
        query_embedding = embedding_service.encode_text(query_text)
        
        # Get existing cases from database
        existing_cases = CaseRepository.get_cases_for_similarity_search(db)
        
        if not existing_cases:
            return RecommendationResponse(
                similar_cases=[],
                alert_threshold_reached=False,
                recommend_icm=False,
                highest_similarity=0.0
            )
        
        # Generate embeddings for all existing cases
        case_texts = [
            embedding_service.create_case_text(
                title=case["CaseTitle"],
                description=case["CaseDescription"],
                product=case.get("Product"),
                error_message=case.get("ErrorMessage"),
                stack_trace=case.get("StackTrace")
            )
            for case in existing_cases
        ]
        
        candidate_embeddings = embedding_service.encode_batch(case_texts)
        
        # Compute similarities
        similarities = SimilarityService.compute_cosine_similarity(
            query_embedding,
            candidate_embeddings
        )
        
        # Get top-k similar cases
        top_k_results = SimilarityService.get_top_k_similar(
            similarities,
            k=request.top_k
        )
        
        # Fetch full case details for top results
        similar_cases = []
        for idx, score in top_k_results:
            case_id = existing_cases[idx]["CaseID"]
            case = CaseRepository.get_case_by_id(db, case_id)
            if case:
                similar_cases.append(
                    SimilarCase(case=case, similarity_score=score)
                )
        
        # Analyze results
        analysis = SimilarityService.analyze_similarities(similarities)
        
        return RecommendationResponse(
            similar_cases=similar_cases,
            alert_threshold_reached=analysis["alert"],
            recommend_icm=analysis["recommend_icm"],
            highest_similarity=analysis["max_score"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


@app.get("/cases", response_model=List[Case])
async def get_cases(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get all cases with pagination"""
    try:
        cases = CaseRepository.get_all_cases(db, limit=limit, offset=offset)
        return cases
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve cases: {str(e)}")


@app.get("/cases/{case_id}", response_model=Case)
async def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get a specific case by ID"""
    case = CaseRepository.get_case_by_id(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
