function saveTask(newTask) {
  // Get existing tasks from Local Storage or initialize an empty array
  let tasks = JSON.parse(localStorage.getItem('recordapp_tasks')) || [];

  // Add the new task
  tasks.push(newTask);

  // Save the updated array back to Local Storage
  localStorage.setItem('recordapp_tasks', JSON.stringify(tasks));

  // Redirect to home page
  window.location.href = 'index.html';
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
  if (!(window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/index.html'))) {
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
    tasksContainer.innerHTML = '';
  }

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

function renderNavbar() {
  const path = window.location.pathname;
  let currentPage = '';
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/index.html')) {
    currentPage = 'home';
  } else if (path.endsWith('pets')) {
    currentPage = 'pets';
  } else if (path.endsWith('stats')) {
    currentPage = 'stats';
  }

  // Do not render navbar on new_task page
  if (path.endsWith('new_task')) {
    return;
  }

  const activeClass = 'text-[#1d110c]';
  const inactiveClass = 'text-[#a15f45]';

  const navbarHTML = `
    <div class="flex gap-2 border-t border-[#f4eae6] bg-[#fcf9f8] px-4 pb-3 pt-2 fixed bottom-0 left-0 right-0 z-50">
      <a href="index.html" class="flex flex-1 flex-col items-center justify-end gap-1 ${currentPage === 'home' ? activeClass : inactiveClass}">
        <div class="flex h-8 items-center justify-center" data-icon="House" data-size="24px"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256"><path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path></svg></div>
        <p class="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
      </a>
      <a href="pets" class="flex flex-1 flex-col items-center justify-end gap-1 ${currentPage === 'pets' ? activeClass : inactiveClass}">
        <div class="flex h-8 items-center justify-center" data-icon="PawPrint" data-size="24px"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256"><path d="M212,80a28,28,0,1,0,28,28A28,28,0,0,0,212,80Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,212,120ZM72,108a28,28,0,1,0-28,28A28,28,0,0,0,72,108ZM44,120a12,12,0,1,1,12-12A12,12,0,0,1,44,120ZM92,88A28,28,0,1,0,64,60,28,28,0,0,0,92,88Zm0-40A12,12,0,1,1,80,60,12,12,0,0,1,92,48Zm72,40a28,28,0,1,0-28-28A28,28,0,0,0,164,88Zm0-40a12,12,0,1,1-12,12A12,12,0,0,1,164,48Zm23.12,100.86a35.3,35.3,0,0,1-16.87-21.14,44,44,0,0,0-84.5,0A35.25,35.25,0,0,1,69,148.82,40,40,0,0,0,88,224a39.48,39.48,0,0,0,15.52-3.13,64.09,64.09,0,0,1,48.87,0,40,40,0,0,0,34.73-72ZM168,208a24,24,0,0,1-9.45-1.93,80.14,80.14,0,0,0-61.19,0,24,24,0,0,1-20.71-43.26,51.22,51.22,0,0,0,24.46-30.67,28,28,0,0,1,53.78,0,51.27,51.27,0,0,0,24.53,30.71A24,24,0,0,1,168,208Z"></path></svg></div>
        <p class="text-xs font-medium leading-normal tracking-[0.015em]">Pets</p>
      </a>
      <a href="stats" class="flex flex-1 flex-col items-center justify-end gap-1 ${currentPage === 'stats' ? activeClass : inactiveClass}">
        <div class="flex h-8 items-center justify-center" data-icon="PresentationChart" data-size="24px"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path></svg></div>
        <p class="text-xs font-medium leading-normal tracking-[0.015em]">Stats</p>
      </a>
    </div>
  `;

  let navbarContainer = document.getElementById('bottom-navbar-container');
  if (!navbarContainer) {
    navbarContainer = document.createElement('div');
    navbarContainer.id = 'bottom-navbar-container';
    document.body.appendChild(navbarContainer);
  }
  navbarContainer.innerHTML = navbarHTML;
}

document.addEventListener('DOMContentLoaded', function() {
  handleNewTaskForm();
  loadTasks();
  renderNavbar();
});
