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

//     //         const response = await fetch(`http://127.0.0.1:8000/api/employee-payslips/${empId}/`);

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
//     fetch(`http://127.0.0.1:8000/api/employee-payslips/${empId}/`)
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
    
    fetch(`http://13.60.26.193:8000/api/employee-payslips/${empId}/`)
    .then(res => res.json())
    .then(data => {
        payslipTableBody.innerHTML = "";
        console.log(data);

        if (!data || data.length === 0) {
            payslipTableBody.innerHTML = `<tr><td colspan="4">No payslips found</td></tr>`;
            return;
        }

        data.forEach(p => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <a href="#" class="month-link" 
                       data-month="${p.month}" 
                       data-name="${p.name}" 
                       data-gross="${p.gross_salary}" 
                       data-net="${p.net_salary}" 
                       data-basic="${p.basic_salary}" 
                       data-pf="${p.pf_amount}" 
                       data-tax="${p.professional_tax}" 
                       data-lop="${p.lop_amount}" 
                       data-days="${p.lop_days}">
                       ${p.month}
                    </a>
                </td>
                <td>Salary</td>
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

    payslipTableBody.addEventListener("click", function(e) {
    if (e.target.classList.contains("month-link")) {
        e.preventDefault();
        openPayslipWindow(e.target.dataset);
    }
});

function openPayslipWindow(data) {
    const month = data.month;
    const empName = data.name;
    const gross = data.gross;
    const net = data.net;
    const basic = data.basic;
    const pf = data.pf;
    const tax = data.tax;
    const lop = data.lop;
    const days = data.days;

    const newWin = window.open("", "_blank");
    newWin.document.write(`
        <html>
        <head>
            <title>Payslip - ${month}</title>
            <style>
                /* Center the card vertically and horizontally */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full viewport height */
  margin: 0;
  background: #f2f2f2; /* Light gray background for contrast */
  font-family: 'Arial', sans-serif;
}

/* Container card */
.preview-card {
  background: #f9f9f9;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  padding: 30px; /* Increased padding */
  box-sizing: border-box;
  border: none;
  min-height: 500px; /* Increased height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

/* Header with title and draft badge */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  font-weight: bold;
  font-size: 16px;
}

.badge-warning {
  background: #fff8dd;
  color: #ffc700;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Payslip inner ticket */
.payslip-ticket {
  background: #fff;
  padding: 30px; /* More padding */
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-top: 4px solid #ff5722; /* Orange top border */
}

/* Top section with logo and month */
.ticket-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px; /* More spacing */
}

.logo-area img {
  height: 40px; /* Slightly bigger logo */
  width: 120px;
}

/* Employee summary row */
.employee-summary {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px dashed #ccc;
  margin-bottom: 20px;
}

.lbl {
  display: block;
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
}

.val {
  font-size: 14px; /* Slightly bigger text */
  font-weight: 600;
  color: #333;
}

/* Salary calculation table */
.calc-table {
  font-size: 13px;
}

.ct-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* More spacing */
}

.ct-row.head {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.ct-row.subtotal {
  font-weight: 600;
  border-top: 1px solid #ccc;
  padding-top: 5px;
  margin-top: 5px;
  color: #333;
}

.ct-row.deduct {
  color: #ff3b30; /* Red color for deductions */
}

.ct-divider,
.ct-divider-total {
  border-bottom: 1px dashed #ccc;
  margin: 5px 0;
}

.ct-divider-total {
  border-bottom: 2px solid #333;
  margin: 10px 0;
}

.total-pay {
  font-size: 20px; /* Slightly bigger net payable */
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  color: #333;
}

.ticket-footer-note {
  font-size: 11px;
  color: #999;
  margin-top: 10px;
  font-style: italic;
  text-align: center;
}
            </style>
        </head>
        <body>
            <div class="card preview-card">
                
                
                <div class="payslip-ticket">
                    <div class="ticket-top">
                        <div class="logo-area">
                            <img style="height: 30px; width: 100px;" src="../assets/opptylogo.png" alt="logo">
                        </div>
                        <div class="payslip-month" id="prevMonthYear">${month}</div>
                    </div>
                    
                    <div class="employee-summary">
                        <div>
                            <span class="lbl">Employee</span>
                            <span class="val" id="prevName">${empName}</span>
                        </div>
                        <div class="text-right">
                            <span class="lbl">Paid Days</span>
                            <span class="val" id="prevDays">${days}</span>
                        </div>
                    </div>

                    <div class="calc-table">
                        <div class="ct-row head">
                            <span>Description</span>
                            <span>Amount</span>
                        </div>
                        <div class="ct-row"><span>Basic Salary</span> <span id="prevBasic">₹${basic}</span></div>
                        <div class="ct-row subtotal"><span>Gross Salary</span> <span id="prevGross">₹${gross}</span></div>
                        
                        <div class="ct-divider"></div>
                        <div class="ct-row deduct"><span>PF (12% of Basic)</span> <span id="prevPf">-₹${pf}</span></div>
                        <div class="ct-row deduct"><span>Professional Tax</span> <span id="prevTax">-₹${tax}</span></div>
                        <div class="ct-row deduct" style="font-weight: 600;">
                            <span>LOP (<span id="prevLopDays">${lop}</span> Days)</span> 
                            <span id="prevLop">-₹${lop}</span>
                        </div>
                        
                        <div class="ct-divider-total"></div>
                        
                        <div class="ct-row total-pay">
                            <span>Net Payable</span>
                            <span id="prevNet">₹${net}</span>
                        </div>
                        <div style="font-size: 10px; color: #999; margin-top: 5px;">
                            (In Words: <span id="amountWords">Zero Only</span>)
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    newWin.document.close();
}
});
