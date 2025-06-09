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

function loadTasks() {
  if (!window.location.pathname.endsWith('home') && !window.location.pathname.endsWith('home/index.html')) {
    return;
  }

  const tasks = JSON.parse(localStorage.getItem('recordapp_tasks')) || [];
  const tasksHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Tasks for Today'));

  if (!tasksHeading) {
    console.error('Tasks heading not found. Cannot display tasks.');
    return;
  }

  let tasksContainer = document.getElementById('tasks-container');
  if (!tasksContainer) {
    tasksContainer = document.createElement('div');
    tasksContainer.id = 'tasks-container';
    tasksHeading.parentNode.insertBefore(tasksContainer, tasksHeading.nextSibling);
  } else {
    // Clear existing tasks to avoid duplication if loadTasks is called multiple times
    tasksContainer.innerHTML = '';
  }

  // Remove existing static tasks if any, assuming they follow the same structure
  const staticTaskElements = [];
  let sibling = tasksHeading.nextSibling;
  while(sibling && sibling !== tasksContainer) {
    if (sibling.nodeType === 1 && sibling.classList.contains('flex') && sibling.classList.contains('items-center')) {
        staticTaskElements.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  staticTaskElements.forEach(el => el.remove());


  if (tasks.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No tasks yet. Add some!';
    emptyMessage.className = 'text-[#a15f45] text-base font-normal leading-normal px-4 py-2';
    tasksContainer.appendChild(emptyMessage);
    return;
  }

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'flex items-center gap-4 bg-[#fcf9f8] px-4 min-h-14';
    taskElement.innerHTML = `
      <div class="flex size-7 items-center justify-center">
        <input
          type="checkbox"
          class="h-5 w-5 rounded border-[#ead5cd] border-2 bg-transparent text-[#ffa07a] checked:bg-[#ffa07a] checked:border-[#ffa07a] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#ead5cd] focus:outline-none"
          ${task.completed ? 'checked' : ''}
          data-task-id="${task.id}"
        >
      </div>
      <p class="text-[#1d110c] text-base font-normal leading-normal flex-1 truncate ${task.completed ? 'line-through text-[#a15f45]' : ''}">${task.text}</p>
    `;
    tasksContainer.appendChild(taskElement);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  handleNewTaskForm();
  loadTasks();
});
