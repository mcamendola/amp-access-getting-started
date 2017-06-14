"use strict";

var app = require('./app/config/server');
var consign = require('consign')();

// EJS
app.set('view engine', 'ejs');
app.set('views', './app/views')



// Middlewares
app.use(require('./app/middlewares/amp-access-cors'));

consign.include('./app/api/amp-access')
       .then('./app/controllers')
       .into(app);
