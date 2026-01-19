-- Sample data for testing the ICM Suggestion System

-- Insert sample cases with ICM information
INSERT INTO icm.Cases (CaseTitle, CaseDescription, Product, Component, Severity, Priority, Environment, Region, ErrorCodes, ErrorMessage, CaseStatus, ResolutionNotes, ICMNumber, ICMOpenedDate, ICMDescription, DaysDelayedBeforeICM, CreatedDate)
VALUES 
('Azure VM fails to start after reboot', 
 'Virtual machine in West US region fails to boot after scheduled maintenance. Error code: VMStartTimedOut', 
 'Azure Virtual Machines', 'Compute', 'High', 'P1', 'Production', 'West US', 
 'VMStartTimedOut', 'The VM failed to start within the expected time frame', 
 'Resolved', 'Deallocated and reallocated VM to different host. Issue resolved.',
 'ICM-2024-001234', DATEADD(DAY, -150, GETDATE()), 'VM startup failure requiring host reallocation', 5, DATEADD(DAY, -155, GETDATE())),

('Database connection timeout in production', 
 'Application experiencing intermittent database connection timeouts during peak hours. Multiple connection attempts failing with timeout errors.', 
 'Azure SQL Database', 'Database Engine', 'Critical', 'P0', 'Production', 'East US', 
 'ConnectionTimeout', 'Connection timeout: The timeout period elapsed while attempting to consume the pre-login handshake', 
 'Open', NULL,
 'ICM-2024-002567', DATEADD(DAY, -120, GETDATE()), 'SQL Database connectivity issues during peak load', 3, DATEADD(DAY, -123, GETDATE())),

('Authentication failure with Azure AD', 
 'Users unable to authenticate using SSO with Azure Active Directory. Error occurs during login redirect.', 
 'Azure Active Directory', 'Authentication', 'High', 'P1', 'Production', 'Global', 
 'AADSTS50058', 'A silent sign-in request was sent but no user is signed in', 
 'Resolved', 'Issue caused by expired token cache. Cleared cache and re-authenticated.',
 NULL, NULL, NULL, NULL, DATEADD(DAY, -100, GETDATE())),

('Storage blob upload fails with 500 error', 
 'Blob storage upload operations failing randomly with HTTP 500 internal server error. Intermittent issue affecting 10% of requests.', 
 'Azure Storage', 'Blob Storage', 'Medium', 'P2', 'Staging', 'West Europe', 
 'InternalError', 'HTTP 500: Internal Server Error', 
 'In Progress', NULL,
 'ICM-2024-003891', DATEADD(DAY, -90, GETDATE()), 'Blob storage internal errors requiring backend investigation', 7, DATEADD(DAY, -97, GETDATE())),

('VM performance degradation after update', 
 'Significant performance slowdown on Azure VMs following recent platform update. CPU usage normal but I/O operations delayed.', 
 'Azure Virtual Machines', 'Compute', 'Medium', 'P2', 'Production', 'East US', 
 NULL, NULL, 'Open', NULL,
 'ICM-2024-004123', DATEADD(DAY, -75, GETDATE()), 'Platform update causing VM I/O performance issues', 4, DATEADD(DAY, -79, GETDATE())),

('Function app cold start timeout', 
 'Azure Function cold start taking over 30 seconds, causing timeout errors for HTTP triggers.', 
 'Azure Functions', 'Runtime', 'High', 'P1', 'Production', 'Central US', 
 'FunctionTimeout', 'Function execution timeout after 30000ms', 
 'Resolved', 'Switched to Premium plan with pre-warmed instances.',
 NULL, NULL, NULL, NULL, DATEADD(DAY, -60, GETDATE())),

('Cosmos DB throttling errors', 
 'Receiving 429 throttling errors from Cosmos DB during normal load. RU consumption appears normal.', 
 'Azure Cosmos DB', 'Core SQL', 'High', 'P1', 'Production', 'Southeast Asia', 
 'TooManyRequests', 'Request rate is large. More info: https://aka.ms/cosmosdb-error-429', 
 'Open', NULL,
 'ICM-2025-000456', DATEADD(DAY, -45, GETDATE()), 'Cosmos DB throttling despite adequate RU provisioning', 6, DATEADD(DAY, -51, GETDATE())),

('Application Gateway 502 errors', 
 'Intermittent 502 Bad Gateway errors from Application Gateway. Backend pool health shows as healthy.', 
 'Azure Application Gateway', 'Gateway', 'Critical', 'P0', 'Production', 'West US', 
 'BadGateway', 'HTTP 502: Bad Gateway', 
 'In Progress', NULL,
 'ICM-2025-000789', DATEADD(DAY, -30, GETDATE()), 'Application Gateway returning 502 errors with healthy backends', 2, DATEADD(DAY, -32, GETDATE())),

('Key Vault access denied', 
 'Application unable to retrieve secrets from Key Vault. Access policy appears correct.', 
 'Azure Key Vault', 'Secrets', 'High', 'P1', 'Production', 'North Europe', 
 'Forbidden', 'The user, group or application does not have secrets get permission', 
 'Resolved', 'Updated managed identity permissions. Required propagation time of 5 minutes.',
 NULL, NULL, NULL, NULL, DATEADD(DAY, -20, GETDATE())),

('Container instance startup failure', 
 'Container instances failing to start with ImagePullFailed error. Image exists in registry.', 
 'Azure Container Instances', 'Compute', 'Medium', 'P2', 'Development', 'West US', 
 'ImagePullFailed', 'Failed to pull image: unauthorized', 
 'Resolved', 'Updated registry credentials and image pull secret.',
 'ICM-2025-001234', DATEADD(DAY, -10, GETDATE()), 'Container image pull authentication failures', 8, DATEADD(DAY, -18, GETDATE()));

PRINT 'Sample data inserted successfully!'
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' cases created.'

-- Display inserted cases
SELECT CaseID, CaseTitle, Product, Severity, CaseStatus, ICMNumber, DaysDelayedBeforeICM
FROM icm.Cases 
ORDER BY CaseID;
