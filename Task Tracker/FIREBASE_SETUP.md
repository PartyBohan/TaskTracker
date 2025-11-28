# Firebase Cloud Storage Setup Guide

This guide will help you set up Firebase so your tasks can be shared and viewed by anyone who opens the website.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "Labubu Todo List")
4. Follow the setup wizard (you can disable Google Analytics if you want)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in test mode" (for now - you can secure it later)
4. Select a location closest to you
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app (you can name it "Labubu Todo")
6. Copy the `firebaseConfig` object that appears

## Step 4: Configure the App

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 5: Set Up Firestore Rules (Important!)

1. Go to Firestore Database → Rules tab
2. Replace the rules with this (allows read/write for everyone):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: This makes your data publicly accessible. For production, you should add authentication.

## Step 6: Test It!

1. Open `index.html` in your browser
2. Add a task - it should sync to Firebase
3. Open the same page in another browser/device - you should see the same tasks!

## Security (Optional but Recommended)

For better security, you can:
1. Enable Firebase Authentication
2. Update Firestore rules to require authentication
3. Add user-specific data paths

## Troubleshooting

**Tasks not syncing?**
- Check browser console for errors
- Verify Firebase config is correct
- Make sure Firestore is enabled
- Check Firestore rules allow read/write

**Can't see shared data?**
- Make sure both browsers are using the same Firebase project
- Check that data was saved (look in Firestore console)
- Refresh the page

## Free Tier Limits

Firebase free tier includes:
- 1 GB storage
- 50K reads/day
- 20K writes/day
- 20K deletes/day

This should be plenty for personal use!

