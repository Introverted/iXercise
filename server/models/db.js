/**
 * Created by huyanh on 2016. 5. 16..
 */
var mongoose = require('mongoose');

var dbURI = "mongodb://128.195.54.50/GroupBDB"
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
    console.log("mongoose connected to " + dbURI)
});
mongoose.connection.on('error', function(err) {
    console.log("mongoose connection error" + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('mongoose disconnected');
});

var gracefulShutdown = function( msg, callback) {
    mongoose.connection.close(function () {
        console.log('mongoose disconnected through ' + msg);
        callback()
    })
}

// we monitor sigint so we close the connection when the application stops, might need to put extra sigint code for windows
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0)
    })
})