"use strict";

const path = require('path');
var express = require('express');
var app = express();
var SERVER_PORT = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs')

app.listen(SERVER_PORT, function() {
    console.log('Server ON, listening port ' + SERVER_PORT);
});

// Static files
app.use('/static', express.static('./app/assets'));

module.exports = app;