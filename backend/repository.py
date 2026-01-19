from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from models import CaseCreate, Case
from datetime import datetime


class CaseRepository:
    """Repository for database operations on Cases table"""
    
    @staticmethod
    def create_case(db: Session, case_data: CaseCreate) -> Case:
        """Insert a new case into icm.Cases table"""
        query = text("""
            INSERT INTO icm.Cases (
                CaseTitle, CaseDescription, Product, Component, Severity, Priority,
                CustomerTier, SLAImpact, Environment, Region, Tenant, ErrorCodes,
                ErrorMessage, StackTrace, AttachmentsJson, LogLinksJson,
                TroubleshootingSteps, CaseStatus, ResolutionNotes, AssignedTeam,
                AssignedTo, Account, Tags, ICMNumber, ICMOpenedDate, ICMDescription,
                DaysDelayedBeforeICM, CreatedDate
            )
            OUTPUT INSERTED.*
            VALUES (
                :CaseTitle, :CaseDescription, :Product, :Component, :Severity, :Priority,
                :CustomerTier, :SLAImpact, :Environment, :Region, :Tenant, :ErrorCodes,
                :ErrorMessage, :StackTrace, :AttachmentsJson, :LogLinksJson,
                :TroubleshootingSteps, :CaseStatus, :ResolutionNotes, :AssignedTeam,
                :AssignedTo, :Account, :Tags, :ICMNumber, :ICMOpenedDate, :ICMDescription,
                :DaysDelayedBeforeICM, GETDATE()
            )
        """)
        
        result = db.execute(query, case_data.model_dump())
        db.commit()
        
        row = result.fetchone()
        return Case.model_validate(dict(row._mapping))
    
    @staticmethod
    def get_case_by_id(db: Session, case_id: int) -> Optional[Case]:
        """Get a case by ID"""
        query = text("SELECT * FROM icm.Cases WHERE CaseID = :case_id")
        result = db.execute(query, {"case_id": case_id})
        row = result.fetchone()
        
        if row:
            return Case.model_validate(dict(row._mapping))
        return None
    
    @staticmethod
    def get_all_cases(
        db: Session,
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[Case]:
        """Get all cases with optional pagination"""
        query_str = "SELECT * FROM icm.Cases ORDER BY CreatedDate DESC"
        
        if limit:
            query_str += f" OFFSET {offset} ROWS FETCH NEXT {limit} ROWS ONLY"
        
        query = text(query_str)
        result = db.execute(query)
        
        return [Case.model_validate(dict(row._mapping)) for row in result]
    
    @staticmethod
    def get_cases_for_similarity_search(
        db: Session,
        exclude_case_id: Optional[int] = None
    ) -> List[dict]:
        """
        Get cases with relevant fields for similarity computation
        Returns list of dicts with CaseID and text fields
        """
        query_str = """
            SELECT 
                CaseID,
                CaseTitle,
                CaseDescription,
                Product,
                ErrorMessage,
                StackTrace
            FROM icm.Cases
        """
        
        if exclude_case_id:
            query_str += f" WHERE CaseID != {exclude_case_id}"
        
        query = text(query_str)
        result = db.execute(query)
        
        return [dict(row._mapping) for row in result]
    
    @staticmethod
    def update_case(db: Session, case_id: int, updates: dict) -> Optional[Case]:
        """Update a case with given fields"""
        # Build dynamic UPDATE query
        set_clauses = []
        params = {"case_id": case_id}
        
        for key, value in updates.items():
            if value is not None:
                set_clauses.append(f"{key} = :{key}")
                params[key] = value
        
        if not set_clauses:
            return CaseRepository.get_case_by_id(db, case_id)
        
        set_clauses.append("ModifiedDate = GETDATE()")
        
        query_str = f"""
            UPDATE icm.Cases
            SET {', '.join(set_clauses)}
            OUTPUT INSERTED.*
            WHERE CaseID = :case_id
        """
        
        query = text(query_str)
        result = db.execute(query, params)
        db.commit()
        
        row = result.fetchone()
        if row:
            return Case.model_validate(dict(row._mapping))
        return None
    
    @staticmethod
    def delete_case(db: Session, case_id: int) -> bool:
        """Delete a case by ID"""
        query = text("DELETE FROM icm.Cases WHERE CaseID = :case_id")
        result = db.execute(query, {"case_id": case_id})
        db.commit()
        return result.rowcount > 0
    
    @staticmethod
    def get_icm_statistics(db: Session, similar_case_ids: List[int], months: int = 6) -> dict:
        """Get ICM statistics for similar cases from the last N months"""
        if not similar_case_ids:
            return {
                "total_similar_cases_reviewed": 0,
                "cases_with_icm": 0,
                "average_delay_days": 0.0
            }
        
        case_ids_str = ','.join(map(str, similar_case_ids))
        
        query = text(f"""
            SELECT 
                COUNT(*) as total_cases,
                COUNT(ICMNumber) as cases_with_icm,
                AVG(CAST(DaysDelayedBeforeICM as FLOAT)) as avg_delay
            FROM icm.Cases
            WHERE CaseID IN ({case_ids_str})
                AND CreatedDate >= DATEADD(MONTH, -{months}, GETDATE())
        """)
        
        result = db.execute(query)
        row = result.fetchone()
        
        if row:
            return {
                "total_similar_cases_reviewed": row.total_cases or 0,
                "cases_with_icm": row.cases_with_icm or 0,
                "average_delay_days": float(row.avg_delay) if row.avg_delay else 0.0
            }
        
        return {
            "total_similar_cases_reviewed": 0,
            "cases_with_icm": 0,
            "average_delay_days": 0.0
        }
