# 🚀 Quick Azure Deployment Reference

## ✅ What's Already Created

| Resource | Name | Status | URL |
|----------|------|--------|-----|
| Resource Group | icm-suggestion-rg | ✅ Created | East US |
| Static Web App | icm-suggestion-frontend | ✅ Created | https://thankful-desert-00777a80f.6.azurestaticapps.net |
| Web App (Backend) | icm-suggestion-backend | ⏳ Waiting for quota | - |

## ⚠️ Current Issue: Quota Limit

Your Azure subscription has **0 quota for App Service Plans**.

### 🔧 How to Request Quota Increase:

1. Go to: https://portal.azure.com
2. Navigate to: **Subscriptions** → **Your Subscription** → **Usage + quotas**
3. Search: **"App Service"** or **"Basic VMs"**
4. Click: **"Request increase"**
5. Request: **2 cores** minimum
6. Wait: **1-2 business days** for approval

## 🚀 After Quota Approval - Deploy in 1 Command

```powershell
# Navigate to project
cd C:\Users\anchoub\icm-suggestion-system

# Run deployment script
.\deploy-to-azure.ps1
```

This script will:
- ✅ Create and deploy backend Web App
- ✅ Configure environment variables
- ✅ Build and deploy frontend
- ✅ Update API endpoints
- ✅ Display all URLs

## 🔧 Manual Deployment Options

### Option 1: Azure Portal (No CLI)
See: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md) - Section "Deploy Backend to Azure Web App"

### Option 2: VS Code Extension
1. Install **Azure App Service** extension
2. Right-click `backend` folder → **Deploy to Web App**
3. Select subscription and create new Web App

### Option 3: Azure CLI
```bash
cd backend
az webapp up --name icm-suggestion-backend --resource-group icm-suggestion-rg --runtime "PYTHON:3.11"
```

## 📊 Your Azure Resources

```
icm-suggestion-rg (Resource Group)
├── icm-suggestion-frontend (Static Web App) ✅
└── icm-suggestion-backend (Web App) ⏳ Needs quota
```

## 🔑 Environment Variables to Configure

After backend is created, set these in Azure Portal:

```
AZURE_SQL_SERVER = your_server.database.windows.net
AZURE_SQL_DATABASE = your_database_name  
AZURE_SQL_USERNAME = your_username
AZURE_SQL_PASSWORD = your_password
USE_ENTRA_AUTH = false
```

## 🧪 Testing URLs

After deployment:

| Endpoint | URL | Expected Response |
|----------|-----|-------------------|
| Backend Health | `https://icm-suggestion-backend.azurewebsites.net/health` | `{"status": "healthy"}` |
| Backend Docs | `https://icm-suggestion-backend.azurewebsites.net/docs` | Swagger UI |
| Frontend | `https://thankful-desert-00777a80f.6.azurestaticapps.net` | React App |

## 💰 Cost

| Resource | Tier | Cost/Month |
|----------|------|------------|
| Static Web App | Free | $0 |
| Web App | Free F1 | $0 |
| Web App | Basic B1 | ~$13 |
| Azure SQL | Basic | ~$5 |

**Total: $5-18/month** (depending on tier)

## 📞 Support Commands

```powershell
# Check login
az account show

# List resources
az resource list --resource-group icm-suggestion-rg --output table

# View Web App logs
az webapp log tail --name icm-suggestion-backend --resource-group icm-suggestion-rg

# Restart Web App
az webapp restart --name icm-suggestion-backend --resource-group icm-suggestion-rg

# Delete everything (cleanup)
az group delete --name icm-suggestion-rg --yes
```

## 📖 Full Documentation

- **Complete Guide**: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)
- **Project Setup**: [README.md](README.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)

## 🆘 Troubleshooting

### "Quota limit" error
→ Request increase at portal.azure.com

### "Cannot connect to database"
→ Check firewall rules allow Azure services

### "Backend returns 500 error"
→ View logs: Azure Portal → Web App → Log stream

### "Frontend can't reach backend"
→ Update API_BASE_URL in frontend/src/api.ts

## ⏭️ Next Steps

1. ✅ Resource Group created
2. ✅ Static Web App created  
3. ⏳ **Request quota increase** ← YOU ARE HERE
4. 🔜 Run `.\deploy-to-azure.ps1`
5. 🔜 Test the application
6. 🔜 Enable monitoring
