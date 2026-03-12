// ==========================================
// 1. CONFIGURATION & GLOBAL VARIABLES
// ==========================================

const API_BASE_URL = "http://127.0.0.1:8000"; 

// 1. Get the ID saved by your Login script
const EMP_ID = localStorage.getItem("employee_id"); 

// 2. Initialize Name/Role (Will update these from API in a moment)
let EMP_NAME = localStorage.getItem("emp_name") || "Employee"; 
let EMP_ROLE = localStorage.getItem("emp_role") || "Associate Software Engineer";

document.addEventListener("DOMContentLoaded", async () => {
    
    // Check Login
    if (!EMP_ID) {
        window.location.href = "../employee_login/emp_login.html"; 
        return;
    }

    console.log(`Logged in as ID: ${EMP_ID}. Fetching Profile Name...`);

    // --- STEP 1: FETCH REAL NAME FROM BACKEND ---
    await fetchEmployeeProfile(EMP_ID);

    // --- STEP 2: LOAD ASSETS ---
    loadEmployeeAssets(EMP_ID);
});

// ==========================================
// 2. FETCH PROFILE (GET NAME)
// ==========================================

async function fetchEmployeeProfile(id) {
    try {
        // We call the dashboard API to get the name associated with this ID
        const response = await fetch(`${API_BASE_URL}/api/employee/dashboard/${id}/`);
        
        if (response.ok) {
            const data = await response.json();
            
            // 1. Update Global Variable
            if(data.name) EMP_NAME = data.name;
            if(data.role) EMP_ROLE = data.role;

            console.log("Updated Name:", EMP_NAME);

            // 2. Update Sidebar & Header UI
            document.querySelectorAll("#name").forEach(el => el.innerText = EMP_NAME);
            
            const roleEl = document.getElementById("role");
            if(roleEl) roleEl.innerText = EMP_ROLE;

            const idEl = document.getElementById("employee_id");
            if(idEl) idEl.innerText = id;
            
            // 3. Update Request Popup Name (if it exists)
            const popupName = document.querySelector("#assetRequest #name");
            if(popupName) popupName.innerText = EMP_NAME;

        }
    } catch (error) {
        console.error("Could not fetch profile name:", error);
    }
}

// ==========================================
// 3. FETCH & RENDER ASSETS
// ==========================================

async function loadEmployeeAssets(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employee-assets/${id}/`);

        if (!response.ok) throw new Error("Failed to fetch assets");

        const data = await response.json();
        
        renderAssetChart(data);

        const tableBody = document.getElementById("ast-table-body");
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No assets allocated</td></tr>`;
            return;
        }

        data.forEach(asset => {
            let badgeClass = "ast-badge-active"; 
            if (asset.status === "returned") badgeClass = "ast-badge-returned"; 

            const row = `
            <tr>
                <td>
                    <div class="ast-row-info">
                        <div class="ast-icon-box">
                            <i class="fa-solid fa-laptop"></i>
                        </div>
                        <div>
                            <strong>${asset.asset_type}</strong>
                            <span>${asset.model_details}</span>
                        </div>
                    </div>
                </td>
                <td>${asset.asset_id}</td>
                <td>${asset.assigned_date}</td>
                <td><span class="ast-badge ${badgeClass}">${asset.status}</span></td>
            </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading assets:", error);
    }
}


// ==========================================
// 4. ASSET REQUEST LOGIC (POST)
// ==========================================

function openAssetRequest() {
    document.getElementById("assetRequest").style.display = "flex";
    // Ensure name is visible in popup
    const popupName = document.querySelector("#assetRequest #name");
    if(popupName) popupName.innerText = EMP_NAME;
}

function closeAssetRequest() {
    document.getElementById("assetRequest").style.display = "none";
}

function submitAssetRequest() {
    const Asset_catagory = document.getElementById("AssetCategory").value;
    const Asset_Des = document.getElementById("assetDes").value;
    const Asset_loc = document.getElementById("assetLocation").value;

    if (!Asset_catagory || !Asset_Des || !Asset_loc) {
        showToast("error", "Please fill all fields");
        return;
    }

    const payload = {
        emp_id: EMP_ID, 
        employee_name: EMP_NAME, // Uses the fetched name
        asset_category: Asset_catagory,
        description: Asset_Des,
        location: Asset_loc,
        status: "Pending"
    };

    fetch(`${API_BASE_URL}/api/asset-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
    })
    .then(data => {
        showToast("success", "Asset request sent");
        closeAssetRequest();
        document.getElementById("AssetCategory").value = "";
        document.getElementById("assetDes").value = "";
        document.getElementById("assetLocation").value = "";
    })
    .catch(err => {
        console.error(err);
        showToast("error", "Failed to send request");
    });
}


