# 📁 Project File Index

## Complete File Structure

```
icm-suggestion-system/
│
├── 📄 README.md                    - Complete setup and usage guide
├── 📄 QUICKSTART.md                - 5-minute quick start
├── 📄 GETTING_STARTED.md           - Visual guide with checklists
├── 📄 PROJECT_SUMMARY.md           - Feature checklist and deliverables
├── 📄 ARCHITECTURE.md              - System architecture diagrams
├── 📄 API_EXAMPLES.md              - API usage with curl/Python/JS
│
├── 📂 backend/                     - Python FastAPI backend
│   ├── main.py                     - FastAPI app (3 endpoints)
│   ├── models.py                   - Pydantic models (22 fields)
│   ├── db.py                       - Database manager (SQL + Entra ID)
│   ├── embedder.py                 - sentence-transformers service
│   ├── similarity.py               - Cosine similarity computation
│   ├── repository.py               - Database operations (CRUD)
│   ├── requirements.txt            - Python dependencies
│   ├── .env.template              - Environment config template
│   ├── .gitignore                 - Git ignore rules
│   └── populate_sample_data.py    - Test data generator
│
├── 📂 frontend/                    - React + TypeScript UI
│   ├── index.html                  - HTML entry point
│   ├── package.json                - npm dependencies
│   ├── tsconfig.json               - TypeScript config
│   ├── tsconfig.node.json          - Node TypeScript config
│   ├── vite.config.ts              - Vite build config
│   ├── .gitignore                 - Git ignore rules
│   │
│   └── 📂 src/
│       ├── main.tsx                - React entry point
│       ├── App.tsx                 - Main app component
│       ├── App.css                 - App styling
│       ├── index.css               - Global styles
│       ├── api.ts                  - HTTP client functions
│       ├── types.ts                - TypeScript type definitions
│       │
│       ├── 📂 components/
│       │   ├── CaseForm.tsx        - 22-field case form
│       │   ├── SuggestionsPanel.tsx - Similar cases display
│       │   ├── NotificationBell.tsx - Alert indicator (>= 0.75)
│       │   └── IcmModal.tsx        - Warning modal (>= 0.80)
│       │
│       └── 📂 styles/
│           ├── CaseForm.css        - Frosted-glass form styling
│           ├── SuggestionsPanel.css - Match visualization
│           ├── NotificationBell.css - Animated bell
│           └── IcmModal.css        - Modal design
│
└── 📂 database/                    - SQL scripts
    ├── schema.sql                  - Table creation + indexes
    └── sample_data.sql             - 10 test cases
```

---

## 📋 File Descriptions

### Documentation Files

| File | Size | Purpose |
|------|------|---------|
| README.md | 7.2 KB | Complete setup guide with all instructions |
| QUICKSTART.md | 1.5 KB | Get started in 5 minutes |
| GETTING_STARTED.md | 9.8 KB | Visual guide with checklists and tips |
| PROJECT_SUMMARY.md | 7.8 KB | Feature checklist and what's included |
| ARCHITECTURE.md | 19.2 KB | System architecture with diagrams |
| API_EXAMPLES.md | 12.6 KB | API usage examples in multiple languages |

### Backend Files

| File | Lines | Purpose |
|------|-------|---------|
| main.py | 165 | FastAPI app with endpoints |
| models.py | 73 | Pydantic models for validation |
| db.py | 108 | Database connection manager |
| embedder.py | 68 | Embedding generation service |
| similarity.py | 100 | Cosine similarity computation |
| repository.py | 155 | Database CRUD operations |
| requirements.txt | 12 | Python dependencies |
| populate_sample_data.py | 95 | Test data generator |

### Frontend Files

| File | Lines | Purpose |
|------|-------|---------|
| App.tsx | 140 | Main application logic |
| CaseForm.tsx | 310 | Complete case submission form |
| SuggestionsPanel.tsx | 125 | Similar cases display panel |
| NotificationBell.tsx | 32 | Alert notification component |
| IcmModal.tsx | 95 | Warning modal dialog |
| api.ts | 39 | HTTP client wrapper |
| types.ts | 45 | TypeScript type definitions |

### CSS Files

| File | Lines | Purpose |
|------|-------|---------|
| App.css | 58 | App container and background |
| CaseForm.css | 142 | Frosted-glass form styling |
| SuggestionsPanel.css | 197 | Match cards and badges |
| NotificationBell.css | 65 | Animated bell with badge |
| IcmModal.css | 214 | Modal overlay and content |

### Database Files

| File | Lines | Purpose |
|------|-------|---------|
| schema.sql | 62 | Create table with indexes |
| sample_data.sql | 89 | 10 test cases for demo |

---

## 🎯 Key Files for Different Tasks

### Getting Started
1. **GETTING_STARTED.md** - Start here for overview
2. **QUICKSTART.md** - Quick setup commands
3. **README.md** - Full documentation

### Backend Development
1. **main.py** - API endpoints
2. **models.py** - Data models
3. **embedder.py** - AI/ML logic
4. **similarity.py** - Threshold logic

### Frontend Development
1. **App.tsx** - State management
2. **CaseForm.tsx** - Form logic
3. **SuggestionsPanel.tsx** - Display logic
4. **IcmModal.tsx** - Modal logic

