document.addEventListener('DOMContentLoaded', () => {

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