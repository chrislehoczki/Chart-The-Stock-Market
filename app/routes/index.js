'use strict';

var path = process.cwd();
var TimeHandler = require(path + '/app/controllers/timeHandler.server.js');

//NODE MODULES
var p = require('ua-parser');
var get_ip = require('ipware')().get_ip;
var requestLanguage = require('express-request-language');
var cookieParser = require('cookie-parser');

module.exports = function (app) {
	


	app.route('/')
		.get(function (req,res) {

		//GET BROWSER USING UA-PARSER
		var userAgent = req.headers['user-agent'];
		var browser = p.parseUA(userAgent).toString();
		
		
		//GET LANGUAGE USING EXPRESS-LANGUAGE
		var lang = req.language;
		
		
		//GET IP ADDRESS USING GET IP
		
		var IP = get_ip(req).clientIp;
      
		
		//CREATE OBJ
		var parsedHeader = {
			"IP address": IP,
			"language": lang,
			"operating system": browser
		}
		
		res.json(parsedHeader)
		
		});
		
} //end of app


			
	
		
