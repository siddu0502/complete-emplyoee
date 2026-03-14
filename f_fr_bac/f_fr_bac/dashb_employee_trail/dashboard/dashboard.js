
document.addEventListener("DOMContentLoaded", function () {
     const emp_id = localStorage.getItem('employee_id')
   
    console.log(emp_id)
fetch(`http://13.60.70.185:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;
              document.getElementById("display_name").innerText = data.name;
              document.getElementById("email").innerText = data.email;
              
                document.getElementById("display_dob").innerText = data.other_details[0].dob;
                 document.getElementById("display_marital").innerText = data.other_details[0].marital_status;
                document.getElementById("display_number").innerText = data.other_details[0].mobile;
                document.getElementById("display_role").innerText = data.role;
                document.getElementById("display_salary").innerText = data.salary;
                document.getElementById("display_address").innerText = data.other_details[0].address;
                document.getElementById("display_city").innerText = data.other_details[0].city;

               if(data.bank_details && data.bank_details.length > 0){
                document.getElementById("bankname").innerText = data.bank_details[0].bank_name;
                document.getElementById("accno").innerText = data.bank_details[0].acc_no;
                document.getElementById("ifsccode").innerText = data.bank_details[0].ifsc_code;
                document.getElementById("accholdername").innerText = data.bank_details[0].holder_name;
                document.getElementById("number").innerText = data.bank_details[0].mobile;
                document.getElementById("branch").innerText = data.bank_details[0].branch
                

                }
                
                document.getElementById("display_other_phone").innerText = data.other_details[0].mobile
                document.getElementById("display_other_gender").innerText = data.other_details[0].Gender
                document.getElementById("display_other_dob").innerText = data.other_details[0].dob
                
                
        // document.getElementById("mobile").innerText = data.other_details[0].mobile
        // document.getElementById("gender").innerText = data.other_details[0].Gender
        // document.getElementById("city").innerText = data.other_details[0].city
        // document.getElementById("dob").innerText = data.other_details[0].dob

    
              



            // document.getElementById("doj").innerText = data.joining;

           
            // document.getElementById("p_name").innerText = data.name;
            // document.getElementById("email").innerText = data.email;

            
            // document.getElementById("username").innerText = data.username;

            // document.getElementById("role").innerText = data.role;
            // document.getElementById("salary").innerText = data.salary;

            

            })
   
    // 1. GLOBAL TOAST NOTIFICATION LOGIC
     
    const toast = document.getElementById("successToast");
    const toastCloseBtn = document.querySelector(".toast-close");

    // Function to show the success message
    function showToast() {
        if (toast) {
            toast.classList.add("show");
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }
    }

    // Manual close button for toast
    if (toastCloseBtn) {
        toastCloseBtn.addEventListener("click", () => {
            toast.classList.remove("show");
        });
    }

    
    // 2. PROFILE DETAILS CARD LOGIC
    
    
    // Modal & Buttons
    const profileModal = document.getElementById("editProfileModal");
    const profileOpenBtn = document.getElementById("openEditModalBtn");
    const profileCloseBtn = document.getElementById("closeEditModal");
    const profileCancelBtn = document.getElementById("cancelEditBtn");
    const profileForm = document.getElementById("editProfileForm");

    // Display Fields (Read data from here)
    const dispName = document.getElementById("display_name");
    // const dispUser = document.getElementById("display_username");
    const dispNumber = document.getElementById("display_number");
    const dispDob = document.getElementById("display_dob");
    // const dispDesignation = document.getElementById("display_designation");
    // const dispSalary = document.getElementById("display_salary");
    const dispAddress = document.getElementById("display_address");
    const dispCity = document.getElementById("display_city");

    // Input Fields (Write data to here)
   
    // const inputUser = document.getElementById("input_username");
    const inputNumber = document.getElementById("input_number");
    const inputDob = document.getElementById("input_dob");
    // const inputDesignation = document.getElementById("input_designation");
    // const inputSalary = document.getElementById("input_salary");
    const inputAddress = document.getElementById("input_address");
    const inputCity = document.getElementById("input_city");

    // OPEN Profile Modal
    if (profileOpenBtn) {
        profileOpenBtn.addEventListener("click", () => {
            // Fill inputs with current values
            // if(inputName) inputName.value = dispName.innerText;
            // if(inputUser) inputUser.value = dispUser.innerText;
            if(inputNumber) inputNumber.value = dispNumber.innerText;
            if(inputDob) inputDob.value = dispDob.innerText;
            // if(inputDesignation) inputDesignation.value = dispDesignation.innerText;
            // if(inputSalary) inputSalary.value = dispSalary.innerText;
            if(inputAddress) inputAddress.value = dispAddress.innerText;
            if(inputCity) inputCity.value = dispCity.innerText;

            profileModal.classList.add("active");
        });
    }

    // CLOSE Profile Modal
    const closeProfileModalFunc = () => {
        if(profileModal) profileModal.classList.remove("active");
    };

    if (profileCloseBtn) profileCloseBtn.addEventListener("click", closeProfileModalFunc);
    if (profileCancelBtn) profileCancelBtn.addEventListener("click", closeProfileModalFunc);

    // SAVE Profile Details
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // // Update Page Text
            // if(dispName) dispName.innerText = inputName.value;
            // // if(dispUser) dispUser.innerText = inputUser.value;
            // if(dispNumber) dispNumber.innerText = inputNumber.value;
            // if(dispDob) dispDob.innerText = inputDob.value;
            // // if(dispDesignation) dispDesignation.innerText = inputDesignation.value;
            // // if(dispSalary) dispSalary.innerText = inputSalary.value;
            // if(dispAddress) dispAddress.innerText = inputAddress.value;
            // if(dispCity) dispCity.innerText = inputCity.value;
            const profileData = {
        mobile: document.getElementById('input_number').value,
        dob: document.getElementById('input_dob').value,
        marital_status : document.getElementById('input_other_marital').value,
        address: document.getElementById('input_address').value,
        city: document.getElementById('input_city').value
    };

    fetch(`http://13.60.70.185:8000/api/update-employee/${emp_id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Profile update response:", data);
        if (data.profile) alert("Profile updated successfully!");
        else if (data.profile_errors) alert(JSON.stringify(data.profile_errors));
    })
    .catch(err => {
        console.error("Profile update error:", err);
        alert("Failed to update profile.");
    });

            closeProfileModalFunc();
            showToast();
        });
    }

    
    // 3. OTHER INFORMATION CARD LOGIC
   

    // Modal & Buttons
    const otherModal = document.getElementById("editOtherModal");
    const otherOpenBtn = document.getElementById("openOtherEditBtn");
    const otherCloseBtn = document.getElementById("closeOtherModal");
    const otherCancelBtn = document.getElementById("cancelOtherBtn");
    const otherForm = document.getElementById("editOtherForm");

    // Display Fields
    const dispOtherPhone = document.getElementById("display_other_phone");
    const dispOtherGender = document.getElementById("display_other_gender");
    const dispOtherDob = document.getElementById("display_other_dob");

    // Input Fields
    const inputOtherPhone = document.getElementById("input_other_phone");
    const inputOtherGender = document.getElementById("input_other_gender"); // Select Box
    const inputOtherDob = document.getElementById("input_other_dob");

    // OPEN Other Modal
    if (otherOpenBtn) {
        otherOpenBtn.addEventListener("click", () => {
            // Fill inputs
            if(inputOtherPhone) inputOtherPhone.value = dispOtherPhone.innerText;
            if(inputOtherGender) inputOtherGender.value = dispOtherGender.innerText; // Matches option value
            if(inputOtherDob) inputOtherDob.value = dispOtherDob.innerText;

            otherModal.classList.add("active");
        });
    }

    // CLOSE Other Modal
    const closeOtherModalFunc = () => {
        if(otherModal) otherModal.classList.remove("active");
    };

    if (otherCloseBtn) otherCloseBtn.addEventListener("click", closeOtherModalFunc);
    if (otherCancelBtn) otherCancelBtn.addEventListener("click", closeOtherModalFunc);

    // SAVE Other Details
    if (otherForm) {
        otherForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const profileData = {
                mobile: document.getElementById('input_other_phone').value,
                gender: document.getElementById('input_other_gender').value,
                dob: document.getElementById('input_other_dob').value,
            }
             fetch(`http://13.60.70.185:8000/api/update-employee/${emp_id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Profile update response:", data);
        if (data.profile) alert("Profile updated successfully!");
        else if (data.profile_errors) alert(JSON.stringify(data.profile_errors));
    })
    .catch(err => {
        console.error("Profile update error:", err);
        alert("Failed to update profile.");
    });


            // // Update Page Text
            // if(dispOtherPhone) dispOtherPhone.innerText = inputOtherPhone.value;
            // if(dispOtherGender) dispOtherGender.innerText = inputOtherGender.value;
            // if(dispOtherDob) dispOtherDob.innerText = inputOtherDob.value;

            closeOtherModalFunc();
            showToast();
        });
    }

    
    // 4. GLOBAL CLICK OUTSIDE TO CLOSE
    
    window.addEventListener("click", (e) => {
        if (e.target === profileModal) closeProfileModalFunc();
        if (e.target === otherModal) closeOtherModalFunc();
    });

});



//profile details card logic
document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // PROFILE PHOTO MODAL LOGIC
    // ==========================================

    // Elements
    const photoModal = document.getElementById("photoModal");
    const openPhotoBtn = document.getElementById("openPhotoModalBtn");
    const closePhotoBtn = document.getElementById("closePhotoModal");
    const cancelPhotoBtn = document.getElementById("cancelPhotoBtn");
    const savePhotoBtn = document.getElementById("savePhotoBtn");

    // Image Elements
    const mainImg = document.getElementById("mainProfileImage"); // The one on the page
    const previewImg = document.getElementById("modalImagePreview"); // The one in the popup
    const fileInput = document.getElementById("newPhotoInput");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    
    // Toast (Reuse existing toast)
    const toast = document.getElementById("successToast");

    // 1. OPEN MODAL
    if (openPhotoBtn) {
        openPhotoBtn.addEventListener("click", () => {
            // Reset preview to match current main image
            previewImg.src = mainImg.src;
            fileNameDisplay.textContent = "No file chosen";
            fileInput.value = ""; // Clear input
            
            photoModal.classList.add("active");
        });
    }

    // 2. CLOSE MODAL FUNCTION
    const closePhotoModalFunc = () => {
        photoModal.classList.remove("active");
    };

    if (closePhotoBtn) closePhotoBtn.addEventListener("click", closePhotoModalFunc);
    if (cancelPhotoBtn) cancelPhotoBtn.addEventListener("click", closePhotoModalFunc);
    
    // Close on outside click
    window.addEventListener("click", (e) => {
        if (e.target === photoModal) closePhotoModalFunc();
    });

    // 3. PREVIEW IMAGE ON FILE SELECT
    if (fileInput) {
        fileInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Update file name text
                fileNameDisplay.textContent = file.name;

                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. SAVE BUTTON CLICK
    if (savePhotoBtn) {
        savePhotoBtn.addEventListener("click", () => {
            // Update the main profile image on the page
            mainImg.src = previewImg.src;

            // Close Modal
            closePhotoModalFunc();

            // Show Success Toast
            if(toast) {
                toast.classList.add("show");
                setTimeout(() => toast.classList.remove("show"), 3000);
            }
        });
    }
});

// const profile_update = document.getElementById('editProfileForm')
// profile_update.addEventListener('submit',function (event) {
//      event.preventDefault();
//     const profileData = {
//       
//         mobile: document.getElementById('input_number').value,
//         dob: document.getElementById('input_dob').value,
//         address: document.getElementById('input_address').value,
//         city: document.getElementById('input_city').value
//     };

//     fetch(`http://13.60.70.185:8000/api/update-employee/${emp_id}/`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(profileData)
//     })
//     .then(res => res.json())
//     .then(data => {
//         console.log("Profile update response:", data);
//         if (data.profile) alert("Profile updated successfully!");
//         else if (data.profile_errors) alert(JSON.stringify(data.profile_errors));
//     })
//     .catch(err => {
//         console.error("Profile update error:", err);
//         alert("Failed to update profile.");
//     });

// })
//notification and profile toggle logic
/* --- TOGGLE NOTIFICATIONS --- */
function db_toggleNotifications() {
    const notifDropdown = document.getElementById('db-notification-menu');
    const notifBtn = document.querySelector('.db-notif-trigger-btn');
    
    // Close profile if it's currently open
    db_closeProfile();

    // Toggle visibility class
    notifDropdown.classList.toggle('db-show-menu');
    notifBtn.classList.toggle('db-active-state');
}

/* --- TOGGLE PROFILE --- */
function db_toggleProfile() {
    const profileDropdown = document.getElementById('db-profile-menu');
    const profileBtn = document.querySelector('.db-profile-trigger-btn');

    // Close notifications if currently open
    db_closeNotifications();

    // Toggle visibility class
    profileDropdown.classList.toggle('db-show-menu');
    profileBtn.classList.toggle('db-active-state');
}

/* --- HELPER FUNCTIONS --- */
function db_closeNotifications() {
    document.getElementById('db-notification-menu').classList.remove('db-show-menu');
    document.querySelector('.db-notif-trigger-btn').classList.remove('db-active-state');
}

function db_closeProfile() {
    document.getElementById('db-profile-menu').classList.remove('db-show-menu');
    document.querySelector('.db-profile-trigger-btn').classList.remove('db-active-state');
}

/* --- LOGOUT LOGIC --- */
function db_logoutUser() {
    // 1. Clear session/local storage
    // localStorage.removeItem('userToken');
    
    // 2. Redirect
    window.location.href = '../employee_login/emp_login.html'; 
}

/* --- CLOSE MENUS WHEN CLICKING OUTSIDE --- */
window.onclick = function(event) {
    // Check if the click is NOT inside a widget wrapper
    if (!event.target.closest('.db-widget-wrapper')) {
        db_closeNotifications();
        db_closeProfile();
    }
}


//small profile 
document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SIMULATED USER DATA ---
    // Change 'profilePic' to a URL string to test the image version.
    // Leave as null or empty string "" to test the initials version.
    const currentUser = {
        firstName: "Dhamodhar",
        lastName: "Kamini",
        empId: "EMP-2024-055",
        profilePic: "" // Try changing this to: "https://ui-avatars.com/api/?name=John+Doe"
    };

    // --- 2. INITIALIZE PROFILE ---
    loadUserProfile(currentUser);
});

