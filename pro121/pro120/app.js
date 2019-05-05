var express  = require('express');
var app      = express();
var path     = require('path');
var session  = require('express-session');
var flash    = require('connect-flash');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var static = require('serve-static');
var ejs = require('ejs');
var sequelize = require('./models').sequelize;

// db sync
sequelize.sync();

// view engine
app.set("view engine", 'ejs');

//CORS 허용
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//리스너 제한 수정
process.setMaxListeners(100);

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret'}));


// routes
app.use('/reserve', require('./routes/reserve'));
app.use('/rooms', require('./routes/room'));
app.use('/', require('./routes/home'));


//css, js, image, fonts 폴더 연결
app.use('/js', static(path.join(__dirname,   'js')));
app.use('/css', static(path.join(__dirname,  'css')));
app.use('/images', static(path.join(__dirname,  'images')));
app.use('/fonts', static(path.join(__dirname,  'fonts')));
app.use('/html', static(path.join(__dirname,  'html')));
app.use('/uploads', static(path.join(__dirname,  'uploads')));




// start server
var port = process.env.PORT || 80;
app.listen(port, function(){
  console.log('Server On : %d', port);
});


