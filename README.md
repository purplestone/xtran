

## API
* xtran( input, opt );
* xtran.file(filePath).then( TranObj => {} )
* xtran.json(jsonFilePath).then( TranObj => {} )
* xtran.config({ extFormatDir, extModeDir })
* xtran.addScriptDir()

TranObj
* oTran.data
* oTran.toFormat( sFormat ).then( TranObj => {} )
* oTran.toMode( sMode ).then( TranObj => {} )
* oTran.to({ format, mode }).then( TranObj => {} )
* oTran.saveFile(filePath)

oTran.toFormat('csv', {noheader:true})

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
xtran file.a.csv file.b.json

xtran --ff csv --fm a --tf json --tm b fileA fileB
```


	Usage: xtran [options] <fileFrom> <fileTo> 

	default mode and farmat info from file name. 
	<fileName> = <filePath.mode.format>
	eg.
		xtran list.user.json list.vip.csv

	Options:
		-V, --version                     output the version number
		--ff, --from-farmat <fileFarmat>  from format of file to transform
		--fm, --from-mode <fileMode>      from mode of file to transform
		--tf, --to-farmat <fileFarmat>    to format of file transform
		--tm, --to-mode <fileMode>        to mode of file transform
		-h, --help                        display help for command

	Commands:
		init [scriptDir]                  xtran function script create into [scriptDir]
		list [options]                    show all transform function
	

