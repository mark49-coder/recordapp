// js/modules/calendarHandler.js

// Store current month and year, default to current date
let currentDate = new Date();
let currentMonth = currentDate.getMonth(); // 0-indexed (0 for January, 11 for December)
let currentYear = currentDate.getFullYear();

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// DOM Elements
let calendarGrid;
let monthYearDisplay;
let prevMonthButton;
let nextMonthButton;

function getDOMReferences() {
    const calendarContainer = document.querySelector('div.flex.min-w-72.max-w-\\[336px\\].flex-1.flex-col');
    if (!calendarContainer) {
        console.error("Calendar container not found!");
        return false;
    }

    calendarGrid = calendarContainer.querySelector('.grid.grid-cols-7');
    monthYearDisplay = calendarContainer.querySelector('p.text-base.font-bold.leading-tight.flex-1.text-center');

    const buttons = calendarContainer.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.querySelector('div[data-icon="CaretLeft"]')) {
            prevMonthButton = button;
        } else if (button.querySelector('div[data-icon="CaretRight"]')) {
            nextMonthButton = button;
        }
    });

    if (!calendarGrid) {
        console.error('Calendar grid not found.');
        return false;
    }
    if (!monthYearDisplay) {
        console.error('Month year display not found.');
        return false;
    }
    if (!prevMonthButton) {
        console.error('Previous month button not found.');
        return false;
    }
    if (!nextMonthButton) {
        console.error('Next month button not found.');
        return false;
    }
    return true;
}


export function renderCalendar(month, year) {
    if (!calendarGrid || !monthYearDisplay) {
        console.error("Calendar elements not ready for renderCalendar. Ensure getDOMReferences succeeded.");
        // Attempt to get references again if they are missing
        if (!getDOMReferences()) {
            console.error("Failed to get DOM references again. Aborting renderCalendar.");
            return;
        }
    }

    calendarGrid.innerHTML = ''; // Clear previous days

    // Update month and year display
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday...
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Create blank cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'h-12 w-full';
        calendarGrid.appendChild(emptyCell);
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement('button');
        dayButton.className = 'h-12 w-full text-[#1d110c] text-sm font-medium leading-normal';

        const dayDiv = document.createElement('div');
        dayDiv.className = 'flex size-full items-center justify-center rounded-full';
        dayDiv.textContent = day;

        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayDiv.classList.add('bg-accent'); // Use custom color name
            dayDiv.classList.add('text-primary-text'); // Ensure text is readable
        }

        dayButton.appendChild(dayDiv);
        calendarGrid.appendChild(dayButton);
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

export function initCalendar() {
    if (!getDOMReferences()) {
        console.log("Failed to get DOM references for calendar. Calendar not initialized.");
        return;
    }

    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    renderCalendar(currentMonth, currentYear);
    console.log("Calendar initialized and rendered for", monthNames[currentMonth], currentYear);
}
