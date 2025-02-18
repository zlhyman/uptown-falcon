let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const modeToggleButton = document.getElementById('mode-toggle');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

// Add cycle count functions
function saveCycleCount(count) {
    localStorage.setItem('cycleCount', count.toString());
}

function getCycleCount() {
    const count = localStorage.getItem('cycleCount');
    return count ? parseInt(count) : 0;
}

function updateCycleDisplay(count) {
    const displayElement = document.getElementById('cycle-count');
    const emoji = count === 0 ? '⭕' : '🙆🏼'.repeat(count);
    displayElement.textContent = `Completed Cycles: ${emoji}`;
}

function incrementCycle() {
    const currentCount = getCycleCount();
    const newCount = currentCount + 1;
    saveCycleCount(newCount);
    updateCycleDisplay(newCount);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update all display elements
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('wingding-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('wingding-seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Update both status texts
    document.getElementById('status-text').textContent = isWorkTime ? 'Work Time' : 'Break Time';
    document.getElementById('wingding-status-text').textContent = isWorkTime ? 'Work Time' : 'Break Time';
    
    document.title = `(${timeString}) ${isWorkTime ? 'Work' : 'Break'} - Pomodoro Timer`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    document.body.classList.toggle('break-mode');
    modeToggleButton.textContent = isWorkTime ? 'Switch to Break Mode' : 'Switch to Work Mode';
    updateDisplay();
}

function toggleMode() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
    switchMode();
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            playNotification();
            if (isWorkTime) {  // Only increment when completing work session
                incrementCycle();
            }
            switchMode();
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    document.body.classList.remove('break-mode');
    modeToggleButton.textContent = 'Switch to Break Mode';
    startButton.textContent = 'Start';
    updateDisplay();
}

function playNotification() {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    timeLeft = WORK_TIME;
    updateDisplay();
    updateCycleDisplay(getCycleCount());
}); 