"use strict";

var app = require('./app/config/server');

// EJS
app.set('view engine', 'ejs');
app.set('views', './app/views')

// Middlewares
app.use(require('./app/middlewares/amp-access-cors'));

// API
var apiAuthorization = require('./app/api/amp-access/authorization')(app);

// Controllers
var homeController = require('./app/controllers/home-controller')(app);