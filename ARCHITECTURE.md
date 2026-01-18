# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React + TypeScript)                        │
│                    http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │   CaseForm    │  │ Notifications  │  │  IcmModal        │  │
│  │ (22 fields)   │  │ Bell (>= 0.75) │  │  (>= 0.80)       │  │
│  └───────┬───────┘  └────────────────┘  └──────────────────┘  │
│          │                                                       │
│  ┌───────▼─────────────────────────────────────────────────┐   │
│  │           SuggestionsPanel                              │   │
│  │   Display similar cases with score visualization       │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/JSON
                            │ Vite Proxy (/api → :8000)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                │
│                   (FastAPI + Python)                            │
│                  http://localhost:8000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Endpoints                                              │   │
│  │  • GET  /health         → System health check          │   │
│  │  • POST /create_case    → Create new case              │   │
│  │  • POST /recommend_icm  → Get similar cases            │   │
│  │  • GET  /cases          → List all cases               │   │
│  │  • GET  /cases/{id}     → Get specific case            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐    │
│  │   models.py  │  │ repository.py│  │   embedder.py     │    │
│  │  (Pydantic)  │  │   (CRUD)     │  │ (all-MiniLM-L6-v2)│    │
│  └──────────────┘  └──────┬───────┘  └─────────┬─────────┘    │
│                            │                    │               │
│  ┌──────────────┐  ┌──────▼───────┐  ┌─────────▼─────────┐    │
│  │similarity.py │  │    db.py     │  │ sentence-         │    │
│  │  (Cosine)    │  │ (SQLAlchemy) │  │ transformers      │    │
│  └──────────────┘  └──────┬───────┘  └───────────────────┘    │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │ pyodbc
                             │ ODBC Driver 18
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AZURE SQL DATABASE                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Schema: icm                                            │   │
│  │  Table:  Cases                                          │   │
│  │                                                         │   │
│  │  Authentication:                                        │   │
│  │  • SQL Authentication (username/password)              │   │
│  │  • Entra ID (Azure AD) token authentication            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Creating a Case

```
1. User fills form
   └─→ 2. Click "Get Similar Cases"
           └─→ 3. Frontend sends POST /recommend_icm
                   {
                     "case_title": "...",
                     "case_description": "...",
                     "product": "...",
                     ...
                   }
                   └─→ 4. Backend: embedder.create_case_text()
                           └─→ 5. Generate embedding vector (384 dimensions)
                                   └─→ 6. Query database for all cases
                                           └─→ 7. Generate embeddings for all cases
                                                   └─→ 8. Compute cosine similarity
                                                           └─→ 9. Sort and get top-K
                                                                   └─→ 10. Return similar cases
                                                                            └─→ 11. Frontend displays:
                                                                                    ├─ SuggestionsPanel
                                                                                    ├─ NotificationBell (if >= 0.75)
                                                                                    └─ IcmModal (if >= 0.80)

12. User decides:
    A. Review similar cases → Don't create (avoid duplicate)
    B. Create ICM anyway → POST /create_case
                              └─→ 13. Insert into database
                                      └─→ 14. Return created case
                                              └─→ 15. Show success message
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                │
│                     (Main Orchestrator)                         │
│                                                                 │
│  State:                                                         │
│  • suggestions: SimilarCase[]                                   │
│  • showModal: boolean                                           │
│  • hasAlert: boolean                                            │
│  • isLoading: boolean                                           │
│                                                                 │
│  Methods:                                                       │
│  • handleGetRecommendations(caseData)                           │
│  • handleSubmitCase(caseData)                                   │
│  • handleCreateIcmAnyway()                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              CaseForm                                  │    │
│  │  Props:                                                │    │
│  │  • onSubmit: (data) => void                            │    │
│  │  • onRecommend: (data) => void                         │    │
│  │  • isLoading: boolean                                  │    │
│  │                                                        │    │
│  │  Buttons:                                              │    │
│  │  [Get Similar Cases] [Create Case]                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │          SuggestionsPanel                              │    │
│  │  Props:                                                │    │
│  │  • suggestions: SimilarCase[]                          │    │
│  │  • isVisible: boolean                                  │    │
│  │                                                        │    │
│  │  Displays:                                             │    │
│  │  • Match percentage with color-coded bars             │    │
│  │  • Case details (title, status, resolution)           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────┐  ┌──────────────────────────────────┐     │
│  │NotificationBell│  │         IcmModal                 │     │
│  │                │  │  Props:                          │     │
│  │Props:          │  │  • isOpen: boolean               │     │
│  │• hasAlert      │  │  • onClose: () => void           │     │
│  │• count         │  │  • onCreateIcm: () => void       │     │
│  │• onClick       │  │  • similarCases                  │     │
│  │                │  │  • highestSimilarity             │     │
│  │Badge: [3]      │  │                                  │     │
│  │(if >= 0.75)    │  │  Buttons:                        │     │
│  └────────────────┘  │  [Review] [Create ICM Anyway]    │     │
│                      └──────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Similarity Computation Algorithm

```
Input: New case with title, description, product, error message, stack trace
Output: List of similar cases with similarity scores

