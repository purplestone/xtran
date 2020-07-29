#!/usr/bin/env node
var commander = require('commander')
  , pkg = require('../package.json')
  , xtran = require('./main')
  , debug = require('debug')('xtran')
  , path = require('path')
  , copydir = require('copy-dir')
;

var Cli = (function () {
  var _pub_static = function () {var _pub = {}, _pri = {}, _pro = {};
    var _init = function () {
            
      commander.program
        .name('xtran')
        .version(pkg.version)
        .usage('[options] <fileFrom> <fileTo> \n\n  default mode and farmat info from file name. \n  <fileName> = <filePath.mode.format>\n  eg.\n    xtran list.user.json list.vip.csv')
        .option('--ff, --from-farmat <fileFarmat>', 'from format of file to transform')
        .option('--fm, --from-mode <fileMode>', 'from mode of file to transform')
        .option('--tf, --to-farmat <fileFarmat>', 'to format of file transform')
        .option('--tm, --to-mode <fileMode>', 'to mode of file transform')
        .option('--of, --opts-from <opts>', 'opts from transform to')
        .option('--ot, --opts-to <opts>', 'opts to transform')
        .action(function(cmd){_pri.runCli(null, commander.program);})
      ;

      _pri["scriptDir"] = './xtranScript';

      commander.program.command('init [scriptDir]')
        .usage('[scriptDir]')
        .description('xtran function script create into [scriptDir]')
        .action((cmd, oProgram) => {
          _pri.runCli('init', oProgram || cmd);
        })
      ;


      commander.program.command('list')
        .usage(' ')
        .description('show all transform function')
        .option('-l, --load-info', 'log load info')
        .option('-f, --farmat <format>', 'list format can <format> transform to')
        .option('-m, --mode <mode>', 'list mode can <mode> transform to')
        .action((cmd, oProgram) => {
          _pri.runCli('list', oProgram || cmd);
        })
      ;

      commander.program.parse.apply(commander.program, arguments);

    };

    _pub["routeCmd"] = function (oCli, go) {
      switch (oCli.cmd) {
        case 'init':
          oCli.opts.initDir = oCli.opts.initDir || _pri.scriptDir;
          if (oCli.opts.initDir) {
            oCli.opts.initDir = path.resolve(oCli.cwd, oCli.opts.initDir);
          }
          go(oCli => _pri.initTranDir(oCli));
          break;
        case 'list':
          go(oCli => _pri.shwoTranList(oCli));
          break;
        default:
          if (oCli.args.length != 2) {
            commander.program.help();
          }
          go(oCli => _pri.tran(oCli));
          break;
      }
    };

    _pri["tran"] = function (oCli) {
      xtran.config(_pri.getExtScript(oCli));
      var fileFrom = path.resolve(oCli.cwd, oCli.args[0]);
      var fileTo = path.resolve(oCli.cwd, oCli.args[1]);
      var oFileFromOpt = _pri.buildOpts(_pri.getOptFromFileName(fileFrom), {
        format: oCli.opts.fromFarmat,
        mode: oCli.opts.fromMode,
        opts: Function('return ' + oCli.opts.optsFrom)()
      });
      var oFileToOpt = _pri.buildOpts(_pri.getOptFromFileName(fileTo), {
        format: oCli.opts.toFarmat,
        mode: oCli.opts.toMode,
        opts: Function('return ' + oCli.opts.optsTo)()
      });
      console.log(`format: ${oFileFromOpt.format} ${oFileFromOpt.mode && 'mode: ' + oFileFromOpt.mode} ,  file: ${fileFrom}\n>>> transform to >>> \nformat: ${oFileToOpt.format} ${oFileToOpt.mode && 'mode: ' + oFileToOpt.mode} ,  file: ${fileTo}`);
      var oFromOpts = Function('return ' + oCli.opts.optsFrom)();
      xtran.file(fileFrom).then(oFileStr => {
        oFileStr.to(oFileFromOpt).then(oFile => {
          oFile.to(oFileToOpt).then(oFile => {
            return oFile.saveFile(fileTo);
          });
        })
      });
    };

    _pri["buildOpts"] = function (oFileInfo, opts) {
      Object.keys(opts).forEach(k => {
        if (opts[k]) oFileInfo[k] = opts[k];
      });
      return oFileInfo;
    };

    _pri["getOptFromFileName"] = function (filePath) {
      var opts = {
        fileName: null,
        format: null,
        mode: null
      };
      var aName = path.basename(filePath).split('.');
      opts.fileName = aName.shift();
      if (aName.length) {
        opts.format = aName.pop();
      }
      if (aName.length) {
        opts.mode = aName.pop();
      }
      
      return opts;
    };

    _pri["getExtScript"] = function (oCli) {
      var sExtDir = path.resolve(oCli.cwd, _pri.scriptDir);
      var extFormatDir = path.join(sExtDir, 'format');
      var extModeDir = path.join(sExtDir, 'mode');
      return {
        extFormatDir,
        extModeDir
      };
    };

    _pri["shwoTranList"] = function (oCli) {
      var {formatPath, modePath} = _pri.getExtScript(oCli);
      xtran.config({
        showLoadLog: oCli.opts.loadInfo
      });
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
    };

    _pri["initTranDir"] = function (oCli) {
      if (oCli.opts.initDir) {
        var demoDir = path.join(__dirname, './funDemo');
        copydir(demoDir, oCli.opts.initDir, {cover: true});
        console.log('Build xtran function dir into: ', oCli.opts.initDir);
        console.log('You should rename *.js.demo file to *.js and edit, for enable the script.');
      }
    };

    _pri["runCli"] = function (cmd, oProgram) {
      if (!oProgram.opts) {
        throw new Error('error argment: ' + oProgram);
      }
      if (_pri.runCli.ed) return _pri.runCli.ed = true;
      var oCli = {
        scriptDir: __dirname,
        cwd: process.cwd(),
        opts: oProgram.opts(process.argv),
        args: oProgram.args,
        cmd,
        oProgram,
      };
      
      _pub.routeCmd(oCli, go);
      
      function go(run) {
      
        var oInfo = {...oCli};
        delete oInfo.oProgram;
        debug(JSON.stringify(oInfo, 0, 2));
      
        run(oCli);
      }
    
    };

    switch(this+'') {
      case 'test':
        _pub._pri = _pri;
      case 'extend':
        _pub._pro = _pro;
        _pub._init = _init;
        break;
      default:
        delete _pub._init;
        delete _pub._pro;
        _init.apply(_pub, arguments);
    }
    return _pub;
  };

  

  return _pub_static;
}());



if(!module.parent) Cli(process.argv, 'node');

module.exports = Cli;


