var createError       = require('http-errors');
var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var logger            = require('morgan');
var dotenv            = require('dotenv');
var cors              = require('cors');
var moment            = require('moment-timezone');

// initialize configuration
dotenv.config({
  path: path.join(__dirname,`${process.env.NODE_ENV || ''}.env`)
});

//*******************CONNECTION DATABASE
const sequelize = require('./configs/db.config');

async function connect(){
  try {
    await sequelize.authenticate().then(res => {
      console.log('Conexion exitosa a la base de datos');
    }, (err) => {
      console.log('No se pudo conectar a la base de datos: ', err);
    });
  } catch (error) {
    console.log('No se pudo conectar a la base de datos: ', error);
  }
}

connect();
//****************************

var indexRouter         = require('./routes/index');
var employerRouter      = require('./routes/employer.route');
var roleRouter          = require('./routes/role.route');
var typeEmployerRouter  = require('./routes/typeEmployer.route');
var movementsRouter     = require('./routes/movements.route');

var app = express();

//*******************TIME ZONE
moment.tz.setDefault("America/Mazatlan");
//****************************

//************************CORS
app.use(cors('*'))
//****************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',            indexRouter);
app.use('/employer',    employerRouter);
app.use('/role',        roleRouter);
app.use('/typeEmployer',typeEmployerRouter);
app.use('/movement',    movementsRouter);

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
