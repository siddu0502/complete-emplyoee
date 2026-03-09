const emp_id = localStorage.getItem("employee_id");
    fetch(`http://192.168.1.16:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;})
fetch(`http://192.168.1.16:8000/api/employee/leaves/${emp_id}/`)

        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById('taken').innerText = data.taken
            document.getElementById('casual').innerText = data.casual_taken
            document.getElementById('sick').innerText = data.sick_taken
            // document.getElementById('taken').innerText = data.taken
            document.getElementById('lop').innerText = data.lop
            document.getElementById('remaining').innerText = data.remaining
        })
function showToast(message, type = 'error') {
    toastMsg.innerText = message;
    
    if(type === 'success') {
        toast.classList.add('success');
        toast.querySelector('i').className = "fa-solid fa-circle-check";
    } else {
        toast.classList.remove('success');
        toast.querySelector('i').className = "fa-solid fa-circle-exclamation";
    }

    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// =============================
// DOM ELEMENTS
// =============================
const modal = document.getElementById("lmLeaveModal");
const openBtn = document.querySelector(".btn-trigger");
const closeBtn = document.getElementById("lmCloseBtn");
const cancelBtn = document.getElementById("lmCancelBtn");

const empNameIn = document.getElementById("lmEmpName");
const leaveTypeIn = document.getElementById("lmLeaveType");
const fromDateIn = document.getElementById("lmFromDate");
const toDateIn = document.getElementById("lmToDate");
const numDaysIn = document.getElementById("lmNumDays");
const balanceIn = document.getElementById("lmBalance");
const reasonIn = document.getElementById("lmReason");

const leaveForm = document.getElementById("lmLeaveForm");


// =============================
// MODAL OPEN / CLOSE
// =============================
openBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

function closeModal() {
    modal.classList.remove("active");
    resetForm();
}


document.getElementById('taken').innerText=
// =============================
// AUTO CALCULATE LEAVE DAYS
// =============================
fromDateIn.addEventListener("change", calculateDays);
toDateIn.addEventListener("change", calculateDays);

function calculateDays() {

    if (!fromDateIn.value || !toDateIn.value) {
        numDaysIn.value = 0;
        return;
    }

    const start = new Date(fromDateIn.value);
    const end = new Date(toDateIn.value);

    if (end < start) {
        alert("To Date cannot be before From Date");
        toDateIn.value = "";
        numDaysIn.value = 0;
        return;
    }

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    numDaysIn.value = diffDays + 1;
}


// =============================
// APPLY LEAVE (POST API)
// =============================
leaveForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const leaveType = leaveTypeIn.value;
    const fromDate = fromDateIn.value;
    const toDate = toDateIn.value;
    const numDays = numDaysIn.value;
    const balance = balanceIn.value;
    const reason = reasonIn.value;

    if (!leaveType || !fromDate || !toDate || !reason) {
        alert("Please fill all required fields");
        return;
    }

    const data = {

        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate,
        number_of_days: parseInt(numDays),
       remaining_leaves: balance === "-" ? 0 : parseInt(balance),
        reason: reason

    };

    fetch(`http://192.168.1.16:8000/api/employee/apply-leave/${emp_id}/`, {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })
    .then(response => response.json())
    .then(result => {

        console.log(result);
        

       alert("leave request submitted")

        closeModal();

    })
    .catch(error => {

        console.error("Error:", error);
        alert("Error applying leave");

    });

});


// =============================
// CHECK LEAVE STATUS EVERY 5s
// =============================
document.addEventListener("DOMContentLoaded", function () {

    setInterval(() => {

        fetch(`http://192.168.1.16:8000/api/employee/apply-leave/${emp_id}/`)
        .then(response => response.json())
        .then(data => {

            data.forEach(leave => {

                if (leave.status === "approved") {
                    alert("Your leave was approved");
                }

                if (leave.status === "rejected") {
                    alert("Your leave was rejected");
                }

            });

        });

    }, 5000);

});


// =============================
// RESET FORM
// =============================
function resetForm() {

    leaveForm.reset();

    numDaysIn.value = 0;
    balanceIn.value = "-";

}