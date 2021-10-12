var express = require("express");
var route = express.Router();

/* GET home page. */
route.get("/", function (req, res, next) {
  const { msg } = req.query;
  res.render("index", { err: msg, title: "Leave Management System" });

});

module.exports = route;