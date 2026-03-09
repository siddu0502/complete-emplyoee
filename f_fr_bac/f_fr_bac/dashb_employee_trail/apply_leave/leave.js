// // let notifiedLeaves = {};
// // const emp_id = localStorage.getItem('employee_id')
// // console.log(emp_id)
// // document.addEventListener('DOMContentLoaded', () => {

// //     setInterval(() => {

// //         fetch(`http://127.0.0.1:8000/api/employee/apply-leave/${emp_id}`)
// //             .then(response => response.json())
// //             .then(data => {

// //                 data.forEach(leave => {

// //                     if (!notifiedLeaves[leave.id]) {

// //                         if (leave.status === "approved") {
// //                             alert("Your leave was approved!");
// //                             notifiedLeaves[leave.id] = "approved";
// //                         }

// //                         if (leave.status === "rejected") {
// //                             alert("Your leave was rejected!");
// //                             notifiedLeaves[leave.id] = "rejected";
// //                         }

// //                     }

// //                 });

// //             });

// //     }, 5000);
// //     // --- 1. Select Elements ---
// //     const formModal = document.getElementById('lmLeaveModal');
// //     const successModal = document.getElementById('lmSuccessModal');
    
// //     // Select the Trigger Button (Using the class from your HTML)
// //     const openBtn = document.querySelector('.btn-trigger');

// //     // Close Buttons
// //     const closeBtn = document.getElementById('lmCloseBtn');
// //     const cancelBtn = document.getElementById('lmCancelBtn');
// //     const submitBtn = document.getElementById('lmSubmitBtn');
// //     const successCloseBtn = document.getElementById('lmSuccessCloseBtn');

// //     // Form Inputs
// //     const name = document.getElementById('lmEmpName');
// //     const leaveType = document.getElementById('lmLeaveType');
// //     const fromDate = document.getElementById('lmFromDate');
// //     const toDate = document.getElementById('lmToDate');
// //     const numDays = document.getElementById('lmNumDays');
// //     const balanceDisplay = document.getElementById('lmBalance');
// //     const reason = document.getElementById('lmReason');

// //     // Fake Database
// //     const leaveDatabase = {
// //         'casual': 12,
// //         'medical': 10,
// //         'nopay': 99
// //     };

// //     // --- 2. Open/Close Logic ---

// //     // Open Form Modal
// //     if (openBtn) {
// //         openBtn.addEventListener('click', (e) => {
// //             e.preventDefault();
// //             formModal.classList.add('active');
// //         });
// //     } else {
// //         console.error("Apply Leave button not found. Check class .btn-trigger");
// //     }

// //     // Close Form Modal
// //     const closeFormModal = () => {
// //         formModal.classList.remove('active');
// //         // Reset form
// //         document.getElementById('lmLeaveForm').reset();
// //         numDays.value = "0";
// //         balanceDisplay.value = "-";
// //     };

// //     if(closeBtn) closeBtn.addEventListener('click', closeFormModal);
// //     if(cancelBtn) cancelBtn.addEventListener('click', closeFormModal);

// //     // Close Success Modal
// //     if(successCloseBtn) {
// //         successCloseBtn.addEventListener('click', () => {
// //             successModal.classList.remove('active');
// //         });
// //     }

// //     // Close on click outside
// //     window.addEventListener('click', (e) => {
// //         if (e.target === formModal) closeFormModal();
// //         if (e.target === successModal) successModal.classList.remove('active');
// //     });

// //     // --- 3. Calculation Logic ---
// //     const calculateLeave = () => {
// //         const type = leaveType.value;
// //         const start = new Date(fromDate.value);
// //         const end = new Date(toDate.value);

// //         // Update Balance
// //         if(type && leaveDatabase[type]) {
// //             balanceDisplay.value = leaveDatabase[type];
// //         } else {
// //             balanceDisplay.value = "-";
// //         }

// //         // Calculate Days
// //         if (fromDate.value && toDate.value) {
// //             if (end < start) {
// //                 numDays.value = "Invalid";
// //                 return;
// //             }
// //             const diffTime = Math.abs(end - start);
// //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
// //             numDays.value = diffDays;
// //         } else {
// //             numDays.value = "0";
// //         }
// //     };

// //     if(leaveType) leaveType.addEventListener('change', calculateLeave);
// //     if(fromDate) fromDate.addEventListener('change', calculateLeave);
// //     if(toDate) toDate.addEventListener('change', calculateLeave);

