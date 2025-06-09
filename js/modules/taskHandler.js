// js/modules/taskHandler.js
export function addTask(title, notes, time, frequency) {
    const newTask = {
        id: Date.now(),
        text: title, // 'text' is used in the existing saveTask/loadTasks
        notes: notes,
        time: time,
        frequency: frequency,
        completed: false
    };
    console.log("New task created by taskHandler.addTask:", newTask);
    return newTask;
}

// We might need a function to retrieve tasks as well, but the user story
// only specified addTask for now. loadTasks is in app.js.
