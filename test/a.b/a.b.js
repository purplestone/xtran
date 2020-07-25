var $$xtran = require('../../lib/main.js');
var assert = require('assert');

var csvStrA = `
name,age
xxx,36
yyy,41
zzz,31
`;
var csvStrB = `
"[name]","[age]"
"(xxx)","=36"
"(yyy)","=41"
"(zzz)","=31"
`;
// You can coding ./mode/a.b.js file to create your xtran function.
$$xtran(csvStrA, 'csv').then(oCsv => {
	oCsv.toFormat('json').then(oJson => {
		var oA = oJson.toMode('a');
		assert.deepEqual(oA.data, [
			{name: 'xxx', age: 36},
			{name: 'yyy', age: 41},
			{name: 'zzz', age: 31},
		]);
		var oB = oA.toMode('b');
		assert.deepEqual(oB.data, [
			{'[name]': '(xxx)', '[age]': '=36'},
			{'[name]': '(yyy)', '[age]': '=41'},
			{'[name]': '(zzz)', '[age]': '=31'},
		]);
		oB.toFormat('csv').then(oCsvB => {
			assert.deepEqual(oCsvB.data, csvStrB.trim().replace(/\n/g, '\r\n'));
		})
	});

	oCsv.toFormat('json').then(oJson => {
		oJson.toMode('a').to({
			mode: 'b',
			format: 'csv'
		}).then(oCsv => {
			assert.deepEqual(oCsv.data, csvStrB.trim().replace(/\n/g, '\r\n'));
		})
		
	});

});