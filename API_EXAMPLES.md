# API Examples

## Health Check

### Request
```bash
curl -X GET http://localhost:8000/health
```

### Response (200 OK)
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T23:17:00.123456",
  "database": "connected",
  "model_loaded": true
}
```

---

## Create Case

### Request
```bash
curl -X POST http://localhost:8000/create_case \
  -H "Content-Type: application/json" \
  -d '{
    "CaseTitle": "Azure VM fails to start",
    "CaseDescription": "Virtual machine in West US fails to boot after maintenance",
    "Product": "Azure Virtual Machines",
    "Component": "Compute",
    "Severity": "High",
    "Priority": "P1",
    "Environment": "Production",
    "Region": "West US",
    "ErrorCodes": "VMStartTimedOut",
    "ErrorMessage": "The VM failed to start within the expected time frame"
  }'
```

### Response (200 OK)
```json
{
  "CaseID": 123,
  "CaseTitle": "Azure VM fails to start",
  "CaseDescription": "Virtual machine in West US fails to boot after maintenance",
  "Product": "Azure Virtual Machines",
  "Component": "Compute",
  "Severity": "High",
  "Priority": "P1",
  "CustomerTier": null,
  "SLAImpact": null,
  "Environment": "Production",
  "Region": "West US",
  "Tenant": null,
  "ErrorCodes": "VMStartTimedOut",
  "ErrorMessage": "The VM failed to start within the expected time frame",
  "StackTrace": null,
  "AttachmentsJson": null,
  "LogLinksJson": null,
  "TroubleshootingSteps": null,
  "CaseStatus": "Open",
  "ResolutionNotes": null,
  "AssignedTeam": null,
  "AssignedTo": null,
  "Account": null,
  "Tags": null,
  "CreatedDate": "2026-01-17T23:17:30.456789",
  "ModifiedDate": null
}
```

---

## Get Recommendations

### Request
```bash
curl -X POST http://localhost:8000/recommend_icm \
  -H "Content-Type: application/json" \
  -d '{
    "case_title": "VM won'\''t boot after update",
    "case_description": "Azure VM experiencing boot failure after platform update in West US region",
    "product": "Azure Virtual Machines",
    "error_message": "VM start timeout error",
    "top_k": 5
  }'
