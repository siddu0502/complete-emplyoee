// document.addEventListener('DOMContentLoaded', function() {
    
//     // --- 1. Toggle Mobile Sidebar ---
//     const mobileBtn = document.getElementById('mobileMenuBtn');
//     const sidebar = document.getElementById('sidebar');

//     if(mobileBtn) {
//         mobileBtn.addEventListener('click', () => {
//             // Simple toggle class for mobile view
//             if (sidebar.style.display === 'flex') {
//                 sidebar.style.display = 'none';
//             } else {
//                 sidebar.style.display = 'flex';
//             }
//         });
//     }

//     // --- 2. Chart Configuration ---
//     const ctx = document.getElementById('salaryChart');
//     if(ctx) {
//         const ctx2d = ctx.getContext('2d');

//         // Gradient
//         let gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
//         gradient.addColorStop(0, 'rgba(255, 102, 0, 0.25)'); // Orange
//         gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

//         new Chart(ctx2d, {
//             type: 'line',
//             data: {
//                 labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
//                 datasets: [{
//                     label: 'Gross Salary',
//                     data: [21000, 21000, 21000, 21000, 21000],
//                     borderColor: '#ff6600',
//                     backgroundColor: gradient,
//                     borderWidth: 2,
//                     pointBackgroundColor: '#000',
//                     pointBorderColor: '#ff6600',
//                     pointRadius: 4,
//                     fill: true,
//                     tension: 0
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: { display: false }
//                 },
//                 scales: {
//                     y: {
//                         grid: { color: '#333' },
//                         ticks: { color: '#888' },
//                         min: 20000,
//                         max: 22000
//                     },
//                     x: {
//                         grid: { display: false },
//                         ticks: { color: '#888' }
//                     }
//                 }
//             }
//         });
//     }

//     // --- 3. Interaction Functions ---
//     window.downloadSlips = function() {
//         alert("Downloading payslips for selected financial year...");
//     };
// });


// document.addEventListener("DOMContentLoaded", () => {

//     const empId = localStorage.getItem('employee_id');
//     console.log(empId)
//     const payslipTableBody = document.getElementById("payslipTableBody");

//     if (!payslipTableBody) {
//         console.error("Payslip table body not found in DOM!");
//         return;
//     }

//     // async function fetchPayslips() {

//     //     try {

//     //         const response = await fetch(`http://13.60.70.185:8000/api/employee-payslips/${empId}/`);

//     //         if (!response.ok) {
//     //             throw new Error(HTTP `${response.status}`);
//     //         }

//     //         const data = await response.json();

//     //         payslipTableBody.innerHTML = "";

//     //         if (data.length === 0) {
//     //             payslipTableBody.innerHTML =
//     //                 <tr><td colspan="4">No payslips found</td></tr>;
//     //             return;
//     //         }

//     //         data.forEach(p => {

//     //             const row = document.createElement("tr");

//     //             row.innerHTML = `
//     //                 <td>${p.month}</td>
//     //                 <td>${p.employee_name}</td>
//     //                 <td>₹${p.gross_salary}</td>
//     //                 <td>₹${p.net_salary}</td>
//     //             `;

//     //             payslipTableBody.appendChild(row);

//     //         });

//     //     } catch (error) {

//     //         console.error("Error fetching payslips:", error);

//     //         payslipTableBody.innerHTML =
//     //             <tr><td colspan="4">Error loading payslips</td></tr>;

//     //     }

//     // }

//     // fetchPayslips();
//     fetch(`http://13.60.70.185:8000/api/employee-payslips/${empId}/`)
//     .then(res => res.json())
//     .then(data => {
//         payslipTableBody.innerHTML = ""
//          if (data.length === 0) {
//                 payslipTableBody.innerHTML =
//                     <tr><td colspan="4">No payslips found</td></tr>;
//                 return;
//             }
//         data.forEach(p => {
//                 const row = document.createElement("tr");
//                 row.innerHTML = `
//                     <td>${p.month}</td>
//                     <td>${p.employee_name}</td>
//                     <td>₹${p.gross_salary}</td>
//                     <td>₹${p.net_salary}</td>
//                 `;
//                 payslipTableBody.appendChild(row);

//             });
//     })

// });


document.addEventListener("DOMContentLoaded", () => {

    const empId = localStorage.getItem('employee_id');
    
    fetch(`http://13.51.167.95:8000/api/employee/dashboard/${empId}/`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;})
    console.log("Employee ID:", empId);

    const payslipTableBody = document.getElementById("payslipTableBody");

    if (!payslipTableBody) {
        console.error("Payslip table body not found in DOM!");
        return;
    }

    if (!empId) {
        payslipTableBody.innerHTML = `<tr><td colspan="4">Employee ID not found. Please login.</td></tr>`;
        return;
    }

    fetch(`http://13.51.167.95:8000/api/employee-payslips/${empId}/`)
        .then(res => res.json())
        .then(data => {
            payslipTableBody.innerHTML = "";
            console.log(data)
            if (!data || data.length === 0) {
                payslipTableBody.innerHTML = `<tr><td colspan="4">No payslips found</td></tr>`;
                return;
            }

            data.forEach(p => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${p.month}</td>
                    <td>Associate Software Engineer</td>
                    <td>₹${p.gross_salary}</td>
                    <td>₹${p.net_salary}</td>
                `;
                payslipTableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error("Error fetching payslips:", err);
            payslipTableBody.innerHTML = `<tr><td colspan="4">Error loading payslips</td></tr>`;
        });
});