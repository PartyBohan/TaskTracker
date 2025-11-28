// State management
let tasks = [];
let routineTasks = []; // Daily routine template
let streakData = {
    startDate: null,
    currentDay: 1,
    completedDays: [],
    lastCheckDate: null
};

// Firebase initialization
let db = null;
let firebaseInitialized = false;

// Initialize Firebase if config is available
function initializeFirebase() {
    try {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            updateSyncStatus('offline', '⚠️ Not configured');
            console.log('Firebase SDK not loaded. Using local storage only.');
            return false;
        }
        
        // Check if config exists and is valid
        if (typeof firebaseConfig !== 'undefined' && firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            firebaseInitialized = true;
            updateSyncStatus('connected', '✅ Connected');
            setupFirebaseListeners();
            return true;
        } else {
            updateSyncStatus('offline', '⚠️ Not configured');
            console.log('Firebase not configured. Using local storage only.');
            return false;
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        updateSyncStatus('offline', '⚠️ Not configured');
        return false;
    }
}

// Setup real-time listeners for Firebase
function setupFirebaseListeners() {
    if (!firebaseInitialized || !db) return;
    
    // Listen for changes to tasks
    db.collection('labubuData').doc('tasks').onSnapshot((doc) => {
        if (doc.exists()) {
            const cloudTasks = doc.data().tasks || [];
            // Merge with local tasks (cloud takes priority for conflicts)
            syncTasksFromCloud(cloudTasks);
        }
    }, (error) => {
        console.error('Firebase listener error:', error);
        updateSyncStatus('error', '❌ Sync Error');
    });
    
    // Listen for changes to streak data
    db.collection('labubuData').doc('streak').onSnapshot((doc) => {
        if (doc.exists()) {
            const cloudStreak = doc.data();
            streakData = { ...streakData, ...cloudStreak };
            saveData(); // Save to localStorage
            updateProgress();
        }
    });
    
    // Listen for changes to routine
    db.collection('labubuData').doc('routine').onSnapshot((doc) => {
        if (doc.exists()) {
            const cloudRoutine = doc.data().routineTasks || [];
            routineTasks = cloudRoutine;
            saveData(); // Save to localStorage
            if (!document.getElementById('routine-manager').classList.contains('hidden')) {
                renderRoutineTasks();
            }
        }
    });
}

// Sync tasks from cloud (merge strategy)
function syncTasksFromCloud(cloudTasks) {
    // Create a map of existing tasks by ID
    const existingTasksMap = new Map(tasks.map(t => [t.id, t]));
    
    // Update or add tasks from cloud
    cloudTasks.forEach(cloudTask => {
        if (existingTasksMap.has(cloudTask.id)) {
            // Update existing task
            const index = tasks.findIndex(t => t.id === cloudTask.id);
            tasks[index] = cloudTask;
        } else {
            // Add new task
            tasks.push(cloudTask);
        }
    });
    
    // Save merged data
    saveData();
    renderTasks();
    updateProgress();
}

