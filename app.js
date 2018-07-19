const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
"use strict";
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
"use strict";
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');
let Dockersx86 = require('./models/dockersx86');
let Client = require('./models/client');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  "use strict";
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
  	"use strict";
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
"use strict";
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function(req, res){
"use strict";
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});
app.get('/dockersx86', function(req, res){
"use strict";
  Dockersx86.find({}, function(err, dockersx86){
    if(err){
      console.log(err);
    } else {
      res.render('dockersx86', {
        title:'Dockersx86',
        dockersx86: dockersx86
      });
    }
  });
});
app.get('/clients', function(req, res){
"use strict";
  Client.find({}, function(err, clients){
    if(err){
      console.log(err);
    } else {
      res.render('client', {
        title:'Clients',
        clients: clients
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
let dockersx86 = require('./routes/dockersx86');
let clients = require('./routes/clients');
app.use('/articles', articles);
app.use('/users', users);
app.use('/dockersx86', dockersx86);
app.use('/clients', clients);



// Start Server
app.listen(3000, function(){
"use strict";
  console.log('Server started on port 3000...');
});
