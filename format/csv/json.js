var $$csvtojson = require('csvtojson');



module.exports = {
	from: 'csv',
	target: 'json',
	check: function () {
		return true;
	},
	to: function (input, opt) {
		input = input.trim();
		return $$csvtojson(opt)
		.fromString(input);
	},

};