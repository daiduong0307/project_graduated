const { Router } = require("express");
var express = require("express");
var route = express.Router();

var loginController = require("../controllers/loginController");



// Get login page
route.get("/",  async (req, res, next) => {
  const { msg, sucessfully } = req.query;

  res.render("login", { err: msg, sucessfully: sucessfully,  title: "Leave management system", layout: "loginLayout.hbs"});
});

// Get login / logout request
route.post("/login", loginController.Login);
route.get("/logout", loginController.Logout);
// route.get("/signup", loginController.SignUp);

//front end for require reset password 
route.get('/forgot_select', loginController.forgotSelect)
route.get('/forgot_manager', loginController.forgot_manager)
route.get('/forgot_staff', loginController.forgot_staff)
route.post('/resetPassManager', loginController.resetPassManager)
route.post('/resetPassStaff', loginController.resetPassStaff)
//front end for require enter reset password
route.get('/reset_pass/:userId/:token', loginController.reset_pass)
route.post('/resetPassword/:userId/:token', loginController.resetPassUserId)

module.exports = route;
