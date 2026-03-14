document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // --- 1. DUMMY DATA (Reference from Admin) ---
    // ==========================================
    const birthdays = [
        { 
            id: 1, 
            name: "Dhamodhar", 
            role: "IOS Developer", 
            date: "Today, 24 Oct", 
            phone: "918790997602", // Add Country Code (91)
            img: "../assets/profiledp.jpeg" 
        },
        { 
            id: 2, 
            name: "Saleem", 
            role: "UI Designer", 
            date: "Today, 25 Oct", 
            phone: "917075653250", 
            img: "../assets/profiledp.jpeg" 
        },
        { 
            id: 3, 
            name: "Balaji", 
            role: "Product Manager", 
            date: "26 Oct", 
            phone: "918309930827", 
            img: "../assets/profiledp.jpeg" 
        },
        { 
            id: 4, 
            name: "Manikanta", 
            role: "QA Engineer", 
            date: "28 Oct", 
            phone: "917036084043", 
            img: "../assets/profiledp.jpeg" 
        }
    ];

    // Global State
    let currentTargetPhone = ""; 
    let birthdaySwiper = null;

    // Elements
    const wrapper = document.getElementById("birthdayWrapper");
    const wishBtn = document.getElementById('sendWishBtn');

    // ==========================================
    // --- 2. INITIALIZE SWIPER & RENDER SLIDES ---
    // ==========================================
    function initBirthdaySlider() {
        if (!wrapper) return;
        wrapper.innerHTML = ""; // Clear existing

        if (birthdays.length === 0) {
            // No Birthdays State
            wrapper.innerHTML = `
                <div class="swiper-slide">
                    <div class="birthday-profile">
                        <img src="../assets/profiledp.jpeg" style="filter: grayscale(100%); opacity: 0.5;">
                        <h3>No Birthdays Today</h3>
                        <p>Check "View All" list</p>
                    </div>
                </div>`;
            if (wishBtn) {
                wishBtn.disabled = true;
                wishBtn.style.opacity = "0.5";
                wishBtn.style.cursor = "not-allowed";
            }
            return;
        }

        // Render Slides
        birthdays.forEach(person => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            // Store data attributes for easy access
            slide.setAttribute("data-phone", person.phone);
            slide.setAttribute("data-name", person.name);
            
            slide.innerHTML = `
                <div class="birthday-profile">
                    <img src="${person.img}" onerror="this.src='../assets/profiledp.jpeg'" alt="${person.name}">
                    <h3>${person.name}</h3>
                    <p>🎂 ${person.date}</p>
                    <small>${person.role}</small>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        // Initialize Swiper
        if (birthdaySwiper) birthdaySwiper.destroy(true, true);
        
        birthdaySwiper = new Swiper(".birthdaySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: birthdays.length > 1, // Only loop if more than 1
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            }
        });
    }

    // Run Initialization
    initBirthdaySlider();


    // ==========================================
    // --- 3. MAIN "SEND WISHES" BUTTON LOGIC ---
    // ==========================================
    if (wishBtn) {
        wishBtn.addEventListener("click", function () {
            if (!birthdaySwiper) return;

            // Get the currently active slide index
            const activeIndex = birthdaySwiper.realIndex;
            const person = birthdays[activeIndex];

            if (person) {
                openWishModal(person);
            } else {
                alert("No active birthday selected.");
            }
        });
    }


    // ==========================================
    // --- 4. MODAL & WHATSAPP LOGIC ---
    // ==========================================
    
    const wishModal = document.getElementById("wishModal");
    const successWishModal = document.getElementById("successWishModal");
    const allBdayModal = document.getElementById("allBirthdaysModal");
    
    // Inputs
    const wishTargetNameEl = document.getElementById("wishTargetName");
    const wishMessageEl = document.getElementById("wishMessage");

    // A. Open Wish Modal
    window.openWishModal = function (personOrName) {
        // Pause slider so it doesn't move while wishing
        if (birthdaySwiper && birthdaySwiper.autoplay.running) birthdaySwiper.autoplay.stop();

        let person = null;

        if (typeof personOrName === 'string') {
            // If called from "View All" (passed as name string)
            person = birthdays.find(p => p.name === personOrName);
        } else {
            // If called from Main Card (passed as object)
            person = personOrName;
        }

        if (person) {
            currentTargetPhone = person.phone;
            
            if (wishTargetNameEl) wishTargetNameEl.innerText = person.name;
            if (wishMessageEl) wishMessageEl.value = `Happy Birthday ${person.name}! 🎂 Wishing you a fantastic year ahead!`;

            if (wishModal) wishModal.classList.add("active");
        }
    };

    // B. Close Wish Modal
    window.closeWishModal = function () {
        if (wishModal) wishModal.classList.remove("active");
        // Resume slider
        if (birthdaySwiper) birthdaySwiper.autoplay.start();
    };

    // C. Submit Wish (WhatsApp Logic from Admin Page)
    window.submitWish = function () {
        const btn = document.querySelector(".btn-send-wish");
        const originalText = btn.innerHTML;
        const message = wishMessageEl ? wishMessageEl.value : "Happy Birthday!";
        const name = wishTargetNameEl ? wishTargetNameEl.innerText : "Employee";

        // 1. Validate Phone
        if (!currentTargetPhone) {
            alert("Phone number missing for this employee.");
            return;
        }

        // Clean phone (remove spaces/dashes)
        const cleanPhone = currentTargetPhone.replace(/\D/g, '');

        // 2. UI Loading State
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening WhatsApp...';
        btn.disabled = true;

        // 3. Process with Delay (to allow UI to update and prevent blockers)
        setTimeout(() => {
            // Construct URL
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Close Modal & Reset UI
            closeWishModal();
            btn.innerHTML = originalText;
            btn.disabled = false;

            // Show Success
            openSuccessWishModal(name);

        }, 1000); // 1 Second delay
    };

    // D. Success Modal
    window.openSuccessWishModal = function (name) {
        const successNameEl = document.getElementById("successName");
        if (successNameEl) successNameEl.innerText = name;
        if (successWishModal) successWishModal.classList.add("active");
    };

    window.closeSuccessWishModal = function () {
        if (successWishModal) successWishModal.classList.remove("active");
    };


    // ==========================================
    // --- 5. VIEW ALL MODAL LOGIC ---
    // ==========================================
    
    window.openAllBirthdaysModal = function () {
        const listContainer = document.getElementById("bdayListContainer");
        if (listContainer) {
            listContainer.innerHTML = "";
            
            birthdays.forEach(person => {
                const item = document.createElement("div");
                item.className = "bday-list-item"; // Ensure CSS exists
                
                // Inline styles for reliability
                item.style.display = "flex";
                item.style.justifyContent = "space-between";
                item.style.alignItems = "center";
                item.style.padding = "10px";
                item.style.borderBottom = "1px solid #eee";

                item.innerHTML = `
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${person.img}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" onerror="this.src='../assets/profiledp.jpeg'">
                        <div>
                            <h4 style="margin:0; font-size:14px;">${person.name}</h4>
                            <span style="font-size:12px; color:#666;">${person.date} - ${person.role}</span>
                        </div>
                    </div>
                    <button style="padding:5px 10px; background:#ff6b00; color:white; border:none; border-radius:4px; cursor:pointer;" 
                        onclick="openWishModal('${person.name}')">
                        Wish
                    </button>
                `;
                listContainer.appendChild(item);
            });
        }
        if (allBdayModal) allBdayModal.classList.add("active");
    };

    window.closeAllBirthdaysModal = function () {
        if (allBdayModal) allBdayModal.classList.remove("active");
    };

    // ==========================================
    // --- 6. CLOSE ON OUTSIDE CLICK ---
    // ==========================================
    window.onclick = function (event) {
        if (event.target === wishModal) closeWishModal();
        if (event.target === successWishModal) closeSuccessWishModal();
        if (event.target === allBdayModal) closeAllBirthdaysModal();
    };

});





document.addEventListener("DOMContentLoaded", function () {

  const emp_id = localStorage.getItem('employee_id')
  
  // Fetch Profile Data
  fetch(`http://13.51.167.95:8000/api/employee/dashboard/${emp_id}/`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("name").innerText = data.name;
      document.getElementById("role").innerText = data.role;
      document.getElementById("p_name").innerText = data.name;
      document.getElementById("p_role").innerText = data.role;
      document.getElementById("email").innerText = data.email;
      if(data.other_details && data.other_details.length > 0){
          document.getElementById("mobile").innerText = data.other_details[0].mobile
      }
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
if(toggleBtn){
    toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
    });
}

