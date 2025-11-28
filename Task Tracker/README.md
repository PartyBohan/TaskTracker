# 🐰 Labubu To-Do List

A beautiful, feature-rich task tracker application with a cute Labubu theme! Track your daily tasks, maintain streaks, and manage your routine with this delightful web app.

![Labubu To-Do List](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🎯 **Task Management**: Add, complete, and delete tasks with dates and times
- 🔥 **Streak Tracking**: Track your daily completion streak (30-day challenge)
- 📊 **Progress Bars**: Visual progress indicators for overall and daily completion
- 📋 **Daily Routine**: Create and apply reusable daily routines
- 💾 **Data Export/Import**: Backup and restore your data as JSON files
- ☁️ **Cloud Sync**: Optional Firebase integration for real-time sharing across devices
- 🎨 **Beautiful UI**: Cute Labubu-themed design with animations
- 📱 **Responsive**: Works on desktop and mobile devices

## 🚀 Quick Start

### Option 1: Use Locally (No Setup Required)

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd task-tracker
   ```

2. Open `index.html` in your web browser, or use a local server:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

3. Start adding tasks! Your data will be saved locally in your browser.

### Option 2: Host on GitHub Pages (Free Online Hosting)

To make your app accessible online for free:

1. Push your code to a GitHub repository
2. Follow the guide in [`GITHUB_PAGES_SETUP.md`](GITHUB_PAGES_SETUP.md)
3. Enable GitHub Pages in your repository settings
4. Your app will be live at `https://yourusername.github.io/repository-name/`

### Option 3: Enable Cloud Sharing (Firebase)

For real-time synchronization across devices and users:

1. Follow the setup guide in [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md)
2. Configure your Firebase credentials in `firebase-config.js`
3. Your tasks will now sync in real-time!

## 📁 Project Structure

```
task-tracker/
├── index.html              # Main HTML file
├── style.css               # Stylesheet
├── script.js               # Main JavaScript logic
├── firebase-config.js      # Firebase configuration (needs setup)
├── images/                 # Labubu images folder
│   ├── README.md          # Image requirements
│   └── IMAGE_LIST.txt     # List of needed images
├── README.md              # This file
├── QUICK_START.md         # Quick start guide
├── FIREBASE_SETUP.md      # Firebase setup instructions
└── DATA_STORAGE_GUIDE.md  # Data storage documentation
```

## 🎨 Customization

### Adding Labubu Images

Place your Labubu images in the `images/` folder:
- `labubu-icon.png` - Header icon (50x50px recommended)
- `labubu-smile.png` - Celebration animation (200x200px recommended)
- `labubu-empty.png` - Empty state image (150x150px recommended)

If images are not found, the app will automatically fall back to emoji characters (🐰).

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - How to host on GitHub Pages
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase cloud sync setup
- **[DATA_STORAGE_GUIDE.md](DATA_STORAGE_GUIDE.md)** - Data storage and backup guide

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript (Vanilla)** - Functionality
- **Firebase Firestore** - Optional cloud storage
- **LocalStorage API** - Local data persistence

## 📝 Features in Detail

### Task Management
- Add tasks with custom dates and times
- Mark tasks as completed
- Delete tasks
- View tasks for today and past dates

### Streak System
- Track consecutive days of task completion
- 30-day challenge progress
- Automatic streak reset if you miss a day

### Daily Routine
- Create reusable daily routine templates
- Apply routine to today's tasks with one click
- Manage routine tasks with times

### Data Management
- Export all data to JSON file
- Import data from JSON backup
- Automatic local storage backup
- Cloud sync with Firebase (optional)

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Inspired by the cute Labubu character
- Built with love for productivity and organization

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ and 🐰**

