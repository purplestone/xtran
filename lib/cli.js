#!/usr/bin/env node
var commander = require('commander')
  , pkg = require('../package.json')
  , xtran = require('./main')
  , debug = require('debug')('xtran')
  , path = require('path')
  , copydir = require('copy-dir')
;

commander.program
  .version(pkg.version)
  .usage('[options] <fileFrom> <fileTo> \n\n  default mode and farmat info from file name. \n  <fileName> = <filePath.mode.format>\n  eg.\n    xtran list.user.json list.vip.csv')
  .option('--ff, --from-farmat <fileFarmat>', 'what format transform file from')
  .option('--fm, --from-mode <fileMode>', 'what mode transform file from')
  .option('--tf, --to-farmat <fileFarmat>', 'what format of file transform to')
  .option('--tm, --to-mode <fileMode>', 'what mode of file transform to')
  .option('-f, --farmat <format>', 'list format can <format> transform to')
  .option('-m, --mode <mode>', 'list mode can <mode> transform to')
  .option('-l, --list', 'show all transform function');
;
commander.program.command('*').action(function(cmd){runCli(null, commander.program);});

var scriptDir = './xtranScript';
commander.program.command('init [scriptDir]')
  .usage('[scriptDir]')
  .description('xtran function script create into [scriptDir]')
  .action((cmd, oProgram) => {
    runCli('init', oProgram || cmd);
  })
;

commander.program.command('list')
  .usage(' ')
  .description('show all transform function')
  .action((cmd, oProgram) => {
    runCli('list', oProgram || cmd);
  })
;

function routeCmd(oCli, go) {
  if (oCli.cmd) {
    switch (oCli.cmd) {
      case 'init':path.resolve(oCli.cwd, scriptDir);
        oCli.opts.initDir = oCli.opts.initDir || scriptDir;
        if (oCli.opts.initDir) {
          oCli.opts.initDir = path.resolve(oCli.cwd, oCli.opts.initDir);
        }
        go(oCli => initTranDir(oCli));
        break;
      case 'list':
        go(oCli => shwoTranList(oCli));
        break;
      default:
        break;
    }
  }
}

function shwoTranList(oCli) {
  var sExtDir = path.resolve(oCli.cwd, './xtranScript');
  var formatPath = path.join(sExtDir, 'format');
  var modePath = path.join(sExtDir, 'mode');
  console.log('formatScriptDir : ', formatPath);
  console.log('modeScriptDir : ', modePath);
  var oTran = {
    format: xtran.getAllFormat(formatPath).get(),
    mode: xtran.getAllMode(modePath).get(),
  };


  show(oTran.format, 'toFormat');
  show(oTran.mode, 'toMode');

  function show(oTree, k) {
    console.log(`[[ ${k.slice(2)} ]]`);
    Object.keys(oTree).forEach(from => {
      console.log('    ', from + ' :');

      Object.keys(oTree[from][k]).forEach(to => {
        console.log('       --> ', oTree[from][k][to].target || to);
        
      });
    });
  }
}

function initTranDir(oCli) {
  if (oCli.opts.initDir) {
    var demoDir = path.join(oCli.cwd, 'lib/funDemo');
    copydir(demoDir, oCli.opts.initDir, {cover: true});
    console.log('Build xtran function dir into: ', oCli.opts.initDir);
  }
}



commander.program.parse(process.argv, 'node');


function runCli(cmd, oProgram) {
  if (runCli.ed) return runCli.ed = true;
  var oCli = {
    scriptDir: __dirname,
    cwd: process.cwd(),
    opts: oProgram.opts(process.argv),
    args: oProgram.args,
    cmd,
    oProgram,
  };

  routeCmd(oCli, go);

  function go(run) {

    var oInfo = {...oCli};
    delete oInfo.oProgram;
    debug(JSON.stringify(oInfo, 0, 2));

    run(oCli);
  }
  
}







