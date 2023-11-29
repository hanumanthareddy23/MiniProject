const express = require("express");
const admindashboard = require("../controller/admindashboardController");

const router = express.Router();

router.get("/tasks", admindashboard.getAllTasks);
router.get("/tasks/:id", admindashboard.getAllTasksUpdate);
router.post("/tasks", admindashboard.createTask);
router.put("/tasks/:id", admindashboard.updateTask);
router.delete("/tasks/:id", admindashboard.deleteTask);
router.get("/task/:id", admindashboard.getTasksByUsername);
router.put("/tasks/update-status/:taskId", admindashboard.updateTaskStatus);
router.get("/completed-tasks", admindashboard.getCompletedTasks);
router.get("/current-tasks", admindashboard.getCurrentTasks);
router.get("/search", admindashboard.searchTasks);
router.put("/tasks/update/:taskId", admindashboard.updateTaskNotification);

module.exports = router;
