let timer;
let seconds = 25 * 60; // Initial value set to 25 minutes
let isRunning = false;
let totalSeconds = 25 * 60; // Initial value set to 25 minutes
let animationTriggered = false; // Tracks whether the animation has already been triggered

function startTimer() {
    if (isRunning) return; // Do nothing if already running
    isRunning = true;
    timer = setInterval(updateTimer, 1000); // Call updateTimer every second

    // Change the state of the buttons
    document.getElementById('start').textContent = 'Running...';
    document.getElementById('start').disabled = true;
    document.getElementById('stop').style.display = 'inline-block';
    document.getElementById('reset').style.display = 'none'; // Hide the Finish button

    // Execute the animation to hide elements
    hideElementsAndExpandCoffee();
}

function stopTimer() {
    clearInterval(timer); // Stop the timer
    isRunning = false;

    document.getElementById('start').textContent = 'Resume';
    document.getElementById('start').disabled = false;
    document.getElementById('reset').style.display = 'inline-block'; // Show the Finish button
}

function resetTimer() {
    clearInterval(timer); // Stop the timer
    isRunning = false;
    seconds = totalSeconds; // Reset to the selected time
    animationTriggered = false; // Reset the animation state
    updateUI();

    document.getElementById('start').textContent = 'Start';
    document.getElementById('start').disabled = false;
    document.getElementById('stop').style.display = 'none';
    document.getElementById('reset').style.display = 'none'; // Hide the Finish button
}

function resumeTimer() {
    if (isRunning) return; // Do nothing if already running
    isRunning = true;
    timer = setInterval(updateTimer, 1000); // Call updateTimer every second

    // Change the state of the buttons
    document.getElementById('start').textContent = 'Running...';
    document.getElementById('start').disabled = true;
    document.getElementById('stop').style.display = 'inline-block';
    document.getElementById('reset').style.display = 'none'; // Hide the Finish button

    // Re-execute the animation to hide elements
    hideElementsAndExpandCoffee();
}

function updateTimer() {
    if (seconds <= 0) {
        stopTimer(); // Stop the timer
        playSound(); // Play the end sound
        alert("Time's up!");
        return;
    }

    seconds--; // Decrease the remaining time by 1 second
    updateUI(); // Update the UI
    updateCoffeeLevel(); // Update the coffee level
}

function updateUI() {
    const minutes = Math.floor(seconds / 60); // Calculate minutes
    const remainingSeconds = seconds % 60; // Calculate seconds
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = remainingSeconds.toString().padStart(2, '0');
}

function updateCoffeeLevel() {
    const progress = 1 - (seconds / totalSeconds); // Calculate progress
    const coffeeFill = document.getElementById('coffee');
    coffeeFill.style.height = `${progress * 100}%`; // Set height as a percentage
}

function playSound() {
    if (Notification.permission === "granted") {
        new Notification("Time's up!", {
            body: "Your pomodoro session has ended.",
            icon: "icon.png"
        });
    } else {
        alert("Time's up!");
    }
}

function triggerAnimation() {
    const sidebar = document.querySelector('.sidebar');
    const coffeeContainer = document.querySelector('.coffee-container');

    // Fade out the sidebar
    sidebar.style.transition = 'opacity 2s ease, transform 2s ease';
    sidebar.style.opacity = '0';
    sidebar.style.transform = 'translateX(-100%)'; // Slide out to the left

    // Enlarge the coffee image
    coffeeContainer.style.transition = 'transform 2s ease';
    coffeeContainer.style.transform = 'scale(1.5)'; // Enlarge
}

function hideElementsAndExpandCoffee() {
    // Hide other elements
    const titleContainer = document.querySelector('.title-container');
    const timeSelectorContainer = document.querySelector('.time-selector-container');
    const buttonsContainer = document.querySelector('.buttons-container');

    // Force reflow to apply animation
    titleContainer.style.transition = 'opacity 1s ease';
    timeSelectorContainer.style.transition = 'opacity 1s ease';
    buttonsContainer.style.transition = 'opacity 1s ease';

    // Trigger reflow by accessing offsetHeight
    void titleContainer.offsetHeight;

    // Change styles to start animation
    titleContainer.style.opacity = '0';
    timeSelectorContainer.style.opacity = '0';
    buttonsContainer.style.opacity = '0';
}

function resetToInitialState() {
    // Re-display other elements
    document.querySelector('.title-container').style.opacity = '1';
    document.querySelector('.time-selector-container').style.opacity = '1';
    document.querySelector('.buttons-container').style.opacity = '1';
}

// Timer selection event
document.getElementById('time-select').addEventListener('change', function () {
    const selectedMinutes = parseInt(this.value, 10); // Get the selected time
    totalSeconds = selectedMinutes * 60; // Update total seconds
    seconds = totalSeconds; // Update current seconds
    animationTriggered = false; // Reset the animation state
    updateUI(); // Update the UI
});

// Request notification permission on first load
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Set event listeners for buttons
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

// Add touch event listeners for buttons
document.getElementById('start').addEventListener('touchstart', startTimer);
document.getElementById('stop').addEventListener('touchstart', stopTimer);
document.getElementById('reset').addEventListener('touchstart', resetTimer);
document.getElementById('toggle-buttons').addEventListener('touchstart', resetToInitialState);

// Click the small icon to reset to the initial state
document.getElementById('toggle-buttons').addEventListener('click', () => {
    resetToInitialState();
});
