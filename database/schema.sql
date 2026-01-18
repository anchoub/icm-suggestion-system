-- Create schema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'icm')
BEGIN
    EXEC('CREATE SCHEMA icm')
END
GO

-- Drop table if exists (for clean setup)
IF OBJECT_ID('icm.Cases', 'U') IS NOT NULL
    DROP TABLE icm.Cases
GO

-- Create Cases table
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
    CreatedDate DATETIME DEFAULT GETDATE() NOT NULL,
    ModifiedDate DATETIME,
    
    -- Constraints
    CONSTRAINT CK_Cases_Severity CHECK (Severity IN ('Critical', 'High', 'Medium', 'Low')),
    CONSTRAINT CK_Cases_Status CHECK (CaseStatus IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Pending'))
)
GO

-- Create indexes for better query performance
CREATE INDEX IX_Cases_Product ON icm.Cases(Product)
GO

CREATE INDEX IX_Cases_Severity ON icm.Cases(Severity)
GO

CREATE INDEX IX_Cases_Status ON icm.Cases(CaseStatus)
GO

CREATE INDEX IX_Cases_CreatedDate ON icm.Cases(CreatedDate DESC)
GO

-- Optional: Create a view for active cases
CREATE VIEW icm.ActiveCases AS
SELECT *
FROM icm.Cases
WHERE CaseStatus IN ('Open', 'In Progress')
GO

PRINT 'Database schema created successfully!'
PRINT 'Table: icm.Cases'
PRINT 'View: icm.ActiveCases'