// Save data to Firebase
async function saveToFirebase() {
    if (!firebaseInitialized || !db) return;
    
    try {
        updateSyncStatus('syncing', '🔄 Syncing...');
        
        // Save tasks
        await db.collection('labubuData').doc('tasks').set({
            tasks: tasks,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Save streak data
        await db.collection('labubuData').doc('streak').set({
            ...streakData,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Save routine
        await db.collection('labubuData').doc('routine').set({
            routineTasks: routineTasks,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        updateSyncStatus('connected', '✅ Synced');
        
        // Reset to connected after 2 seconds
        setTimeout(() => {
            if (firebaseInitialized) {
                updateSyncStatus('connected', '✅ Connected');
            }
        }, 2000);
    } catch (error) {
        console.error('Firebase save error:', error);
        updateSyncStatus('error', '❌ Error');
    }
}

// Update sync status indicator
function updateSyncStatus(status, text) {
    const indicator = document.getElementById('sync-indicator');
    const syncText = document.getElementById('sync-text');
    
    if (indicator && syncText) {
        syncText.textContent = text;
        const statusEl = document.getElementById('sync-status');
        if (statusEl) {
            statusEl.className = `sync-status sync-${status}`;
        }
    }
}

// Load data from Firebase
async function loadFromFirebase() {
    if (!firebaseInitialized || !db) return;
    
    try {
        updateSyncStatus('syncing', '🔄 Loading...');
        
        // Load tasks
        const tasksDoc = await db.collection('labubuData').doc('tasks').get();
        if (tasksDoc.exists()) {
            const cloudTasks = tasksDoc.data().tasks || [];
            if (cloudTasks.length > 0) {
                // Merge: keep local tasks that don't exist in cloud, update existing ones
                const cloudTaskIds = new Set(cloudTasks.map(t => t.id));
                const localTasksToKeep = tasks.filter(t => !cloudTaskIds.has(t.id));
                tasks = [...cloudTasks, ...localTasksToKeep];
            }
        }
        
        // Load streak data (cloud takes priority)
        const streakDoc = await db.collection('labubuData').doc('streak').get();
        if (streakDoc.exists()) {
            const cloudStreak = streakDoc.data();
            delete cloudStreak.lastUpdated; // Remove Firebase timestamp
            if (cloudStreak.currentDay !== undefined) {
                streakData = { ...streakData, ...cloudStreak };
            }
        }
        
        // Load routine (cloud takes priority)
        const routineDoc = await db.collection('labubuData').doc('routine').get();
        if (routineDoc.exists()) {
            const cloudRoutine = routineDoc.data().routineTasks || [];
            if (cloudRoutine.length > 0) {
                routineTasks = cloudRoutine;
            }
        }
        
        // Save to localStorage as backup (but don't trigger Firebase save)
        localStorage.setItem('labubuTasks', JSON.stringify(tasks));
        localStorage.setItem('labubuStreak', JSON.stringify(streakData));
        localStorage.setItem('labubuRoutine', JSON.stringify(routineTasks));
        
        renderTasks();
        updateProgress();
        if (!document.getElementById('routine-manager').classList.contains('hidden')) {
            renderRoutineTasks();
        }
        
        updateSyncStatus('connected', '✅ Loaded');
        setTimeout(() => {
            updateSyncStatus('connected', '✅ Connected');
        }, 2000);
    } catch (error) {
        console.error('Firebase load error:', error);
        updateSyncStatus('error', '❌ Load Error');
        // Fall back to local storage
        loadData();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase first
    initializeFirebase();
    
    // Load from Firebase if available, otherwise from localStorage
    if (firebaseInitialized) {
        loadFromFirebase().then(() => {
            initializeUI();
            setupEventListeners();
            updateProgress();
        }).catch((error) => {
            console.error('Firebase load error:', error);
            // Fallback to local storage
            loadData();
            initializeUI();
            setupEventListeners();
            updateProgress();
        });
    } else {
        loadData();
        initializeUI();
        setupEventListeners();
        updateProgress();
    }
});

// Load data from localStorage
function loadData() {
    const savedTasks = localStorage.getItem('labubuTasks');
    const savedStreak = localStorage.getItem('labubuStreak');
    const savedRoutine = localStorage.getItem('labubuRoutine');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    
    if (savedStreak) {
        streakData = JSON.parse(savedStreak);
    } else {
        // Initialize streak data
        streakData.startDate = new Date().toISOString().split('T')[0];
        streakData.lastCheckDate = null;
    }
    
    if (savedRoutine) {
        routineTasks = JSON.parse(savedRoutine);
    }
    
    checkStreakContinuity();
}

// Save data to localStorage and Firebase
function saveData() {
    // Always save to localStorage first (backup)
    localStorage.setItem('labubuTasks', JSON.stringify(tasks));
    localStorage.setItem('labubuStreak', JSON.stringify(streakData));
    localStorage.setItem('labubuRoutine', JSON.stringify(routineTasks));
    
    // Also save a timestamp of last save
    localStorage.setItem('labubuLastSave', new Date().toISOString());
    
    // Create automatic backup every 10 saves
    const backupCount = parseInt(localStorage.getItem('labubuBackupCount') || '0') + 1;
    localStorage.setItem('labubuBackupCount', backupCount.toString());
    
    if (backupCount % 10 === 0) {
        // Auto-backup to localStorage as well
        localStorage.setItem('labubuTasksBackup', JSON.stringify(tasks));
        localStorage.setItem('labubuStreakBackup', JSON.stringify(streakData));
        localStorage.setItem('labubuRoutineBackup', JSON.stringify(routineTasks));
    }
    
    // Save to Firebase if initialized (async, don't wait)
    if (firebaseInitialized) {
        saveToFirebase();
    }
}

// Check if streak is still continuous
function checkStreakContinuity() {
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = streakData.lastCheckDate;
    
    if (!lastCheck) {
        streakData.currentDay = 1;
        if (streakData.completedDays.length === 0) {
            streakData.startDate = today;
        }
        return;
    }
    
    const lastCheckDate = new Date(lastCheck);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastCheckDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        // Same day, keep current day
        return;
    } else if (diffDays === 1) {
        // Consecutive day - check if previous day was completed
        if (!streakData.completedDays.includes(lastCheck)) {
            // Previous day wasn't completed, reset
            streakData.currentDay = 1;
            streakData.completedDays = [];
            streakData.startDate = today;
        }
        // If previous day was completed, currentDay will be updated when today is completed
    } else {
        // Streak broken (more than 1 day gap), reset
        streakData.currentDay = 1;
        streakData.completedDays = [];
        streakData.startDate = today;
    }
    
    // Update current day based on completed days
    if (streakData.completedDays.length > 0) {
        const sortedDays = streakData.completedDays.sort();
        let consecutiveCount = 1;
        for (let i = sortedDays.length - 1; i > 0; i--) {
            const current = new Date(sortedDays[i]);
            const previous = new Date(sortedDays[i - 1]);
            const diff = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
                consecutiveCount++;
            } else {
                break;
            }
        }
        streakData.currentDay = Math.min(consecutiveCount, 30);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Export/Import functionality
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Routine functionality
    document.getElementById('manage-routine-btn').addEventListener('click', toggleRoutineManager);
    document.getElementById('close-routine-btn').addEventListener('click', toggleRoutineManager);
    document.getElementById('add-routine-task-btn').addEventListener('click', addRoutineTask);
    document.getElementById('routine-task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addRoutineTask();
        }
    });
    document.getElementById('save-routine-btn').addEventListener('click', saveRoutine);
    document.getElementById('clear-routine-btn').addEventListener('click', clearRoutine);
    document.getElementById('apply-routine-btn').addEventListener('click', applyRoutineToToday);
    
    // Event delegation for dynamically created elements
    const tasksList = document.getElementById('tasks-list');
    if (tasksList) {
        tasksList.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                toggleTask(taskId);
            }
        });
        
        tasksList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const taskId = parseInt(e.target.getAttribute('data-task-id'));
                deleteTask(taskId);
            }
        });
    }
    
    // Event delegation for routine tasks
    const routineTasksList = document.getElementById('routine-tasks-list');
    if (routineTasksList) {
        routineTasksList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-routine-btn')) {
                const routineId = parseInt(e.target.getAttribute('data-routine-id'));
                deleteRoutineTask(routineId);
            }
        });
    }
    
}

