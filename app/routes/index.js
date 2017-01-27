'use strict';

var UserHandler = require( process.cwd() + "/app/controllers/user.js");
var Barhandler = require( process.cwd() + "/app/controllers/bar.js");


module.exports = function (app, db) {
	var userHandler = new UserHandler(db);
	var barhandler = new Barhandler(db);

	app.route('/listBars').post(barhandler.listBar);
	app.route('/goingBar').post(barhandler.goingBar);
	app.route('/addUser').post(userHandler.addUser);
	app.route('/loginUser').post(userHandler.loginUser);

	app.route('/')
		.get(function (req, res) {
			res.render(process.cwd() + '/public/views/index.pug');
		});

	app.route('*').get(function(req,res){ console.log(req.url);res.end();});

	// app.route('/api/:id/clicks')
	// 	.get(isLoggedIn, clickHandler.getClicks)
	// 	.post(isLoggedIn, clickHandler.addClick)
	// 	.delete(isLoggedIn, clickHandler.resetClicks);

};
