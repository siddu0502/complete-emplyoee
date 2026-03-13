/**
 * Displays a custom animated alert modal matching the dashboard theme.
 * @param {string} message - The text to display.
 * @param {string} type - 'warning', 'error', or 'success'.
 */
function showCustomAlert(message, type = 'warning') {
    // Prevent multiple alerts stacking
    if (document.querySelector('.custom-alert-overlay')) return;

    // Theme Config
    const colors = {
        warning: '#ff6b00', // Orange
        error:   '#ef4444', // Red
        success: '#10b981'  // Green
    };
    const icons = {
        warning: 'fa-triangle-exclamation',
        error:   'fa-circle-xmark',
        success: 'fa-circle-check'
    };
    const accentColor = colors[type] || colors.warning;
    const iconClass = icons[type] || icons.warning;

    // Inject CSS if not exists
    if (!document.getElementById('custom-alert-style')) {
        const style = document.createElement('style');
        style.id = 'custom-alert-style';
        style.innerHTML = `
            .custom-alert-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
            .custom-alert-card { background: #fff; padding: 25px 30px; border-radius: 12px; width: 90%; max-width: 360px; text-align: center; transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-top: 5px solid ${accentColor}; box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
            .custom-alert-icon { font-size: 2.5rem; color: ${accentColor}; margin-bottom: 15px; }
            .custom-alert-msg { font-size: 1rem; color: #333; margin-bottom: 20px; line-height: 1.4; font-weight: 500; }
            .custom-alert-btn { background: ${accentColor}; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; width: 100%; transition: opacity 0.2s; }
            .custom-alert-btn:hover { opacity: 0.9; }
        `;
        document.head.appendChild(style);
    }

    // Create DOM Elements
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.innerHTML = `
        <div class="custom-alert-card">
            <div class="custom-alert-icon"><i class="fa-solid ${iconClass}"></i></div>
            <p class="custom-alert-msg">${message}</p>
            <button class="custom-alert-btn">Okay</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animate In
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.custom-alert-card').style.transform = 'scale(1)';
    });

    // Close Handler
    const close = () => {
        overlay.style.opacity = '0';
        overlay.querySelector('.custom-alert-card').style.transform = 'scale(0.8)';
        setTimeout(() => overlay.remove(), 300);
    };
    overlay.querySelector('.custom-alert-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });
}


document.addEventListener("DOMContentLoaded", () => {
const emp_id = localStorage.getItem('employee_id')   
    // 1. CONFIGURATION & STATE
    
    fetch(`http://127.0.0.1:8000/api/employee/dashboard/${emp_id}/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            document.getElementById("name").innerText = data.name;
             document.getElementById("role").innerText = data.role;})
    const SHIFT_START_HR = 10; // 10:00 AM
    const SHIFT_END_HR = 19;   // 07:00 PM
    const TOTAL_HOURS = SHIFT_END_HR - SHIFT_START_HR; // 9 hours

    const STORAGE_KEY_HISTORY = "att_history_log";

    // State Variables
    let workTimerInterval = null;
    let breakTimerInterval = null;

    let workStartTime = null;
    let breakStartTime = null;
    let punchInTimeStr = null;
    let totalWorkMs = 0;
    let totalBreakMs = 0;

    let isWorking = false;
    let isOnBreak = false;
    let currentBreakType = ""; // 'lunch' or 'normal'

    // Break Limits (in seconds)
    const LIMITS = {
        lunch: 45 * 60,
        normal: 15 * 60
    };

    // Accumulated usage for limits
    let usage = { lunch: 0, normal: 0 };

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    // Main Punch Elements
    const punchBtn = document.getElementById("punchBtn");
    const timerDisplay = document.getElementById("timerDisplay");
    const productionDisplay = document.getElementById("productionDisplay");
    const statusMsg = document.getElementById("punchStatusMsg");
    const dateDisplay = document.getElementById("currentDateDisplay");
    // Break Management Elements
    const bmEls = {
        timerDisplay: document.getElementById("bmTimerDisplay"),
        btnIn: document.getElementById("bmBtnIn"),
        btnOut: document.getElementById("bmBtnOut"),
        breakSelect: document.getElementById("bmBreakTypeSelect"),
        statusBadge: document.getElementById("bmStatusBadge"),
        limitWarning: document.getElementById("bmLimitWarning"),
        logTable: document.getElementById("bmLogTableBody"),
        emptyState: document.getElementById("bmEmptyState"),
        lunchUsed: document.getElementById("bmLunchUsed"),
        lunchBar: document.getElementById("bmLunchBar"),
        normalUsed: document.getElementById("bmNormalUsed"),
        normalBar: document.getElementById("bmNormalBar"),
        totalTime: document.getElementById("bmTotalTime"),
        remainingTime: document.getElementById("bmRemainingTime"),
    };

    // Metrics & Timeline Elements
    const metricEls = {
        todayVal: document.getElementById("todayVal"),
        barToday: document.getElementById("barToday"),
        breakVal: document.getElementById("breakVal"),
        barBreak: document.getElementById("barBreak"),
        timelineTrack: document.getElementById("timelineTrack"),
        mainLogBody: document.getElementById("logTableBody")
    };

    // Calendar Elements
    const calEls = {
        grid: document.getElementById("daysGrid"),
        label: document.getElementById("calMonthYear"),
        prev: document.getElementById("prevMonth"),
        next: document.getElementById("nextMonth"),
        viewBtn: document.getElementById("viewAttBtn"),
        modal: document.getElementById("attModal"),
        closeBtn: document.getElementById("attCloseBtn"),
        bottomCloseBtn: document.getElementById("attCloseBtnBottom"),
        tableBody: document.getElementById("attTableBody")
    };

    let currentDate = new Date(); // For Calendar

    // set default month picker to current month and wire up change
    const monthPicker = document.getElementById("monthSelector");
    if (monthPicker) {
        const now = new Date();
        monthPicker.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
        monthPicker.addEventListener("change", loadHistoryTable);
    }

    const loadBtn = document.getElementById("loadMonthBtn");
    if (loadBtn) {
        loadBtn.addEventListener("click", loadHistoryTable);
    }

    // cache for currently displayed attendance records (month view)
    const attendanceCache = {};

    // ==========================================
    // 3. HELPER FUNCTIONS
    // ==========================================

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    function pad(n) { return n < 10 ? "0" + n : n; }

    function updateHeaderTime() {
        const now = new Date();
        if (dateDisplay) {
            dateDisplay.innerText = now.toLocaleString("en-GB", {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }
    }
    setInterval(updateHeaderTime, 1000);
    updateHeaderTime();

    // Add row to Bottom Log Panel
    function addMainLog(status, note) {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const row = `<tr><td>${timeStr}</td><td><strong>${status}</strong></td><td>${note}</td></tr>`;
        if (metricEls.mainLogBody) {
            metricEls.mainLogBody.innerHTML = row + metricEls.mainLogBody.innerHTML;
        }
    }

  
    function updateTimeline() {

        if (!isWorking && !isOnBreak) return;

        const now = new Date();

        const currentDecimal =
            now.getHours() +
            (now.getMinutes() / 60) +
            (now.getSeconds() / 3600);

        let percent = ((currentDecimal - SHIFT_START_HR) / TOTAL_HOURS) * 100;

        percent = Math.max(0, Math.min(100, percent));

        const seg = document.createElement("div");

        seg.className = isOnBreak
            ? "timeline-segment yellow"
            : "timeline-segment green";

        seg.style.left = percent + "%";
        seg.style.width = "0.2%";

        metricEls.timelineTrack.appendChild(seg);
    }


       function convertTo24(time12) {
        if (!time12) return "";
        const date = new Date("1970-01-01 " + time12);
        if (isNaN(date.getTime())) return "";
        return date.toTimeString().slice(0, 5);
    }

    // Convert "10:30" -> "10:30 AM"
    function convertTo12(time24) {
        if (!time24) return "--:--";
        const [h, m] = time24.split(":");
        const date = new Date();
        date.setHours(h, m);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
        } catch (e) {
            return {};
        }
    }
    // ==========================================
    // 4. WORK TIMER LOGIC
    // ==========================================

    function startWorkTimer() {
        if (workTimerInterval) clearInterval(workTimerInterval);

        workStartTime = Date.now();
        isWorking = true;
        isOnBreak = false;

        // UI Updates
        punchBtn.innerText = "Punch Out";
        punchBtn.classList.add("mode-out");
        statusMsg.innerHTML = `<i class="fa-solid fa-clock"></i> Currently working...`;
        statusMsg.style.color = "#ff6b00";

        // Enable Break Controls
        bmEls.btnIn.disabled = false;
        bmEls.breakSelect.disabled = false;

        workTimerInterval = setInterval(() => {
            const now = Date.now();
            const currentSessionMs = now - workStartTime;
            const totalDisplayMs = totalWorkMs + currentSessionMs;

            // Update Main Timer
            timerDisplay.innerText = formatTime(totalDisplayMs);
            productionDisplay.innerText = `Active : ${(totalDisplayMs / 3600000).toFixed(2)} hrs`;

            // Update Metrics (Work Today)
            const hrs = totalDisplayMs / 3600000;
            metricEls.todayVal.innerText = hrs.toFixed(2);
            // 8 hours target
            metricEls.barToday.style.width = Math.min((hrs / 8) * 100, 100) + '%';
            // const progress = document.getElementById("timerProgress");

            // if(progress){
            //     const percent = Math.min((hrs / 8) * 360, 360);
            //     progress.style.transform = rotate(${percent}deg);

            //     }
            const progress = document.getElementById("timerProgress");

            if (progress) {

                const radius = 70;
                const circumference = 2 * Math.PI * radius;

                const percent = Math.min(hrs / 8, 1);
                
                const offset = circumference - percent * circumference;

                progress.style.strokeDashoffset = offset;
            }

            updateTimeline();

        }, 1000);
    }

    function pauseWorkTimer() {
        if (workTimerInterval) clearInterval(workTimerInterval);
        if (isWorking) {
            totalWorkMs += Date.now() - workStartTime;
        }
        isWorking = false;
    }

    // ==========================================
    // 5. BREAK TIMER LOGIC
    // ==========================================

        if (bmEls.btnIn) {
        bmEls.btnIn.addEventListener("click", () => {
            
            // --- VALIDATION STEP ---
            // Check if user has actually punched in for work yet
            if (!isWorking && totalWorkMs === 0) {
                showCustomAlert("Please Punch In to start work before taking a break!", "warning");
                return;
            }

            // --- 1. STOP WORK / START BREAK STATE ---
            pauseWorkTimer(); // Stops the main work timer
            
            // Update Main Status Message
            statusMsg.innerHTML = `<i class="fa-solid fa-mug-hot"></i> On Break...`;
            statusMsg.style.color = "#FF5B1E"; // Orange Theme
            
            // Set State Flags
            isOnBreak = true;
            isWorking = false; // Ensure work flag is false while on break

            // --- 2. INITIALIZE BREAK DATA ---
            breakStartTime = Date.now();
            currentBreakType = bmEls.breakSelect.value;
            const typeLabel = currentBreakType === "lunch" ? "Lunch Break" : "Normal Break";

            // --- 3. UI UPDATES ---
            // Swap Buttons
            bmEls.btnIn.style.display = "none";
            bmEls.btnOut.style.display = "flex";
            
            // Disable Controls
            bmEls.breakSelect.disabled = true; // Lock dropdown
            if(punchBtn) punchBtn.disabled = true; // Lock Main Punch Out button
            if(punchBtn) punchBtn.classList.add('disabled-btn'); // Optional CSS class for visual feedback

            // Update Badge
            bmEls.statusBadge.textContent = `On ${typeLabel}`;
            bmEls.statusBadge.className = "bm-badge bm-badge-primary"; // Ensure this class has orange bg in CSS

            // Reset Timer Display Color (in case it was red from previous break)
            bmEls.timerDisplay.style.color = "#111"; 
            bmEls.limitWarning.style.display = "none";

            // Log Action
            addMainLog("Break Started", typeLabel);

            // --- 4. START BREAK INTERVAL ---
            // Clear any existing interval to prevent overlapping timers
            if (breakTimerInterval) clearInterval(breakTimerInterval);
            
            breakTimerInterval = setInterval(() => {
                const now = Date.now();
                const currentBreakMs = now - breakStartTime;
                
                // Calculate real-time totals
                // Note: totalBreakMs should be the sum of PREVIOUS breaks, not including current
                // If your totalBreakMs logic differs, adjust here.
                const totalDisplayMs = totalBreakMs + currentBreakMs; 

                // Update Timer Display (MM:SS)
                bmEls.timerDisplay.textContent = formatTime(currentBreakMs);

                // --- LIMIT CHECKING LOGIC ---
                const diffInSeconds = Math.floor(currentBreakMs / 1000);
                const limitSec = LIMITS[currentBreakType];
                
                // Calculate used time (Previous usage of this type + current session)
                // Ensure 'usage' object exists in your scope
                const usedSec = (usage[currentBreakType] || 0) + diffInSeconds;

                if (usedSec > limitSec) {
                    // Over Limit Styling
                    bmEls.timerDisplay.style.color = "#d32f2f"; // Red
                    bmEls.timerDisplay.style.fontWeight = "bold";
                    bmEls.limitWarning.style.display = "block";
                    bmEls.limitWarning.textContent = "Time Limit Exceeded!";
                } else {
                    // Within Limit Styling
                    bmEls.timerDisplay.style.color = "#111";
                    bmEls.timerDisplay.style.fontWeight = "normal";
                    bmEls.limitWarning.style.display = "none";
                }

                // Update Timeline Visualization
                if (typeof updateTimeline === "function") {
                    updateTimeline(); 
                }

            }, 1000);
        });
    }

    if (bmEls.btnOut) {
        bmEls.btnOut.addEventListener("click", () => {
            // 1. Stop Break Timer
            clearInterval(breakTimerInterval);
            const endTime = Date.now();
            const durationMs = endTime - breakStartTime;
            const durationSec = Math.floor(durationMs / 1000);

            // Accumulate Data
            totalBreakMs += durationMs;
            usage[currentBreakType] += durationSec;

            // 2. Resume Work Timer
            isOnBreak = false;
            startWorkTimer(); // Resume working
            addMainLog("Break Ended", "Resumed Work");

            // UI Resets
            bmEls.btnIn.style.display = "flex";
            bmEls.btnOut.style.display = "none";
            bmEls.breakSelect.disabled = false;
            punchBtn.disabled = false; // Enable punch out button

            bmEls.timerDisplay.textContent = "00:00:00";
            bmEls.timerDisplay.style.color = "#333";
            bmEls.limitWarning.style.display = "none";
            bmEls.statusBadge.textContent = "Not Active";
            bmEls.statusBadge.className = "bm-badge bm-badge-light";

            // Update Logs & Stats
            bmAddToHistoryLog(currentBreakType, breakStartTime, endTime, durationSec);
            bmUpdateProgressStats();
        });
    }

    // ==========================================
    // 6. MAIN PUNCH BUTTON LOGIC
    // ==========================================
punchBtn.addEventListener("click", () => {

    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (!isWorking && !isOnBreak && totalWorkMs === 0) {

        fetch("http://127.0.0.1:8000/api/employee-attendence/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: emp_id })
        })
        .then(res => res.json())
        .then(data => {

            

           

        })
        .catch(err => console.error("Punch In Error:", err));

        // save button state
        // localStorage.setItem("attendanceStatus" + emp_id, "punched_in");

        // save start time for timer
        workStartTime = Date.now();
        // localStorage.setItem("workStartTime_" + emp_id, workStartTime);

        punchInTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        startWorkTimer();
        addMainLog("Punch In", "Shift Started");

    }

    else if (isWorking) {
        fetch("http://127.0.0.1:8000/api/employee-attendence/checkout/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: emp_id })
            });
        // PUNCH OUT
        pauseWorkTimer();

        // localStorage.setItem("attendanceStatus" + emp_id, "punched_out");

        // // remove stored timer
        // localStorage.removeItem("workStartTime_" + emp_id);

        punchBtn.innerText = "Shift Completed";
        punchBtn.disabled = true;

        statusMsg.innerHTML = `<i class="fa-solid fa-check-circle"></i> Punch out recorded`;
        statusMsg.style.color = "#4caf50";

        bmEls.btnIn.disabled = true;
        bmEls.breakSelect.disabled = true;

        addMainLog("Punch Out", "Shift Ended");

        saveCalendarHistory('Present', punchInTimeStr, nowStr);
    }

});


