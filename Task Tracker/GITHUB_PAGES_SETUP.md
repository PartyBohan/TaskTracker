# GitHub Pages Setup Guide

This guide will help you host your Labubu To-Do List on GitHub Pages so anyone can access it online!

## Step 1: Enable GitHub Pages

1. Go to your GitHub repository on GitHub.com
2. Click on **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Folder**: `/ (root)` 
5. Click **Save**

## Step 2: Wait for Deployment

- GitHub will build and deploy your site (usually takes 1-2 minutes)
- You'll see a message: "Your site is live at `https://yourusername.github.io/repository-name/`"
- The URL will be displayed in green

## Step 3: Access Your Site

Your site will be available at:
```
https://yourusername.github.io/repository-name/
```

Replace:
- `yourusername` with your GitHub username
- `repository-name` with your repository name

## Troubleshooting

### Still Getting 404?

1. **Wait a few minutes** - GitHub Pages can take 1-5 minutes to deploy
2. **Check the repository is public** - Private repos need GitHub Pro for Pages
3. **Verify the branch** - Make sure you selected the correct branch (usually `main`)
4. **Check the folder** - Should be `/ (root)` for this project
5. **Clear browser cache** - Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Common Issues

**"Page build failed"**
- Check that `index.html` is in the root directory
- Make sure all file paths are relative (not absolute)
- Check for any syntax errors in your files

**"404 Not Found"**
- Make sure GitHub Pages is enabled in Settings
- Verify the repository name matches the URL
- Wait a few minutes for deployment

**"Styles/CSS not loading"**
- Check that `style.css` is in the root directory
- Verify the path in `index.html` is correct: `href="style.css"`
- Make sure file names match exactly (case-sensitive)

**"JavaScript not working"**
- Check that `script.js` and `firebase-config.js` are in the root directory
- Verify the paths in `index.html` are correct
- Open browser console (F12) to check for errors

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to your repository root with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with your custom domain

## Updating Your Site

Every time you push changes to your `main` branch, GitHub Pages will automatically rebuild and deploy your site. Changes usually appear within 1-5 minutes.

## Testing Locally Before Deploying

Before pushing to GitHub, test locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser to verify everything works.

