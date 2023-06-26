var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors');
const bodyParser = require('body-parser');



var app = express();



// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Rest of your code

// Start the server
app.listen(3002, () => {
  console.log('Server is running on port 3002');
});

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const authMiddleware = require('./middleware/authMiddleware');

// Apply the authentication middleware to protected routes
app.use('/api/protected', authMiddleware);

// Add protected routes
// Example:
app.get('/api/protected/data', (req, res) => {
  // Access the user information from req.user
  res.status(200).json({ data: 'Protected data' });
});


const registerRouter = require('./routes/register');
app.use('/api/register', registerRouter);


const loginRouter = require('./routes/login');
app.use('/api/login', loginRouter);

const updateRouter = require('./routes/update');
app.use('/api/update', updateRouter);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