// Add new task
function addTask() {
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const timeInput = document.getElementById('task-time');
    const taskText = input.value.trim();
    const taskDate = dateInput.value || new Date().toISOString().split('T')[0];
    const taskTime = timeInput.value || '00:00';
    
    if (!taskText) {
        alert('🐰 Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        date: taskDate,
        time: taskTime,
        completedDates: []
    };
    
    tasks.push(task);
    input.value = '';
    dateInput.value = '';
    timeInput.value = '';
    
    saveData();
    renderTasks();
    updateProgress();
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveData();
    renderTasks();
    updateProgress();
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const today = new Date().toISOString().split('T')[0];
    const taskDate = new Date(task.date);
    const todayDate = new Date(today);
    
    // Check if task date matches today or is in the past
    if (taskDate > todayDate) {
        alert('🐰 This task is scheduled for a future date!');
        return;
    }
    
    // Check if task is already completed today
    const isCompletedToday = task.completedDates.includes(today);
    
    if (!isCompletedToday) {
        // Mark as completed for today
        if (!task.completedDates.includes(today)) {
            task.completedDates.push(today);
        }
        
        // Trigger firework animation
        createFirework();
        
        // Check if all tasks are completed for today
        setTimeout(() => {
            checkAllTasksCompleted();
        }, 500);
    } else {
        // Unchecking - remove today's completion
        task.completedDates = task.completedDates.filter(d => d !== today);
    }
    
    saveData();
    renderTasks();
    updateProgress();
}

// Check if all tasks for today are completed
function checkAllTasksCompleted() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate <= today;
    });
    
    if (todayTasks.length === 0) return;
    
    const allCompleted = todayTasks.every(task => {
        return task.completedDates.includes(today);
    });
    
    if (allCompleted) {
        // Mark today as completed in streak
        if (!streakData.completedDays.includes(today)) {
            streakData.completedDays.push(today);
            streakData.lastCheckDate = today;
            
            // Update current day based on consecutive completion
            if (streakData.completedDays.length === 1) {
                streakData.currentDay = 1;
                streakData.startDate = today;
            } else {
                // Check if it's consecutive
                const sortedDays = streakData.completedDays.sort();
                const lastDay = sortedDays[sortedDays.length - 2];
                const lastDate = new Date(lastDay);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    // Consecutive day
                    streakData.currentDay = Math.min(streakData.currentDay + 1, 30);
                } else {
                    // Not consecutive, reset
                    streakData.currentDay = 1;
                    streakData.completedDays = [today];
                    streakData.startDate = today;
                }
            }
            
            saveData();
            updateProgress();
        }
        
        // Show Labubu celebration
        showLabubuCelebration();
    }
}

