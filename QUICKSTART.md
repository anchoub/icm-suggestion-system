# ICM Suggestion System

Full-stack AI-powered incident case management system with semantic similarity detection.

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env
# Edit .env with your Azure SQL credentials
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 to use the application.

## Documentation

See [README.md](README.md) for full documentation.

## Project Structure

```
icm-suggestion-system/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── db.py                # Database manager
│   ├── embedder.py          # Embedding service
│   ├── similarity.py        # Similarity computation
│   ├── repository.py        # Data access layer
│   ├── requirements.txt     # Python dependencies
│   └── .env.template        # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS files
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript types
│   │   └── App.tsx         # Main app
│   ├── package.json
│   └── vite.config.ts
└── README.md
```
