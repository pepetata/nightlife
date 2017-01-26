'use strict';

var express = require('express')
	, routes = require('./app/routes/index.js')
	, bodyParser = require('body-parser')
	, MongoClient = require('mongodb').MongoClient
	, stylus = require('stylus')
	;

var app = express();

app.set('views', process.cwd() + '/public' );
app.set('view engine', 'stylus');
app.use(express.static("public"));
app.use(stylus.middleware( process.cwd() + '/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
// app.use('/common', express.static(process.cwd() + '/app/common'));

MongoClient.connect("mongodb://localhost:27017/polldb", function (err, database) {
	if (err) 
   		console.log('------>>>> Error: Not connected to database');
   	else
		console.log("MongoDB connected to port 27017");
   
	routes(app, database);

	var port = process.env.PORT || 8080;
	app.listen(port,  function () {
		console.log('Node.js listening on port ' + port + '...');
	});
});


// Consumer Key	z74tdO0MA5-uKNZPDO1cVQ
// Consumer Secret	gVXdlnVXDZw0plmyBtQcU55N5uI
// Token	6aqiRo0S8w27istk7cn21qz-jF_HiL4C
// Token Secret	7bJ9zQ8kS0uKBVnQvJqPX6dPmzY