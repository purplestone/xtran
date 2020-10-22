var $$fs = require('fs');
var $$Tran = require('./Tran.js');
const $$walkDir = require('./walkDir');
const $$path = require('path');
var debug = require('debug')('xtran');

var Class = (function () {
  var _pub_static = function () {var _pub = function () {return _pub.run.apply(_pub, arguments)}, _pri = {}, _pro = {};
    var _init = function () {
      
      
    };

    _pri["buildContext"] = function () {
      var ctx = {
        format: _pub.getAllFormat(_pri.config.extFormatDir),
        mode: _pub.getAllMode(_pri.config.extModeDir),
        bindData: _pri.bindData,
        cwd: require.main ? require.main.path : process.env.PWD
      };
      return ctx;
    };
    
    _pub["run"] = function (input, opt) {
      if (typeof opt == 'string') {
        opt = {format: opt};
      }else if (!opt) {
        opt = {format: 'string'}
      }

      var ctx = _pri.buildContext();

      return new Promise((ok, err) => {
        ok($$Tran(input, opt, ctx));
      });
    };    

    
    _pri["formatTranList"] = [];
    _pri["modeTranList"] = [];
    
    _pub["getAllFormat"] = function (extDir) {
      var parseFile = function (node) {
        if (node.name.slice(-3) == '.js') {
          var oFormatTran = require(node.uri);
          var mdPath = require.resolve(node.uri);
          _pri.checkFormatTranFunction(oFormatTran, mdPath);
          _pri.config.showLoadLog && console.log(`    load mode script: ${oFormatTran.disable ? '[disable]' : ''} ${mdPath}`);
        }
      };
      var searchScriptDir = function (dir) {
        (_pri.config.showLoadLog ? console.log : debug)('search formatScriptDir : ', dir);
        $$walkDir(dir, null, parseFile);
      };
      var formatPath = $$path.join(__dirname, '../format');
      searchScriptDir(formatPath);
      if (extDir) {
        [].concat(extDir).forEach(dir => {
          if ($$fs.existsSync(extDir)) {
            searchScriptDir(extDir);
          }
        });
      }
      return {
        get: function (sFormat) {
          return sFormat ? _pri.formatTranList.handler[sFormat] : _pri.formatTranList.handler;
        }
      };
    };

    _pub["getAllMode"] = function (extDir) {
      var parseFile = function (node) {
        if (node.name.slice(-3) == '.js') {
          var oModeTran = require(node.uri);
          var mdPath = require.resolve(node.uri);
          _pri.checkModeTranFunction(oModeTran, mdPath);
          _pri.config.showLoadLog && console.log(`    load format script: ${oModeTran.disable ? '[disable]' : ''} ${mdPath}`);
        }
      };
      var searchScriptDir = function (dir) {
        (_pri.config.showLoadLog ? console.log : debug)('search modeScriptDir : ' + dir);
        $$walkDir(dir, null, parseFile);
      };
      var modePath = $$path.join(__dirname, '../mode');
      searchScriptDir(modePath);
      $$walkDir(modePath, null, parseFile);
      if (extDir) {
        [].concat(extDir).forEach(dir => {
          if ($$fs.existsSync(extDir)) {
            searchScriptDir(extDir);
          }
        });
      }
      return {
        get: function (sMode) {
          return sMode ? _pri.modeTranList.handler[sMode] : _pri.modeTranList.handler;
        }
      };
    };

    _pri["checkFormatTranFunction"] = function (oFun, sMdPath) {
      if (oFun.disable) {
        return false;
      }
      if ([
        'check?',
        'from',
        'target',
        'to'
      ].some(k => k.slice(-1) == '?' ? false : !oFun[k])) {
        throw new Error('Format Tran Function Error ' + sMdPath);
      }
      oFun.mdPath = sMdPath;
      _pri.formatTranList.handler = _pri.formatTranList.handler || {};
      var oF = _pri.formatTranList.handler[oFun.from] = _pri.formatTranList.handler[oFun.from] || {
        name: oFun.from,
        check: () => 0,
        toFormat: {},
      };
      oF.check = oFun.check;
      if (oFun.target) {
        oF.toFormat[oFun.target] = oFun;
      }

      _pri.formatTranList.push(oFun);
    };

    _pri["checkModeTranFunction"] = function (oFun, sMdPath) {
      if (oFun.disable) {
        return false;
      }
      if ([
        'from',
        'check?',
        'fromFormat',
        'toMode'
      ].some(k => k.slice(-1) == '?' ? false : !oFun[k])) {
        throw new Error('Mode Tran Function Error ' + sMdPath);
      }

      oFun.mdPath = sMdPath;
      _pri.modeTranList.handler = _pri.modeTranList.handler || {};
      var oF = _pri.modeTranList.handler[oFun.from] = _pri.modeTranList.handler[oFun.from] || {
        name: oFun.from,
        check: () => 0,
        fromFormat: {},
        toMode: {}
      };
      oF.check = oFun.check;
      Object.assign(oF.fromFormat, oFun.fromFormat);
      Object.assign(oF.toMode, oFun.toMode);

      _pri.modeTranList.push(oFun);
    };

    _pri["config"] = {};
    _pub["scriptDirDefault"] = './xtranScript';
    _pub["addScriptDir"] = function (dir) {
      var dirPath = dir || $$path.join(process.cwd(), _pub.scriptDirDefault);
      _pub.config({
        extFormatDir: dirPath + '/format', 
        extModeDir: dirPath + '/mode'
      });
      return _pub;
    };

    _pub["config"] = function (opt) {
      Object.assign(_pri.config, opt);
      return _pub;
    };

    _pub["file"] = function (filePath) {
      var str = _pub.getFileStr(filePath);
      var opt = arguments[1];
      if (typeof opt == 'string') {
        opt = {format: opt};
      }

      if (!opt || !opt.format) {
        opt = opt || {
          format: filePath.split('.').pop()
        };
      }

      return _pub.run(str, opt);
    };

    _pub["json"] = function (filePath, opt) {
      var sFile = JSON.parse($$fs.readFileSync($$path.resolve(require.main.path, filePath)).toString());
      return _pub.run(sFile, Object.assign(opt || {}, {format: 'json'}));
    };

    _pub["getFileStr"] = function (filePath) {
      var sFile = $$fs.readFileSync($$path.resolve(require.main.path, filePath));
      return sFile;
    };
    _pri["bindData"] = {}

    _pub["bind"] = function (opt) {
      Object.assign(_pri.bindData , opt);
      return _pub;
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

var creator = (function () {
  var oC = Class();
  var _fun = function () {
    return oC.run.apply(oC, arguments);
  };

  Object.assign(_fun, oC);

  return _fun;
}());



module.exports = creator;