// ==========================================
// 5. ASSET RETURN LOGIC (POST)
// ==========================================

function openAssetPopup() {
    document.getElementById("assetReturnPopup").style.display = "flex";
}

function closeAssetReturn() {
    document.getElementById("assetReturnPopup").style.display = "none";
}

function submitAssetReturn() {
    const asset = document.getElementById("assetType").value;
    const condition = document.getElementById("assetCondition").value;
    const reason = document.getElementById("assetreason").value;

    if (!asset || !condition || !reason) {
        showToast("error", "Please fill all fields");
        return;
    }

    const payload = {
        emp_id: EMP_ID,
        employee_name: EMP_NAME, // Uses the fetched name
        asset_type: asset,
        condition: condition,
        description: reason,
        status: "Pending"
    };

    fetch(`${API_BASE_URL}/api/asset-return/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("Return Request failed");
        return res.json();
    })
    .then(data => {
        showToast("success", "Return request sent");
        closeAssetReturn();
        document.getElementById("assetType").value = "";
        document.getElementById("assetCondition").value = "";
        document.getElementById("assetreason").value = "";
    })
    .catch(err => {
        console.error(err);
        showToast("error", "Failed to submit return");
    });
}


// ==========================================
// 6. CHART & UI HELPERS
// ==========================================

let assetChart = null;

function renderAssetChart(assets) {
    const assetTypes = ["Laptop", "Monitor", "Keyboard", "Mouse", "Phone"];
    const assetCount = { Laptop: 0, Monitor: 0, Keyboard: 0, Mouse: 0, Phone: 0 };

    assets.forEach(asset => {
        const type = Object.keys(assetCount).find(key => key.toLowerCase() === asset.asset_type.toLowerCase());
        if (type) assetCount[type]++;
    });

    const labels = assetTypes;
    const values = assetTypes.map(type => assetCount[type]);
    const maxValue = Math.max(...values);
    const chartMax = maxValue > 0 ? Math.ceil(maxValue / 5) * 5 : 5; 

    const ctx = document.getElementById("ast-main-chart");
    if (!ctx) return; 

    if (assetChart) assetChart.destroy();

    assetChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Assets",
                data: values,
                backgroundColor: ["#FF5B1E", "#164E63", "#FCD34D", "#10B981", "#6366F1"],
                borderRadius: 6,
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: chartMax, grid: { color: "#f3f4f6" } },
                x: { grid: { display: false } }
            }
        }
    });
}

function showToast(type, message) {
    const toast = document.getElementById("popupToast");
    const icon = document.getElementById("toastIcon");
    const title = document.getElementById("toastTitle");
    const msg = document.getElementById("toastMsg");

    toast.classList.remove("success", "error");

    if (type === "success") {
        toast.classList.add("success");
        icon.className = "fa-solid fa-circle-check";
        title.innerText = "Success";
    } else {
        toast.classList.add("error");
        icon.className = "fa-solid fa-circle-exclamation";
        title.innerText = "Error";
    }

    msg.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Sidebar Logic
const sidebar = document.getElementById('sidebar');
const mobileBtn = document.getElementById('mobileMenuBtn'); 

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active'); 
    });
}

function logoutUser(){
    localStorage.clear();
    window.location.href = "../employee_login/emp_login.html";
}