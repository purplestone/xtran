var $$xtranCli = require('../../lib/cli.js');
var assert = require('assert');
var os = require('os');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var abCase = require('../a.b/a.b.js');

var devConfig = Function('return ' + fs.readFileSync(path.join(__dirname, '../../.vscode/launch.json')))();


exports.run = function () {
		
	devConfig = (_ => {var conf = {};devConfig.configurations.map(o => conf[o.name] = o);return conf;})();

	var oCli = $$xtranCli.call('test');

	assert.deepEqual(oCli._pri.getOptFromFileName('path/asd'), {
		fileName: 'asd',
		format: null,
		mode: null
	});
	assert.deepEqual(oCli._pri.getOptFromFileName('path/asd.json'), {
		fileName: 'asd',
		format: 'json',
		mode: null
	});
	assert.deepEqual(oCli._pri.getOptFromFileName('path/asd.bb.json'), {
		fileName: 'asd',
		format: 'json',
		mode: 'bb'
	});



	child_process.spawnSync('xtran', devConfig['xtran cli a b.csv'].args, {
		cwd: __dirname
	});
	assert.equal(fs.readFileSync(path.join(__dirname, 'b.csv')).toString(), abCase.csvStrA);


	child_process.spawnSync('xtran', devConfig['xtran cli list.a.csv list.b.csv'].args, {
		cwd: __dirname
	});
	assert.equal(fs.readFileSync(path.join(__dirname, 'list.b.csv')).toString(), abCase.csvStrB);
	
	
};
