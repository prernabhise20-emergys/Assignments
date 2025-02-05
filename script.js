const taskNameInput = document.getElementById('taskNameInput');
const taskDescriptionInput = document.getElementById('taskDescriptionInput');
const taskPriorityInput = document.getElementById('taskPriorityInput');
const taskDateInput = document.getElementById('taskDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearAllTasksBtn = document.getElementById('clearAllTasksBtn');
const taskList = document.getElementById('taskList');
const tabs = document.querySelectorAll('.status-tab');
const sortingDropdown = document.getElementById('sortingDropdown')



const today = new Date().toISOString().split('T')[0];
document.getElementById('taskDateInput').setAttribute('min', today);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

display();

// *******************************************************************************************

const errorMessage = document.getElementById('errormessage')
const userinput = document.getElementById('taskNameInput')


const validity = '^[a-zA-Z0-9_ ]+$';
const regex = new RegExp(validity);

userinput.addEventListener('input', (e) => {

    let userinput = document.getElementById('taskNameInput')

    if (!regex.test(userinput.value)) {
        errorMessage.style.display = 'block';
    }
    else if (userinput =="") {
        
        errorMessage.style.display = 'none';
    }
    else {
        errorMessage.style.display = 'none';
    }
})



// ***************************************************************************************

addTaskBtn.addEventListener('click', () => {
    const taskName = taskNameInput.value;
    const taskDescription = taskDescriptionInput.value;
    const taskPriority = taskPriorityInput.value;
    const taskDate = taskDateInput.value;



    if (!taskName || !taskPriority || !taskDate) {
        if (!taskName) {
            taskNameInput.style.border = '1.5px solid red';
        }
        else {
            taskNameInput.style.border = '1px solid #dfe3e8';

        }

        if (!taskPriority) {
            taskPriorityInput.style.border = '1.5px solid red';
        }
        else {
            taskPriorityInput.style.border = '1px solid #dfe3e8'

        }
        if (!taskDate) {
            taskDateInput.style.border = '1.5px solid red';
        }
        else {
            taskDateInput.style.border = '1px solid #dfe3e8';

        }
        return;
    }
    else {
        taskNameInput.style.border = '1px solid #dfe3e8';
        taskPriorityInput.style.border = '1px solid #dfe3e8'
        taskDateInput.style.border = '1px solid #dfe3e8';
    }






    const duplicate = tasks.some(task => task.name.toLowerCase() === taskName.toLowerCase());
    if (duplicate) {
        alert('A task with this name is already exists')
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        date: taskDate,
        status: 'Pending'
    };

    tasks.push(task);
    saveTasksToLocalStorage();
    display();
    clearInputs();
});

// **********************************************************************************************

clearAllTasksBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasksToLocalStorage();
        display();
    }
});

// ************************************************************************************************

sortingDropdown.addEventListener('change', () => {
    sorting();
})

function sorting() {
    let sortedTasks = [...tasks];

    const sortType = sortingDropdown.value;

    if (sortType === 'alphabetical') {
        sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'alphabetical-desc') {
        sortedTasks.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'date') {
        sortedTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    taskList.innerHTML = '';
    sortedTasks.forEach(task => createTaskElement(task));
}

// ******************************************************************************************************

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        display();
    });
});

// **********************************************************************************************************
function display() {
    taskList.innerHTML = ''

    tasks.filter(task => {
        if (currentFilter === 'pending') return task.status === 'Pending';
        if (currentFilter === 'completed') return task.status === 'Completed';
        return true;
    })
        .forEach(task => createTaskElement(task));
}