### Styling
1. **App.css** - Overall layout
2. **CaseForm.css** - Form appearance
3. **SuggestionsPanel.css** - Cards and badges
4. **IcmModal.css** - Modal design

### Configuration
1. **backend/.env.template** - Backend config
2. **frontend/package.json** - Frontend dependencies
3. **backend/requirements.txt** - Backend dependencies
4. **vite.config.ts** - Build configuration

### Database
1. **database/schema.sql** - Run first
2. **database/sample_data.sql** - Run for test data
3. **backend/populate_sample_data.py** - Python alternative

---

## 🔍 Where to Find Specific Features

### AI/ML Features
- **Embedding generation**: `backend/embedder.py`
- **Similarity computation**: `backend/similarity.py`
- **Thresholds (0.75, 0.80)**: `backend/similarity.py` lines 9-10
- **Model loading**: `backend/embedder.py` lines 15-19

### Database Operations
- **Connection setup**: `backend/db.py`
- **SQL auth**: `backend/db.py` lines 30-40
- **Entra ID auth**: `backend/db.py` lines 23-29
- **CRUD operations**: `backend/repository.py`

### API Endpoints
- **Health check**: `backend/main.py` line 55
- **Create case**: `backend/main.py` line 71
- **Get recommendations**: `backend/main.py` line 91
- **List cases**: `backend/main.py` line 166
- **Get case by ID**: `backend/main.py` line 180

### UI Components
- **Form fields**: `frontend/src/components/CaseForm.tsx` lines 30-60
- **Notification bell**: `frontend/src/components/NotificationBell.tsx`
- **Modal trigger**: `frontend/src/App.tsx` lines 40-45
- **Suggestions display**: `frontend/src/components/SuggestionsPanel.tsx`

### Styling
- **Frosted-glass effect**: `frontend/src/styles/*.css` backdrop-filter
- **Color-coded bars**: `frontend/src/components/SuggestionsPanel.tsx` lines 15-22
- **Animations**: `frontend/src/styles/NotificationBell.css` keyframes

---

## 📊 Statistics

### Total Project Size
- **Source files**: 28
- **Documentation files**: 6
- **Total files**: 34
- **Total lines of code**: ~2,500+
- **Total size**: ~130 KB

### Language Distribution
- **Python**: 8 files, ~900 lines
- **TypeScript/TSX**: 13 files, ~1,100 lines
- **CSS**: 5 files, ~680 lines
- **SQL**: 2 files, ~150 lines
- **Markdown**: 6 files, ~750 lines

### Component Breakdown
- **Backend endpoints**: 5
- **Frontend components**: 4
- **Form fields**: 22
- **Database tables**: 1
- **Database indexes**: 4

---

## 🚀 Typical File Access Flow

### Creating a Case
```
1. User → CaseForm.tsx (enter data)
2. CaseForm.tsx → App.tsx (handleSubmitCase)
3. App.tsx → api.ts (createCase)
4. api.ts → main.py (/create_case)
5. main.py → repository.py (create_case)
6. repository.py → db.py (database insert)
7. db.py → Azure SQL Database
8. Response back through chain
9. App.tsx → Toast notification
```

### Getting Recommendations
```
1. User → CaseForm.tsx (click "Get Similar Cases")
2. CaseForm.tsx → App.tsx (handleGetRecommendations)
3. App.tsx → api.ts (getRecommendations)
4. api.ts → main.py (/recommend_icm)
5. main.py → embedder.py (create embeddings)
6. embedder.py → sentence-transformers (AI model)
7. main.py → repository.py (get all cases)
8. main.py → similarity.py (compute scores)
9. similarity.py → Return matches
10. App.tsx → Update state
11. App.tsx → SuggestionsPanel (display)
12. App.tsx → NotificationBell (if >= 0.75)
13. App.tsx → IcmModal (if >= 0.80)
```

---

## 📝 Quick Reference

### Start Backend
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

### Start Frontend
```powershell
cd frontend
npm run dev
```

### Run Database Setup
```sql
-- In Azure Data Studio or SSMS
:r database/schema.sql
:r database/sample_data.sql
```

### View API Docs
```
http://localhost:8000/docs
```

### Access Application
```
http://localhost:5173
```

---

## 🎓 Learning Path

### Beginners
1. Read GETTING_STARTED.md
2. Run QUICKSTART.md commands
3. Explore the UI
4. Read API_EXAMPLES.md

### Developers
1. Read ARCHITECTURE.md
2. Study backend/main.py
3. Study frontend/src/App.tsx
4. Modify thresholds in similarity.py
5. Customize CSS files

### Advanced
1. Study embedder.py and similarity.py
2. Experiment with different models
3. Optimize database queries
4. Add custom features
5. Deploy to production

---

## 🔗 Quick Links

| Resource | Location |
|----------|----------|
| API Documentation | http://localhost:8000/docs |
| Frontend App | http://localhost:5173 |
| Health Check | http://localhost:8000/health |
| Source Code (Backend) | `backend/` |
| Source Code (Frontend) | `frontend/src/` |
| Database Scripts | `database/` |
| Configuration | `backend/.env` |

---

**All files are ready to use!** 🎉

Start with [GETTING_STARTED.md](GETTING_STARTED.md) for a guided walkthrough.
