from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
import struct
import os
from azure.identity import DefaultAzureCredential

Base = declarative_base()


class DatabaseManager:
    def __init__(self):
        self.engine = None
        self.SessionLocal = None
        self.use_entra_auth = os.getenv("USE_ENTRA_AUTH", "false").lower() == "true"
        
    def get_connection_string(self):
        """Build connection string with SQL Auth or Entra ID token auth"""
        server = os.getenv("AZURE_SQL_SERVER")
        database = os.getenv("AZURE_SQL_DATABASE")
        driver = os.getenv("SQL_DRIVER", "ODBC Driver 18 for SQL Server")
        
        if self.use_entra_auth:
            # Entra ID (Azure AD) authentication
            connection_string = (
                f"mssql+pyodbc://{server}/{database}"
                f"?driver={driver}"
                f"&Authentication=ActiveDirectoryInteractive"
                f"&Encrypt=yes"
                f"&TrustServerCertificate=no"
            )
        else:
            # SQL Authentication
            username = os.getenv("AZURE_SQL_USERNAME")
            password = os.getenv("AZURE_SQL_PASSWORD")
            connection_string = (
                f"mssql+pyodbc://{username}:{password}@{server}/{database}"
                f"?driver={driver}"
                f"&Encrypt=yes"
                f"&TrustServerCertificate=no"
            )
        
        return connection_string
    
    def get_token_for_entra(self):
        """Get Azure AD token for authentication"""
        credential = DefaultAzureCredential()
        token_bytes = credential.get_token("https://database.windows.net/.default").token.encode("UTF-16-LE")
        token_struct = struct.pack(f'<I{len(token_bytes)}s', len(token_bytes), token_bytes)
        return token_struct
    
    def initialize(self):
        """Initialize database connection"""
        connection_string = self.get_connection_string()
        
        # Connection args for Entra ID token
        connect_args = {}
        if self.use_entra_auth:
            token = self.get_token_for_entra()
            connect_args = {
                "attrs_before": {1256: token}  # SQL_COPT_SS_ACCESS_TOKEN
            }
        
        self.engine = create_engine(
            connection_string,
            connect_args=connect_args,
            poolclass=NullPool,  # Disable pooling for token refresh
            echo=False
        )
        
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
    
    def get_session(self):
        """Get database session"""
        if self.SessionLocal is None:
            self.initialize()
        return self.SessionLocal()
    
    def test_connection(self):
        """Test database connection"""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                return result.fetchone()[0] == 1
        except Exception as e:
            print(f"Database connection test failed: {e}")
            return False


# Global instance
db_manager = DatabaseManager()


def get_db():
    """Dependency for FastAPI endpoints"""
    db = db_manager.get_session()
    try:
        yield db
    finally:
        db.close()
