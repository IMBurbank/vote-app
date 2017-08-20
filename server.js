'use strict';


const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express = require('express'),
      flash = require('connect-flash'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      passport = require('passport'),
      routes = require('./app/routes/index.js'),
      session = require('express-session');


require('dotenv').load();
require('./app/config/passport')(passport);


const app = express(),
      appPort = process.env.PORT,
      dir = process.cwd(),
      nodeEnv = process.env.NODE_ENV;


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', dir + '/app/views');

app.use('/common', express.static(dir + '/app/common'))
app.use('/controllers', express.static(dir + '/app/controllers'));
app.use('/public', express.static(dir + '/app/public'));

app.use(session({
  secret: 'boilerSecret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


routes(app, passport);

app.listen(appPort, () => {
  console.log(`Express App listening on port ${appPort}...`);
});
