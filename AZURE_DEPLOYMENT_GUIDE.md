# Azure Deployment Guide for ICM Suggestion System

## Overview
This guide explains how to deploy the ICM Suggestion System to Azure using the Azure Portal (manual deployment) since your subscription has quota limitations for automated CLI deployment.

## ✅ Already Created
- **Resource Group**: `icm-suggestion-rg` (East US)
- **Static Web App**: `icm-suggestion-frontend` 
  - URL: https://thankful-desert-00777a80f.6.azurestaticapps.net

## 📋 Prerequisites
- Azure subscription with access to Azure Portal
- Request quota increase for App Service Plans in your subscription
- Azure SQL Database (already configured)

---

## Option 1: Deploy Backend to Azure Web App (Recommended)

### Step 1: Request Quota Increase
Your subscription currently has a quota limit preventing App Service creation. To resolve this:

1. Go to Azure Portal → Subscriptions
2. Select your subscription: `BAMI_ad75a453-0feb-4c7c-972f-fb9f8c79ca75`
3. Click **"Usage + quotas"** in the left menu
4. Search for **"App Service"** or **"Basic VMs"**
5. Click **"Request increase"**
6. Request at least **2 cores** for Basic or Free tier
7. Wait for approval (usually 1-2 business days)

### Step 2: Create Backend Web App via Portal

Once quota is approved:

