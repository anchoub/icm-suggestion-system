from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CaseBase(BaseModel):
    CaseTitle: str = Field(..., max_length=255)
    CaseDescription: str
    Product: str = Field(..., max_length=100)
    Component: Optional[str] = Field(None, max_length=100)
    Severity: str = Field(..., max_length=20)
    Priority: str = Field(..., max_length=20)
    CustomerTier: Optional[str] = Field(None, max_length=50)
    SLAImpact: Optional[str] = Field(None, max_length=50)
    Environment: Optional[str] = Field(None, max_length=50)
    Region: Optional[str] = Field(None, max_length=50)
    Tenant: Optional[str] = Field(None, max_length=100)
    ErrorCodes: Optional[str] = None
    ErrorMessage: Optional[str] = None
    StackTrace: Optional[str] = None
    AttachmentsJson: Optional[str] = None
    LogLinksJson: Optional[str] = None
    TroubleshootingSteps: Optional[str] = None
    CaseStatus: Optional[str] = Field("Open", max_length=50)
    ResolutionNotes: Optional[str] = None
    AssignedTeam: Optional[str] = Field(None, max_length=100)
    AssignedTo: Optional[str] = Field(None, max_length=100)
    Account: Optional[str] = Field(None, max_length=100)
    Tags: Optional[str] = None


class CaseCreate(CaseBase):
    pass


class Case(CaseBase):
    CaseID: int
    CreatedDate: datetime
    ModifiedDate: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class SimilarCase(BaseModel):
    case: Case
    similarity_score: float


class RecommendationRequest(BaseModel):
    case_title: str
    case_description: str
    product: Optional[str] = None
    error_message: Optional[str] = None
    stack_trace: Optional[str] = None
    top_k: int = Field(5, ge=1, le=20)


class RecommendationResponse(BaseModel):
    similar_cases: List[SimilarCase]
    alert_threshold_reached: bool  # >= 0.75
    recommend_icm: bool  # >= 0.80
    highest_similarity: float


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    database: str
    model_loaded: bool
