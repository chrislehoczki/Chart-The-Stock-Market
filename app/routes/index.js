'use strict';

var path = process.cwd();

//NODE MODULES

module.exports = function (app) {
	


	app.route('/')
		.get(function (req,res) {

	
		
		res.sendFile(path + "/public/index.html")
		
		});
		
} //end of app


			
	
		
