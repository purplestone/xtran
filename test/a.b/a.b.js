var $$xtran = require('../../lib/main.js');
var assert = require('assert');
var os = require('os');

var csvStrA = `
"name","age"
"xxx","36"
"yyy","41"
"zzz","31"
`;
var jsonA = [
	{name: 'xxx', age: 36},
	{name: 'yyy', age: 41},
	{name: 'zzz', age: 31},
];
var csvStrB = `
"[name]","[age]"
"(xxx)","=36"
"(yyy)","=41"
"(zzz)","=31"
`;
var jsonB = [
	{'[name]': '(xxx)', '[age]': '=36'},
	{'[name]': '(yyy)', '[age]': '=41'},
	{'[name]': '(zzz)', '[age]': '=31'},
];

exports.run = function () {
	// You can coding ./mode/a.b.js file to create your xtran function.
	$$xtran(csvStrA, 'csv').then(oCsv => {
		oCsv.toFormat('json').then(oJson => {
			var oA = oJson.toMode('a');
			assert.deepEqual(oA.data, jsonA);
			var oB = oA.toMode('b');
			assert.deepEqual(oB.data, jsonB);
			oB.toFormat('csv').then(oCsvB => {
				assert.deepEqual(oCsvB.data, csvStrB.trim().replace(/\n/g, os.EOL));
			})
		});

		oCsv.toFormat('json').then(oJson => {
			oJson.toMode('a').to({
				mode: 'b',
				format: 'csv'
			}).then(oCsv => {
				assert.deepEqual(oCsv.data, csvStrB.trim().replace(/\n/g, os.EOL));
			})
			
		});

	});
};

exports.csvStrA = csvStrA.trim();
exports.jsonA = jsonA;
exports.csvStrB = csvStrB.trim();
exports.jsonB = jsonB;