/**
 * Populates the profile section with data.
 * Handles Image vs Initials logic.
 */
function loadUserProfile(user) {
    // 1. Set Text Data
    document.getElementById("db-user-name").textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("db-employee-id").textContent = user.empId;

    // 2. Handle Avatar Logic (For both Trigger and Header)
    updateAvatar("db-trigger-avatar-box", "db-trigger-img", user);
    updateAvatar("db-header-avatar-box", "db-header-img", user);
}

/**
 * Helper function to render image or initials into a specific container
 */
function updateAvatar(containerId, imgId, user) {
    const container = document.getElementById(containerId);
    const imgElement = document.getElementById(imgId);

    if (user.profilePic && user.profilePic.trim() !== "") {
        // CASE A: User has a photo
        imgElement.src = user.profilePic;
        imgElement.style.display = "block";
        
        // Remove any existing initials div if it exists
        const existingInitials = container.querySelector('.avatar-initials');
        if (existingInitials) existingInitials.remove();

    } else {
        // CASE B: No photo -> Generate Initials
        imgElement.style.display = "none"; // Hide the broken/empty image tag

        // Get Initials (First char of First Name + First char of Last Name)
        const fInitial = user.firstName ? user.firstName.charAt(0) : "";
        const lInitial = user.lastName ? user.lastName.charAt(0) : "";
        const initials = (fInitial + lInitial).toUpperCase();

        // Check if initials element already exists to avoid duplicates
        let initialsDiv = container.querySelector('.avatar-initials');
        
        if (!initialsDiv) {
            initialsDiv = document.createElement("div");
            initialsDiv.className = "avatar-initials";
            container.appendChild(initialsDiv);
        }
        
        initialsDiv.textContent = initials;
    }
}

