"""
Example script to populate the database with sample cases for testing
"""
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db_manager
from repository import CaseRepository
from models import CaseCreate

load_dotenv()

# Sample test cases
sample_cases = [
    {
        "CaseTitle": "Azure VM fails to start after reboot",
        "CaseDescription": "Virtual machine in West US region fails to boot after scheduled maintenance. Error code: VMStartTimedOut",
        "Product": "Azure Virtual Machines",
        "Component": "Compute",
        "Severity": "High",
        "Priority": "P1",
        "Environment": "Production",
        "Region": "West US",
        "ErrorCodes": "VMStartTimedOut",
        "ErrorMessage": "The VM failed to start within the expected time frame",
        "CaseStatus": "Resolved",
        "ResolutionNotes": "Deallocated and reallocated VM to different host. Issue resolved."
    },
    {
        "CaseTitle": "Database connection timeout in production",
        "CaseDescription": "Application experiencing intermittent database connection timeouts during peak hours",
        "Product": "Azure SQL Database",
        "Component": "Database Engine",
        "Severity": "Critical",
        "Priority": "P0",
        "Environment": "Production",
        "ErrorMessage": "Connection timeout: The timeout period elapsed while attempting to consume the pre-login handshake",
        "CaseStatus": "Open",
    },
    {
        "CaseTitle": "Authentication failure with Azure AD",
        "CaseDescription": "Users unable to authenticate using SSO with Azure Active Directory",
        "Product": "Azure Active Directory",
        "Component": "Authentication",
        "Severity": "High",
        "Priority": "P1",
        "ErrorCodes": "AADSTS50058",
        "ErrorMessage": "A silent sign-in request was sent but no user is signed in",
        "CaseStatus": "Resolved",
        "ResolutionNotes": "Issue caused by expired token cache. Cleared cache and re-authenticated."
    },
    {
        "CaseTitle": "Storage blob upload fails with 500 error",
        "CaseDescription": "Blob storage upload operations failing randomly with HTTP 500 internal server error",
        "Product": "Azure Storage",
        "Component": "Blob Storage",
        "Severity": "Medium",
        "Priority": "P2",
        "Environment": "Staging",
        "ErrorCodes": "InternalError",
        "CaseStatus": "In Progress",
    },
    {
        "CaseTitle": "VM performance degradation after update",
        "CaseDescription": "Significant performance slowdown on Azure VMs following recent platform update",
        "Product": "Azure Virtual Machines",
        "Component": "Compute",
        "Severity": "Medium",
        "Priority": "P2",
        "Environment": "Production",
        "Region": "East US",
        "CaseStatus": "Open",
    }
]

def populate_database():
    """Populate database with sample cases"""
    db_manager.initialize()
    db = db_manager.get_session()
    
    try:
        print("Populating database with sample cases...")
        
        for idx, case_data in enumerate(sample_cases, 1):
            case = CaseCreate(**case_data)
            created = CaseRepository.create_case(db, case)
            print(f"✓ Created case #{created.CaseID}: {created.CaseTitle}")
        
        print(f"\n✓ Successfully created {len(sample_cases)} sample cases")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_database()
