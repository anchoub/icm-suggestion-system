-- Migration script to add ICM tracking fields to existing database
-- Run this if you already have the icm.Cases table created

-- Check if columns already exist before adding them
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('icm.Cases') 
    AND name = 'ICMNumber'
)
BEGIN
    ALTER TABLE icm.Cases
    ADD ICMNumber NVARCHAR(100) NULL;
    PRINT 'Added ICMNumber column';
END
ELSE
BEGIN
    PRINT 'ICMNumber column already exists';
END

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('icm.Cases') 
    AND name = 'ICMOpenedDate'
)
BEGIN
    ALTER TABLE icm.Cases
    ADD ICMOpenedDate DATETIME NULL;
    PRINT 'Added ICMOpenedDate column';
END
ELSE
BEGIN
    PRINT 'ICMOpenedDate column already exists';
END

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('icm.Cases') 
    AND name = 'ICMDescription'
)
BEGIN
    ALTER TABLE icm.Cases
    ADD ICMDescription NVARCHAR(MAX) NULL;
    PRINT 'Added ICMDescription column';
END
ELSE
BEGIN
    PRINT 'ICMDescription column already exists';
END

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('icm.Cases') 
    AND name = 'DaysDelayedBeforeICM'
)
BEGIN
    ALTER TABLE icm.Cases
    ADD DaysDelayedBeforeICM INT NULL;
    PRINT 'Added DaysDelayedBeforeICM column';
END
ELSE
BEGIN
    PRINT 'DaysDelayedBeforeICM column already exists';
END

GO

PRINT 'Migration completed successfully!';
PRINT 'ICM tracking fields are now available in icm.Cases table';
