function openImageUpload() {
  const fileInput = document.getElementById("imageUpload");
  if (fileInput) {
    fileInput.click();
  }
}

document.addEventListener("DOMContentLoaded", function () {


  const emp_id = localStorage.getItem('employee_id')
 console.log(emp_id)
    fetch(`http://13.60.26.193:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;
             document.getElementById("p_name").innerText = data.name;
             document.getElementById("p_role").innerText = data.role;
             document.getElementById("email").innerText = data.email;
             document.getElementById("mobile").innerText = data.other_details[0].mobile
            })

  const uploadInput = document.getElementById("imageUpload");
  const profileImage = document.getElementById("profileImage");

  if (!uploadInput || !profileImage) return;

  uploadInput.addEventListener("change", function () {

    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

      const imageData = e.target.result;

      profileImage.src = imageData;

      localStorage.setItem("profileImage", imageData);
    };

    reader.readAsDataURL(file);
  });

  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    profileImage.src = savedImage;
  }

});



// Sidebar Toggle

const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const toggleBtn = document.getElementById("sidebarToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

// Desktop Toggle
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  mainContent.classList.toggle("expanded");
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 992) {
    if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  }
});



// sidebar section
document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
       1. SIDEBAR ACCORDION & TOGGLE LOGIC
       ========================================= */
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  // A. Desktop Toggle (Collapse Sidebar)
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  // B. Mobile Toggle (Show Sidebar)
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }

  // C. Close Mobile Sidebar on Outside Click
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 992) {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove("active");
      }
    }
  });

  // D. ACCORDION LOGIC (The Dropdown Menu)
  const menuItems = document.querySelectorAll(".has-submenu > .menu-link");

  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault(); // Stop link navigation

      const parent = this.parentElement; // The <li>

      // 1. Toggle current menu
      parent.classList.toggle("open");
    });
  });
});


//nav active element section
document.addEventListener("DOMContentLoaded", function () {
  // 1. Get the current page URL
  const currentLocation = window.location.href;

  // 2. Select all menu items and links
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
  const menuLinks = document.querySelectorAll('.sidebar-menu .menu-link');

  // 3. Remove 'active' class from ALL items first (cleans up hardcoded HTML)
  menuItems.forEach(item => {
    item.classList.remove('active');
  });

  // 4. Loop through links to find the match
  menuLinks.forEach(link => {
    // Check if the link's destination matches the current URL
    if (link.href === currentLocation) {
      // Add 'active' to the parent <li> of the matching link
      link.closest('.menu-item').classList.add('active');
    }
  });
});


//wishes section\
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Select Elements ---
  const twTriggerBtn = document.getElementById('tw-trigger-btn');
  const twModal = document.getElementById('tw-modal-overlay');
  const twCloseBtn = document.getElementById('tw-close-btn');
  const twSendBtn = document.getElementById('tw-send-action-btn');

  // Data elements
  const twDashName = document.getElementById('tw-dashboard-name');
  const twModalName = document.getElementById('tw-modal-name-span');

  // --- 2. Open Modal Logic ---
  if (twTriggerBtn) {
    twTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Populate the name inside the modal
      if (twDashName && twModalName) {
        twModalName.textContent = twDashName.textContent;
      }

      // Show Modal
      twModal.classList.add('tw-active');
    });
  }

  // --- 3. Close Modal Logic ---
  const closeTwModal = () => {
    twModal.classList.remove('tw-active');

    // Reset the "Send" button style after closing
    setTimeout(() => {
      if (twSendBtn) {
        twSendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Wish';
        twSendBtn.style.backgroundColor = '#164E63';
      }
    }, 300);
  };

  if (twCloseBtn) {
    twCloseBtn.addEventListener('click', closeTwModal);
  }

  // Close when clicking outside the box
  window.addEventListener('click', (e) => {
    if (e.target === twModal) {
      closeTwModal();
    }
  });

  // --- 4. Send Button Logic ---
  if (twSendBtn) {
    twSendBtn.addEventListener('click', () => {
      // A. Change visual to "Sending..."
      twSendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      // B. Simulate a delay (e.g., API call)
      setTimeout(() => {
        // Success Visual
        twSendBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        twSendBtn.style.backgroundColor = '#22c55e'; // Green

        // C. Close Modal after success
        setTimeout(() => {
          closeTwModal();
          alert(`Birthday wish sent to ${twDashName ? twDashName.textContent : 'Employee'}!`);

          // D. Disable the dashboard button (optional)
          if (twTriggerBtn) {
            twTriggerBtn.innerText = "Sent";
            twTriggerBtn.disabled = true;
            twTriggerBtn.style.opacity = "0.6";
            twTriggerBtn.style.cursor = "not-allowed";
          }
        }, 800);
      }, 1000);
    });
  }
  });
  document.addEventListener("DOMContentLoaded", function () {
  // Initialize Birthday Swiper
  const birthdaySwiper = new Swiper(".birthdaySwiper", {
    slidesPerView: 1, // How many slides to show at once
    spaceBetween: 20, // Space between slides
    loop: true,       // Makes it slide infinitely
    
    // Optional: Auto-play the slider
    autoplay: {
      delay: 3000, // 3 seconds per slide
      disableOnInteraction: false,
    },

    // Enable the dots at the bottom
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});

    const birthdays = [
    { name: "Jermia", role: "IOS Developer", date: "Today", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "John Smith", role: "Backend Developer", date: "Tomorrow", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Emma Watson", role: "UI Designer", date: "18 Oct", img: "https://randomuser.me/api/portraits/women/44.jpg" }
];

const wishModal = document.getElementById("wishModal");
const allBdayModal = document.getElementById("allBirthdaysModal");
const wishTargetName = document.getElementById("wishTargetName");
const wishMessage = document.getElementById("wishMessage");
const listContainer = document.getElementById("bdayListContainer");

// Open Wish Modal
window.openWishModal = function(passedName) {
    let finalName = "your colleague";

    // If clicking from the list, use passed name. Otherwise, grab the active Swiper slide name!
    if (passedName && typeof passedName === 'string') {
        finalName = passedName;
    } else {
        const activeSlideName = document.querySelector('.swiper-slide-active .birthday-profile h3');
        if (activeSlideName) finalName = activeSlideName.innerText;
    }

    if (wishTargetName) wishTargetName.innerText = finalName;
    if (wishMessage) wishMessage.value = ""; // Clear text
    
    if (wishModal) wishModal.classList.add("active");
};

window.closeWishModal = function() {
    if (wishModal) wishModal.classList.remove("active");
};

// Submit Wish Animation
window.submitWish = function() {
    const btn = document.querySelector(".btn-send-wish");
    if(!btn) return;

    const originalText = btn.innerHTML;
    
    // Simulate Success
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
    btn.style.background = "#28C76F"; // Green

    setTimeout(() => {
        closeWishModal();
        // Reset Button State
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = ""; // Revert to CSS default
        }, 500);
    }, 1000);
};

// Open All Birthdays Modal
window.openAllBirthdaysModal = function() {
    if (listContainer) {
        listContainer.innerHTML = ""; // Clear old list
        
        // Generate list from array
        birthdays.forEach(person => {
            const item = document.createElement("div");
            item.className = "bday-item";
            item.innerHTML = `
                <div class="bday-left">
                    <img src="${person.img}" alt="${person.name}">
                    <div class="bday-info">
                        <h4>${person.name}</h4>
                        <span>${person.date} - ${person.role}</span>
                    </div>
                </div>
                <button class="btn-mini-wish" onclick="openWishModal('${person.name}')">
                    Wish
                </button>
            `;
            listContainer.appendChild(item);
        });
    }
    if (allBdayModal) allBdayModal.classList.add("active");
};

window.closeAllBirthdaysModal = function() {
    if (allBdayModal) allBdayModal.classList.remove("active");
};

// Close modals when clicking on the dark overlay background
window.onclick = function(event) {
    if (event.target === wishModal) closeWishModal();
    if (event.target === allBdayModal) closeAllBirthdaysModal();
};




// --- NEW SUCCESS MODAL VARIABLES ---
const successWishModal = document.getElementById("successWishModal");
const successNameDisplay = document.getElementById("successName");

// ... (keep your openWishModal functions) ...

// --- UPDATED SUBMIT FUNCTION ---
window.submitWish = function() {
    const btn = document.querySelector(".btn-send-wish");
    const originalText = btn.innerHTML;
    
    // 1. Button Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    // 2. Simulate Network Delay (0.8 seconds)
    setTimeout(() => {
        // Get the name of the person we just wished
        const currentName = wishTargetName.innerText;
        
        // 3. Close Input Modal
        closeWishModal();
        
        // 4. Reset Button (for next time)
        btn.innerHTML = originalText;
        
        // 5. Open Success Modal
        openSuccessWishModal(currentName);
        
    }, 800);
};

// --- NEW SUCCESS MODAL FUNCTIONS ---
window.openSuccessWishModal = function(name) {
    if(successNameDisplay) successNameDisplay.innerText = name;
    if(successWishModal) successWishModal.classList.add("active");
};

window.closeSuccessWishModal = function() {
    if(successWishModal) successWishModal.classList.remove("active");
};

// --- CLICK OUTSIDE TO CLOSE ---
window.onclick = function(event) {
    if (event.target === wishModal) closeWishModal();
    if (event.target === allBdayModal) closeAllBirthdaysModal();
    if (event.target === successWishModal) closeSuccessWishModal();
};


