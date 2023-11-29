const Task = require("../model/admin");
const Users = require("../model/Users");

exports.getAllTasksUpdate = (req, res) => {
  const id = req.params.id;
  Task.find({ _id: id })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getAllTasks = (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  Task.findByIdAndUpdate(taskId, updatedTask, { new: true })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    })
    .catch((error) => {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  Task.findByIdAndRemove(taskId)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getTasksByUsername = (req, res) => {
  const userId = req.params.id;
  console.log("usid", userId);
  Users.findById(userId)
    .then((user) => {
      if (!user) {
        console.error("User not found");
        return res.status(404).json({ error: "User not found" });
      }

      const username = user.name;

      return Task.find({ ASSIGNED_TO: username });
    })
    .then((tasks) => {
      res.json({ tasks });
    })
    .catch((err) => {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.updateTaskStatus = (req, res) => {
  const taskId = req.params.taskId;
  const newStatus = req.body.STATUS;

  Task.findByIdAndUpdate(taskId, { STATUS: newStatus }, { new: true })
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({ message: "Status updated successfully", task: updatedTask });
    })
    .catch((error) => {
      console.error("Error updatingSTATUS:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getCompletedTasks = (req, res) => {
  Task.find({ STATUS: "Completed" })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error("Error fetching completed tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getCurrentTasks = (req, res) => {
  Task.find({ STATUS: "Declined" })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error("Error fetching completed tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.searchTasks = (req, res) => {
  const query = req.query.query;


  const searchRegex = new RegExp(query, "i");

  Task.find({
    $or: [
      { TITLE: searchRegex },
      { ASSIGNED_TO: searchRegex },
      { PRIORITY: searchRegex },
      { STATUS: searchRegex },
      { COMMENT: searchRegex },
      { DESCRIPTION: searchRegex },
      { DEADLINE: searchRegex },
      { TASK_ID: searchRegex },
    ],
  })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error("Error searching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.updateTaskNotification = (req, res) => {
  const taskId = req.params.taskId;
  const newStatus = req.body.notification;
  const newComment = req.body.COMMENT;
  const oldStatus = req.body.STATUS;
  console.log("newStatus", newStatus);

  Task.findByIdAndUpdate(
    taskId,
    { notification: newStatus, COMMENT: newComment, STATUS: oldStatus },
    { new: true }
  )
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({ message: "Status updated successfully", task: updatedTask });
    })
    .catch((error) => {
      console.error("Error updatingSTATUS:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getAllTasks = (req, res) => {
  const { sortBy, sortOrder } = req.query;
  console.log("sort controller", sortBy, sortOrder);
  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  Task.find({})
    .sort(sortOptions)
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.createTask = (req, res) => {
  const newTask = new Task(req.body);
  newTask
    .save()
    .then((task) => {
      res.json(task);
    })
    .catch((error) => {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
