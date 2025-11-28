# GitHub Pages Deployment Checklist

## ✅ Pre-Deployment Checklist

1. **All files are in the root directory** (not in a subfolder)
   - ✅ index.html
   - ✅ script.js
   - ✅ style.css
   - ✅ firebase-config.js

2. **File names are correct** (case-sensitive)
   - ✅ index.html (lowercase, not Index.html or INDEX.HTML)

3. **All file paths are relative** (already correct)
   - ✅ style.css (not /style.css or ./style.css)
   - ✅ script.js (not /script.js)
   - ✅ firebase-config.js (not /firebase-config.js)

## 🚀 Deployment Steps

1. **Push all files to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** (top menu)
   - Scroll to **Pages** in left sidebar
   - Under **Source**, select:
     - **Branch**: `main` (or `master`)
     - **Folder**: `/ (root)`
   - Click **Save**

3. **Wait for deployment**
   - GitHub will show "Your site is live at..."
   - Usually takes 1-5 minutes
   - URL format: `https://yourusername.github.io/repository-name/`

## 🔍 Troubleshooting

### Page shows 404
- ✅ Check that `index.html` is in the root directory
- ✅ Verify GitHub Pages is enabled in Settings → Pages
- ✅ Wait 2-5 minutes for deployment
- ✅ Check the branch name matches (main vs master)

### Page loads but is blank
- ✅ Open browser console (F12) to check for errors
- ✅ Verify all files are uploaded (script.js, style.css, etc.)
- ✅ Check file paths are correct (relative, not absolute)

### JavaScript errors
- ✅ Check browser console for specific error messages
- ✅ Verify firebase-config.js exists (it's okay if Firebase isn't configured)
- ✅ App should work with local storage even without Firebase

### Styles not loading
- ✅ Verify style.css is in root directory
- ✅ Check that path in index.html is `href="style.css"` (relative)

## 📝 Important Notes

- **Firebase is optional**: The app works without Firebase (uses local storage)
- **Each user sees their own data** if Firebase isn't configured
- **Shared data requires Firebase setup** (see FIREBASE_SETUP.md)

## ✅ Verification

After deployment, your site should:
- ✅ Load without errors
- ✅ Show the Labubu To-Do List interface
- ✅ Allow adding tasks
- ✅ Save data to browser's local storage
- ✅ Work offline

If Firebase is configured:
- ✅ Tasks are shared across all users
- ✅ Real-time updates when others add tasks