```

### Response - High Similarity (200 OK)
```json
{
  "similar_cases": [
    {
      "case": {
        "CaseID": 1,
        "CaseTitle": "Azure VM fails to start after reboot",
        "CaseDescription": "Virtual machine in West US region fails to boot after scheduled maintenance",
        "Product": "Azure Virtual Machines",
        "Component": "Compute",
        "Severity": "High",
        "Priority": "P1",
        "Environment": "Production",
        "Region": "West US",
        "ErrorCodes": "VMStartTimedOut",
        "ErrorMessage": "The VM failed to start within the expected time frame",
        "CaseStatus": "Resolved",
        "ResolutionNotes": "Deallocated and reallocated VM to different host. Issue resolved.",
        "CreatedDate": "2026-01-15T10:30:00",
        "ModifiedDate": "2026-01-15T14:20:00"
      },
      "similarity_score": 0.87
    },
    {
      "case": {
        "CaseID": 5,
        "CaseTitle": "VM performance degradation after update",
        "CaseDescription": "Significant performance slowdown on Azure VMs following recent platform update",
        "Product": "Azure Virtual Machines",
        "Component": "Compute",
        "Severity": "Medium",
        "Priority": "P2",
        "Environment": "Production",
        "Region": "East US",
        "CaseStatus": "Open",
        "CreatedDate": "2026-01-16T09:15:00",
        "ModifiedDate": null
      },
      "similarity_score": 0.76
    },
    {
      "case": {
        "CaseID": 3,
        "CaseTitle": "Authentication failure with Azure AD",
        "CaseDescription": "Users unable to authenticate using SSO",
        "Product": "Azure Active Directory",
        "Severity": "High",
        "Priority": "P1",
        "CaseStatus": "Resolved",
        "CreatedDate": "2026-01-14T16:00:00"
      },
      "similarity_score": 0.42
    }
  ],
  "alert_threshold_reached": true,
  "recommend_icm": true,
  "highest_similarity": 0.87
}
```

### Response - Low Similarity (200 OK)
```json
{
  "similar_cases": [
    {
      "case": {
        "CaseID": 7,
        "CaseTitle": "Cosmos DB throttling errors",
        "CaseDescription": "Receiving 429 throttling errors",
        "Product": "Azure Cosmos DB",
        "Severity": "High",
        "Priority": "P1",
        "CaseStatus": "Open",
        "CreatedDate": "2026-01-17T08:00:00"
      },
      "similarity_score": 0.23
    }
  ],
  "alert_threshold_reached": false,
  "recommend_icm": false,
  "highest_similarity": 0.23
}
```

### Response - No Cases in Database (200 OK)
```json
{
  "similar_cases": [],
  "alert_threshold_reached": false,
  "recommend_icm": false,
  "highest_similarity": 0.0
}
```

---

## List Cases

### Request
```bash
curl -X GET "http://localhost:8000/cases?limit=10&offset=0"
```

### Response (200 OK)
```json
[
  {
    "CaseID": 10,
    "CaseTitle": "Container instance startup failure",
    "CaseDescription": "Container instances failing to start with ImagePullFailed error",
    "Product": "Azure Container Instances",
    "Severity": "Medium",
    "Priority": "P2",
    "CaseStatus": "Resolved",
    "CreatedDate": "2026-01-17T12:00:00"
  },
  {
    "CaseID": 9,
    "CaseTitle": "Key Vault access denied",
    "CaseDescription": "Application unable to retrieve secrets from Key Vault",
    "Product": "Azure Key Vault",
    "Severity": "High",
    "Priority": "P1",
    "CaseStatus": "Resolved",
    "CreatedDate": "2026-01-17T10:30:00"
  }
]
```

---

## Get Specific Case

### Request
```bash
curl -X GET http://localhost:8000/cases/1
```

### Response (200 OK)
```json
{
  "CaseID": 1,
  "CaseTitle": "Azure VM fails to start after reboot",
  "CaseDescription": "Virtual machine in West US region fails to boot after scheduled maintenance. Error code: VMStartTimedOut",
  "Product": "Azure Virtual Machines",
  "Component": "Compute",
  "Severity": "High",
  "Priority": "P1",
  "CustomerTier": null,
  "SLAImpact": null,
  "Environment": "Production",
  "Region": "West US",
  "Tenant": null,
  "ErrorCodes": "VMStartTimedOut",
  "ErrorMessage": "The VM failed to start within the expected time frame",
  "StackTrace": null,
  "AttachmentsJson": null,
  "LogLinksJson": null,
  "TroubleshootingSteps": null,
  "CaseStatus": "Resolved",
  "ResolutionNotes": "Deallocated and reallocated VM to different host. Issue resolved.",
  "AssignedTeam": null,
  "AssignedTo": null,
  "Account": null,
  "Tags": null,
  "CreatedDate": "2026-01-15T10:30:00",
  "ModifiedDate": "2026-01-15T14:20:00"
}
```

### Response - Not Found (404)
```json
{
  "detail": "Case not found"
}
```

---

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "CaseTitle"],
      "msg": "Field required",
      "input": {},
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Failed to create case: Connection timeout"
}
```

---

## Python Examples

### Using requests library

