const emp_id = localStorage.getItem("employee_id");
document.addEventListener('DOMContentLoaded', () => {
    emp_id = localStorage.getItem('employee_id')
fetch(`http://192.168.1.16:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;})
    // --- 1. Sidebar Toggles ---
    const sidebar = document.getElementById('ast-sidebar');
    const toggleBtn = document.getElementById('ast-sidebar-toggle');
    const mobileBtn = document.getElementById('ast-mobile-menu-btn');

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('ast-collapsed');
        });
    }

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('ast-mobile-active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if(window.innerWidth <= 992 && sidebar.classList.contains('ast-mobile-active')) {
            if(!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
                sidebar.classList.remove('ast-mobile-active');
            }
        }
    });

    // --- 2. Filter Table Logic ---
    const filterSelect = document.getElementById('ast-filter-type');
    const tableRows = document.querySelectorAll('#ast-table-body tr');

    if(filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value.toLowerCase();

            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                // Simple filter logic
                if(filterValue === 'all' || text.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- 3. Chart Configuration ---
    const chartCanvas = document.getElementById('ast-main-chart');
    
    if(chartCanvas) {
        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Laptops', 'Monitors', 'Keyboards', 'Mice', 'Phones'],
                datasets: [{
                    label: 'Assets',
                    data: [15, 20, 12, 12, 5],
                    backgroundColor: [
                        '#FF5B1E', // Orange (Primary)
                        '#164E63', // Teal (Secondary)
                        '#FCD34D', // Yellow
                        '#10B981', // Green
                        '#6366F1'  // Indigo
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
});
function openAssetPopup(){
        document.getElementById("assetReturnPopup").style.display="flex";

    }
    function closeAssetReturn(){
        document.getElementById("assetReturnPopup").style.display="none";
    }
    function submitAssetReturn(){
        const asset=document.getElementById("assetType").value;
        const condition=document.getElementById("assetCondition").value;
        const reason=document.getElementById("assetreason").value;
        
        if(!asset){
            alert("please select asset");
            return;
        }
        console.log(
        {
            asset_type:asset,
            asset_condition:condition,
            asset_reason:reason



        })
        alert("asset request sent succussfully")
        document.getElementById("assetType").value=""
        document.getElementById("assetCondition").value=""
        document.getElementById("assetreason").value=""
        closeAssetReturn()

    }

    function openAssetRequest(){
        document.getElementById("assetRequest").style.display="flex";
    }

    function closeAssetRequest(){
        document.getElementById("assetRequest").style.display="none";
    }
    function submitAssetRequest(){

        

    if(!emp_id){
        alert("Employee ID not found");
        return;
    }
        
        const Asset_catagory=document.getElementById("AssetCategory").value;
        const Asset_Des=document.getElementById("assetDes").value;
        const Asset_loc=document.getElementById("assetLocation").value;

        if(!Asset_catagory || !Asset_Des || !Asset_loc){
            alert("Please fill all fields");
            return;
        }
        fetch(`http://192.168.1.16:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            const emp_name=data.name;
        console.log({
            name: emp_name,
            catagory:Asset_catagory,
            des:Asset_Des,
            loc:Asset_loc
        });
        document.getElementById("name").innerText = emp_name;
        alert("success")
        document.getElementById("AssetCategory").value = "";
        document.getElementById("assetDes").value = "";
        document.getElementById("assetLocation").value = "";
        closeAssetRequest()


        })
    .catch(error => console.error("Error:", error));
}