1. **Go to Azure Portal** → [portal.azure.com](https://portal.azure.com)

2. **Create Web App**:
   - Click "Create a resource"
   - Search for "Web App"
   - Click "Create"

3. **Configure Basics**:
   - Subscription: `BAMI_ad75a453-0feb-4c7c-972f-fb9f8c79ca75`
   - Resource Group: `icm-suggestion-rg`
   - Name: `icm-suggestion-backend`
   - Publish: **Code**
   - Runtime stack: **Python 3.11**
   - Operating System: **Linux**
   - Region: **East US**
   - App Service Plan: Create new → Name: `icm-suggestion-plan`, Pricing: **Basic B1** (or Free F1 if available)

4. **Click "Review + Create"** → **"Create"**

### Step 3: Configure Application Settings

After the Web App is created:

1. Go to your Web App → **Configuration** → **Application settings**

2. Add the following environment variables (from your .env file):

   ```
   AZURE_SQL_SERVER = your_server_name.database.windows.net
   AZURE_SQL_DATABASE = your_database_name
   AZURE_SQL_USERNAME = your_username
   AZURE_SQL_PASSWORD = your_password
   USE_ENTRA_AUTH = false
   SCM_DO_BUILD_DURING_DEPLOYMENT = true
   ```

3. Click **"Save"**

### Step 4: Deploy Backend Code

**Option A: Using VS Code Extension** (Easiest):

1. Install **Azure App Service** extension in VS Code
2. Sign in to Azure
3. Right-click on `backend` folder → **"Deploy to Web App"**
4. Select your subscription and `icm-suggestion-backend`
5. Confirm deployment

**Option B: Using Azure CLI** (After quota approval):

```bash
cd C:\Users\anchoub\icm-suggestion-system\backend
az webapp up --name icm-suggestion-backend --resource-group icm-suggestion-rg --runtime "PYTHON:3.11"
```

**Option C: Using ZIP Deploy**:

1. Create a ZIP file of your backend folder (excluding `venv`, `.env`)
2. Go to Web App → **Deployment Center** → **ZIP Deploy**
3. Upload the ZIP file

### Step 5: Configure Startup Command

1. Go to Web App → **Configuration** → **General settings**
2. Set **Startup Command**: 
   ```
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
   ```
3. Click **"Save"**

### Step 6: Verify Backend

- Access: `https://icm-suggestion-backend.azurewebsites.net/health`
- Should return: `{"status": "healthy"}`

---

## Option 2: Deploy Frontend to Static Web App

### Step 1: Get Deployment Token

```bash
az staticwebapp secrets list --name icm-suggestion-frontend --resource-group icm-suggestion-rg
```

Copy the `apiKey` value.

### Step 2: Build Frontend

```bash
cd C:\Users\anchoub\icm-suggestion-system\frontend
npm install
npm run build
```

### Step 3: Deploy Frontend

**Option A: Using SWA CLI**:

1. Install SWA CLI:
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. Deploy:
   ```bash
   swa deploy --app-location ./dist --deployment-token YOUR_API_KEY_HERE
   ```

**Option B: Using Azure Portal**:

1. Go to Static Web App → **"Deployment"**
2. Upload your `dist` folder manually

**Option C: Using GitHub Actions** (Best for continuous deployment):

1. Create a GitHub repository
2. Push your code to GitHub
3. In Static Web App → **"Deployment"** → Connect to GitHub
4. Select repository and configure:
   - App location: `/frontend`
   - Api location: `` (leave blank)
   - Output location: `dist`

### Step 4: Update Frontend API Endpoint

Before building, update the API endpoint in [frontend/src/api.ts](frontend/src/api.ts):

```typescript
const API_BASE_URL = 'https://icm-suggestion-backend.azurewebsites.net';
```

Then rebuild and redeploy.

---

## Option 3: Deploy Backend to Azure Container Instances

If Web App quota is still blocked, use Azure Container Instances:

### Step 1: Create Dockerfile

Already exists at `backend/Dockerfile` - if not, create:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Build and Push to Azure Container Registry

```bash
# Create ACR
az acr create --name icmsuggestionacr --resource-group icm-suggestion-rg --sku Basic

# Build image
cd C:\Users\anchoub\icm-suggestion-system\backend
az acr build --registry icmsuggestionacr --image icm-backend:latest .
```

### Step 3: Deploy to Container Instances

```bash
az container create \
  --name icm-backend \
  --resource-group icm-suggestion-rg \
  --image icmsuggestionacr.azurecr.io/icm-backend:latest \
  --dns-name-label icm-backend \
  --ports 8000 \
  --registry-username icmsuggestionacr \
  --registry-password $(az acr credential show --name icmsuggestionacr --query "passwords[0].value" -o tsv) \
  --environment-variables \
    AZURE_SQL_SERVER=your_server.database.windows.net \
    AZURE_SQL_DATABASE=your_database \
    AZURE_SQL_USERNAME=your_username \
    AZURE_SQL_PASSWORD=your_password \
    USE_ENTRA_AUTH=false
```

---

## 🔒 Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use Azure Key Vault** for production secrets
3. **Enable Managed Identity** for Azure SQL authentication
4. **Configure CORS** in backend to only allow your frontend domain
5. **Enable HTTPS** only (disable HTTP)

---

## 🧪 Testing After Deployment

### Backend Health Check:
```bash
curl https://icm-suggestion-backend.azurewebsites.net/health
```

### Test Case Creation:
```bash
curl -X POST https://icm-suggestion-backend.azurewebsites.net/create_case \
  -H "Content-Type: application/json" \
  -d '{
    "CaseTitle": "Test Case",
    "CaseDescription": "Testing deployment",
    "Product": "Azure",
    "Severity": "Medium",
    "Priority": "Medium"
  }'
```

### Frontend:
Visit: https://thankful-desert-00777a80f.6.azurestaticapps.net

---

## 📊 Monitoring

1. **Application Insights** (Recommended):
   - Enable in Web App → Application Insights
   - View logs, metrics, performance

2. **Log Stream**:
   - Web App → Log stream
   - Real-time application logs

3. **Metrics**:
   - Web App → Metrics
   - CPU, Memory, HTTP requests

---

## 🆘 Troubleshooting

### Backend won't start:
- Check **Log Stream** in Azure Portal
- Verify environment variables are set
- Check Python version is 3.11
- Verify requirements.txt includes all dependencies

### Frontend can't reach backend:
- Update API_BASE_URL in frontend/src/api.ts
- Configure CORS in backend main.py
- Check Network Security Groups

### Database connection fails:
- Verify firewall rules allow Azure services
- Check connection string format
- Test with Azure SQL extension in VS Code

---

## 💰 Cost Estimation

| Resource | Tier | Monthly Cost (USD) |
|----------|------|-------------------|
| Static Web App | Free | $0 |
| Web App | Free F1 | $0 |
| Web App | Basic B1 | ~$13 |
| Azure SQL Database | Basic | ~$5 |
| **Total (Free tier)** | | **~$5/month** |
| **Total (Basic tier)** | | **~$18/month** |

---

## 📞 Next Steps

1. ✅ Request quota increase for App Service
2. ⏳ Wait for approval (1-2 business days)
3. 🚀 Deploy backend using one of the methods above
4. 🌐 Deploy frontend to Static Web App
5. 🧪 Test the complete system
6. 📊 Enable Application Insights for monitoring

---

## Already Created Resources

Your Static Web App is ready:
- **Name**: icm-suggestion-frontend
- **URL**: https://thankful-desert-00777a80f.6.azurestaticapps.net
- **Resource Group**: icm-suggestion-rg
- **Location**: East US 2

Once you have quota, run:
```bash
az webapp up --name icm-suggestion-backend --resource-group icm-suggestion-rg --runtime "PYTHON:3.11" --location eastus
```
