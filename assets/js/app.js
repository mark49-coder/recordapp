function saveTask(newTask) {
  // Get existing tasks from Local Storage or initialize an empty array
  let tasks = JSON.parse(localStorage.getItem('recordapp_tasks')) || [];

  // Add the new task
  tasks.push(newTask);

  // Save the updated array back to Local Storage
  localStorage.setItem('recordapp_tasks', JSON.stringify(tasks));

  // Redirect to home page
  window.location.href = 'home/index.html';
}

function handleNewTaskForm() {
  if (!window.location.pathname.endsWith('new_task')) {
    return;
  }

  const taskInput = document.querySelector('input[placeholder="Task Title"]');
  const saveButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Save Task'));

  if (taskInput && saveButton) {
    const form = saveButton.closest('form'); // Assuming the button is inside a form

    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
          const task = {
            id: Date.now(),
            text: taskText,
            completed: false
          };
          saveTask(task);
        }
      });
    } else {
      // Fallback if no form element is found, listen to button click
      saveButton.addEventListener('click', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
          const task = {
            id: Date.now(),
            text: taskText,
            completed: false
          };
          saveTask(task);
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', handleNewTaskForm);
