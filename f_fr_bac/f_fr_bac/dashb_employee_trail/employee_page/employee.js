document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // --- 1. BIRTHDAY SLIDER & WHATSAPP LOGIC ---
    // ==========================================
    const birthdays = [
        { 
            id: 1, 
            name: "Dhamodhar", 
            role: "IOS Developer", 
            date: "Today, 24 Oct", 
            phone: "918790997602", 
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

    let currentTargetPhone = ""; 
    let birthdaySwiper = null;
    const wrapper = document.getElementById("birthdayWrapper");
    const wishBtn = document.getElementById('sendWishBtn');

    function initBirthdaySlider() {
        if (!wrapper) return;
        wrapper.innerHTML = ""; 

        if (birthdays.length === 0) {
            wrapper.innerHTML = `<div class="swiper-slide"><div class="birthday-profile"><h3>No Birthdays Today</h3></div></div>`;
            return;
        }

        birthdays.forEach(person => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
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

        if (birthdaySwiper) birthdaySwiper.destroy(true, true);
        birthdaySwiper = new Swiper(".birthdaySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: birthdays.length > 1,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true }
        });
    }

    initBirthdaySlider();

    if (wishBtn) {
        wishBtn.addEventListener("click", function () {
            if (!birthdaySwiper) return;
            const person = birthdays[birthdaySwiper.realIndex];
            if (person) openWishModal(person);
        });
    }

    // Modal Elements
    const wishModal = document.getElementById("wishModal");
    const successWishModal = document.getElementById("successWishModal");
    const allBdayModal = document.getElementById("allBirthdaysModal");
    const wishTargetNameEl = document.getElementById("wishTargetName");
    const wishMessageEl = document.getElementById("wishMessage");

    window.openWishModal = function (personOrName) {
        if (birthdaySwiper) birthdaySwiper.autoplay.stop();
        let person = (typeof personOrName === 'string') ? birthdays.find(p => p.name === personOrName) : personOrName;
        if (person) {
            currentTargetPhone = person.phone;
            if (wishTargetNameEl) wishTargetNameEl.innerText = person.name;
            if (wishMessageEl) wishMessageEl.value = `Happy Birthday ${person.name}! 🎂 Wishing you a fantastic year ahead!`;
            if (wishModal) wishModal.classList.add("active");
        }
    };

    window.closeWishModal = function () {
        if (wishModal) wishModal.classList.remove("active");
        if (birthdaySwiper) birthdaySwiper.autoplay.start();
    };

    window.submitWish = function () {
        const btn = document.querySelector(".btn-send-wish");
        const cleanPhone = currentTargetPhone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(wishMessageEl.value)}`, '_blank');
        closeWishModal();
        if (successWishModal) successWishModal.classList.add("active");
    };

    window.closeSuccessWishModal = function () {
        if (successWishModal) successWishModal.classList.remove("active");
    };

    window.openAllBirthdaysModal = function () {
        const listContainer = document.getElementById("bdayListContainer");
        if (listContainer) {
            listContainer.innerHTML = birthdays.map(p => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.img}" style="width:40px; height:40px; border-radius:50%;" onerror="this.src='../assets/profiledp.jpeg'">
                        <div><h4 style="margin:0;">${p.name}</h4><span>${p.date}</span></div>
                    </div>
                    <button style="padding:5px 10px; background:#ff6b00; color:white; border:none; border-radius:4px;" onclick="openWishModal('${p.name}')">Wish</button>
                </div>`).join("");
        }
        if (allBdayModal) allBdayModal.classList.add("active");
    };

    window.closeAllBirthdaysModal = function () {
        if (allBdayModal) allBdayModal.classList.remove("active");
    };

    // ==========================================
    // --- 2. PROFILE IMAGE UPLOAD & HEADER SYNC ---
    // ==========================================
    // ==========================================
    // --- 2. PROFILE IMAGE UPLOAD (SERVER SYNC) ---
    // ==========================================
    const emp_id = localStorage.getItem('employee_id');
    const uploadInput = document.getElementById("imageUpload");
    const profileImage = document.getElementById("profileImage");

    window.openImageUpload = function() {
        if (uploadInput) uploadInput.click();
    };

    // 1. INITIAL FETCH: Get the image URL from the Database
    fetch(`http://13.51.167.95:8000/api/employee/dashboard/${emp_id}/`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("name").innerText = data.name;
        document.getElementById("role").innerText = data.role;
        document.getElementById("p_name").innerText = data.name;
        document.getElementById("p_role").innerText = data.role;
        document.getElementById("email").innerText = data.email;
        if(data.other_details && data.other_details.length > 0){
            document.getElementById("mobile").innerText = data.other_details[0].mobile;
        }

        // --- NEW: Load the image from the Server URL ---
        if (data.profile_pic) {
            const serverImageUrl = `http://13.51.167.95:8000${data.profile_pic}`;
            profileImage.src = serverImageUrl;
            
            // Sync to Header
            if (typeof loadUserProfile === "function") {
                const names = (data.name || "Employee").split(" ");
                loadUserProfile({
                    firstName: names[0],
                    lastName: names.length > 1 ? names.slice(1).join(" ") : "",
                    empId: data.employee_id || emp_id,
                    profilePic: serverImageUrl 
                });
            }
        }
    });

    // 2. UPLOAD HANDLER: Send file to Server
    if (uploadInput && profileImage) {
        uploadInput.addEventListener("change", function () {
            const file = this.files[0];
            if (!file) return;

            // Prepare the form data
            const formData = new FormData();
            formData.append("profile_pic", file); // Must match the field name in your Django model

            // Send to the new Django API endpoint
            fetch(`http://127.0.0.1:8000/api/upload-profile-pic/${emp_id}/`, {
                method: "PATCH",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.profile_pic_url) {
                    const fullUrl = `http://127.0.0.1:8000${data.profile_pic_url}`;
                    
                    // Update UI immediately with the server version
                    profileImage.src = fullUrl;
                    
                    // Update Top Header Instantly
                    if (typeof loadUserProfile === "function") {
                        const parts = document.getElementById("p_name").innerText.split(" ");
                        loadUserProfile({ 
                            firstName: parts[0], 
                            lastName: parts.length > 1 ? parts.slice(1).join(" ") : "", 
                            empId: emp_id, 
                            profilePic: fullUrl 
                        });
                    }
                    alert("Profile picture saved to server!");
                }
            })
            .catch(err => {
                console.error("Server upload failed:", err);
                alert("Failed to save image to server.");
            });
        });
    }

    // ==========================================
    // --- 3. UI SIDEBAR & HOLIDAYS ---
    // ==========================================
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const toggleBtn = document.getElementById("sidebarToggle");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");

    if(toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            mainContent.classList.toggle("expanded");
        });
    }

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => sidebar.classList.toggle("active"));
    }

    const holidayPopup = document.getElementById("holidayPopup");
    const openHoliday = document.getElementById("viewHolidayBtn");
    const closeHoliday = document.getElementById("closeHoliday");

    if(openHoliday) openHoliday.onclick = () => holidayPopup.classList.add("active");
    if(closeHoliday) closeHoliday.onclick = () => holidayPopup.classList.remove("active");

    window.onclick = function(event) {
        if (event.target === wishModal) closeWishModal();
        if (event.target === allBdayModal) closeAllBirthdaysModal();
        if (event.target === successWishModal) closeSuccessWishModal();
        if (event.target === holidayPopup) holidayPopup.classList.remove("active");
    };
});