// --- GLOBAL VARIABLES TO STORE DATA ---
let allFetchedBirthdays = []; // Stores UPCOMING data for "View All"
let currentReceiverId = null; // Stores the ID of the person we are wishing
let hasActiveBirthday = false; // Flag to check if there is a birthday today

function openImageUpload() {
  const fileInput = document.getElementById("imageUpload");
  if (fileInput) {
    fileInput.click();
  }
}

document.addEventListener("DOMContentLoaded", async function () {

  try {
    const res = await fetch("http://13.51.167.95:8000/api/birthdays/");
    const data = await res.json();

    const wrapper = document.getElementById("birthdayWrapper");
    const wishBtn = document.querySelector('.wish-btn'); // Get the Send Wish button
    
    if (!wrapper) return;

    wrapper.innerHTML = "";
    allFetchedBirthdays = []; // Clear list
    hasActiveBirthday = false; // Reset flag

    // 1. 🎂 PROCESS TODAY'S BIRTHDAYS (SLIDER ONLY)
    if (data.today && data.today.length > 0) {
      hasActiveBirthday = true;
      
      data.today.forEach(emp => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        // IMPORTANT: Add data-id so we know who to wish
        slide.dataset.id = emp.id;
        slide.dataset.name = emp.name;

        slide.innerHTML = `
          <div class="birthday-profile">
            <img src="${emp.profile_image ? emp.profile_image : '../assets/profiledp.jpeg'}" onerror="this.src='../assets/profiledp.jpeg'">
            <h3>${emp.name}</h3>
            <p>🎂 Birthday Today</p>
          </div>
        `;
        wrapper.appendChild(slide);
      });

      // Enable the button visually
      if(wishBtn) {
        wishBtn.style.opacity = "1";
        wishBtn.style.cursor = "pointer";
        wishBtn.innerText = "Send Wishes";
      }

    } else {
      // 2. 🚫 NO ACTIVE BIRTHDAYS LOGIC
      hasActiveBirthday = false;
      
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      // No ID attached here
      slide.innerHTML = `
        <div class="birthday-profile">
          <img src="../assets/profiledp.jpeg" style="filter: grayscale(100%); opacity: 0.5;">
          <h3>No Active Birthdays</h3>
          <p>Check "View All" for upcoming</p>
        </div>
      `;
      wrapper.appendChild(slide);

      // Disable the wish button visually
      if(wishBtn) {
        wishBtn.style.opacity = "0.6";
        wishBtn.style.cursor = "not-allowed";
        wishBtn.innerText = "No Birthdays Today";
      }
    }

    // 3. 🎉 PROCESS UPCOMING BIRTHDAYS (VIEW ALL LIST ONLY)
    // We DO NOT add these to the slider wrapper anymore
    if (data.upcoming && data.upcoming.length > 0) {
      data.upcoming.forEach(emp => {
        // Add to global list for "View All" logic
        allFetchedBirthdays.push({ ...emp, label: "Upcoming", displayDate: emp.dob || "Upcoming" });
      });
    }

    // Initialize Swiper
    new Swiper(".birthdaySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: hasActiveBirthday, // Only loop if there are actual birthdays
      autoplay: hasActiveBirthday ? {
        delay: 3000,
        disableOnInteraction: false
      } : false, // Disable autoplay if no birthdays
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    });

  } catch (error) {
    console.error("Birthday fetch error:", error);
  }

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
// window.openWishModal = function(passedName, passedId) {
    
//     // Safety Check: If clicked from slider but there are no birthdays today
//     if (!passedName && !hasActiveBirthday) {
//         // Do nothing or alert user
//         return; 
//     }

//     let finalName = "your colleague";
//     let finalId = null;

//     // Case 1: Clicked from the List View (Name and ID passed directly)
//     if (passedName && passedId) {
//         finalName = passedName;
//         finalId = passedId;
//     } 
//     // Case 2: Clicked "Send Wishes" under the Slider
//     else {
//         const activeSlide = document.querySelector('.swiper-slide-active');
//         if (activeSlide) {
//             finalName = activeSlide.dataset.name;
//             finalId = activeSlide.dataset.id;
            
//             // If slider is somehow undefined (e.g. no data-id), abort
//             if(!finalName || !finalId) return;
//         }
//     }

//     // Set Global Receiver ID for sending later
//     currentReceiverId = finalId;

//     if (wishTargetName) wishTargetName.innerText = finalName;
//     if (wishMessage) wishMessage.value = ""; // Clear text
    
//     if (wishModal) wishModal.classList.add("active");
// };

function openWishModal(phone,name){
  const url =`whatsapp://send?phone=${phone}?text=${encodeURIComponent('happy birthday')}`;
  window.open(url,'_blank')
}

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