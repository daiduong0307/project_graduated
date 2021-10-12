const RoleUser = require("../models/roleUserModel");
const Admin = require("../models/adminModel");
const Staff = require("../models/staffModel");
const Manager = require("../models/managerModel");
const BusinessUnit = require("../models/businessUnitModel");
const RequestType = require("../models/requestTypeModel");
const Request = require("../models/requestModel");
const Message = require('../models/messageModel')
const app = require('../app')
//socket.io
const http = require('http')
const socketio = require('socket.io')
const { Socket } = require('dgram')

//GET
exports.loginChat = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const role = await RoleUser.findOne({ _id: getAdmin.account_id })
    try {
        res.render("adminViews/admin_login_chat", {
            Admin: getAdmin,
            Role: role
        })
    } catch (e) {
        res.status(400).send(e)
    }
}


exports.chatRoom = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const role = await RoleUser.findOne({ _id: getAdmin.account_id })
    const message = await Message.find({ userId: role._id })
    console.log(role)
    console.log(message)
    try {
        res.render("adminViews/admin_chat_room", {
            Admin: getAdmin,
            Role: role,
            Message: message
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.get_all_messages = async (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
}

exports.new_messages = async (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
            io.emit('message', req.body);
            res.sendStatus(200);
    })

}











// no require needed here, at least, I don't think so

// Controller agrees to implement the function called "respond"
exports.respond = function (socket_io) {
    // this function expects a socket_io connection as argument

    // now we can do whatever we want:
    socket_io.on('news', function (newsreel) {

        // as is proper, protocol logic like
        // this belongs in a controller:

        socket.broadcast.emit(newsreel);
    });
}

exports.respond = function (endpoint, socket) {
    // this function now expects an endpoint as argument

    socket.on('news', function (newsreel) {

        // as is proper, protocol logic like
        // this belongs in a controller:

        endpoint.emit(newsreel); // broadcast news to everyone subscribing
        // to our endpoint/namespace
    });
}