// --- 3. TOGGLE DROPDOWN FUNCTION ---
function db_toggleProfile() {
    const menu = document.getElementById("db-profile-menu");
    menu.classList.toggle("show");
}

// Close dropdown if clicking outside
window.addEventListener("click", function(e) {
    const menu = document.getElementById("db-profile-menu");
    const trigger = document.querySelector(".db-profile-trigger-btn");
    
    if (menu.classList.contains("show")) {
        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove("show");
        }
    }
});

// --- 4. LOGOUT FUNCTION ---
// --- 1. Trigger the Modal (Replaces the old confirm alert) ---
function db_logoutUser() {
    // Hide the profile dropdown first (optional, for cleaner UI)
    const menu = document.getElementById("db-profile-menu");
    if (menu) menu.classList.remove("show");

    // Show the custom modal
    const modal = document.getElementById("logout-confirm-modal");
    modal.classList.add("show");
}

// --- 2. Close Modal (Cancel Action) ---
function closeLogoutModal() {
    const modal = document.getElementById("logout-confirm-modal");
    modal.classList.remove("show");
}

// --- 3. Perform Actual Logout (Yes Action) ---
function performLogout() {
    const btn = document.querySelector(".btn-confirm");
    
    // UI Feedback (Loading state)
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging out...';
    btn.style.opacity = "0.8";

    // Simulate short delay for smooth UX
    setTimeout(() => {
        // 1. Clear Data
        localStorage.clear(); 
        sessionStorage.clear();

        // 2. Redirect to Login
        window.location.href = "../employee_login/emp_login.html"; // Adjust path as needed
    }, 800);
}

