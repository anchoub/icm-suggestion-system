# Quick Deploy Script for ICM Suggestion System
# Run this script AFTER your quota increase is approved

# Variables
$RESOURCE_GROUP = "icm-suggestion-rg"
$LOCATION = "eastus"
$BACKEND_NAME = "icm-suggestion-backend"
$FRONTEND_NAME = "icm-suggestion-frontend"
$RUNTIME = "PYTHON:3.11"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ICM Suggestion System - Azure Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if logged in
Write-Host "`nChecking Azure login status..." -ForegroundColor Yellow
az account show | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in. Please run: az login" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Logged in to Azure" -ForegroundColor Green

# Deploy Backend
Write-Host "`n[1/3] Deploying Backend to Azure Web App..." -ForegroundColor Yellow
Write-Host "This will create the Web App and deploy your Python FastAPI backend" -ForegroundColor Gray

cd "$PSScriptRoot\backend"

az webapp up --name $BACKEND_NAME `
    --resource-group $RESOURCE_GROUP `
    --runtime $RUNTIME `
    --location $LOCATION `
    --sku B1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend deployed successfully!" -ForegroundColor Green
    Write-Host "  URL: https://$BACKEND_NAME.azurewebsites.net" -ForegroundColor Cyan
} else {
    Write-Host "✗ Backend deployment failed. Check error above." -ForegroundColor Red
    Write-Host "  If quota error, request increase at: https://portal.azure.com" -ForegroundColor Yellow
    exit 1
}

# Configure Backend Environment Variables
Write-Host "`n[2/3] Configuring Backend Environment Variables..." -ForegroundColor Yellow

# Read .env file
if (Test-Path ".env") {
    $envVars = Get-Content ".env" | Where-Object { $_ -notmatch '^#' -and $_ -match '=' }
    
    foreach ($line in $envVars) {
        $key, $value = $line -split '=', 2
        $key = $key.Trim()
        $value = $value.Trim()
        
        Write-Host "  Setting: $key" -ForegroundColor Gray
        az webapp config appsettings set `
            --name $BACKEND_NAME `
            --resource-group $RESOURCE_GROUP `
            --settings "$key=$value" `
            --output none
    }
    
    Write-Host "✓ Environment variables configured" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: .env file not found. Configure manually in Azure Portal" -ForegroundColor Yellow
}

# Set startup command
Write-Host "  Setting startup command..." -ForegroundColor Gray
az webapp config set `
    --name $BACKEND_NAME `
    --resource-group $RESOURCE_GROUP `
    --startup-file "gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000" `
    --output none

Write-Host "✓ Startup command configured" -ForegroundColor Green

# Build and Deploy Frontend
Write-Host "`n[3/3] Building and Deploying Frontend..." -ForegroundColor Yellow

cd "$PSScriptRoot\frontend"

# Update API endpoint
Write-Host "  Updating API endpoint..." -ForegroundColor Gray
$apiFile = "src\api.ts"
$backendUrl = "https://$BACKEND_NAME.azurewebsites.net"

if (Test-Path $apiFile) {
    (Get-Content $apiFile) | ForEach-Object {
        $_ -replace "http://localhost:8000", $backendUrl
    } | Set-Content $apiFile
    
    Write-Host "✓ API endpoint updated to: $backendUrl" -ForegroundColor Green
}

# Build frontend
Write-Host "  Building React application..." -ForegroundColor Gray
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    exit 1
}

# Get Static Web App deployment token
Write-Host "  Getting deployment token..." -ForegroundColor Gray
$deployToken = az staticwebapp secrets list `
    --name $FRONTEND_NAME `
    --resource-group $RESOURCE_GROUP `
    --query "properties.apiKey" `
    --output tsv

if ($deployToken) {
    Write-Host "✓ Deployment token retrieved" -ForegroundColor Green
    
    # Check if SWA CLI is installed
    $swaInstalled = Get-Command swa -ErrorAction SilentlyContinue
    
    if ($swaInstalled) {
        Write-Host "  Deploying to Static Web App..." -ForegroundColor Gray
        swa deploy --app-location ./dist --deployment-token $deployToken
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Frontend deployed successfully!" -ForegroundColor Green
        } else {
            Write-Host "✗ Frontend deployment failed" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ SWA CLI not installed. Install with: npm install -g @azure/static-web-apps-cli" -ForegroundColor Yellow
        Write-Host "  Then run: swa deploy --app-location ./dist --deployment-token $deployToken" -ForegroundColor Cyan
    }
} else {
    Write-Host "✗ Could not retrieve deployment token" -ForegroundColor Red
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n📊 Your Application URLs:" -ForegroundColor Yellow
Write-Host "  Backend:  https://$BACKEND_NAME.azurewebsites.net" -ForegroundColor Green
Write-Host "  Frontend: https://thankful-desert-00777a80f.6.azurestaticapps.net" -ForegroundColor Green

Write-Host "`n🧪 Test Backend Health:" -ForegroundColor Yellow
Write-Host "  curl https://$BACKEND_NAME.azurewebsites.net/health" -ForegroundColor Gray

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Test the health endpoint" -ForegroundColor White
Write-Host "  2. Visit the frontend URL" -ForegroundColor White
Write-Host "  3. Test creating a case and getting recommendations" -ForegroundColor White
Write-Host "  4. Enable Application Insights for monitoring" -ForegroundColor White

Write-Host "`n💡 Tip: View logs at:" -ForegroundColor Yellow
Write-Host "  Azure Portal -> $BACKEND_NAME -> Log stream" -ForegroundColor Gray

cd $PSScriptRoot
