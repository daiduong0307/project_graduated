var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const { Timestamp } = require("mongodb");
const validator = require('validator')
const roleUserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    maxlength: 100,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    maxlength: 255,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  role: {
    type: String,
    enum: ["admin", "staff", "manager"],
    default: "staff",
  }
}, {
  timestamps: true
});

roleUserSchema.path("password").set((inputString) => {
  return (inputString = bcrypt.hashSync(
    inputString,
    bcrypt.genSaltSync(10),
    null
  ));
});



const roleUser = mongoose.model("RoleUser", roleUserSchema);

module.exports = roleUser;
