var RoleUser = require("../models/roleUserModel");
var bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const Manager = require("../models/managerModel");
const Staff = require("../models/staffModel");
const Token = require('../models/tokenModel')
var crypto = require('crypto');
const roleUser = require("../models/roleUserModel");
const { resetPass } = require("../middleware/sendingEmail");
const URL = process.env.URL_KEY
// exports.SignUp = async (req, res, next) => {
//   const user = RoleUser({
//     username: "admin",
//     password: "admin",
//     role: "admin",
//   });
//   await user.save();
//   console.log(user);
//   return res.send(user);
// };

exports.Login = async (req, res) => {

  const user = await RoleUser.findOne({ username: req.body.username })
  if (!user) {

    // res.send('unable to login')
    const msg = "User Not Found !!!";
    return res.redirect(`/?msg=${msg}`);

  }
  try {
    const isMatch = await bcrypt.compare(req.body.password, user.password)

    if (!isMatch) {
      // res.send('unable to login')
      const msg = "Username or Password is incorrect !!!";
      return res.redirect(`/?msg=${msg}`);
    } else {

      req.session.userId = user._id;
      req.session.isAdmin = user.role === "admin" ? true : false;
      req.session.isStaff = user.role === "staff" ? true : false;
      req.session.isManager = user.role === "manager" ? true : false;

      if (user.role === "admin") {
        return res.redirect('admin/home');
      } else if (user.role === "staff") {
        return res.redirect(`/staff/list_all_requests`);
      } else if (user.role === "manager") {
        return res.redirect(`/manager/home`);
      }
    }
  } catch (error) {
    res.send(error)
    return res.redirect(`/`)
  }
}

exports.forgotSelect = async (req, res) => {
  const { msg, message } = req.query
  res.render('forgotSelect', {
    err: msg,
    sucessfully: message,
    layout: "loginLayout.hbs"
  })
}

exports.forgot_manager = async (req, res) => {
  const { msg, message } = req.query
  res.render('forgotManager', {
    err: msg,
    sucessfully: message,
    layout: "loginLayout.hbs"
  })
}
exports.forgot_staff = async (req, res) => {
  const { msg, message } = req.query
  res.render('forgotStaff', {
    err: msg,
    sucessfully: message,
    layout: "loginLayout.hbs"
  })
}

exports.resetPassManager = async (req, res) => {
  try {

    // const admin = await Admin.findOne({ email: req.body.email });
    const doesntExistUsername = "user with given email doesn't exist !!!"
    const message = "email send sucessfully !!"

    const manager = await Manager.findOne({ email: req.body.email });
    if (!manager) {
      return res.redirect(`/forgot_manager?msg=${doesntExistUsername}`)
    } else {
      const user = await RoleUser.findOne({ _id: manager.account_id })
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const link = URL +`/reset_pass/${user._id}/${token.token}`;
      await resetPass(manager.email, "Password reset", link)
        .then((result) => {
          console.log("Email sent...", result);
        })
        .catch((err) => {
          console.log(err.message);
        })
    }
    // if (!admin) {
    //   return res.redirect(`/forgot?msg=${doesntExistUsername}`)
    // } else {
    //   const user = await RoleUser.findOne({ _id: admin.account_id })
    //   let token = await Token.findOne({ userId: user._id });
    //   if (!token) {
    //     token = await new Token({
    //       userId: user._id,
    //       token: crypto.randomBytes(32).toString("hex"),
    //     }).save();
    //   }
    //   const link = `localhost:3000/resetPass/${user._id}/${token.token}`;
    //   await resetPass(admin.email, "Password reset", link)
    //     .then((result) => {
    //       console.log("Email sent...", result);
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //     })
    // }

    return res.redirect(`/forgot_manager?message=${message}`)
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}
exports.resetPassStaff = async (req, res) => {
  try {
    const doesntExistUsername = "user with given email doesn't exist !!!"
    const message = "email send sucessfully !!"

    const staff = await Staff.findOne({ email: req.body.email });
    if (!staff) {
      return res.redirect(`/forgot_staff?msg=${doesntExistUsername}`)
    } else {
      const user = await RoleUser.findOne({ _id: staff.account_id })
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const link = URL +`/reset_pass/${user._id}/${token.token}`;
      await resetPass(staff.email, "Password reset", link)
        .then((result) => {
          console.log("Email sent...", result);
        })
        .catch((err) => {
          console.log(err.message);
        })
    }

    return res.redirect(`/forgot_staff?message=${message}`)
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}

exports.reset_pass = async (req, res) => {
  const { userId, token } = req.params
  const {invalid,sucessfully, error } = req.query
  res.render('reset_pass', {
    User: userId,
    Token: token,
    notify:{
      error,
      invalid,
      sucessfully,
    },
    layout: "loginLayout.hbs"
  })
}

exports.resetPassUserId = async (req, res) => {
  try {
    const password = req.body.password
    const sucessfully = 'password reset sucessfully'
    const user = await RoleUser.findById(req.params.userId);
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    })

    if (!user) {
      const invalid = 'Invalid link or expired'
      return res.redirect(`/reset_pass/${user._id}/${token.token}?invalid=${invalid}`)
    }
    if (!token) {
      const invalid = 'Invalid link or expired'
      return res.redirect(`/reset_pass/${user._id}/${token.token}?invalid=${invalid}`)
    }
    //!check validate
    if(password) {
      if(password.length < 7 || password.includes("password")) {
        const err = 'the password length must be  > 7'
        return res.redirect(`/reset_pass/${user._id}/${token.token}?error=${err}`)
      }
    }
    user.password = password;
    // if( user.password = "") {
    //   return res.redirect( URL + `/reset_pass/${user._id}/${token.token}?msg=${err}`)
    // }
    await user.save();
    await token.delete();
    return res.redirect(`/?sucessfully=${sucessfully}`)
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}

exports.Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
};

