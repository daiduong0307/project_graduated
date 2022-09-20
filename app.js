const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const exphbs = require('express-handlebars');
const hbs = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
require('./db/mongoose')
const methodOverride = require("method-override");
const paginate = require('handlebars-paginate');


//Route
const adminRoute = require('./routes/adminRoute')
const staffRoute = require('./routes/staffRoute')
const managerRoute = require('./routes/managerRoute')
const loginRoute = require('./routes/loginRoute')

//Middleware
const loginMiddleware = require('./middleware/loginMiddleware')

var app = express();

// //socket.io
// const server = http.createServer(app)
// const io = socketio(server)

// let count = 0
// io.on('connection', (socket) => {
//   console.log('new Websocket connection')
//   socket.emit('countUpdate', count)
// })


// using Session to verify User Login.
app.use(
  session({
    secret: "process.env.SESSION_KEY",
    resave: true,
    saveUninitialized: false,
  })
);

// view engine setup
//HBS Helper
hbs.registerHelper('equals', function (a,b, options) {
  if(a == b){
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

//patination
hbs.registerHelper('paginate', paginate)


app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', exphbs({
    defaultLayout: 'adminLayout',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    handlebars: allowInsecurePrototypeAccess(hbs),
    helpers: require("handlebars-helpers")(),
    extname: '.hbs'
}));

app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//============
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);



//================================================
app.use('/', loginRoute)
app.use('/admin', loginMiddleware.isAdmin , adminRoute)
app.use('/staff', loginMiddleware.isStaff, staffRoute)
app.use('/manager', loginMiddleware.isManager, managerRoute)
//==================================================



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
