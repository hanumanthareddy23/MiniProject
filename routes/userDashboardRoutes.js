const express = require("express");
const userroutes = express.Router();
const userDashboard = require("../controller/userdashboardController");
const isadminAuth = require("../middleware/adminauth");

userroutes.post("/login", userDashboard.login);
userroutes.get("/logout", userDashboard.logout);
userroutes.post("/register", userDashboard.register);
userroutes.post("/checkUser", isadminAuth, userDashboard.checkUser);
userroutes.get("/users", userDashboard.getallusers);

module.exports = userroutes;
