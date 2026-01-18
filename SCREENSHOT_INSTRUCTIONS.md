# How to Add Your Azure Screenshot as Background

## Step 1: Save Your Screenshot

From the image you shared in the chat:
1. Right-click the Azure Support Center screenshot
2. Save it as `azure-case-bg.png`

## Step 2: Copy to Frontend

Place the file here:
```
C:\Users\anchoub\icm-suggestion-system\frontend\public\azure-case-bg.png
```

Replace the placeholder file that's already there.

## What You'll See

After adding the screenshot and refreshing:

✅ **Black and white monochromatic theme**
   - All UI elements in grayscale
   - Black notification icon
   - Black modal backgrounds with white text

✅ **Your Azure screenshot as background**
   - Full screen background
   - Grayscale filter applied
   - No UI elements covering the case details

✅ **ICM notification at right corner**
   - Black flag icon with white interior
   - Badge showing "3" alerts
   - Positioned at top-right (120px from top, 30px from right)
   - Hover to see: "ICM Needed - 87% confidence - 3 similar cases"

✅ **Clean overlay**
   - No case form shown initially
   - Just the notification icon on your Azure background
   - Click notification to see details
   - Click "Create ICM" to show escalate form

## Current State

The app is now configured to:
- Show ONLY the notification icon initially
- Display your Azure Support Center background (grayscale)
- Not show any case form until you interact with the notification
- Use black and white colors throughout

Just replace the placeholder image with your actual screenshot!
