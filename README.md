```javascript
var $$xtran = require('xtran');

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
		var oB = oJson.toMode('a').toMode('b').toFormat('csv').then(oCsvB => {
			console.log(oCsvB.data);
		})
	});

	oCsv.toFormat('json').then(oJson => {
		oJson.toMode('a').to({
			mode: 'b',
			format: 'csv'
		}).then(oCsv => {
			console.log(oCsv.data);
		})
		
	});

});

$$xtran(csvStrA, 'csv').then(data => {

	console.log(data.data); // ${csvStrA}
	console.log(data.format); // csv
	console.log(data.canToFormat('xxx')); // false

	console.log(data.canToFormat()); // ['json']
	var oJsonData = data.toFormat('json');
	console.log(oJsonData.data);
	console.log(oJsonData.format); // json

	var oModeA = oJsonData.toMode('a');
	console.log(oModeA.check().canToMode()); // ['b']
	console.log(oModeA.toMode('b').toFormat('csv').data);
	
	try {
		data.toMode('b').check().data
	} catch (error) {
		console.log(error);
	}

});
```


```bash
xtran --init
xtran fileA fileB
```