// Format time for display
function formatTime(timeString) {
    if (!timeString || timeString === '00:00') {
        return 'All Day';
    }
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Render tasks
function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    const today = new Date().toISOString().split('T')[0];
    
    // Filter tasks for today or past dates
    const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate <= today;
    }).sort((a, b) => {
        // Sort by date first, then by time
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
    });
    
    if (todayTasks.length === 0) {
        tasksList.innerHTML = `
            <li class="empty-state">
                <span class="labubu-emoji-fallback">🐰</span>
                <p>No tasks for today! Add some tasks to get started 🐰</p>
            </li>`;
        return;
    }
    
    tasksList.innerHTML = todayTasks.map(task => {
        const isCompletedToday = task.completedDates.includes(today);
        const formattedDate = new Date(task.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const taskTime = task.time || '00:00';
        const formattedTime = formatTime(taskTime);
        
        return `
            <li class="task-item ${isCompletedToday ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${isCompletedToday ? 'checked' : ''}
                       data-task-id="${task.id}" />
                <span class="task-text">${escapeHtml(task.text)}</span>
                <span class="task-date-display">📅 ${formattedDate}</span>
                <span class="task-time-display">🕐 ${formattedTime}</span>
                <button class="delete-btn" data-task-id="${task.id}">×</button>
            </li>
        `;
    }).join('');
}

// Update progress bars
function updateProgress() {
    // Overall progress (30 days)
    const overallProgress = (streakData.currentDay / 30) * 100;
    document.getElementById('overall-progress').style.width = `${overallProgress}%`;
    document.getElementById('overall-progress-text').textContent = `${Math.round(overallProgress)}%`;
    
    // Daily progress
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate <= today;
    });
    
    if (todayTasks.length === 0) {
        document.getElementById('daily-progress').style.width = '0%';
        document.getElementById('daily-progress-text').textContent = '0%';
    } else {
        const completedToday = todayTasks.filter(task => 
            task.completedDates.includes(today)
        ).length;
        const dailyProgress = (completedToday / todayTasks.length) * 100;
        document.getElementById('daily-progress').style.width = `${dailyProgress}%`;
        document.getElementById('daily-progress-text').textContent = `${Math.round(dailyProgress)}%`;
    }
    
    // Update streak info
    const streakDays = streakData.completedDays.length;
    document.getElementById('streak-days').textContent = streakDays;
    document.getElementById('current-day').textContent = streakData.currentDay;
}

// Firework animation
function createFirework() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.2;
    
    const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#FFE5F1'];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 5 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: Math.random() * 0.02 + 0.01
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let alive = false;
        particles.forEach(particle => {
            if (particle.life > 0) {
                alive = true;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // gravity
                particle.life -= particle.decay;
                
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        if (alive) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// Show Labubu celebration
function showLabubuCelebration() {
    const celebration = document.getElementById('labubu-celebration');
    celebration.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        celebration.classList.add('hidden');
    }, 3000);
}

// Initialize UI
function initializeUI() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-date').value = today;
    
    // Set default time to current time (rounded to nearest hour)
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('task-time').value = `${hours}:${minutes}`;
    
    // Set default time for routine input
    document.getElementById('routine-task-time').value = `${hours}:${minutes}`;
    
    renderTasks();
    renderRoutineTasks();
}

