# ICM Suggestion System

A full-stack AI-powered Incident Case Management (ICM) suggestion system that uses semantic similarity to detect duplicate incidents and recommend existing cases.

## Features

- **AI-Powered Similarity Detection**: Uses sentence-transformers (all-MiniLM-L6-v2) for semantic similarity
- **Smart Thresholds**:
  - 🔔 Alert threshold: 0.75 (notification bell activates)
  - ⚠️ ICM recommendation: 0.80 (modal prompts user)
- **Azure SQL Database**: Supports both SQL authentication and Entra ID (Azure AD) token auth
- **Modern UI**: React/TypeScript with frosted-glass design and full background support
- **Real-time Recommendations**: Get similar cases as you type

## Architecture

### Backend (FastAPI)
- **main.py**: FastAPI application with endpoints
- **models.py**: Pydantic models for data validation
- **db.py**: Database connection manager with SQL/Entra ID auth
- **embedder.py**: Sentence transformer embedding service
- **similarity.py**: Cosine similarity computation
- **repository.py**: Database operations for Cases table

### Frontend (React + TypeScript)
- **CaseForm**: Comprehensive form with all case fields
- **SuggestionsPanel**: Display similar cases with score bars
- **NotificationBell**: Alert indicator for similarity >= 0.75
- **IcmModal**: Warning modal for similarity >= 0.80

## Prerequisites

- Python 3.9+
- Node.js 18+
- Azure SQL Database with `icm.Cases` table
- ODBC Driver 18 for SQL Server

## Database Schema

The system expects an `icm.Cases` table with the following columns:

```sql
CREATE TABLE icm.Cases (
    CaseID INT IDENTITY(1,1) PRIMARY KEY,
    CaseTitle NVARCHAR(255) NOT NULL,
    CaseDescription NVARCHAR(MAX) NOT NULL,
    Product NVARCHAR(100) NOT NULL,
    Component NVARCHAR(100),
    Severity NVARCHAR(20) NOT NULL,
    Priority NVARCHAR(20) NOT NULL,
    CustomerTier NVARCHAR(50),
    SLAImpact NVARCHAR(50),
    Environment NVARCHAR(50),
    Region NVARCHAR(50),
    Tenant NVARCHAR(100),
    ErrorCodes NVARCHAR(MAX),
    ErrorMessage NVARCHAR(MAX),
    StackTrace NVARCHAR(MAX),
    AttachmentsJson NVARCHAR(MAX),
    LogLinksJson NVARCHAR(MAX),
    TroubleshootingSteps NVARCHAR(MAX),
    CaseStatus NVARCHAR(50) DEFAULT 'Open',
    ResolutionNotes NVARCHAR(MAX),
    AssignedTeam NVARCHAR(100),
    AssignedTo NVARCHAR(100),
    Account NVARCHAR(100),
    Tags NVARCHAR(MAX),
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME
);
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   - Copy `.env.template` to `.env`
   - Update with your Azure SQL credentials:
   
   ```env
   AZURE_SQL_SERVER=your-server.database.windows.net
   AZURE_SQL_DATABASE=your-database-name
   
   # For SQL Authentication
   USE_ENTRA_AUTH=false
   AZURE_SQL_USERNAME=your-username
   AZURE_SQL_PASSWORD=your-password
   
   # OR for Entra ID (Azure AD) Authentication
   USE_ENTRA_AUTH=true
   ```

5. **Run the backend**:
   ```bash
   python main.py
   ```
   
   Backend will be available at `http://localhost:8000`
   API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add background image (optional)**:
   - Place your background image in `frontend/public/background.jpg`
   - Uncomment the style in `App.tsx`:
   ```tsx
   style={{ backgroundImage: 'url(/background.jpg)' }}
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173`

## API Endpoints

### GET /health
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T23:17:00",
  "database": "connected",
  "model_loaded": true
}
```

### POST /create_case
Create a new case
```json
{
  "CaseTitle": "Application crash on startup",
  "CaseDescription": "App crashes immediately after launch",
  "Product": "MyApp",
  "Severity": "High",
  "Priority": "P1"
}
```

### POST /recommend_icm
Get similar cases
```json
{
  "case_title": "Application crash on startup",
  "case_description": "App crashes immediately after launch",
  "product": "MyApp",
  "top_k": 5
}
```

Response:
```json
{
  "similar_cases": [...],
  "alert_threshold_reached": true,
  "recommend_icm": false,
  "highest_similarity": 0.78
}
```

### GET /cases
List all cases with pagination
```
GET /cases?limit=100&offset=0
```

### GET /cases/{case_id}
Get specific case by ID

## Usage Flow

1. **Fill out case form** with incident details
2. **Click "Get Similar Cases"** to check for duplicates
3. **Review suggestions** with similarity scores
4. **Notification bell** activates if similarity >= 0.75
5. **Warning modal** appears if similarity >= 0.80
6. **Choose action**:
   - Review similar cases and close the incident
   - Create ICM anyway if it's genuinely new

## Customization

### Adjust Similarity Thresholds

Edit `backend/similarity.py`:
```python
class SimilarityService:
    ALERT_THRESHOLD = 0.75  # Change notification threshold
    RECOMMEND_ICM_THRESHOLD = 0.80  # Change modal threshold
```

### Change Embedding Model

Edit `backend/embedder.py`:
```python
embedding_service = EmbeddingService(model_name="all-MiniLM-L6-v2")
```

Available models: https://www.sbert.net/docs/pretrained_models.html

### Customize UI Colors

Edit CSS files in `frontend/src/styles/` to change colors, animations, and layouts.

## Production Deployment

### Backend
```bash
# Use a production WSGI server
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

### Frontend
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Environment Variables for Production
- Set `CORS_ORIGINS` to your production frontend URL
- Use Entra ID authentication for better security
- Consider using Azure Key Vault for secrets

## Troubleshooting

### Database Connection Issues
- Verify ODBC Driver 18 is installed
- Check firewall rules on Azure SQL
- Ensure credentials are correct in `.env`

### Model Loading Issues
- First run downloads ~90MB model (may take time)
- Ensure sufficient disk space (~1GB for model cache)
- Check internet connection for initial download

### CORS Issues
- Update `CORS_ORIGINS` in `.env` to include your frontend URL
- Restart backend after changing environment variables

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues, please check:
1. Backend logs for API errors
2. Browser console for frontend errors
3. Database connectivity with `/health` endpoint
