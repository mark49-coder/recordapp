// js/modules/statsDisplay.js

const TASKS_STORAGE_KEY = 'recordapp_tasks'; // Assuming this is where tasks are stored from app.js

/**
 * Calculates the number of tasks completed per day for the last 7 days.
 * Limitation: Uses task.id (creation timestamp) as completion date if task.completed is true.
 * @returns {Array<{date: Date, count: number}>} Array of objects, date is a Date object for midnight.
 */
export function calculateTasksCompletedPerDay() {
    const tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
    const completedTasks = tasks.filter(task => task.completed);

    const dailyCounts = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    for (let i = 0; i < 7; i++) {
        const dayToCount = new Date(today);
        dayToCount.setDate(today.getDate() - i); // Iterate backwards from today
        dayToCount.setHours(0,0,0,0); // Normalize

        let count = 0;
        completedTasks.forEach(task => {
            // Assumption: task.id is a timestamp of creation/completion.
            // This is a simplification. Ideally, tasks would have a specific completionDate.
            const taskDate = new Date(task.id);
            taskDate.setHours(0,0,0,0); // Normalize task date to midnight for comparison

            if (taskDate.getTime() === dayToCount.getTime()) {
                count++;
            }
        });
        dailyCounts.push({ date: dayToCount, count: count });
    }

    // The array is [today, yesterday, dayBefore, ...]. Reverse it to be chronological for charts.
    return dailyCounts.reverse();
}

/**
 * Calculates the current streak of consecutive days where at least one task was completed.
 * Limitation: Uses task.id (creation timestamp) as completion date if task.completed is true.
 * Streak includes today if at least one task is completed today.
 * @returns {number} The current streak in days.
 */
export function calculateStreak() {
    const tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
        return 0;
    }

    // Get unique dates (normalized to midnight) where tasks were completed
    const completionDates = new Set();
    completedTasks.forEach(task => {
        const taskDate = new Date(task.id); // Assumption: task.id is completion timestamp
        taskDate.setHours(0, 0, 0, 0);
        completionDates.add(taskDate.getTime()); // Store time value for easy comparison
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; ; i++) { // Loop indefinitely, break from inside
        const dayToCheck = new Date(today);
        dayToCheck.setDate(today.getDate() - i);
        dayToCheck.setHours(0,0,0,0);

        if (completionDates.has(dayToCheck.getTime())) {
            streak++;
        } else {
            // If we are checking today (i=0) and no tasks completed, streak is 0.
            // But if i > 0, it means the streak ended on the previous day.
            break;
        }
    }
    return streak;
}

/**
 * Renders the calculated statistics onto the stats.html page.
 */
export function renderStats() {
    // --- Update Resumen - Tareas completadas por día (number) ---
    const dailyCompletionsData = calculateTasksCompletedPerDay(); // Array of {date, count}, chronological

    // Assuming the "Resumen" number should show today's completed tasks.
    // dailyCompletionsData is for the last 7 days, with the last item being today.
    const todayCompletions = dailyCompletionsData.length > 0 ? dailyCompletionsData[dailyCompletionsData.length - 1].count : 0;

    const resumenNumberElement = document.querySelector('div.flex.min-w-72.flex-1.flex-col.gap-2 > p.text-\\[32px\\]');
    if (resumenNumberElement) {
        resumenNumberElement.textContent = todayCompletions;
    } else {
        console.warn("Resumen number element not found in stats.html.");
    }

    // --- Update Racha - Streak Display ---
    const currentStreak = calculateStreak();
    const streakTextElement = document.querySelector('div.flex.flex-col.gap-1.flex-\\[2_2_0px\\] > p.text-base.font-bold');
    if (streakTextElement) {
        streakTextElement.textContent = `${currentStreak} día${currentStreak === 1 ? '' : 's'} seguidos`;
    } else {
        console.warn("Streak text element not found in stats.html.");
    }

    // --- Update Bar Chart ---
    const barChartContainer = document.querySelector('.grid.min-h-\\[180px\\].grid-flow-col');
    if (barChartContainer) {
        barChartContainer.innerHTML = ''; // Clear existing bars and labels for fresh render

        const maxCountForHeight = Math.max(5, ...dailyCompletionsData.map(d => d.count)); // Min height basis of 5, or highest actual count

        // First, append all bar divs
        dailyCompletionsData.forEach(data => {
            const barDiv = document.createElement('div');
            barDiv.className = 'border-[#a15f45] bg-[#f4eae6] border-t-2 w-full'; // Tailwind classes from original HTML
            const percentageHeight = maxCountForHeight === 0 ? 0 : (data.count / maxCountForHeight) * 100;
            // Ensure a minimum height if there are some tasks, but not if count is truly 0.
            const finalHeight = data.count > 0 ? Math.max(5, percentageHeight) : 0; // at least 5% height if count > 0
            barDiv.style.height = `${finalHeight}%`;
            barChartContainer.appendChild(barDiv);
        });

        // Then, append all label p elements
        const shortDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']; // Consistent with Date.getDay()
        dailyCompletionsData.forEach(data => {
            const labelP = document.createElement('p');
            labelP.className = 'text-[#a15f45] text-[13px] font-bold leading-normal tracking-[0.015em]'; // Tailwind classes
            labelP.textContent = shortDayNames[data.date.getDay()];
            barChartContainer.appendChild(labelP);
        });

    } else {
        console.warn("Bar chart container not found in stats.html.");
    }
}
