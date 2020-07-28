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
xtran -ff csv -fm a -tf json -tm b fileA fileB
xtran file.a.csv file.b.json



```

	Usage: xtran [options] <fileFrom> <fileTo>

	default mode and farmat info from file name.
	<fileName> = <filePath.mode.format>
	eg.
		xtran list.user.json list.vip.csv

	Options:
	-V, --version                     output the version number
	--ff, --from-farmat <fileFarmat>  what format transform file from
	--fm, --from-mode <fileMode>      what mode transform file from
	--tf, --to-farmat <fileFarmat>    what format of file transform to
	--tm, --to-mode <fileMode>        what mode of file transform to
	-f, --farmat <format>             list format can <format> transform to
	-m, --mode <mode>                 list mode can <mode> transform to
	-l, --list                        show all transform function
	-h, --help                        display help for command

	Commands:
	*
	init [scriptDir]                  xtran function script create into [scriptDir]
	list                              show all transform function
	help [command]                    display help for command
	