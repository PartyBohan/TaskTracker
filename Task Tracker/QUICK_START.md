# Quick Start Guide - Shared Cloud Storage

## For Shared Access (Anyone can view progress)

### Option 1: Firebase Cloud Storage (Recommended)

1. **Follow the setup in `FIREBASE_SETUP.md`**
2. Once configured, your tasks will automatically sync to the cloud
3. Anyone who opens the website will see the same tasks and progress
4. Changes update in real-time across all devices

### Option 2: Local Storage Only (Current Default)

- Tasks are stored locally in your browser
- Only visible on the same device/browser
- Use Export/Import to share between devices

## How It Works

### With Firebase Enabled:
- ✅ Tasks stored in cloud database
- ✅ Real-time updates (see changes instantly)
- ✅ Shared access (anyone can view)
- ✅ Works across all devices
- ✅ Automatic sync

### Without Firebase:
- ✅ Tasks stored locally
- ✅ Export/Import for sharing
- ✅ Works offline
- ⚠️ Only visible on same browser

## Status Indicators

Look for the sync status in the header:
- **✅ Connected** - Synced with cloud
- **🔄 Syncing...** - Currently syncing
- **⚠️ Not configured** - Using local storage only
- **❌ Error** - Connection issue

## Next Steps

1. **To enable sharing**: Set up Firebase (see `FIREBASE_SETUP.md`)
2. **To use locally only**: Just use the app - it works without setup!
3. **To share manually**: Use Export/Import buttons

