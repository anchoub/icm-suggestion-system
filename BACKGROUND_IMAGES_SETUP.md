# Background Images Setup

To complete the UI with your Azure Support Center screenshots:

## Step 1: Save Your Screenshots

1. Save your first screenshot (Azure Support Center case view) as `azure-case-bg.png`
2. Save your second screenshot (Escalate case form) as `escalate-form-bg.png`

## Step 2: Add Images to Frontend

Place both PNG files in the following directory:
```
C:\Users\anchoub\icm-suggestion-system\frontend\public\
```

## What You'll Get:

### Main View:
- Background: Azure Support Center case interface
- Right side: **Red flag notification icon** (animated, pulsing)
- Hover on flag: Tooltip showing:
  - Confidence Score (e.g., 87%)
  - Number of similar cases
  - "Click to view details"

### When You Click the Flag:
Modal appears showing:
- **Reasons for ICM Recommendation:**
  - 🔴 High Confidence Score: 87% (Above 80% threshold)
  - 📋 Similar Cases Found: 5 cases with high similarity
  - ⚡ High Severity Cases: Similar cases include Severity 1 or 2
  - ⚠️ Duplicate Risk: May result in duplicate incidents
- Top 3 similar cases with details
- Two buttons: "Review Similar Cases" and "Create ICM"

### When You Click "Create ICM":
- Background switches to escalate case form view
- Shows the escalate form with:
  - Pre-filled case data (title, description, product, severity)
  - Template selection (AzureRT SEV3 to EEE)
  - **AI Recommendation banner**: "Similar case with 87% confidence was escalated successfully"
  - "Cancel" and "Next" buttons

## Features:
- ✅ Flag icon positioned on right side (not top header)
- ✅ Detailed reasons for ICM recommendation
- ✅ Confidence score display
- ✅ Background image switching
- ✅ Frosted glass UI overlays
- ✅ AI insights in escalate form
- ✅ Professional Azure theme styling

## Note:
The placeholder files have been created. Replace them with your actual screenshots for the full visual experience!
