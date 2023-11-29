const mongoose = require("mongoose");
const moment = require('moment');

const taskSchema = new mongoose.Schema({
  TASK_ID: {
    type: String,
    required: true,
    unique: true,
  },
  TITLE: {
    type: String,
    required: true,
  },
  DESCRIPTION: {
    type: String,
    required: true,
  },
  Initiation_Date:{
    type:String,
    default:moment().format('YYYY-MM-DD') 
   },
  DEADLINE: String,
  PRIORITY: String,
  ASSIGNED_TO: {
    type: String,
    required: true,
  },
  STATUS: { type: String, default: "Pending" },
  notification:{
   type:Number,
   default:"1" },
   COMMENT:{
     type:String,
     default:""
   }
});

taskSchema.pre('save', function (next) {
  const task = this;
  if (!task.TASK_ID) {
    const currentTimestamp = new Date().getTime();
    task.TASK_ID = `T${currentTimestamp}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;




    






 
