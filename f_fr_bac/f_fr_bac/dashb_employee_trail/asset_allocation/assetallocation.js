
const emp_id = "123";
console.log("Employee ID from localStorage:", emp_id);
document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://127.0.0.1:8000/api/employee-assets/${emp_id}/`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Dashboard API failed");
            }
            return res.json();
        })
        .then(data => {
            console.log(data)

            document.getElementById("name").innerText = data.name;
            document.getElementById("role").innerText = data.role;

            loadEmployeeAssets(emp_id);
        })
        .catch(error => {
            console.error("Dashboard API error:", error);
        });

    // --- 1. Sidebar Toggles ---
    const sidebar = document.getElementById('ast-sidebar');
    const toggleBtn = document.getElementById('ast-sidebar-toggle');
    const mobileBtn = document.getElementById('ast-mobile-menu-btn');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('ast-collapsed');
        });
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('ast-mobile-active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar.classList.contains('ast-mobile-active')) {
            if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
                sidebar.classList.remove('ast-mobile-active');
            }
        }
    });

    // --- 2. Filter Table Logic ---
    const filterSelect = document.getElementById('ast-filter-type');
    const tableRows = document.querySelectorAll('#ast-table-body tr');

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value.toLowerCase();

            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                // Simple filter logic
                if (filterValue === 'all' || text.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
let assetChart = null;

function renderAssetChart(assets) {

    // Always show these asset types
    const assetTypes = ["Laptop", "Monitor", "Keyboard", "Mouse", "Phone"];

    // Initialize counts
    const assetCount = {
        Laptop: 0,
        Monitor: 0,
        Keyboard: 0,
        Mouse: 0,
        Phone: 0
    };

    // Count assets from backend
    assets.forEach(asset => {
        const type = asset.asset_type;

        if (assetCount[type] !== undefined) {
            assetCount[type]++;
        }
    });

    // Prepare chart data
    const labels = assetTypes;
    const values = assetTypes.map(type => assetCount[type]);

    // Calculate dynamic Y-axis max
    const maxValue = Math.max(...values);
    const chartMax = Math.ceil(maxValue / 15) * 15 || 15;

    const ctx = document.getElementById("ast-main-chart");

    // Destroy old chart if exists
    if (assetChart) {
        assetChart.destroy();
    }

    assetChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Assets",
                data: values,
                backgroundColor: [
                    "#FF5B1E",
                    "#164E63",
                    "#FCD34D",
                    "#10B981",
                    "#6366F1"
                ],
                borderRadius: 6,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: chartMax,
                    ticks: {
                        stepSize: 15,
                        precision: 0
                    },
                    grid: {
                        color: "#f3f4f6"
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

}



function openAssetPopup() {
    document.getElementById("assetReturnPopup").style.display = "flex";

}
function closeAssetReturn() {
    document.getElementById("assetReturnPopup").style.display = "none";
}
function submitAssetReturn() {
    const emp_id = "123"
    const emp_name = document.getElementById("name").innerText;
    const asset = document.getElementById("assetType").value;
    const condition = document.getElementById("assetCondition").value;
    const reason = document.getElementById("assetreason").value;

    if (!asset) {
        showToast("error", "Please fill all fields");
        return;
    }

    fetch("http://127.0.0.1:8000/api/asset-return/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            emp_id: emp_id,
            employee_name: emp_name,
            asset_type: asset,
            condition: condition,
            description: reason

        })
    })
        .then(res => res.json())
        .then(data => {

            console.log(data);

        })




    showToast("success", "Asset return submitted");
    document.getElementById("assetType").value = ""
    document.getElementById("assetCondition").value = ""
    document.getElementById("assetreason").value = ""
    closeAssetReturn()

}

function openAssetRequest() {
    document.getElementById("assetRequest").style.display = "flex";
}

function closeAssetRequest() {
    document.getElementById("assetRequest").style.display = "none";
}
function submitAssetRequest() {



    const emp_id = "123";
    const emp_name = document.getElementById("name").innerText;

    const Asset_catagory = document.getElementById("AssetCategory").value;
    const Asset_Des = document.getElementById("assetDes").value;
    const Asset_loc = document.getElementById("assetLocation").value;

    if (!Asset_catagory || !Asset_Des || !Asset_loc) {
        showToast("error", "Please fill all fields");
        return;
    }

    fetch("http://127.0.0.1:8000/api/asset-request/", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            emp_id: emp_id,
            employee_name: emp_name,
            asset_category: Asset_catagory,
            description: Asset_Des,
            location: Asset_loc

        })

    })
        .then(res => res.json())
        .then(data => {

            console.log(data);

            showToast("success", "Asset request sent to admin");

            document.getElementById("AssetCategory").value = "";
            document.getElementById("assetDes").value = "";
            document.getElementById("assetLocation").value = "";

            closeAssetRequest();

        })
        .catch(err => {
            console.error(err);
            showToast("error", "Request failed");
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
async function loadEmployeeAssets(emp_id) {

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/employee-assets/${emp_id}/`
        );

        const data = await response.json();
        console.log("Employee Assets:", data);
        renderAssetChart(data);

        const tableBody = document.getElementById("ast-table-body");
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">No assets allocated</td>
                </tr>
            `;
            return;
        }


        data.forEach(asset => {

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
<td>${asset.emp_id}</td>
<td>${asset.assigned_date}</td>
<td><span class="ast-badge ast-badge-active">${asset.status}</span></td>

</tr>
`;

            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading assets:", error);
    }
}
