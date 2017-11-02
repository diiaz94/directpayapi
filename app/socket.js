var mongoose = require('mongoose');
//var async = require('async');
var UserSchema = require('./schemas/user');

exports.events = function(io) {
    io.on('connection', function(socket) {


        socket.on('disconnect', function() {

        });

        socket.on('enter region', function(data) {

            console.log("emit received ENTER region", data);
            var beacon = data.beacon;
            var user = data.user;
            socket.join(beacon, function() {
                UserSchema.findOne({ _id: user }, function(err, user) {
                    //console.log("user", user)
                    if (user) {
                        io.in(beacon).emit('add user', { user: user });
                    }
                });
            });

        });

        socket.on('exit region', function(data) {

            console.log("emit received EXIT region", data);
            var beacon = data.beacon;
            var user = data.user;
            socket.leave(beacon, function() {
                UserSchema.findOne({ _id: user }, function(err, user) {
                    //console.log("user", user)
                    if (user) {
                        io.in(beacon).emit('remove user', { user: user });
                    }
                });
            });

        });
    });
}