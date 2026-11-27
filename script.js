
console.log("To-Do List is working!");

// 1. HTML elements select karna
let currentFilter = "all";

let filterButtons = document.querySelectorAll(".filter-btn");
let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let taskStats = document.getElementById("taskStats");
// 2. Tasks array
let tasks = [];

// 3. Tasks ko Local Storage mein save karna
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 4. Local Storage se tasks load karna
function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks !== null) {
        tasks = JSON.parse(savedTasks);
    }
}

function updateStats() {

    let total = tasks.length;

    let completed = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    let pending = total - completed;

    taskStats.innerHTML = `
        <p>Total: ${total}</p>
        <p>Completed: ${completed}</p>
        <p>Pending: ${pending}</p>
    `;
}


filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
}); 
// 5. Tasks ko screen par display karna
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "pending") {
            return task.completed === false;
        }

        if (currentFilter === "completed") {
            return task.completed === true;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {

        let index = tasks.indexOf(task);

        let li = document.createElement("li");
        li.innerText = task.name;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("click", function() {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "deletebtn";
        deleteBtn.innerText = "Delete";

        deleteBtn.addEventListener("click", function(event) {
            event.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateStats();
}

// 6. Add Task button functionality
addBtn.addEventListener("click", function() {

    let task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    let newTask = {
        name: task,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
});

// 7. Enter key functionality
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addBtn.click();
    }

});

// 8. Page load hone par saved tasks display karna
loadTasks();
displayTasks();

