document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addTaskBtn = document.getElementById('add-task-btn');
    const modal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');
    const columns = document.querySelectorAll('.column');
    
    // State
    let tasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [
        {
            id: 'task-' + Date.now() + '-1',
            title: 'Welcome to TaskMaster!',
            description: 'This is a sample task. Try dragging it to the "In Progress" column.',
            priority: 'high',
            status: 'todo'
        },
        {
            id: 'task-' + Date.now() + '-2',
            title: 'Design Dashboard UI',
            description: 'Create a sleek dark mode dashboard with glassmorphism effects.',
            priority: 'medium',
            status: 'in-progress'
        }
    ];

    // Initialization
    renderAllTasks();

    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.getElementById('task-title').focus();
    });

    closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-desc').value.trim();
        const priority = document.getElementById('task-priority').value;

        if (title) {
            const newTask = {
                id: 'task-' + Date.now(),
                title,
                description,
                priority,
                status: 'todo' // Default status
            };
            
            tasks.push(newTask);
            saveAndRender();
            closeModal();
            taskForm.reset();
        }
    });

    // Setup drag and drop for columns
    columns.forEach(column => {
        const taskList = column.querySelector('.task-list');

        taskList.addEventListener('dragover', e => {
            e.preventDefault();
            column.classList.add('drag-over');
            
            // Allow dropping anywhere in the list by appending to end if no specific element is hovered
            const afterElement = getDragAfterElement(taskList, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                if (afterElement == null) {
                    taskList.appendChild(draggable);
                } else {
                    taskList.insertBefore(draggable, afterElement);
                }
            }
        });

        taskList.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });

        taskList.addEventListener('drop', e => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = column.dataset.status;
            
            // Update task status in state
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1 && tasks[taskIndex].status !== newStatus) {
                tasks[taskIndex].status = newStatus;
                saveTasks();
                updateCounts();
            }
        });
    });

    // Helper Functions
    function closeModal() {
        modal.classList.remove('active');
        taskForm.reset();
    }

    function renderAllTasks() {
        // Clear all lists
        document.getElementById('todo-list').innerHTML = '';
        document.getElementById('progress-list').innerHTML = '';
        document.getElementById('done-list').innerHTML = '';

        // Render tasks
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            const listId = task.status === 'in-progress' ? 'progress-list' : `${task.status}-list`;
            const list = document.getElementById(listId);
            if (list) {
                list.appendChild(taskElement);
            }
        });

        updateCounts();
    }

    function createTaskElement(task) {
        const div = document.createElement('div');
        div.classList.add('task-card');
        div.setAttribute('draggable', 'true');
        div.dataset.id = task.id;

        div.innerHTML = `
            <div class="task-header">
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                <button class="task-delete" aria-label="Delete task"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            <h3 class="task-title">${escapeHTML(task.title)}</h3>
            ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
        `;

        // Drag events
        div.addEventListener('dragstart', (e) => {
            div.classList.add('dragging');
            e.dataTransfer.setData('text/plain', task.id);
            // Optional: set drag image or effect
            e.dataTransfer.effectAllowed = 'move';
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
            // Force re-render to ensure DOM matches state exactly based on order if needed,
            // but here we just update state on drop. Re-rendering all keeps it clean if order saving was implemented.
        });

        // Delete event
        const deleteBtn = div.querySelector('.task-delete');
        deleteBtn.addEventListener('click', () => {
            div.style.animation = 'fadeIn 0.3s ease-out reverse forwards';
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveAndRender();
            }, 300);
        });

        return div;
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateCounts() {
        const todoCount = tasks.filter(t => t.status === 'todo').length;
        const progressCount = tasks.filter(t => t.status === 'in-progress').length;
        const doneCount = tasks.filter(t => t.status === 'done').length;

        document.getElementById('todo-count').textContent = todoCount;
        document.getElementById('progress-count').textContent = progressCount;
        document.getElementById('done-count').textContent = doneCount;
    }

    function saveTasks() {
        localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    }

    function saveAndRender() {
        saveTasks();
        renderAllTasks();
    }

    // Basic HTML escaping to prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