// Mobile Menu Toggle
if(mobileMenuBtn){
    mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    });
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 992) {
    if (sidebar && !sidebar.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  }
});

// Sidebar Accordion Logic
document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".has-submenu > .menu-link");
  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault(); 
      const parent = this.parentElement; 
      parent.classList.toggle("open");
    });
  });
});

// Nav active element section
document.addEventListener("DOMContentLoaded", function () {
  const currentLocation = window.location.href;
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
  const menuLinks = document.querySelectorAll('.sidebar-menu .menu-link');

  menuItems.forEach(item => {
    item.classList.remove('active');
  });

  menuLinks.forEach(link => {
    if (link.href === currentLocation) {
      link.closest('.menu-item').classList.add('active');
    }
  });
});

// =======================================================
// WISH MODAL & SENDING LOGIC
// =======================================================

const wishModal = document.getElementById("wishModal");
const allBdayModal = document.getElementById("allBirthdaysModal");
const wishTargetName = document.getElementById("wishTargetName");
const wishMessage = document.getElementById("wishMessage");
const listContainer = document.getElementById("bdayListContainer");
const successWishModal = document.getElementById("successWishModal");
const successNameDisplay = document.getElementById("successName");

// Open Wish Modal
window.openWishModal = function(passedName, passedId) {
    
    // Safety Check: If clicked from slider but there are no birthdays today
    if (!passedName && !hasActiveBirthday) {
        // Do nothing or alert user
        return; 
    }

    let finalName = "your colleague";
    let finalId = null;

    // Case 1: Clicked from the List View (Name and ID passed directly)
    if (passedName && passedId) {
        finalName = passedName;
        finalId = passedId;
    } 
    // Case 2: Clicked "Send Wishes" under the Slider
    else {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            finalName = activeSlide.dataset.name;
            finalId = activeSlide.dataset.id;
            
            // If slider is somehow undefined (e.g. no data-id), abort
            if(!finalName || !finalId) return;
        }
    }

    // Set Global Receiver ID for sending later
    currentReceiverId = finalId;

    if (wishTargetName) wishTargetName.innerText = finalName;
    if (wishMessage) wishMessage.value = ""; // Clear text
    
    if (wishModal) wishModal.classList.add("active");
};

