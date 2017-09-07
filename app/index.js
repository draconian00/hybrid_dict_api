const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/keyboard', require('./api/keyboard'));
app.use('/message', require('./api/message'));
// app.use('/users', require('./api/user'));

module.exports = app;