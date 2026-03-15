
// ==========================================
// ATTENDANCE SYSTEM (FULL SCRIPT)
// This version includes:
// - Punch In / Punch Out
// - Break In / Break Out
document.addEventListener("DOMContentLoaded", () => {

const emp_id = localStorage.getItem("employee_id");

// ===============================
// PROFILE FETCH
// ===============================
fetch(`http://13.51.167.95:8000/api/employee/dashboard/${emp_id}/`)
.then(res => res.json())
.then(data => {
    document.querySelectorAll("#pname").forEach(el => el.innerText = data.name || "Employee");
    document.querySelectorAll("#role").forEach(el => el.innerText = data.role || "Employee");
    document.querySelectorAll("#employee_id").forEach(el => el.innerText = data.employee_id || emp_id);
}).catch(err => console.error("Profile Fetch Error:", err));

// ===============================
// GLOBAL STATE
// ===============================
let isWorking = false;
let isOnBreak = false;

let workStartTime = null;
let breakStartTime = null;

let workTimerInterval = null;
let breakTimerInterval = null;

const punchBtn = document.getElementById("punchBtn");
const statusMsg = document.getElementById("punchStatusMsg");

const bmBtnIn = document.getElementById("bmBtnIn");
const bmBtnOut = document.getElementById("bmBtnOut");
const breakSelect = document.getElementById("bmBreakTypeSelect");

// ===============================
// TIMER FORMAT
// ===============================
function formatTime(ms) {

const totalSeconds = Math.floor(ms / 1000);

const h = Math.floor(totalSeconds / 3600);
const m = Math.floor((totalSeconds % 3600) / 60);
const s = totalSeconds % 60;

return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

// ===============================
// WORK TIMER
// ===============================
function startWorkTimer(){

clearInterval(workTimerInterval);

workTimerInterval = setInterval(()=>{

const now = Date.now();
const diff = now - workStartTime;

document.getElementById("timerDisplay").innerText = formatTime(diff);

},1000);

}

// ===============================
// BREAK TIMER
// ===============================
function startBreakTimer(){

clearInterval(breakTimerInterval);

breakTimerInterval = setInterval(()=>{

const now = Date.now();
const diff = now - breakStartTime;

document.getElementById("bmTimerDisplay").innerText = formatTime(diff);

},1000);

}

// ===============================
// PUNCH BUTTON
// ===============================
if(punchBtn){

punchBtn.addEventListener("click",()=>{

if(!isWorking){

fetch("http://13.51.167.95:8000/api/employee-attendence/create/",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id:emp_id})
})
.then(res=>res.json())
.then(()=>{

isWorking=true;
workStartTime=Date.now();

statusMsg.innerHTML="Working...";
punchBtn.innerText="Punch Out";

startWorkTimer();

})
.catch(err=>console.log(err));

}
else{

fetch("http://13.51.167.95:8000/api/employee-attendence/checkout/",{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id:emp_id})
})
.then(res=>res.json())
.then(()=>{

isWorking=false;

clearInterval(workTimerInterval);

punchBtn.innerText="Shift Completed";
punchBtn.disabled=true;

statusMsg.innerHTML="Shift Completed";

})
.catch(err=>console.log(err));

}

});

}

// ===============================
// BREAK IN
// ===============================
if(bmBtnIn){

bmBtnIn.addEventListener("click",()=>{

if(!isWorking){
alert("Punch in first");
return;
}

const type = breakSelect.value;

fetch("http://13.51.167.95:8000/api/employee-break/start/",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id:emp_id,break_type:type})
})
.then(res=>res.json())
.then(()=>{

isOnBreak=true;
isWorking=false;

breakStartTime=Date.now();

bmBtnIn.style.display="none";
bmBtnOut.style.display="block";

statusMsg.innerHTML="On Break";

startBreakTimer();

})
.catch(err=>console.log(err));

});

}

// ===============================
// BREAK OUT
// ===============================
if(bmBtnOut){

bmBtnOut.addEventListener("click",()=>{

fetch("http://13.51.167.95:8000/api/employee-break/end/",{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id:emp_id})
})
.then(res=>res.json())
.then(()=>{

isOnBreak=false;
isWorking=true;

clearInterval(breakTimerInterval);

bmBtnIn.style.display="block";
bmBtnOut.style.display="none";

workStartTime=Date.now();

statusMsg.innerHTML="Working...";

startWorkTimer();

})
.catch(err=>console.log(err));

});

}

// ===============================
// FETCH CURRENT STATUS ON LOAD
// ===============================
window.addEventListener("load",()=>{

fetch(`http://13.51.167.95:8000/api/attendence-status/${emp_id}/`)
.then(res=>res.json())
.then(data=>{

if(data.status==="punched_in"){

isWorking=true;

workStartTime=new Date(data.checkin).getTime();

punchBtn.innerText="Punch Out";

startWorkTimer();

}

if(data.status==="punched_out"){

punchBtn.innerText="Shift Completed";
punchBtn.disabled=true;

}

})
.catch(err=>console.log(err));

});

// ===============================
// BREAK STATUS SYNC ACROSS DEVICES
// ===============================
async function syncBreakStatus(){

try{

const res = await fetch(`http://13.51.167.95:8000/api/break-status/${emp_id}/`);

if(!res.ok) return;

const data = await res.json();

if(data.status==="on_break"){

if(!isOnBreak){

isOnBreak=true;
isWorking=false;

breakStartTime = new Date(data.start_time).getTime();

bmBtnIn.style.display="none";
bmBtnOut.style.display="block";

startBreakTimer();

}

}
else{

if(isOnBreak){

isOnBreak=false;
isWorking=true;

bmBtnIn.style.display="block";
bmBtnOut.style.display="none";

clearInterval(breakTimerInterval);

workStartTime=Date.now();

startWorkTimer();

}

}

}catch(err){

console.log("Break Sync Error",err);

}

}

// ===============================
// AUTO SYNC EVERY 5 SECONDS
// ===============================
setInterval(syncBreakStatus,5000);

});