window.closeWishModal = function() {
    if (wishModal) wishModal.classList.remove("active");
};

// --- SUBMIT FUNCTION (SENDS NOTIFICATION) ---
window.submitWish = function() {
    const btn = document.querySelector(".btn-send-wish");
    if(!btn) return;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    const senderId = localStorage.getItem('employee_id');
    const message = document.getElementById("wishMessage").value || "Happy Birthday!";

    fetch("http://13.51.167.95:8000/api/notifications/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "sender": senderId,
            "receiver": currentReceiverId, 
            "message": message,
            "notification_type": "birthday_wish"
        })
    })
    .then(response => {
        closeWishModal();
        btn.innerHTML = originalText;
        openSuccessWishModal(wishTargetName.innerText);
    })
    .catch(error => {
        console.error("Notification Error:", error);
        // Fallback Success 
        closeWishModal();
        btn.innerHTML = originalText;
        openSuccessWishModal(wishTargetName.innerText);
    });
};

// --- SUCCESS MODAL FUNCTIONS ---
window.openSuccessWishModal = function(name) {
    if(successNameDisplay) successNameDisplay.innerText = name;
    if(successWishModal) successWishModal.classList.add("active");
};

window.closeSuccessWishModal = function() {
    if(successWishModal) successWishModal.classList.remove("active");
};

// --- VIEW ALL BIRTHDAYS (SHOWS UPCOMING ONLY) ---
window.openAllBirthdaysModal = function() {
    if (listContainer) {
        listContainer.innerHTML = ""; // Clear old list
        
        if(allFetchedBirthdays.length === 0){
            listContainer.innerHTML = "<p style='text-align:center; padding:10px'>No upcoming birthdays.</p>";
        }

        // Generate list from UPCOMING data only
        allFetchedBirthdays.forEach(person => {
            const item = document.createElement("div");
            item.className = "bday-item";
            item.innerHTML = `
                <div class="bday-left">
                    <img src="${person.profile_image ? person.profile_image : '../assets/profiledp.jpeg'}" onerror="this.src='../assets/profiledp.jpeg'">
                    <div class="bday-info">
                        <h4>${person.name}</h4>
                        <span>${person.dob || "Upcoming"} - ${person.role || 'Employee'}</span>
                    </div>
                </div>
                <button class="btn-mini-wish" onclick="openWishModal('${person.name}', '${person.id}')">
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
    if (event.target === successWishModal) closeSuccessWishModal();
};


// =========================================
// HOLIDAYS SECTION
// =========================================
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("holidayPopup");
    const openBtn = document.getElementById("viewHolidayBtn");
    const closeBtn = document.getElementById("closeHoliday");

    if(openBtn){
        openBtn.onclick = () => {
        popup.classList.add("active");
        };
    }

    if(closeBtn){
        closeBtn.onclick = () => {
        popup.classList.remove("active");
        };
    }

    window.onclick = (e) => {
        if(e.target === popup){
            popup.classList.remove("active");
        }
        if (e.target === wishModal) closeWishModal();
        if (e.target === allBdayModal) closeAllBirthdaysModal();
        if (e.target === successWishModal) closeSuccessWishModal();
    };
});