var mongoose = require('mongoose');
//var async = require('async');

exports.events = function(io) {
    io.on('connection', function(socket) {


        socket.on('disconnect', function() {

        });
    });
}