// //     // --- 4. Submit Logic ---
// //     if(submitBtn) {
// //         submitBtn.addEventListener('click', () => {
// //             e.preventDefault();
// //             const days = parseInt(numDays.value);
// //             const currentBal = parseInt(balanceDisplay.value);
// //             const name = empName.value.trim();
// //             const reasonText = reason.value.trim();

// //             // Validation
// //             if(!name || !leaveType.value || !fromDate.value || !toDate.value || !reasonText) {
// //                 alert("Please fill all required fields");
// //                 return;
// //             }

// //             if(isNaN(days) || days <= 0) {
// //                 alert("Invalid date range");
// //                 return;
// //             }

// //             if(currentBal !== 99 && days > currentBal) {
// //                 alert("Insufficient leave balance!");
// //                 return;
// //             }

// // // const emp_id = localStorage.getItem('employee_id')

// //             const data = {
// //                 leave_type: leaveType.value,
// //                 from_date: fromDate.value,
// //                 to_date: toDate.value,
// //                 number_of_days: days,
// //                 remaining_leaves: currentBal,
// //                 reason: reasonText
// //             };

// //             fetch(`http://127.0.0.1:8000/api/employee/apply-leave/${emp_id}/`,{
// //     method:"POST",
// //     headers:{
// //         "Content-Type":"application/json"
// //     },
// //     body:JSON.stringify(
// //        data
// //     )
// // })
// //                 .then(response => response.json())
// //                 .then(result => {
// //                     console.log("result:",result)
// //                     formModal.classList.remove('active');
// //                     successModal.classList.add('active');

// //                     setTimeout(() => {
// //                         document.getElementById('lmLeaveForm').reset();
// //                         numDays.value = "0";
// //                         balanceDisplay.value = "-";
// //                     }, 500);

// //                 })
// //                 .catch(error => {
// //                     alert("Error applying leave");
// //                 });
// //             // // --- SUCCESS ACTION ---
            
// //             // // 1. Close Form
// //             // formModal.classList.remove('active');

// //             // // 2. Open Success Modal
// //             // successModal.classList.add('active');
            
// //             // // 3. Update Fake DB
// //             // if(leaveDatabase[leaveType.value] !== 99) {
// //             //     leaveDatabase[leaveType.value] -= days;
// //             // }
            
// //             // // 4. Reset form (optional delay)
// //             // setTimeout(() => {
// //             //     document.getElementById('lmLeaveForm').reset();
// //             //     numDays.value = "0";
// //             //     balanceDisplay.value = "-";
// //             // }, 500);
// //         });
// //     }
// // });

// const emp_id = localStorage.getItem('employee_id')

// document.addEventListener("DOMContentLoaded", function () {

//     setInterval(() => {

//         fetch(`http://127.0.0.1:8000/api/employee/apply-leave/${emp_id}/`)
//         .then(response => response.json())
//         .then(data => {

//             data.forEach(leave => {

//                 if (leave.status === "approved") {
//                     showToast("Your leave was approved!", "success");
//                 }

//                 if (leave.status === "rejected") {
//                     showToast("Your leave was rejected!", "error");
//                 }

//             });

//         });

//     }, 5000); // check every 5 seconds

// });
// // Database
// const userDatabase = {};

// // DOM Elements
// const modal = document.getElementById('leaveModal');
// const empNameIn = document.getElementById('empName');
// const leaveTypeIn = document.getElementById('leaveType');
// const fromDateIn = document.getElementById('fromDate');
// const toDateIn = document.getElementById('toDate');
// const numDaysIn = document.getElementById('numDays');
// const balanceIn = document.getElementById('balance');
// const toast = document.getElementById('customToast');
// const toastMsg = document.getElementById('toastMsg');

// // --- 1. Modal Functions ---
// function openModal() { modal.classList.add('active'); }
// function closeModal() { modal.classList.remove('active'); resetForm(); }

// // --- 2. Toast Notification Function ---
// // type = 'error' (default) or 'success'
// function showToast(message, type = 'error') {
//     toastMsg.innerText = message;
    
//     if(type === 'success') {
//         toast.classList.add('success');
//         toast.querySelector('i').className = "fa-solid fa-circle-check";
//     } else {
//         toast.classList.remove('success');
//         toast.querySelector('i').className = "fa-solid fa-circle-exclamation";
//     }

//     toast.classList.add('show');