// ***********************************************************************************************************
function createTaskElement(task) {
    const taskCard = document.createElement('li');
    taskCard.className = `task-item ${task.status === 'Completed' ? 'completed' : 'pending'}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.status === 'Completed';
    checkbox.className = 'status-checkbox';

    checkbox.addEventListener('change', () => {
        task.status = checkbox.checked ? 'Completed' : 'Pending';
        saveTasksToLocalStorage();
        display();
    });

    checkbox.disabled = task.status === 'Completed';

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';

    const taskName = document.createElement('div');
    taskName.className = 'task-name';
    taskName.textContent = task.name;

    taskName.addEventListener('click', () => enableInlineEdit(task, 'name', taskName));

    taskCard.addEventListener('click', (event) => {
        if ((!event.target.classList.contains('status-checkbox')) || (!event.target.classList.contains('delete-btn'))) {
            // openWindow(task);
        }
    })

    const taskDescription = document.createElement('div');
    taskDescription.className = 'task-description';
    taskDescription.textContent = `Description: ${task.description}`;

    taskDescription.addEventListener('click', () => enableInlineEdit(task, 'description', taskDescription));

    const taskPriority = document.createElement('span');
    taskPriority.className = `categoryNew category-${task.priority.toLowerCase()}`;
    taskPriority.textContent = task.priority;

    taskPriority.addEventListener('click', () => enableInlineEdit(task, 'priority', taskPriority));

    const taskDate = document.createElement('div');
    taskDate.className = 'task-date';
    taskDate.textContent = `Due: ${task.date}`;

    taskDate.addEventListener('click', () => enableInlineEdit(task, 'date', taskDate));

    taskDetails.appendChild(taskName);
    taskDetails.appendChild(taskDescription);
    taskDetails.appendChild(taskPriority);
    taskDetails.appendChild(taskDate);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'X';

    deleteButton.addEventListener('click', () => {
        taskCard.style.animation = 'slideOut 0.4s forwards';
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasksToLocalStorage();
        display();
    });

    taskCard.appendChild(checkbox);
    taskCard.appendChild(taskDetails);
    taskCard.appendChild(deleteButton);
    taskList.appendChild(taskCard);
}

// *********************************************************************************************************

function openWindow(task) {
    document.getElementById('popup').style.display = "block";

    document.getElementById('PName').innerText = `Task Name: ${task.name}`;

    document.getElementById('PDesc').innerText = `Description: ${task.description}`;

    document.getElementById('PCategory').innerText = `Category: ${task.priority}`;

    document.getElementById('PDate').innerText = `Due: ${task.date}`;


}


window.onclick = function (event) {
    if (event.target === document.getElementById('popup')) {
        document.getElementById('popup').style.display = "none";
    }
}

// *********************************************************************************************************
function enableInlineEdit(task, property, element) {

    if (task.status === 'Completed') {
        alert('This task is completed, you can not edit the task');
        return;
    }

    const inputField = document.createElement('input');

    if (property === 'name' || property === 'description') {
        inputField.type = 'text';
        inputField.value = task[property];
    } else if (property === 'priority') {
        inputField.type = 'select';
        const options = ['Personal', 'Business', 'Other'];
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            inputField.appendChild(optionElement);
        });
        inputField.value = task[property];
    } else if (property === 'date') {
        inputField.type = 'date';
        inputField.value = task[property];
    }

    inputField.className = `editable-${property}`;

    element.innerHTML = '';
    element.appendChild(inputField);
    inputField.focus();

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (property === 'priority' || property === 'date') {
                task[property] = inputField.value;
            } else {
                task[property] = inputField.value.trim();
            }
            saveTasksToLocalStorage();
            display();
        }
    });
}

// *************************************************************************************************************

function clearInputs() {
    taskNameInput.value = '';
    taskDescriptionInput.value = '';
    taskPriorityInput.value = '';
    taskDateInput.value = '';
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ****************************************************************************************************************

document.getElementById("searchBar").addEventListener("input",
    function () {
        const query = this.value.toLowerCase().trim();

        const tasks = document.querySelectorAll("#taskList li")

        tasks.forEach(task => {
            const taskName = task.textContent.toLowerCase();

            if (taskName.includes(query)) {
                task.style.display = "block";

            }
            else {
                task.style.display = "none";
            }
        })
    }
)