var express = require('express');
var jsonfile = require('jsonfile')
var app = express();
var serv = require('http').createServer(app);
var http = require('http');
var file = "films.json";
var fileCategories = "categories.json";

serv.listen(8080);
console.log("Server initialized");

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.on('getFilms', function () {
        jsonfile.readFile(file, function (err, obj) {
            var films = obj;
            jsonfile.readFile(fileCategories, function (err, obj2) {
                socket.emit('allFilms', films, obj2);
            })
        });
    });
    socket.on('getFilm', function (film) {
        var fileInfo = "info/" + film.slice(1) + ".json";
        jsonfile.readFile(fileInfo, function (err, obj) {
            if (err) console.log(err);
            if (obj) {
                obj.genre = obj.genre.toString();
                socket.emit('film', obj);
            }
        });
    })
    socket.on("search", function(film){
        jsonfile.readFile(file, function (err, films) {
            for(i = 0; i < films.length; i++){
                var n = new RegExp(film, "i");
                if (films[i].search(n)){
                    console.log("Result found");
                }
            }
        })
    })
    socket.on("link", function (film) {
        var fileInfo = "info/" + film + ".json";
        jsonfile.readFile(fileInfo, function (err, obj) {
            obj.genre = obj.genre.toString();
            socket.emit('thisLink', obj.link);
        });
    })
});