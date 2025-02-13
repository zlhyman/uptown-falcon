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

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update both display elements
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('wingding-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('wingding-seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Update the document title with the time and current mode
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `(${timeString}) ${mode} - Pomodoro Timer`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    updateDisplay();
}

function toggleMode() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
    
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    modeToggleButton.textContent = isWorkTime ? 'Switch to Break Mode' : 'Switch to Work Mode';
    updateDisplay();
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            playNotification();
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
    statusText.textContent = 'Work Time';
    startButton.textContent = 'Start';
    updateDisplay();
}

function playNotification() {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
}

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

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay(); 