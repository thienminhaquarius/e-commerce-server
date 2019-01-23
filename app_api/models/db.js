var mongoose = require('mongoose');

mongoose.connect(process.env.DEV_DB_URL, { useMongoClient: true });

var db = mongoose.connection;

db.on('connected', function () {
	console.log('Mongoose connected to ' + process.env.DEV_DB_URL);
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', function () {
	console.log('Mongoose disconnected');
});