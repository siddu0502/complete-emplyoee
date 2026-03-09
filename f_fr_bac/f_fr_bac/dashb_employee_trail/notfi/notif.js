// --- TOGGLE NOTIFICATIONS ---
function toggleNotifications() {
    const notifBox = document.getElementById('notificationBox');
    const notifBtn = document.querySelector('.bell-btn');
    
    // Close profile if open
    closeProfile();

    // Toggle current
    notifBox.classList.toggle('show');
    notifBtn.classList.toggle('active');
}

// --- TOGGLE PROFILE ---
function toggleProfile() {
    const profileBox = document.getElementById('profileBox');
    const profileBtn = document.querySelector('.profile-btn');

    // Close notifications if open
    closeNotifications();

    // Toggle current
    profileBox.classList.toggle('show');
    profileBtn.classList.toggle('active');
}

// --- HELPER CLOSING FUNCTIONS ---
function closeNotifications() {
    document.getElementById('notificationBox').classList.remove('show');
    document.querySelector('.bell-btn').classList.remove('active');
}

function closeProfile() {
    document.getElementById('profileBox').classList.remove('show');
    document.querySelector('.profile-btn').classList.remove('active');
}

// --- LOGOUT LOGIC ---
function logoutUser() {
    // Ideally, you would clear session storage here
    // sessionStorage.clear(); 
    
    // Redirect to login page
    window.location.href = 'login.html'; 
}

// --- CLOSE BOTH WHEN CLICKING OUTSIDE ---
window.onclick = function(event) {
    // Check if the click happened inside ANY wrapper
    if (!event.target.closest('.wrapper')) {
        closeNotifications();
        closeProfile();
    }
}