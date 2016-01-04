'use strict';

var path = process.cwd();
var TimeHandler = require(path + '/app/controllers/timeHandler.server.js');

var moment = require('moment');
moment().format();
module.exports = function (app) {

		
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/:time')
		.get(function (req, res) {
			
		//GET TIME FROM PARAM
		var time = req.params.time;
		
		//START VARS AS NULL
		var unix = null;
		var natural = null;
		
		
		//GET NATURAL AND UNIX DATES
		var naturalDate = new moment(time)
		var unixDate = new moment(+time*1000);

		//IF UNIX
		if (+time >= 0) {
            unix = unixDate;
            natural =  unixDate.format("MMMM DD, YYYY");
		}
		//IF NATURAL
		if (isNaN(+time) && moment(time, "MMMM DD, YY").isValid()) {
		    unix = naturalDate.unix();
            natural = naturalDate.format("MMMM DD, YYYY");
		}

		//CREATE OBJ
		var timeObj = {
		    UNIX: unix,
		    natural: natural
		}
		
		//SEND OBJ
		res.json(timeObj)
		
		
		});
		
} //end of app


			
	
		
