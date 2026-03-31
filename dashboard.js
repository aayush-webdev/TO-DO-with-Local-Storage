
// DOM Elements
const DOM = {
    textInput: document.querySelector("#text"),
    addBtn: document.querySelector("#btn"),
    taskList: document.querySelector("#taskList")
};

// Storage Manager
const StorageManager = {
    STORAGE_KEY: 'tasks',
    
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error retrieving tasks:', error);
            return [];
        }
    },
    
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    },
    
    addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
    },
    
    removeTask(index) {
        const tasks = this.getTasks();
        tasks.splice(index, 1);
        this.saveTasks(tasks);
    },
    
    toggleTaskComplete(index) {
        const tasks = this.getTasks();
        if (tasks[index]) {
            tasks[index].completed = !tasks[index].completed;
            this.saveTasks(tasks);
        }
    }
};

// Task Renderer
const TaskRenderer = {
    createTaskElement(task, index) {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('complete');
        }
        
        // Task text
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        // Button group
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        
        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('comp-btn');
        completeBtn.textContent = task.completed ? '↻' : '✓';
        completeBtn.title = task.completed ? 'Undo' : 'Complete';
        completeBtn.dataset.index = index;
        completeBtn.dataset.action = 'toggle';
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Delete';
        deleteBtn.dataset.index = index;
        deleteBtn.dataset.action = 'delete';
        
        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(deleteBtn);
        
        li.appendChild(taskText);
        li.appendChild(buttonGroup);
        
        return li;
    },
    
    renderAllTasks() {
        DOM.taskList.innerHTML = '';
        const tasks = StorageManager.getTasks();
        tasks.forEach((task, index) => {
            const li = this.createTaskElement(task, index);
            DOM.taskList.appendChild(li);
        });
    }
};

// Task Manager
const TaskManager = {
    addTask() {
        const taskText = DOM.textInput.value.trim();
        
        if (!taskText) {
            alert('Please enter a task!');
            return;
        }
        
        const task = {
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        StorageManager.addTask(task);
        TaskRenderer.renderAllTasks();
        DOM.textInput.value = '';
        DOM.textInput.focus();
    },
    
    deleteTask(index) {
        StorageManager.removeTask(index);
        TaskRenderer.renderAllTasks();
    },
    
    toggleTask(index) {
        StorageManager.toggleTaskComplete(index);
        TaskRenderer.renderAllTasks();
    }
};

// Event Listeners
function initEventListeners() {
    // Add task button click
    DOM.addBtn.addEventListener('click', () => TaskManager.addTask());
    
    // Add task on Enter key
    DOM.textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            TaskManager.addTask();
        }
    });
    
    // Task list delegation
    DOM.taskList.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const index = parseInt(btn.dataset.index);
        const action = btn.dataset.action;
        
        if (action === 'delete') {
            TaskManager.deleteTask(index);
        } else if (action === 'toggle') {
            TaskManager.toggleTask(index);
        }
    });
}

// Initialize App
function initApp() {
    initEventListeners();
    TaskRenderer.renderAllTasks();
    DOM.textInput.focus();
    console.log('Todo App Initialized');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}