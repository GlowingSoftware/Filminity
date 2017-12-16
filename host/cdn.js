var express = require('express');
var app = express();
var port = 7777;
var serv = require('http').createServer(app);

app.use(express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');
app.listen(port);