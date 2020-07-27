var $$fs = require('fs');
var $$Tran = require('./Tran.js');
const $$walkDir = require('./walkDir');
const $$path = require('path');


var creator = (function () {
  var _pri_static = {};
  var _pub_static = function () {var _pub = {}, _pri = {}, _pro = {};
    var _init = function (input, opt) {
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

    _pri["buildContext"] = function () {
      var ctx = {
        format: _pub_static.getAllFormat(),
        mode: _pub_static.getAllMode(),
      };
      return ctx;
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
        return _init.apply(_pub, arguments);
    }
    return _pub;
  };

  _pri_static["formatTranList"] = [];
  _pri_static["modeTranList"] = [];
  
  _pub_static["getAllFormat"] = function (extDir) {
    var parseFile = function (node) {
      if (node.name.slice(-3) == '.js') {
        var oFormatTran = require(node.uri);
        _pri_static.checkFormatTranFunction(oFormatTran, require.resolve(node.uri));
      }
    };
    $$walkDir($$path.join(__dirname, '../format'), null, parseFile);
    if (extDir) {
      $$walkDir(extDir, null, parseFile);
    }
    return {
      get: function (sFormat) {
        return sFormat ? _pri_static.formatTranList.handler[sFormat] : _pri_static.formatTranList.handler;
      }
    };
  };

  _pub_static["getAllMode"] = function (extDir) {
    var parseFile = function (node) {
      if (node.name.slice(-3) == '.js') {
        var oModeTran = require(node.uri);
        _pri_static.checkModeTranFunction(oModeTran, require.resolve(node.uri));
      }
    };
    $$walkDir($$path.join(__dirname, '../mode'), null, parseFile);
    if (extDir) {
      $$walkDir(extDir, null, parseFile);
    }
    return {
      get: function (sMode) {
        return sMode ? _pri_static.modeTranList.handler[sMode] : _pri_static.modeTranList.handler;
      }
    };
  };

  _pri_static["checkFormatTranFunction"] = function (oFun, sMdPath) {
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
    _pri_static.formatTranList.handler = _pri_static.formatTranList.handler || {};
    var oF = _pri_static.formatTranList.handler[oFun.from] = _pri_static.formatTranList.handler[oFun.from] || {
      name: oFun.from,
      check: () => 0,
      toFormat: {}
    };
    oF.check = oFun.check;
    if (oFun.target) {
      oF.toFormat[oFun.target] = oFun;
    }

    _pri_static.formatTranList.push(oFun);
  };

  _pri_static["checkModeTranFunction"] = function (oFun, sMdPath) {
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

    _pri_static.modeTranList.handler = _pri_static.modeTranList.handler || {};
    var oF = _pri_static.modeTranList.handler[oFun.from] = _pri_static.modeTranList.handler[oFun.from] || {
      name: oFun.from,
      check: () => 0,
      fromFormat: {},
      toMode: {}
    };
    oF.check = oFun.check;
    Object.assign(oF.fromFormat, oFun.fromFormat);
    Object.assign(oF.toMode, oFun.toMode);

    _pri_static.modeTranList.push(oFun);
  };

  _pub_static["file"] = function (filePath) {
    var str = _pub_static.getFileStr(filePath);
    var opt = arguments[1];
    if (typeof opt == 'string') {
      opt = {format: opt};
    }

    if (!opt || !opt.format) {
      opt = opt || {
        format: filePath.split('.').pop()
      };
    }

    return _pub_static(str, opt);
  };

   _pub_static["json"] = function (oJson, opt) {
    return _pub_static(oJson, Object.assign(opt || {}, {format: 'json'}));
  };

  _pub_static["getFileStr"] = function (filePath) {
    var sFile = $$fs.readFileSync(filePath);
    return sFile;
  };

  return _pub_static;
}());




module.exports = creator;