Step 1: Text Preprocessing
├─ Combine fields into single text:
│  "Title: {title} | Description: {desc} | Product: {product} | 
│   Error: {error} | Stack Trace: {trace[:500]}"
└─ Result: query_text

Step 2: Embedding Generation
├─ Load model: sentence-transformers/all-MiniLM-L6-v2
├─ Generate embedding: model.encode(query_text)
└─ Result: query_embedding (384-dim vector)

Step 3: Database Query
├─ Fetch all cases from database
├─ Extract: CaseID, CaseTitle, CaseDescription, Product, ErrorMessage, StackTrace
└─ Result: candidate_cases[]

Step 4: Batch Embedding
├─ Create text for each candidate case
├─ Generate embeddings: model.encode(candidate_texts)
└─ Result: candidate_embeddings (N × 384 matrix)

Step 5: Similarity Computation
├─ Normalize vectors (L2 norm)
├─ Compute: cosine_similarity(query_embedding, candidate_embeddings)
│  Formula: similarity = (A · B) / (||A|| × ||B||)
└─ Result: similarities[] (N values, each between -1 and 1)

Step 6: Ranking
├─ Sort similarities in descending order
├─ Get top-K indices
└─ Result: top_k_cases with scores

Step 7: Threshold Analysis
├─ Check highest score >= 0.75 → Alert (notification bell)
├─ Check highest score >= 0.80 → Recommend ICM (modal)
└─ Result: alert_threshold_reached, recommend_icm flags

Step 8: Response
Return {
  similar_cases: [
    { case: Case, similarity_score: float },
    ...
  ],
  alert_threshold_reached: bool,
  recommend_icm: bool,
  highest_similarity: float
}
```

## Database Schema

```
icm.Cases
├─ CaseID (INT, PK, IDENTITY)
├─ CaseTitle (NVARCHAR(255), NOT NULL)
├─ CaseDescription (NVARCHAR(MAX), NOT NULL)
├─ Product (NVARCHAR(100), NOT NULL)
├─ Component (NVARCHAR(100))
├─ Severity (NVARCHAR(20), NOT NULL)
├─ Priority (NVARCHAR(20), NOT NULL)
├─ CustomerTier (NVARCHAR(50))
├─ SLAImpact (NVARCHAR(50))
├─ Environment (NVARCHAR(50))
├─ Region (NVARCHAR(50))
├─ Tenant (NVARCHAR(100))
├─ ErrorCodes (NVARCHAR(MAX))
├─ ErrorMessage (NVARCHAR(MAX))
├─ StackTrace (NVARCHAR(MAX))
├─ AttachmentsJson (NVARCHAR(MAX))
├─ LogLinksJson (NVARCHAR(MAX))
├─ TroubleshootingSteps (NVARCHAR(MAX))
├─ CaseStatus (NVARCHAR(50), DEFAULT 'Open')
├─ ResolutionNotes (NVARCHAR(MAX))
├─ AssignedTeam (NVARCHAR(100))
├─ AssignedTo (NVARCHAR(100))
├─ Account (NVARCHAR(100))
├─ Tags (NVARCHAR(MAX))
├─ CreatedDate (DATETIME, DEFAULT GETDATE())
└─ ModifiedDate (DATETIME)

Indexes:
├─ IX_Cases_Product (Product)
├─ IX_Cases_Severity (Severity)
├─ IX_Cases_Status (CaseStatus)
└─ IX_Cases_CreatedDate (CreatedDate DESC)

Constraints:
├─ CK_Cases_Severity: IN ('Critical', 'High', 'Medium', 'Low')
└─ CK_Cases_Status: IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Pending')
```

## Technology Stack

```
Frontend:
├─ React 18.2
├─ TypeScript 5.3
├─ Vite 5.0 (build tool)
├─ Axios 1.6 (HTTP client)
└─ CSS3 (frosted-glass effects)

Backend:
├─ Python 3.9+
├─ FastAPI 0.109
├─ Uvicorn (ASGI server)
├─ Pydantic 2.5 (validation)
├─ SQLAlchemy 2.0
├─ pyodbc 5.0
└─ python-dotenv

AI/ML:
├─ sentence-transformers 2.3
├─ all-MiniLM-L6-v2 model
├─ scikit-learn (cosine similarity)
├─ PyTorch 2.1
└─ NumPy 1.26

Database:
├─ Azure SQL Database
├─ ODBC Driver 18 for SQL Server
└─ T-SQL

Authentication:
├─ SQL Authentication
└─ Azure Entra ID (OAuth 2.0)
```

## Deployment Architecture (Production)

```
                    ┌──────────────────┐
                    │   Azure CDN      │
                    │  (Static Files)  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Azure Storage   │
                    │   (Frontend)     │
                    └──────────────────┘
                             │
                             │ HTTPS
                             ▼
                    ┌──────────────────┐
                    │  Application     │
                    │  Gateway / WAF   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Azure App       │
                    │  Service         │
                    │  (FastAPI)       │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Azure SQL       │
                    │  Database        │
                    │  (with firewall) │
                    └──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Azure Key Vault │
                    │  (Secrets)       │
                    └──────────────────┘
```
