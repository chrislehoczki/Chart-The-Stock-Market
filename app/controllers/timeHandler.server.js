'use strict';


var moment = require('moment');

var datejs = require("datejs");




function TimeHandler() {
	
	this.getTime = function(req, res) {


		var date = req.params.time;
		console.log(date)
		
		date = Date(req.params.time)
		res.json(date)
		/*
		var unix = null;
		var natural = null;
		
		
		if (+date >= 0) {
		    console.log("TEST " + moment(date, "MMMM DD, YY").isValid())
            unix = +date;
            natural =  convertUnix(unix);
		}
		
		if (isNaN(+date) && moment(date, "MMMM DD, YY").isValid()) {
		    unix = date;
            natural = date;
		}

		var timeObj = {
		    UNIX: unix,
		    natural: natural
		}
		
		res.json(timeObj)
		
		
	}
	

function convertDate(date) {
    
}

function convertUnix(unix) {
    
    var testDate = moment(unix).format('LL');
    
    return testDate;
}
*/
}
}

module.exports = TimeHandler;