//     // Hide after 3 seconds
//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, 3000);
// }

// // --- 3. User Balance Logic ---
// function checkUserBalance() {
//     const rawName = empNameIn.value.trim();
//     const type = leaveTypeIn.value;
    
//     if (!rawName) { balanceIn.value = "-"; return; }
    
//     const userKey = rawName.toLowerCase();

//     // Auto-create user if not exists
//     if (!userDatabase[userKey]) {
//         userDatabase[userKey] = { medical: 12, casual: 12 };
//     }

//     if (type) {
//         balanceIn.value = userDatabase[userKey][type];
//     }
// }

// // --- 4. Date Logic (The Fix) ---
// function calculateDuration() {
//     // Reset error styles
//     toDateIn.classList.remove('input-error');

//     // Only calc if both dates are picked
//     if (fromDateIn.value && toDateIn.value) {
        
//         // Create Date objects (set time to midnight to compare just dates)
//         const start = new Date(fromDateIn.value);
//         start.setHours(0,0,0,0);
        
//         const end = new Date(toDateIn.value);
//         end.setHours(0,0,0,0);

//         // Validation: End date BEFORE Start date
//         if (end.getTime() < start.getTime()) {
//             showToast("End date cannot be before Start date");
            
//             // Visual feedback
//             toDateIn.classList.add('input-error');
//             toDateIn.value = ""; // Clear invalid date
//             numDaysIn.value = 0;
//             return;
//         }

//         // Calculate days (Inclusive logic: 1st to 1st = 1 day)
//         const diffTime = Math.abs(end - start);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
//         numDaysIn.value = diffDays + 1;
//     } else {
//         numDaysIn.value = 0;
//     }
// }

// // --- 5. Submit Logic ---
// // function submitLeave() {
// //     const rawName = empNameIn.value.trim();
// //     const type = leaveTypeIn.value;
// //     const reqDays = parseInt(numDaysIn.value);

// //     // Basic Validation
// //     if (!rawName || !type || !fromDateIn.value || !toDateIn.value || reqDays <= 0) {
// //         showToast("Please fill all required fields correctly.");
// //         return;
// //     }

// //     const userKey = rawName.toLowerCase();
// //     const currentBalance = userDatabase[userKey][type];

// //     // Balance Check
// //     if (reqDays > currentBalance) {
// //         showToast(Insufficient Balance! You only have ${currentBalance} leaves.);
// //         return;
// //     }

// //     // Success
// //     userDatabase[userKey][type] = currentBalance - reqDays;
// //     showToast(Success! Approved ${reqDays} days., 'success');
    
// //     // Delay close slightly so user sees success message
// //     setTimeout(() => { closeModal(); }, 1500);
// // }
// const leave = document.getElementById("lmLeaveForm");

// leave.addEventListener("submit", function(event) {

//     event.preventDefault();  // stop page reload

//     const emp_name = document.getElementById("empName").value;
//     const leaveType = document.getElementById("leaveType").value;
//     const fromDate = document.getElementById("fromDate").value;
//     const toDate = document.getElementById("toDate").value;
//     const numDays = document.getElementById("numDays").value;
//     const balance = document.getElementById("balance").value;
//     const reason = document.getElementById("reason").value;

//     const data = {
       
//         leave_type: leaveType,
//         from_date: fromDate,
//         to_date: toDate,
//         number_of_days: parseInt(numDays),
//         remaining_leaves: parseInt(balance),
//         reason: reason
//     };

//     fetch(`http://127.0.0.1:8000/api/employee/apply-leave/${emp_id}/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(result => {
//         console.log('re:',result)
//         showToast("Leave Applied Successfully!", "success");
//         setTimeout(() => { closeModal(); }, 1500);
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         showToast("Error saving leave.");
//     });

// });

// function resetForm() {
//     document.getElementById('leaveForm').reset();
//     balanceIn.value = "-";
//     numDaysIn.value = "0";
//     toDateIn.classList.remove('input-error');
// }


// =============================
// Employee ID from localStorage
// =============================
const emp_id = localStorage.getItem("employee_id");
    fetch(`http://127.0.0.1:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;})
fetch(`http://127.0.0.1:8000/api/employee/leaves/${emp_id}/`)

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

    fetch(`http://127.0.0.1:8000/api/employee/apply-leave/${emp_id}/`, {

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

        fetch(`http://127.0.0.1:8000/api/employee/apply-leave/${emp_id}/`)
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