document.addEventListener("DOMContentLoaded", function () {
  const notificat8 = document.getElementById("MyTasks");
  notificat8.addEventListener("click", () => {
    this.location.href = "/login/userDashboard.html";
  });

  fetchdata();

  function fetchdata() {
    console.log("FETCHING.....");
    let uid = localStorage.getItem("username");
    console.log(uid);
    const url = "http://localhost:3000/admin/task/" + uid;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const tasks = data.tasks;
        const tableBody = document.getElementById("taskTableBody");

        console.log("data.task", data.tasks);

        tasks.forEach((task) => {
          let conte = "Hi " + task.ASSIGNED_TO;
          const head1 = document.getElementById("h1user");
          head1.textContent = conte;
          if (task.notification == "1") {
            let val1 = `You have been assigned a new task.... Task Title:${task.TITLE}`;

            showNotification("Notification", val1, task._id);
          }
          if (task.notification == "0") {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = task.TITLE;
            row.insertCell(1).innerText = task.DESCRIPTION;
            row.insertCell(2).innerText = task.DEADLINE;
            row.insertCell(3).innerText = task.PRIORITY;

            const statusCell = row.insertCell(4);

            row.insertCell(5).innerText = task.COMMENT;

            const statusSelect = document.createElement("select");
            statusSelect.innerHTML = `
<option value="Pending">Pending</option>
<option value="In Progress">In Progress</option>
<option value="Completed">Completed</option>
          `;
            statusSelect.value = task.STATUS;

            statusSelect.addEventListener("change", () => {
              updateStatus(task._id, statusSelect.value);
            });
            statusCell.appendChild(statusSelect);

            const ACTI = row.insertCell(6);
            const editButton = document.createElement("button");
            editButton.textContent = "Send Comment";
            editButton.className = "editButton";
            editButton.setAttribute("data-taskid", task._id);
            console.log("taskid", task._id);
            editButton.style.backgroundColor = "blue";
            editButton.style.color = "white";
            editButton.style.marginRight = "10px";
            editButton.style.borderRadius = "10px";
            ACTI.appendChild(editButton);
          }
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));

    function updateStatus(taskId, newStatus) {
      fetch(`http://localhost:3000/admin/tasks/update-status/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ STATUS: newStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Status updated successfully:", data);
        })
        .catch((error) => console.error("Error updating status:", error));
    }
  }
});

function checkNotifications(taskId) {
  let newStatus = 0;
  console.log("check", taskId);
  fetch(`http://localhost:3000/admin/tasks/update/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notification: newStatus }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Status updated successfully:", data);
      location.href = "/login/userDashboard.html";
    })
    .catch((error) => console.error("Error fetching user details:", error));
}

function showNotification(title, message, taskid) {
  const notificationPopup = document.getElementById("notificationPopup");
  const notificationTitle = document.getElementById("notificationTitle");
  const notificationMessage = document.getElementById("notificationMessage");
  const notificat = document.getElementById("OK1");
  notificat.addEventListener("click", () => {
    checkNotifications(taskid);
    closeNotification();
  });
  const notificat2 = document.getElementById("OK2");
  notificat2.addEventListener("click", () => {
    UpdateNotifications(taskid);
    closeNotification();
  });
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;

  notificationPopup.style.display = "block";
}

function closeNotification() {
  const notificationPopup = document.getElementById("notificationPopup");

  notificationPopup.style.display = "none";
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", logout);

function logout() {
  window.location.href = "http://localhost:3000/login/index.html";
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("editButton")) {
    const taskId = event.target.getAttribute("data-taskid");
    console.log("taskid upadete", taskId);
    editTask(taskId);
  }
});

function editTask(taskId) {
  let editfrm = document.getElementById("editTaskForm");
  editfrm.style.display = "block";

  let url = "http://localhost:3000/admin/tasks/" + taskId;
  fetch(url)
    .then((response) => response.json())
    .then((task) => {
      console.log(task);
      document.getElementById("editTaskId").value = task[0]._id;
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
  const comment = document.getElementById("editTaskCOMMENT").value;
  console.log("task", taskId);

  const updatedTask = {
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

      document.getElementById("editTaskForm").style.display = "none";
      location.href = "/login/userDashboard.html";
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

function UpdateNotifications(taskId) {
  let newStatus = 2;
  console.log("check", taskId);
  fetch(`http://localhost:3000/admin/tasks/update/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notification: newStatus,
      COMMENT: "Declined",
      STATUS: "Declined",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Status updated successfully:", data);
    })
    .catch((error) => console.error("Error fetching user details:", error));
}

const notificat6 = document.getElementById("Alltask");
notificat6.addEventListener("click", () => {
  Alltask();
});

function Alltask() {
  fetch("http://localhost:3000/admin/tasks")
    .then((response) => response.json())
    .then((tasks) => displayTasks(tasks))
    .catch((error) => console.error("Error fetching tasks:", error));
}

function displayTasks(tasks) {
  const taskTable = document.getElementById("taskTable");

  taskTable.innerHTML = "";

  const headers = [
    "TASK_ID",
    "TITLE",
    "DESCRIPTION",
    "Initiation_Date",
    "DEADLINE",
    "ASSIGNED_TO",
    "STATUS",
  ];
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  taskTable.appendChild(headerRow);

  tasks.forEach((task) => {
    const tr = document.createElement("tr");
    headers.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = task[header];
      tr.appendChild(td);
    });

    taskTable.appendChild(tr);
  });
}
