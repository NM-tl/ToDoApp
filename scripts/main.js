window.onload = loadTasks;

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    addTask();
});

// String.prototype.firstLetterCaps = function() {
//     return this.charAt(0).toUpperCase() + this.slice(1);
// }
//
// const userName = prompt('Enter your name:')
// document.querySelector('.user-name').innerHTML = userName.firstLetterCaps();

let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

function loadTasks() {
    if (localStorage.getItem("tasks") == null) return;

    tasks.forEach(task => {
        const list = document.querySelector("ul");
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
          <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
          <div class="del-icon" onclick="removeTask(this)"></div>`;
        list.insertBefore(li, list.children[0]);
    });
}

function allTasksCounter() {
    let allTasksCount = tasks.length;

    document.querySelector('.user-tasks_all').innerHTML = `All tasks: ${allTasksCount}`;
    return allTasksCount;
}

allTasksCounter();

function completedTasksCounter() {
    let initialVal = 0;

    let completedTasksCount = tasks.reduce(function (acc, curr) {
        return acc + curr.completed;
    }, initialVal);

    document.querySelector('.user-tasks_done').innerHTML = `Done: ${completedTasksCount}`;
    return completedTasksCount;
}

completedTasksCounter();

function addTask() {
    const task = document.querySelector("form input");
    const list = document.querySelector("ul");

    if (task.value === "") {
        alert("Please add some task!");
        return false;
    }

    if (document.querySelector(`input[value="${task.value}"]`)) {
        alert("Task already exist!");
        return false;
    }

    localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false }]));

    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <div class="del-icon" onclick="removeTask(this)"></div>`;
    list.insertBefore(li, list.children[0]);
    task.value = "";

    document.querySelector('.user-tasks_all').innerHTML = `All tasks: ${allTasksCounter()}`;
}

function taskComplete(event) {
    tasks.forEach(task => {
        if (task.task === event.nextElementSibling.value) {
            task.completed = !task.completed;
            task.task.strike();
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.nextElementSibling.classList.toggle("completed");
    document.querySelector('.user-tasks_done').innerHTML = `Done: ${completedTasksCounter()}`;
}

function removeTask(event) {
    tasks.forEach(task => {
        if (task.task === event.parentNode.children[1].value) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.parentElement.remove();

    document.querySelector('.user-tasks_all').innerHTML = `All tasks: ${allTasksCounter()}`;
}

let currentTask = null;

function getCurrentTask(event) {
    currentTask = event.value;
}

function editTask(event) {
    if (event.value === "") {
        alert("Task is empty!");
        event.value = currentTask;
        return;
    }

    tasks.forEach(task => {
        if (task.task === event.value) {
            alert("Task already exist!");
            event.value = currentTask;
            return;
        }
    });

    tasks.forEach(task => {
        if (task.task === currentTask) {
            task.task = event.value;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const currTime = () => {
    const now = new Date();
    const h = padWithZeroes(now.getHours(), 2);
    const m = padWithZeroes(now.getMinutes(), 2);
    const s = padWithZeroes(now.getSeconds(), 2);

    document.querySelector('.user-time').innerHTML = `${h}:${m}:${s}`;
    setTimeout(currTime, 500);
};

const padWithZeroes = (input, length) => {
    let padded = input;
    if (typeof input !== "string") padded = input.toString();
    return padded.padStart(length, "0");
};

currTime();