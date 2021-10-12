const app = require('./app')
const port = process.env.PORT
//socket.io
const http = require('http')
const socketio = require('socket.io')
const { Socket } = require('dgram')
const Filter = require('bad-words')
const  { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


const Message = require('./models/messageModel')
const RoleUser = require("./models/roleUserModel");
const Admin = require("./models/adminModel");
    // const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    // const role = await RoleUser.findOne({ _id: getAdmin.account_id })
    // const message = await new Message({
    //     userId: role._id,
    //     username: message.username,
    //     message: message.text
    // }).save()

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('new Websocket connection')

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, username, room })

        if(error){
            return callback(error)
        }


        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
        //socket.emit send event to specific client
        // io.emit every connected
        // socket.broadcast.emit except this one

        //io.to.emit omits an event to everybody in specifics room
        //socket.broadcast.to.emit sending an event except.. specifics room


    })

    socket.on('sendMessage', async (message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allows')
        }

                // const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
        // const role = await RoleUser.findOne({ _id: getAdmin.account_id })
        await new Message({
            userId: '6150491eede2b50da81f7e5d',
            username: user.username,
            message: message
        }).save()

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps/?q=${coords.latitude},${coords.longtitude}`))
        callback()
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }


    })
})



server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