```python
import requests

BASE_URL = "http://localhost:8000"

# Health check
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# Create case
case_data = {
    "CaseTitle": "Database timeout error",
    "CaseDescription": "Connection timeouts during peak hours",
    "Product": "Azure SQL Database",
    "Severity": "Critical",
    "Priority": "P0"
}
response = requests.post(f"{BASE_URL}/create_case", json=case_data)
created_case = response.json()
print(f"Created case #{created_case['CaseID']}")

# Get recommendations
recommendation_request = {
    "case_title": "DB connection issues",
    "case_description": "Intermittent database timeouts",
    "product": "Azure SQL Database",
    "top_k": 5
}
response = requests.post(f"{BASE_URL}/recommend_icm", json=recommendation_request)
recommendations = response.json()

if recommendations['recommend_icm']:
    print("⚠️  WARNING: High similarity detected!")
    print(f"Highest similarity: {recommendations['highest_similarity']:.2%}")
    
for item in recommendations['similar_cases']:
    case = item['case']
    score = item['similarity_score']
    print(f"[{score:.2%}] Case #{case['CaseID']}: {case['CaseTitle']}")
```

---

## JavaScript/TypeScript Examples

### Using fetch

```typescript
const BASE_URL = 'http://localhost:8000';

// Health check
const healthCheck = async () => {
  const response = await fetch(`${BASE_URL}/health`);
  const data = await response.json();
  console.log(data);
};

// Create case
const createCase = async () => {
  const caseData = {
    CaseTitle: "Application Gateway 502 errors",
    CaseDescription: "Intermittent 502 errors from gateway",
    Product: "Azure Application Gateway",
    Severity: "Critical",
    Priority: "P0"
  };
  
  const response = await fetch(`${BASE_URL}/create_case`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(caseData)
  });
  
  const createdCase = await response.json();
  console.log(`Created case #${createdCase.CaseID}`);
};

// Get recommendations
const getRecommendations = async () => {
  const request = {
    case_title: "Gateway errors",
    case_description: "502 bad gateway errors occurring",
    product: "Azure Application Gateway",
    top_k: 5
  };
  
  const response = await fetch(`${BASE_URL}/recommend_icm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  
  const recommendations = await response.json();
  
  if (recommendations.recommend_icm) {
    console.warn('⚠️  High similarity detected!');
  }
  
  recommendations.similar_cases.forEach((item) => {
    console.log(
      `[${(item.similarity_score * 100).toFixed(1)}%] ` +
      `Case #${item.case.CaseID}: ${item.case.CaseTitle}`
    );
  });
};
```

---

## PowerShell Examples

```powershell
$baseUrl = "http://localhost:8000"

# Health check
$response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
Write-Host "Status: $($response.status)"
Write-Host "Model loaded: $($response.model_loaded)"

# Create case
$caseData = @{
    CaseTitle = "Storage blob upload failure"
    CaseDescription = "Upload operations failing with 500 error"
    Product = "Azure Storage"
    Severity = "High"
    Priority = "P1"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/create_case" `
    -Method Post `
    -ContentType "application/json" `
    -Body $caseData

Write-Host "Created case #$($response.CaseID)"

# Get recommendations
$recommendRequest = @{
    case_title = "Blob upload issues"
    case_description = "Random failures during blob upload"
    product = "Azure Storage"
    top_k = 5
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/recommend_icm" `
    -Method Post `
    -ContentType "application/json" `
    -Body $recommendRequest

if ($response.recommend_icm) {
    Write-Host "⚠️  WARNING: High similarity detected!" -ForegroundColor Yellow
}

foreach ($item in $response.similar_cases) {
    $score = [math]::Round($item.similarity_score * 100, 1)
    Write-Host "[$score%] Case #$($item.case.CaseID): $($item.case.CaseTitle)"
}
```

---

## Testing with Sample Data

### Step 1: Populate Database
```bash
cd backend
python populate_sample_data.py
```

### Step 2: Test Similar Case Detection
```bash
# This should trigger HIGH similarity (>= 0.80)
curl -X POST http://localhost:8000/recommend_icm \
  -H "Content-Type: application/json" \
  -d '{
    "case_title": "VM fails to start",
    "case_description": "Azure virtual machine in West US fails to boot after maintenance",
    "product": "Azure Virtual Machines",
    "error_message": "VM start timeout",
    "top_k": 5
  }'
```

### Expected Behavior:
- `alert_threshold_reached`: true (>= 0.75)
- `recommend_icm`: true (>= 0.80)
- Frontend should show notification bell AND modal

---

## OpenAPI Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json
