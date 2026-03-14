document.addEventListener("DOMContentLoaded", () => {

    const empId = localStorage.getItem('employee_id');
    console.log("Employee ID:", empId);

    const payslipTableBody = document.getElementById("payslipTableBody");

    if (!payslipTableBody) {
        console.error("Payslip table body not found in DOM!");
        return;
    }

    fetch(`http://13.51.167.95:8000/api/employee/dashboard/${empId}/`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").innerText = data.name;
            document.getElementById("role").innerText = data.role;
        });

    if (!empId) {
        payslipTableBody.innerHTML = `<tr><td colspan="4">Employee ID not found. Please login.</td></tr>`;
        return;
    }

    fetch(`http://13.51.167.95:8000/api/employee-payslips/${empId}/`)
        .then(res => res.json())
        .then(data => {
            payslipTableBody.innerHTML = "";

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

    // Move event listener inside
    payslipTableBody.addEventListener("click", function(e) {
        if (e.target.classList.contains("month-link")) {
            e.preventDefault();
            openPayslipWindow(e.target.dataset);
        }
    });

});