/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const moment = require('moment');


var multer  = require('multer')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/upload/'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' +file.originalname.split('.').pop())
  }
})

var upload = multer({ storage:storage })

var csrf = lusca({ csrf: true })

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ silent: true });

/**
 * Controllers (route handlers).
 */
const userController = require('./controllers/user');
const projectsController = require('./controllers/projects');
const locksController = require('./controllers/locks');
const cardsController = require('./controllers/cards');
const logController = require('./controllers/access-log');
const apiController = require('./controllers/api');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connection.openUri(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Set moment library to be used in templates
 */
app.locals.moment = moment;

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//   lusca.csrf()(req, res, next);
// });
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', (req, res) => res.redirect('/projects'));
app.get('/login', csrf,userController.getLogin);
app.post('/login', csrf,userController.postLogin);
app.get('/logout',csrf, userController.logout);
app.get('/forgot',csrf, userController.getForgot);
app.post('/forgot', csrf,userController.postForgot);
app.get('/reset/:token',csrf, userController.getReset);
app.post('/reset/:token', csrf,userController.postReset);
app.get('/signup',csrf, userController.getSignup);
app.post('/signup',csrf, userController.postSignup);
app.get('/account', csrf,passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile',csrf, passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', csrf,passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete',csrf, passportConfig.isAuthenticated, userController.postDeleteAccount);

app.get('/projects', csrf,passportConfig.isAuthenticated, projectsController.index);
app.get('/projects/create', csrf,passportConfig.isAuthenticated, projectsController.create);
app.get('/projects/delete/:id',csrf, passportConfig.isAuthenticated, projectsController.deleteProject);
app.get('/projects/update/:id',csrf, passportConfig.isAuthenticated, projectsController.showProjectUpdate);
app.get('/projects/:id', csrf,passportConfig.isAuthenticated, projectsController.showProject);
app.post('/projects/:id',csrf, passportConfig.isAuthenticated, projectsController.updateProject);
app.post('/projects', upload.single('picture'),csrf,passportConfig.isAuthenticated, projectsController.postProject);


app.get('/locks',csrf, passportConfig.isAuthenticated, locksController.index);
app.get('/locks/:id',csrf, passportConfig.isAuthenticated, locksController.showLock);
app.post('/locks/:id',csrf, passportConfig.isAuthenticated, locksController.updateLock);
app.post('/locks',csrf, passportConfig.isAuthenticated, locksController.postLock);
app.get('/locks/delete/:id', csrf,passportConfig.isAuthenticated, locksController.deleteLock);
app.get('/cards',csrf, passportConfig.isAuthenticated, cardsController.index);
app.get('/cards/:id',csrf, passportConfig.isAuthenticated, cardsController.showCard);
app.post('/cards/:id', csrf,passportConfig.isAuthenticated, cardsController.updateCard);
app.get('/cards/delete/:id',csrf, passportConfig.isAuthenticated, cardsController.deleteCard);
app.get('/access-log',csrf, passportConfig.isAuthenticated, logController.index);
app.get('/access-log/score/report',csrf, passportConfig.isAuthenticated, logController.score_report);
app.get('/access-log/:id', csrf,passportConfig.isAuthenticated, logController.showScore);
app.post('/access-log/:id',csrf, passportConfig.isAuthenticated, logController.updateScore);
app.get('/api/v1/access',csrf, apiController.index);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
