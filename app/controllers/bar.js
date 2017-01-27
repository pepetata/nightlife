/* global */
'use strict';
var async = require("async");

var Yelp = require('yelp');
var yelp = new Yelp({ consumer_key: "z74tdO0MA5-uKNZPDO1cVQ",
                      consumer_secret: "gVXdlnVXDZw0plmyBtQcU55N5uI",
                      token: "6aqiRo0S8w27istk7cn21qz-jF_HiL4C",
                      token_secret: "7bJ9zQ8kS0uKBVnQvJqPX6dPmzY"
                      });






function BarHandler(db) {

	this.listBar= function(req,res) {
		var bars;
   	var text = req.body.text;
   	yelp.search({location: text,  term: 'bar'})
	  	.then(function (data) {
	  		bars= data.businesses;
	  		db.collection('barUsers', function (err, users) {
		  		if (err) throw err;
		  		async.each(bars, function(bar,callback1) {
		  			users.findOne({ name : bar.name }, function(error, doc) {
		  				var userList;
				  		if (! doc) {
					  		userList = [];
				  		} else {
					  		userList = doc.users;
				  		}
		  				bar.users = userList;
		  				callback1(); 
		  			});
		  		}, function () {
		  			res.end(JSON.stringify(bars));
		  		});
  		});
		});
	};



	this.goingBar= function(req,res) {
   	var name = req.body.name;
   	var user = req.body.user;
   	console.log('goingBar procurando por ',name,user);
	  db.collection('barUsers', function (err, users) {
	  	if (err) throw err;
	  	users.find({name: name}).toArray(function (err, doc) {
	  		if (err) throw err;
	  		var barUser;
console.log('find = ',doc);
	  		if (doc.length === 0) {
	  			// add user
	  			barUser= {name: name, users:[user]}; 
	  			users.insert(barUser);
	  		} else {
					// is this user in the list?
					var userList = doc[0].users;
console.log('userlist ',userList,doc[0].users);
					if (userList.indexOf(user) > -1) {
						// yes, remove it
						userList.splice(userList.indexOf(user), 1);
					} else {
						userList.push(user);
					}
	  			barUser= {name: name, users:userList}; 
					users.update({name:name},barUser);
	  		}
  			res.end(JSON.stringify(barUser.users));
  			return;

  	});
  });
  return [];

	};
}



module.exports = BarHandler;