// window.addEventListener("load", () => {

//     const status = localStorage.getItem("attendanceStatus" + emp_id);
//     const savedStart = localStorage.getItem("workStartTime_" + emp_id);

//     if (status === "punched_in") {

//         punchBtn.innerText = "Punch Out";
//         isWorking = true;

//         if (savedStart) {

//             workStartTime = parseInt(savedStart);

//             const now = Date.now();
//             totalWorkMs = now - workStartTime;

//             startWorkTimer(); // resume timer
//         }
//     }

//     if (status === "punched_out") {

//         punchBtn.innerText = "Shift Completed";
//         punchBtn.disabled = true;

//     }

// });



window.addEventListener("load", () => {

fetch(`http://127.0.0.1:8000/api/attendence-status/${emp_id}/`)
.then(res => res.json())
.then(data => {

    console.log("Attendance Status:", data);

    if (data.status === "punched_in") {

        punchBtn.innerText = "Punch Out";
        isWorking = true;

        // resume timer from backend checkin
        workStartTime = new Date(data.checkin).getTime();

        const now = Date.now();
        totalWorkMs = now - workStartTime;

        startWorkTimer();

    }

    else if (data.status === "punched_out") {


        punchBtn.innerText = "Shift Completed";
        statusMsg.innerHTML = `<i class="fa-solid fa-fingerprint"></i>Shift Completed `
        punchBtn.disabled = true;

    }

    else {

        punchBtn.innerText = "Punch In";
        isWorking = false;

    }

})
.catch(err => console.error("Status fetch error:", err));

});
    // ==========================================
    // 7. STATS & HISTORY HELPERS
    // ==========================================

    function bmUpdateProgressStats() {
        const totalSec = usage.lunch + usage.normal;

        // Update Bars
        const lunchMins = Math.floor(usage.lunch / 60);
        const lunchPct = Math.min((usage.lunch / LIMITS.lunch) * 100, 100);
        bmEls.lunchUsed.textContent = lunchMins;
        bmEls.lunchBar.style.width = `${lunchPct}%`;
        if (lunchPct >= 100) bmEls.lunchBar.style.backgroundColor = "#d32f2f";

        const normalMins = Math.floor(usage.normal / 60);
        const normalPct = Math.min((usage.normal / LIMITS.normal) * 100, 100);
        bmEls.normalUsed.textContent = normalMins;
        bmEls.normalBar.style.width = `${normalPct}%`;
        if (normalPct >= 100) bmEls.normalBar.style.backgroundColor = "#d32f2f";

        // Total Break Metrics
        const totalBreakMins = Math.floor(totalSec / 60);
        metricEls.breakVal.innerText = totalBreakMins + 'm';
        metricEls.barBreak.style.width = Math.min((totalBreakMins / 60) * 100, 100) + '%';

        bmEls.totalTime.textContent = `${Math.floor(totalSec / 3600)}h ${Math.floor((totalSec % 3600) / 60)}m`;

        const maxLimitMins = (LIMITS.lunch + LIMITS.normal) / 60;
        const remaining = Math.max(0, maxLimitMins - totalBreakMins);
        bmEls.remainingTime.textContent = `${remaining}m;`
    }

    function bmAddToHistoryLog(type, start, end, duration) {
        if (bmEls.emptyState) bmEls.emptyState.style.display = "none";

        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeStartStr = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const timeEndStr = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const durStr = formatTime(duration * 1000);
        const typeLabel = type === "lunch" ? "Lunch Break" : "Normal Break";

        const limitSec = LIMITS[type];
        let statusHtml = '<span class="bm-badge bm-badge-success">On Time</span>';
        if (duration > limitSec) statusHtml = '<span class="bm-badge bm-badge-danger">Overtime</span>';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><span style="font-weight:500">${typeLabel}</span></td>
            <td>${timeStartStr}</td>
            <td>${timeEndStr}</td>
            <td style="font-family:monospace; font-weight:600">${durStr}</td>
            <td>${statusHtml}</td>
        `;
        bmEls.logTable.prepend(row);
    }

    // ==========================================
    // 8. CALENDAR & MODAL LOGIC (Existing)
    // ==========================================

    function saveCalendarHistory(status, inTime, outTime) {
        const todayKey = new Date().toLocaleDateString('en-CA');
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};

        history[todayKey] = {
            date: todayKey,
            status: status,
            inTime: inTime,
            outTime: outTime
        };
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
        renderCalendar();
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        if (calEls.label) calEls.label.innerText = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (calEls.grid) {
            calEls.grid.innerHTML = "";
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const todayKey = new Date().toLocaleDateString('en-CA');

            for (let i = 0; i < firstDay; i++) {
                const div = document.createElement("div");
                div.classList.add("day-cell", "faded");
                calEls.grid.appendChild(div);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const div = document.createElement("div");
                div.classList.add("day-cell");
                div.innerText = i;

                const mStr = String(month + 1).padStart(2, '0');
                const dStr = String(i).padStart(2, '0');
                const dateKey =`${year}-${mStr}-${dStr}`;

                if (dateKey === todayKey) div.classList.add("today");
                if (history[dateKey]) div.classList.add("present");

                calEls.grid.appendChild(div);
            }
        }
    }

    if (calEls.prev) calEls.prev.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    if (calEls.next) calEls.next.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    // Modal
    // (history loading implementation lives further down - uses backend and month selector)
    async function loadHistoryTable() {
    // determine selected month/year from picker or default to current
    const picker = document.getElementById("monthSelector");
    let year, month;
    if (picker && picker.value) {
        const [y, m] = picker.value.split("-");
        year = parseInt(y, 10);
        month = parseInt(m, 10) - 1;
    } else {
        const now = new Date();
        year = now.getFullYear();
        month = now.getMonth();
        if (picker) picker.value = `${year}-${String(month + 1).padStart(2, '0')}`;
    }

    // update modal label
    const modalLabel = document.getElementById("modalMonthYear");
    if (modalLabel) {
        modalLabel.innerText = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    const res = await fetch(`http://127.0.0.1:8000/api/employee-attendence-history/${emp_id}/`);
    const data = await res.json();

    calEls.tableBody.innerHTML = "";

    const attendanceMap = {};
    data.forEach(item => {
        attendanceMap[item.date] = item;
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dateStr = dateObj.toISOString().split("T")[0];

        const record = attendanceMap[dateStr];

        let status = "Absent";
        let inTime = "";
        let outTime = "";

        if (record) {
            status = record.status || "Present";

            if (record.checkin) {
                const checkinTime = new Date(record.checkin);
                inTime = checkinTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }

            if (record.checkout) {
                const checkoutTime = new Date(record.checkout);
                outTime = checkoutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            }
        }

        // cache entry for use by edit popup
        attendanceCache[dateStr] = { status, inTime, outTime };

        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>${status}</td>
            <td style="font-family:monospace;">${inTime || '-'}</td>
            <td style="font-family:monospace;">${outTime || '-'}</td>
            <td>
                    <button class="btn-edit-row" data-date="${dateStr}" data-status="${status}" data-intime="${inTime}" data-outtime="${outTime}">
                       <i class="fa-solid fa-pen"></i>
                   </button>
               </td>
        `;
        calEls.tableBody.appendChild(tr);
    }
}


    if (calEls.viewBtn) calEls.viewBtn.addEventListener("click", () => { loadHistoryTable(); calEls.modal.classList.add("show"); });
    const closeHistoryModal = () => calEls.modal.classList.remove("show");
    if (calEls.closeBtn) calEls.closeBtn.addEventListener("click", closeHistoryModal);
    if (calEls.bottomCloseBtn) calEls.bottomCloseBtn.addEventListener("click", closeHistoryModal);
    // window.addEventListener("click", (e) => { if (e.target === calEls.modal) closeModal(); });
    if (calEls.modal) calEls.modal.addEventListener("click", (e) => { if (e.target === calEls.modal) closeHistoryModal(); });


    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-edit-row");
        if (!btn) return;

        const dateKey = btn.dataset.date;
        editingDateKey = dateKey;

        // use cached record (from most recent history load)
        const record = attendanceCache[dateKey] || { status: "Present", inTime: "", outTime: "" };

        // Fill Inputs
        const inTimeInput = document.getElementById("editInTime");
        const outTimeInput = document.getElementById("editOutTime");
        const inAmpm = document.getElementById("editInAMPM");
        const outAmpm = document.getElementById("editOutAMPM");
        const statusInput = document.getElementById("editStatus");
        if (inTimeInput && outTimeInput) {
            inTimeInput.value = convertTo24(record.inTime);
            outTimeInput.value = convertTo24(record.outTime);
            if (inAmpm) inAmpm.value = record.inTime && record.inTime.toUpperCase().includes('PM') ? 'PM' : 'AM';
            if (outAmpm) outAmpm.value = record.outTime && record.outTime.toUpperCase().includes('PM') ? 'PM' : 'AM';
            if(statusInput) statusInput.value = record.status || "Present";
        }

        // Toggle Visiblity
        closeHistoryModal(); // Hide large table if open

        const editModal = document.getElementById("editModal");
        if (editModal) {
            document.body.appendChild(editModal);
            editModal.style.display = "flex";
            editModal.style.visibility = "visible";
            editModal.style.opacity = "1";
            editModal.style.zIndex = "9999999";
            setTimeout(() => editModal.classList.add("show"), 10);
        }
    });

    // B. Save Button
        // ==========================================
    // B. SAVE BUTTON (SEND REQUEST TO BACKEND)
    // ==========================================
    const saveEditBtn = document.getElementById("saveEditBtn");
    if (saveEditBtn) {
        saveEditBtn.addEventListener("click", () => {
            if (!editingDateKey) return;

            // 1. Get Values
            const inTimeVal = document.getElementById("editInTime").value;
            const inAmpm = document.getElementById("editInAMPM").value;
            const outTimeVal = document.getElementById("editOutTime").value;
            const outAmpm = document.getElementById("editOutAMPM").value;
            const reasonVal = document.getElementById("editReason").value;

            if (!reasonVal) {
                alert("Please provide a reason for this correction.");
                return;
            }

            // 2. Helper to Convert Time Input + Dropdown to 24-Hour Format (HH:MM:00)
            function to24Hour(timeStr, ampm) {
                if (!timeStr) return null;
                let [hours, minutes] = timeStr.split(':');
                hours = parseInt(hours);

                if (ampm === "PM" && hours < 12) hours += 12;
                if (ampm === "AM" && hours === 12) hours = 0;

                return `${String(hours).padStart(2, '0')}:${minutes}:00`;
            }

            const finalInTime = to24Hour(inTimeVal, inAmpm);
            const finalOutTime = to24Hour(outTimeVal, outAmpm);

            // 3. Prepare Payload
            // Note: 'employee' field expects the Database ID (emp_id variable from top of file)
            const payload = {
                employee: emp_id, 
                date: editingDateKey,
                clock_in: finalInTime,
                clock_out: finalOutTime,
                reason: reasonVal,
                status: "Pending"
            };

            console.log("Sending Request:", payload);

            // 4. Send to Backend
            fetch("http://127.0.0.1:8000/api/attendance-request/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to submit request");
                return res.json();
            })
            .then(data => {
                alert("Correction Request Sent to Admin!");
                closeEditModal();
                // Optionally reload to reset UI
                // loadHistoryTable(); 
            })
            .catch(err => {
                console.error(err);
                alert("Error sending request. Check console.");
            });
        });
    }
    // C. Cancel Button
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", () => {
            closeEditModal();
            if(calEls.modal) calEls.modal.classList.add("show");
        });
    }

    function closeEditModal() {
        const editModal = document.getElementById("editModal");
        if (editModal) {
            editModal.classList.remove("show");
            editModal.style.display = "none";
        }
    }
    // Initialize Calendar
    renderCalendar();

    // Ensure CSS for Timeline Segments
    // Add this minimal style injection just in case the CSS is missing for .timeline-segment
    const style = document.createElement('style');
    style.innerHTML = `
        .timeline-segment { position: absolute; height: 100%; top: 0; }
        .timeline-segment.green { background-color: #4caf50; }
        .timeline-segment.yellow { background-color: #ffb300; }
    `;
    document.head.appendChild(style);

});


// attendance calender section
document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const modalEls = {
        overlay: document.getElementById("attModal"),
        closeBtn: document.getElementById("attCloseBtn"),
        tableBody: document.getElementById("attTableBody"),
        
        // Dropdowns
        monthSelect: document.getElementById("navMonthSelect"),
        yearSelect: document.getElementById("navYearSelect")
    };

    const STORAGE_KEY_HISTORY = "att_history_log"; 
    let currentModalDate = new Date(); // State

    // --- 1. Initialize Dropdowns ---
    function initDropdowns() {
        if (!modalEls.monthSelect || !modalEls.yearSelect) return;

        // Populate Months (Jan - Dec)
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
        
        modalEls.monthSelect.innerHTML = "";
        monthNames.forEach((m, index) => {
            const opt = document.createElement("option");
            opt.value = index; // 0-11
            opt.text = m;
            modalEls.monthSelect.appendChild(opt);
        });

        // Populate Years (Current Year +/- 5)
        const currentYear = new Date().getFullYear();
        modalEls.yearSelect.innerHTML = "";
        for (let y = currentYear - 5; y <= currentYear + 5; y++) {
            const opt = document.createElement("option");
            opt.value = y;
            opt.text = y;
            modalEls.yearSelect.appendChild(opt);
        }
    }

    // --- 2. Update UI to Match State ---
    function updateDropdownsUI() {
        if (modalEls.monthSelect) {
            modalEls.monthSelect.value = currentModalDate.getMonth();
        }
        if (modalEls.yearSelect) {
            modalEls.yearSelect.value = currentModalDate.getFullYear();
        }
    }

    // --- 3. Load Data & Filter ---
    function loadHistoryTable() {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
        
        if (modalEls.tableBody) modalEls.tableBody.innerHTML = "";
        
        // Ensure UI matches state before filtering
        updateDropdownsUI();

        // Filter Logic
        const targetYear = currentModalDate.getFullYear();
        const targetMonth = currentModalDate.getMonth();

        const rows = Object.values(history)
            .map(r => ({ ...r, dateObj: new Date(r.date) }))
            .filter(r => {
                return !isNaN(r.dateObj) && 
                       r.dateObj.getFullYear() === targetYear && 
                       r.dateObj.getMonth() === targetMonth;
            })
            .sort((a, b) => b.dateObj - a.dateObj); // Sort Newest First

        // Handle Empty State
        if (rows.length === 0) {
            const monthName = currentModalDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (modalEls.tableBody) {
                modalEls.tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#999;">No records found for ${monthName}.</td></tr>`;
            }
            return;
        }

        // Render Rows
        rows.forEach(row => {
            const tr = document.createElement("tr");
            let badgeClass = row.status.toLowerCase().includes('absent') ? 'status-absent' : 'status-present';
            const dateStr = row.dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><span class="status-pill ${badgeClass}">${row.status}</span></td>
                <td style="font-family:monospace;">${row.inTime}</td>
                <td style="font-family:monospace;">${row.outTime}</td>
                <td><button class="btn-icon-small"><i class="fa-solid fa-pen"></i></button></td>
            `;
            modalEls.tableBody.appendChild(tr);
        });
    }

    // --- 4. Event Listeners ---

    // Month Change
    if (modalEls.monthSelect) {
        modalEls.monthSelect.addEventListener("change", (e) => {
            currentModalDate.setMonth(parseInt(e.target.value));
            loadHistoryTable();
        });
    }

    // Year Change
    if (modalEls.yearSelect) {
        modalEls.yearSelect.addEventListener("change", (e) => {
            currentModalDate.setFullYear(parseInt(e.target.value));
            loadHistoryTable();
        });
    }

    // Open Modal Button
    const viewBtn = document.getElementById("viewAttBtn");
    if (viewBtn) {
        viewBtn.addEventListener("click", () => {
            currentModalDate = new Date(); // Reset to today
            initDropdowns(); // Re-populate if needed
            loadHistoryTable();
            if(modalEls.overlay) modalEls.overlay.classList.add("show");
        });
    }

    // Close Modal
    const closeModal = () => {
        if(modalEls.overlay) modalEls.overlay.classList.remove("show");
    };
    if (modalEls.closeBtn) modalEls.closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { if (e.target === modalEls.overlay) closeModal(); });

    // Initial Init
    initDropdowns();
});