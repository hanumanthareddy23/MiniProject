document.addEventListener("DOMContentLoaded", function () {
  fetchTasks();
  getusersList();

  /**
   * Function to search tasks based on user input
   */
  const addTask = document.getElementById("addTask");
  const allTask1 = document.getElementById("Alltask");
  const declinedTask = document.getElementById("declinedTask");
  const completedTask = document.getElementById("completedTask");
  const searchTask = document.getElementById("searchButton");

  const createTaskFormCancel = document.getElementById("createTaskFormCancel");
  createTaskFormCancel.addEventListener("click", hideCreateTaskForm);

  function searchTasks() {
    const searchInput = document.getElementById("searchInput").value;
    fetch(`http://localhost:3000/admin/search?query=${searchInput}`)
      .then((response) => response.json())
      .then((tasks) => displayTasks(tasks))
      .catch((error) => console.error("Error searching tasks:", error));
  }

  addTask.addEventListener("click", showCreateTaskForm);
  declinedTask.addEventListener("click", showCurrentTasks);
  completedTask.addEventListener("click", showCompletedTasks);
  searchTask.addEventListener("click", searchTasks);
  allTask1.addEventListener("click", showalltask);

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("editButton")) {
      const taskId = event.target.getAttribute("data-taskid");
      editTask(taskId);
    }

    if (event.target.classList.contains("deleteButton")) {
      const taskId = event.target.getAttribute("data-taskid");
      deleteTask(taskId);
    }
  });
  /**
   * Function to fetch tasks initially
   */
  function fetchTasks() {
    fetch("http://localhost:3000/admin/tasks")
      .then((response) => response.json())
      .then((tasks) => displayTasks(tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  const sortButton = document.getElementById("sortButton");
  sortButton.addEventListener("click", function () {
    const sortField = document.getElementById("sortField").value;
    const sortOrder = document.getElementById("sortOrder").value;
    sortTasks(sortField, sortOrder);
  });

  /**
   * Function to sort tasks based on selected field and order
   * @param {string} column - The column to sort by
   * @param {string} currentSortOrder - The current sort order (asc/desc)
   */
  function sortTasks(column, currentSortOrder) {
    console.log("sort", column, currentSortOrder);

    fetch(`/admin/tasks?sortBy=${column}&sortOrder=${currentSortOrder}`)
      .then((response) => response.json())
      .then((tasks) => displayTasks(tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  /**
   * Function to display tasks in the table
   * @param {Array} tasks - The array of tasks to display
   */

  function displayTasks(tasks) {
    const taskTable = document.getElementById("taskTable");

    taskTable.innerHTML = "";

    const headers = [
      "TASK_ID",
      "TITLE",
      "DESCRIPTION",
      "Initiation_Date",
      "DEADLINE",
      "PRIORITY",
      "ASSIGNED_TO",
      "STATUS",
      "COMMENT",
    ];
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    headerRow.innerHTML += "<th>Actions</th>";
    taskTable.appendChild(headerRow);

    tasks.forEach((task) => {
      const tr = document.createElement("tr");
      headers.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = task[header];
        tr.appendChild(td);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "editButton";
      editButton.setAttribute("data-taskid", task._id);
      editButton.style.backgroundColor = "blue";
      editButton.style.color = "white";
      editButton.style.marginRight = "10px";
      editButton.style.borderRadius = "10px";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "deleteButton";
      deleteButton.setAttribute("data-taskid", task._id);
      deleteButton.style.backgroundColor = "blue";
      deleteButton.style.color = "white";
      deleteButton.style.borderRadius = "10px";

      const tdActions = document.createElement("td");
      tdActions.appendChild(editButton);
      tdActions.appendChild(deleteButton);
      tr.appendChild(tdActions);

      taskTable.appendChild(tr);
    });
  }
  /**
   * Function to show the create task form
   */
  function showCreateTaskForm() {
    const createTaskForm = document.getElementById("createTaskForm");
    createTaskForm.style.display = "block";

    const createTaskFormSubmit = document.getElementById(
      "createTaskFormSubmit"
    );
    createTaskFormSubmit.addEventListener("click", submitTaskForm);
  }

  /**
   * Function to submit the task form
   */
  function submitTaskForm() {
    const taskForm = document.getElementById("taskForm");

    const taskId = generateTaskId();

    const formData = new FormData(taskForm);
    formData.append("TASK_ID", taskId);

    fetch("http://localhost:3000/admin/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => response.json())
      .then(() => {
        hideCreateTaskForm();
        fetchTasks();
      })
      .catch((error) => console.error("Error creating task:", error));
  }

  /**
   * Function to generate a unique task ID
   * @returns {string} - The generated task ID
   */
  function generateTaskId() {
    const uniqueNumber = Math.floor(Math.random() * 1000);
    return `T${uniqueNumber}`;
  }
  /**
   * Function to hide the create task form
   */

  function hideCreateTaskForm() {
    const createTaskForm = document.getElementById("createTaskForm");
    createTaskForm.style.display = "none";
  }
  /**
   * Function to get the list of users
   */
  function getusersList() {
    const url = "http://localhost:3000/users";
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let length = data.length;
        console.log(length);
        let content = `<select name='ASSIGNED_TO' id='ASSIGNED_TO' required><option> Select User </option>`;
        for (i = 0; i < length; i++) {
          content += `<option value="${data[i].name}" data-extra="${data[i].name}">${data[i].name}</option>`;
        }
        content += `</select>`;

        document.getElementById("ASSIGNED_TO").innerHTML = content;
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", logout);
  /**
   * Function to logout
   */

  function logout() {
    window.location.href = "./index.html";
  }

  declinedTask.addEventListener("click", showDeclinedTasks);

  /**
   * Function to show declined tasks
   */
  function showDeclinedTasks() {
    fetch("http://localhost:3000/admin/current-tasks")
      .then((response) => response.json())
      .then((completedTasks) => displayTasks(completedTasks))
      .catch((error) =>
        console.error("Error fetching completed tasks:", error)
      );
    console.log("Show current tasks");
  }

  const completedTask2 = document.getElementById("completedTask");
  completedTask2.addEventListener("click", showCompletedTasks);

  /**
   * Function to show completed tasks
   */
  function showCompletedTasks() {
    fetch("http://localhost:3000/admin/completed-tasks")
      .then((response) => response.json())
      .then((completedTasks) => displayTasks(completedTasks))
      .catch((error) =>
        console.error("Error fetching completed tasks:", error)
      );
  }

  /**
   * Function to show all tasks
   */

  function showalltask() {
    location.reload();
  }

  /**
   * Function to edit a task
   * @param {string} taskId - The ID of the task to edit
   */
  function editTask(taskId) {
    let editfrm = document.getElementById("editTaskForm");
    editfrm.style.display = "block";

    let url = "http://localhost:3000/admin/tasks/" + taskId;
    fetch(url)
      .then((response) => response.json())
      .then((task) => {
        console.log(task);

        document.getElementById("editTaskId").value = task[0]._id;
        document.getElementById("editTaskTitle").value = task[0].TITLE;
        document.getElementById("editDESCRIPTION").value = task[0].DESCRIPTION;
        document.getElementById("editTaskDueDate").value = task[0].DEADLINE;
        document.getElementById("editTaskPriority").value = task[0].PRIORITY;
        document.getElementById("editTaskAssignedTo").value =
          task[0].ASSIGNED_TO;
        document.getElementById("editTaskCOMMENT").value = task[0].COMMENT;

        document.getElementById("editTaskForm").style.display = "block";
      })
      .catch((error) =>
        console.error("Error fetching task details for edit:", error)
      );
  }

  const updatedata = document.getElementById("update1");
  updatedata.addEventListener("click", updateTask);

  function updateTask() {
    const taskId = document.getElementById("editTaskId").value;
    const title = document.getElementById("editTaskTitle").value;
    const description = document.getElementById("editDESCRIPTION").value;
    const dueDate = document.getElementById("editTaskDueDate").value;
    const priority = document.getElementById("editTaskPriority").value;

    const comment = document.getElementById("editTaskCOMMENT").value;
    // Construct updated task object
    const updatedTask = {
      TITLE: title,
      DESCRIPTION: description,
      DEADLINE: dueDate,
      PRIORITY: priority,
      COMMENT: comment,
    };

    fetch(`http://localhost:3000/admin/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        console.log(`Updated task: ${JSON.stringify(updatedTask)}`);
        fetchTasks();
        document.getElementById("editTaskForm").style.display = "none";
      })
      .catch((error) => console.error(error));
  }

  let can1 = document.getElementById("cancel1");
  can1.addEventListener("click", () => {
    cancelUpdateTask();
  });

  function cancelUpdateTask() {
    document.getElementById("editTaskForm").style.display = "none";
  }

  function deleteTask(taskId) {
    fetch(`http://localhost:3000/admin/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchTasks();
      })
      .catch((error) => console.error("Error deleting task:", error));
  }
});
