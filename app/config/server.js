"use strict";

const path = require('path');
var express = require('express');
var app = express();
var SERVER_PORT = 3000;

// Static files
app.use('/static', express.static('./app/assets'));

app.listen(SERVER_PORT, function() {
    console.log('Server ON, listening port ' + SERVER_PORT);
});

module.exports = app;