// Export data to JSON file
function exportData() {
    const data = {
        tasks: tasks,
        streakData: streakData,
        routineTasks: routineTasks,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `labubu-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('✅ Data exported successfully!', 'success');
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (data.tasks && Array.isArray(data.tasks)) {
                if (confirm('🐰 This will replace your current data. Are you sure?')) {
                    tasks = data.tasks;
                    if (data.streakData) {
                        streakData = data.streakData;
                    }
                    if (data.routineTasks) {
                        routineTasks = data.routineTasks;
                    }
                    
                    saveData();
                    renderTasks();
                    updateProgress();
                    showNotification('✅ Data imported successfully!', 'success');
                }
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            showNotification('❌ Error importing data. Please check the file format.', 'error');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Auto-backup to localStorage (already implemented in saveData)
// This ensures data persists across browser sessions on the same device

// Routine Management Functions

// Toggle routine manager visibility
function toggleRoutineManager() {
    const manager = document.getElementById('routine-manager');
    manager.classList.toggle('hidden');
    if (!manager.classList.contains('hidden')) {
        renderRoutineTasks();
    }
}

// Add task to routine
function addRoutineTask() {
    const input = document.getElementById('routine-task-input');
    const timeInput = document.getElementById('routine-task-time');
    const taskText = input.value.trim();
    const taskTime = timeInput.value || '00:00';
    
    if (!taskText) {
        alert('🐰 Please enter a routine task!');
        return;
    }
    
    const routineTask = {
        id: Date.now(),
        text: taskText,
        time: taskTime
    };
    
    routineTasks.push(routineTask);
    input.value = '';
    timeInput.value = '';
    
    renderRoutineTasks();
}

// Delete routine task
function deleteRoutineTask(taskId) {
    routineTasks = routineTasks.filter(task => task.id !== taskId);
    renderRoutineTasks();
}

// Render routine tasks
function renderRoutineTasks() {
    const routineList = document.getElementById('routine-tasks-list');
    
    if (routineTasks.length === 0) {
        routineList.innerHTML = '<li class="empty-routine">No routine tasks yet. Add some tasks to create your daily routine! 🐰</li>';
        return;
    }
    
    routineList.innerHTML = routineTasks.map(task => {
        const formattedTime = formatTime(task.time);
        return `
            <li class="routine-task-item" data-routine-id="${task.id}">
                <span class="routine-task-text">${escapeHtml(task.text)}</span>
                <span class="routine-task-time">🕐 ${formattedTime}</span>
                <button class="delete-routine-btn" data-routine-id="${task.id}">×</button>
            </li>
        `;
    }).join('');
}

// Save routine
function saveRoutine() {
    saveData();
    showNotification('✅ Routine saved successfully!', 'success');
    toggleRoutineManager();
}

// Clear routine
function clearRoutine() {
    if (confirm('🐰 Are you sure you want to clear your routine? This cannot be undone.')) {
        routineTasks = [];
        saveData();
        renderRoutineTasks();
        showNotification('🗑️ Routine cleared', 'success');
    }
}

// Apply routine to today
function applyRoutineToToday() {
    if (routineTasks.length === 0) {
        showNotification('🐰 No routine tasks found. Please create a routine first!', 'error');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    let addedCount = 0;
    
    routineTasks.forEach(routineTask => {
        // Check if this routine task already exists for today
        const exists = tasks.some(task => {
            const taskDate = new Date(task.date).toISOString().split('T')[0];
            return taskDate === today && 
                   task.text === routineTask.text && 
                   task.time === routineTask.time;
        });
        
        if (!exists) {
            const task = {
                id: Date.now() + Math.random(), // Ensure unique ID
                text: routineTask.text,
                date: today,
                time: routineTask.time,
                completedDates: []
            };
            tasks.push(task);
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        saveData();
        renderTasks();
        updateProgress();
        showNotification(`✅ Added ${addedCount} routine task(s) to today!`, 'success');
    } else {
        showNotification('ℹ️ All routine tasks are already added for today!', 'success');
    }
}

// Functions are now handled via event delegation, no need for global scope

