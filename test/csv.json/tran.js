var $$xtran = require('../../lib/main.js');
var assert = require('assert');
var os = require('os');


assert.ok($$xtran);
assert.ok(typeof $$xtran.file == 'function');
assert.ok(typeof $$xtran.json == 'function');


var oInputJson = [{
	a: 1,
	b: 2
}];

exports.run = function () {

	$$xtran.json(oInputJson).then(data => {

		assert.equal(data.data, oInputJson);
		assert.equal(data.format, 'json');
		assert.equal(data.canToFormat('xxx'), false);
		assert.deepEqual(data.canToFormat(), [
			'csv'
		]);
		data.toFormat('csv').then(oCsvData => {
			assert.deepEqual(oCsvData.data, '"a","b"'+os.EOL+'1,2');
			assert.equal(oCsvData.format, 'csv');
			return oCsvData.toFormat('json');
		}).then(oJson => {
			assert.equal(oJson.format, 'json');
			assert.deepEqual(oJson.data, oInputJson);
		});
	
	});
	
	
};