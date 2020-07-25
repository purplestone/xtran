var $$json2csv = require('json2csv');

module.exports = {
	from: 'json',
	target: 'csv',
	to: function (input, opt) {
 
		const fields = Object.keys(input[0]);
		const opts = { fields };
		
		const parser = new $$json2csv.Parser(opts);
		const csv = parser.parse(input);
		return csv;
	},
}