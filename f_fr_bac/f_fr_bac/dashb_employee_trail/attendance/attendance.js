


document.addEventListener("DOMContentLoaded", () => {
const emp_id = localStorage.getItem('employee_id')   // ==========================================
    // 1. CONFIGURATION & STATE
    // ==========================================
    fetch(`http://13.60.26.193:8000/api/employee/dashboard/${emp_id}/`)
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
            if (!isWorking && totalWorkMs === 0) {
                alert("Please Punch In first to start work!");
                return;
            }

            // 1. Pause Work Timer
            pauseWorkTimer();
            statusMsg.innerHTML = `<i class="fa-solid fa-mug-hot"></i> On Break...`;
            statusMsg.style.color = "#FF5B1E"; // Orange
            isOnBreak = true;

            // 2. Start Break Logic
            breakStartTime = Date.now();
            currentBreakType = bmEls.breakSelect.value;
            const typeLabel = currentBreakType === "lunch" ? "Lunch Break" : "Normal Break";

            // UI Swaps
            bmEls.btnIn.style.display = "none";
            bmEls.btnOut.style.display = "flex";
            bmEls.breakSelect.disabled = true;
            punchBtn.disabled = true; // Cannot punch out during break

            bmEls.statusBadge.textContent = `On ${typeLabel}`;
            bmEls.statusBadge.className = "bm-badge bm-badge-primary";

            addMainLog("Break Started", typeLabel);

            // 3. Start Break Interval
            if (breakTimerInterval) clearInterval(breakTimerInterval);
            breakTimerInterval = setInterval(() => {
                const now = Date.now();
                const currentBreakMs = now - breakStartTime;
                const totalDisplayMs = totalBreakMs + currentBreakMs;

                // Update Break Timer Circle
                const diffInSeconds = Math.floor(currentBreakMs / 1000);
                bmEls.timerDisplay.textContent = formatTime(currentBreakMs);

                // Check Limits
                const limitSec = LIMITS[currentBreakType];
                const usedSec = usage[currentBreakType] + diffInSeconds;

                if (usedSec > limitSec) {
                    bmEls.timerDisplay.style.color = "#d32f2f"; // Red
                    bmEls.limitWarning.style.display = "block";
                }

                updateTimeline(); // Draws yellow segments

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

        fetch("http://13.60.26.193:8000/api/employee-attendence/create/", {
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
        fetch("http://13.60.26.193:8000/api/employee-attendence/checkout/", {
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

fetch(`http://13.60.26.193:8000/api/attendence-status/${emp_id}/`)
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
    function loadHistoryTable() {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
        calEls.tableBody.innerHTML = "";
        const rows = Object.values(history).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (rows.length === 0) {
            calEls.tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#999;">No records found</td></tr>`;
            return;
        }

        rows.forEach(row => {
            const tr = document.createElement("tr");
            let badgeClass = row.status.toLowerCase().includes('absent') ? 'status-absent' : 'status-present';
            const dateObj = new Date(row.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td><span class="status-pill ${badgeClass}">${row.status}</span></td>
                <td style="font-family:monospace;">${row.inTime}</td>
                <td style="font-family:monospace;">${row.outTime}</td>
                <td>
                    <button class="btn-edit-row" data-date="${row.date}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            `;
            calEls.tableBody.appendChild(tr);
        });
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
        const history = getHistory();
        const record = history[dateKey];

        if (!record) {
            alert("Error: Record not found in local storage.");
            return;
        }

        editingDateKey = dateKey;

        // Fill Inputs
        const inTimeInput = document.getElementById("editInTime");
        const outTimeInput = document.getElementById("editOutTime");
        const statusInput = document.getElementById("editStatus");
        if (inTimeInput && outTimeInput) {
            inTimeInput.value = convertTo24(record.inTime);
            outTimeInput.value = convertTo24(record.outTime);
            if(statusInput) statusInput.value = record.status || "Present";
        }

        // Toggle Visiblity
        closeHistoryModal(); // Hide large table

        const editModal = document.getElementById("editModal");
        if (editModal) {
            // FIX: Move to body to avoid clipping
            document.body.appendChild(editModal);
            
            // FIX: Force Styles directly to override any CSS issues
            editModal.style.display = "flex";
            editModal.style.visibility = "visible";
            editModal.style.opacity = "1";
            editModal.style.zIndex = "9999999";
            
            // Add class for animation
            setTimeout(() => editModal.classList.add("show"), 10);
            
            console.log("Edit Modal Opened for:", dateKey);
        } else {
            console.error("Edit Modal ID 'editModal' not found in HTML.");
        }
    });

    // B. Save Button
    const saveEditBtn = document.getElementById("saveEditBtn");
    if (saveEditBtn) {
        saveEditBtn.addEventListener("click", () => {
            if (!editingDateKey) return;
            const inTimeInput = document.getElementById("editInTime");
            const outTimeInput = document.getElementById("editOutTime");
            
            let history = getHistory();
            if (history[editingDateKey]) {
                
                const statusInput = document.getElementById("editStatus");

                if(statusInput) history[editingDateKey].status = statusInput.value;

                history[editingDateKey].inTime = convertTo12(inTimeInput.value);
                history[editingDateKey].outTime = convertTo12(outTimeInput.value);
                localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));

                closeEditModal();
                loadHistoryTable(); // Refresh table
                renderCalendar();   // Refresh calendar
                
                // Re-open history modal to see changes
                if(calEls.modal) calEls.modal.classList.add("show");
            }
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