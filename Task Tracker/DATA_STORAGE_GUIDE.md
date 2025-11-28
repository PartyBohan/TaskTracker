# Data Storage Guide

Your Labubu To-Do List data is stored in multiple ways to ensure you never lose your progress!

## Storage Methods

### 1. **Local Storage (Automatic)**
- Your data is automatically saved to your browser's local storage
- Works on the same browser and device
- Data persists even after closing the browser
- **Location**: Browser's local storage (not visible as files)

### 2. **Export to File (Manual Backup)**
- Click the "💾 Export Data" button to save your data to a JSON file
- The file will be saved to your Downloads folder
- File name format: `labubu-todo-backup-YYYY-MM-DD.json`
- **Use this for**: Backing up your data, transferring to another device, or keeping a copy

### 3. **Import from File (Restore Backup)**
- Click the "📥 Import Data" button to restore from a backup file
- Select the JSON backup file you previously exported
- **Warning**: This will replace your current data

## How to Use Across Devices

### Option 1: Export/Import Method
1. On your first device: Click "💾 Export Data" to save your data
2. Transfer the JSON file to your other device (email, cloud storage, USB, etc.)
3. On your second device: Click "📥 Import Data" and select the file

### Option 2: Cloud Storage Services
You can use cloud storage services to sync your backup file:

- **Google Drive**: Upload your exported JSON file
- **Dropbox**: Sync your exported JSON file
- **iCloud**: Store your exported JSON file
- **OneDrive**: Keep your exported JSON file synced

**How it works:**
1. Export your data regularly (daily/weekly)
2. Store the JSON file in your cloud storage folder
3. Access it from any device
4. Import when needed

### Option 3: Manual File Management
- Keep your exported JSON files in a safe location
- Name them with dates: `labubu-backup-2024-01-15.json`
- Create regular backups (daily/weekly)

## Automatic Features

- **Auto-save**: Data saves automatically when you add/complete/delete tasks
- **Auto-backup**: Every 10 saves, an automatic backup is created in local storage
- **Last save timestamp**: Tracks when data was last saved

## Data Format

The exported JSON file contains:
- All your tasks (with dates, times, completion status)
- Your streak data (current day, completed days, start date)
- Export timestamp
- Version information

## Tips

1. **Regular Backups**: Export your data weekly or before important dates
2. **Multiple Copies**: Keep backups in different locations
3. **Before Major Changes**: Export before clearing browser data
4. **Cross-Device Sync**: Use cloud storage for seamless access

## Troubleshooting

**Lost my data?**
- Check if you have an exported backup file
- Check browser's local storage (data might still be there)
- Look for automatic backups in localStorage

**Can't import?**
- Make sure the file is a valid JSON file exported from this app
- Check that the file isn't corrupted
- Try exporting fresh data first to see the format

**Data not syncing?**
- Local storage is browser-specific
- Use Export/Import for cross-device access
- Consider using cloud storage for automatic syncing