// Close modal if clicking outside the card
window.addEventListener("click", function(e) {
    const modal = document.getElementById("logout-confirm-modal");
    if (e.target === modal) {
        closeLogoutModal();
    }
});



//chat box section
/* =========================================
   SMART RULE-BASED CHATBOT (NO API)
   ========================================= */

// 1. Bot Knowledge Base
// We use arrays of keywords to catch different ways of asking the same thing
const botKnowledge = [
    {
        keywords: ["hello", "hi", "hey", "greetings", "morning", "afternoon"],
        response: "Hello! 👋 I am the company AI assistant. How can I help you today?"
    },
    {
        keywords: ["time", "timing", "hour", "clock", "shift", "schedule", "open", "close"],
        response: "General office hours are <strong>10:00 AM to 7:00 PM</strong>, Monday to Friday."
    },
    {
        keywords: ["leave", "sick", "casual", "vacation", "holiday", "off"],
        // We add a negative check logic inside the function to distinguish 'holiday' vs 'leave'
        response: "You currently have <strong>12 Casual Leaves</strong> and <strong>5 Sick Leaves</strong> remaining. <br><a href='#' style='color:#ff6b00;'>Apply here</a>"
    },
    {
        keywords: ["pay", "salary", "slip", "money", "bonus", "account", "bank"],
        response: "Payslips are generated on the <strong>15th of every month</strong>. You can download them from the Payroll section."
    },
    {
        keywords: ["pass", "reset", "login", "auth", "access", "account"],
        response: "To reset your password, go to <strong>Settings > Security</strong> in the top right menu."
    },
    {
        keywords: ["holiday", "festival", "calendar"],
        response: "The next upcoming holiday is <strong>Ugadi</strong> on March 19th."
    }
];

