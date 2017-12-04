var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var fileUpload = require('express-fileupload');
var Promise = require('promise');
var url = require('url');
var knexLogger = require('knex-logger');
const expressGraphQL = require('express-graphql');

const sMahasiswa = require('./schema/mahasiswa.js');
const sJujian = require('./schema/jenis_ujian.js');
const sKuliah = require('./schema/kuliah.js');

mysql = require('mysql');
db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
var app = express();
{}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(knexLogger(db));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(function(req,res,next){
	res.set({'Access-Control-Allow-Origin' : '*'});
	next()
	});
app.use(validator({
	customValidators : require('./validator/custom_validator')
}));

//ROUTES
app.use('/api/soal', require('./routes/soal'));
app.use('/api/ujian', require('./routes/ujian'));
app.use('/api/mahasiswa', require('./routes/mahasiswa'));
app.use('/api/matkul', require('./routes/matkul'));
app.use('/api/kelas', require('./routes/kelas'));
app.use('/api/jenis_ujian', require('./routes/jenis_ujian'));
app.use('/api/jenis_soal', require('./routes/tipe_soal'));
app.use('/api/dosen', require('./routes/dosen'));
app.use('/api/kuliah', require('./routes/kuliah'));
app.use('/api/test', require('./routes/test'));
app.use('/api/cek', require('./routes/cekPesertaUjian'));
app.use('/api/user', require('./routes/user'));
app.use('/api/v2/mahasiswa', expressGraphQL({
  schema: sMahasiswa,
  graphiql: true,
}));
app.use('/api/v2/jenis_ujian', expressGraphQL({
  schema: sJujian,
  graphiql: true,
}));
app.use('/api/v2/kuliah', expressGraphQL({
  schema: sKuliah,
  graphiql: true,
}));
//EOF ROUTES

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
