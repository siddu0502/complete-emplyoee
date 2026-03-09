
document.addEventListener("DOMContentLoaded", function () {
     const emp_id = localStorage.getItem('employee_id')
   
    console.log(emp_id)
fetch(`http://127.0.0.1:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;
              document.getElementById("display_name").innerText = data.name;
              document.getElementById("email").innerText = data.email;
              
                document.getElementById("display_dob").innerText = data.other_details[0].dob;
                document.getElementById("display_number").innerText = data.other_details[0].mobile;
                document.getElementById("display_role").innerText = data.role;
                document.getElementById("display_salary").innerText = data.salary;
                document.getElementById("display_address").innerText = data.other_details[0].address;
                document.getElementById("display_city").innerText = data.other_details[0].city;
                document.getElementById("bankname").innerText = data.bank_details[0].bank_name;
                document.getElementById("accno").innerText = data.bank_details[0].acc_no;
                document.getElementById("ifsccode").innerText = data.bank_details[0].ifsc_code;



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
    const inputName = document.getElementById("input_name");
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
            if(inputName) inputName.value = dispName.innerText;
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
        name:document.getElementById('input_name').value,
        mobile: document.getElementById('input_number').value,
        dob: document.getElementById('input_dob').value,
        address: document.getElementById('input_address').value,
        city: document.getElementById('input_city').value
    };

    // fetch(`http://127.0.0.1:8000/api/update-employee/${emp_id}/`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(profileData)
    // })
    // .then(res => res.json())
    // .then(data => {
    //     console.log("Profile update response:", data);
    //     if (data.profile) alert("Profile updated successfully!");
    //     else if (data.profile_errors) alert(JSON.stringify(data.profile_errors));
    // })
    // .catch(err => {
    //     console.error("Profile update error:", err);
    //     alert("Failed to update profile.");
    // });

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
             fetch(`http://127.0.0.1:8000/api/update-employee/${emp_id}/`, {
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
//         name:document.getElementById('input_name').value,
//         mobile: document.getElementById('input_number').value,
//         dob: document.getElementById('input_dob').value,
//         address: document.getElementById('input_address').value,
//         city: document.getElementById('input_city').value
//     };

//     fetch(`http://127.0.0.1:8000/api/update-employee/${emp_id}/`, {
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