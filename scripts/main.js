let tasks = []

document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.querySelector('form')

    const localStorageTasks = localStorage.getItem("tasks")

    if (localStorageTasks) {
        tasks = Array.from(JSON.parse(localStorageTasks)) || [];

    }

    todoForm.addEventListener("submit", e => {
        e.preventDefault();

        tasks = addTask(tasks || [])
    });

    initialViewTaskList(tasks)

    setCompletedTasksCounter();

    setTasksCounter(tasks?.length);

    showCurrentTime();

})

function initialViewTaskList(tasks) {
    if (Array.isArray(tasks) && tasks?.length > 0) {
        tasks.forEach(task => createTask(task));
    }
}

const setLocalStorageTaskList = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setTasksCounter(listTaskCount) {
    if (typeof listTaskCount === 'number' && listTaskCount >= 0) {
        const userTaskList = document.querySelector('.user-tasks_all')

        if (userTaskList) {
            userTaskList.innerHTML = `All tasks: ${listTaskCount}`;

            return listTaskCount;
        }

    }
}

function setCompletedTasksCounter() {
    const completedTasksCount = tasks.reduce((acc, curr) => {
        return acc + (curr?.completed || 0);
    }, 0);

    const userCompletedTaskList = document.querySelector('.user-tasks_done')

    if (userCompletedTaskList) {
        userCompletedTaskList.innerHTML = `Done: ${completedTasksCount}`;

        return completedTasksCount;
    }
}

function createTask(task) {

    const list = document.querySelector("ul");

    const li = document.createElement("li");

    li.addEventListener('click', (event) => completeTask(event))

    li.innerHTML = `<input type="checkbox" class="check" ${task?.completed ? 'checked' :''}>
      <input type="text" value="${task?.task || task?.value || ''}" class="task ${task?.completed ? 'completed' :''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <div class="del-icon" onclick="removeTask(this)"></div>`;

    if (list) {
        list.insertBefore(li, list?.children[0]);
    }
}

function addTask(tasks) {
    const task = document.querySelector("form input");

    if (task.value === "") {
        alert("Please add some task!");
        return;
    }

    if (document.querySelector(`input[value="${task.value}"]`)) {
        alert("Task already exist!");
        return;
    }

    const addedTasks = [...(tasks || []), {
        task: task.value,
        completed: false
    }]

    createTask(task)

    setLocalStorageTaskList(addedTasks)

    task.value = "";

    setTasksCounter((tasks?.length || 0) + 1)

    return addedTasks;
}

function completeTask(event) {

    tasks.forEach(task => {
        if (task.task === event?.target?.nextElementSibling?.value) {
            task.completed = !task.completed;
            task.task.strike();
        }
    });
    setLocalStorageTaskList(tasks)

    event?.target?.nextElementSibling?.classList?.toggle("completed");

    setCompletedTasksCounter()
}

function removeTask(event) {
    tasks.forEach(task => {
        if (task.task === event.parentNode.children[1].value) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });

    setLocalStorageTaskList(tasks)

    event.parentElement.remove();

    setTasksCounter(tasks?.length)

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

    setLocalStorageTaskList(tasks)
}

const showCurrentTime = () => {
    const now = new Date();
    const hour = padWithZeroes(now.getHours(), 2);
    const minute = padWithZeroes(now.getMinutes(), 2);
    const seconds = padWithZeroes(now.getSeconds(), 2);

    document.querySelector('.user-time').innerHTML = `${hour}:${minute}:${seconds}`;

    setTimeout(showCurrentTime, 500);
};

const padWithZeroes = (input, length) => {
    return String(input).padStart(length, "0");
};