const defaultResponse = "I'm not sure about that. Would you like to connect with a human? <br><button class='chat-inline-btn' onclick='connectToHuman()'>Chat with HR</button>";

// 2. MAIN LOGIC: Smart Matching
function getBotResponse(userText) {
    userText = userText.toLowerCase();
    
    // Loop through all topics
    for (let topic of botKnowledge) {
        // Check if the user text contains ANY of the keywords for this topic
        // We use .some() to check if at least one keyword exists in the sentence
        const match = topic.keywords.some(word => userText.includes(word));
        
        if (match) {
            // SPECIAL HANDLING: Distinguish "Holiday" from "Leave"
            // If user says "holiday", we prefer the holiday response over the leave response
            if (topic.response.includes("Casual Leaves") && (userText.includes("holiday") || userText.includes("festival"))) {
                continue; // Skip the 'leave' logic, let it find the 'holiday' logic later
            }
            return topic.response;
        }
    }

    return defaultResponse;
}

/* --- STANDARD UI FUNCTIONS (Same as before) --- */

let isChatInitialized = false;

document.addEventListener("DOMContentLoaded", () => {
    if (!isChatInitialized) {
        setTimeout(() => {
            addMessageToChat("Hello! 👋 I can help with:<br><br>" +
                "<span class='chip' onclick='quickAsk(\"leave\")'>Leave Balance</span>" +
                "<span class='chip' onclick='quickAsk(\"time\")'>Office Hours</span>" +
                "<span class='chip' onclick='quickAsk(\"pay\")'>Payroll</span>", 
                'received');
            isChatInitialized = true;
        }, 1000);
    }
});

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const badge = document.querySelector('.chat-notify-badge');
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        badge.style.display = 'none';
        setTimeout(() => document.getElementById('chat-input').focus(), 300);
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const userText = input.value.trim();
    if (userText === "") return;

    addMessageToChat(userText, 'sent');
    input.value = "";
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const reply = getBotResponse(userText);
        addMessageToChat(reply, 'received');
    }, 800);
}

function quickAsk(keyword) {
    // Determine label based on keyword
    let label = keyword;
    if(keyword === 'leave') label = "Leave Balance";
    if(keyword === 'time') label = "Office Hours";
    if(keyword === 'pay') label = "Payroll Info";

    addMessageToChat(label, 'sent');
    showTypingIndicator();
    setTimeout(() => {
        const reply = getBotResponse(keyword); 
        addMessageToChat(reply, 'received');
        removeTypingIndicator();
    }, 800);
}

function connectToHuman() {
    addMessageToChat("Connecting to HR...", 'sent');
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addMessageToChat("An HR representative has been notified.", 'received');
    }, 2000);
}

function addMessageToChat(htmlContent, type) {
    const chatBody = document.getElementById('chat-body');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerHTML = `<p>${htmlContent}</p><span class="msg-time">${time}</span>`;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function handleEnter(event) {
    if (event.key === 'Enter') sendMessage();
}

function showTypingIndicator() {
    const chatBody = document.getElementById('chat-body');
    removeTypingIndicator();
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message received typing';
    typingDiv.innerHTML = `<span></span><span></span><span></span>`;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}