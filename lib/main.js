var $$fs = require('fs');
var $$Tran = require('./Tran.js');
const $$walkDir = require('./walkDir');
const $$path = require('path');


var creator = (function () {
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
        format: _pri.getAllFormat(),
        mode: _pri.getAllMode(),
        writeFile: function (filePath, data) {
          $$fs.writeFileSync(filePath, data);
        }
      };
      return ctx;
    };


    _pri["formatTranList"] = [];
    _pri["modeTranList"] = [];

    _pri["getAllFormat"] = function () {
      $$walkDir($$path.join(__dirname, '../format'), null, function (node) {
        if (node.name.slice(-3) == '.js') {
          var oFormatTran = require(node.uri);
          _pri.checkFormatTranFunction(oFormatTran, require.resolve(node.uri));
          _pri.formatTranList.push(oFormatTran);
        }
      });
      return {
        get: function (sFormat) {
          return _pri.formatTranList.handler[sFormat];
        }
      };
    };

    _pri["getAllMode"] = function () {
      $$walkDir($$path.join(__dirname, '../mode'), null, function (node) {
        if (node.name.slice(-3) == '.js') {
          var oModeTran = require(node.uri);
          _pri.checkModeTranFunction(oModeTran, require.resolve(node.uri));
          _pri.modeTranList.push(oModeTran);
        }
      });
      return {
        get: function (sMode) {
          return _pri.modeTranList.handler[sMode];
        }
      };
    };
    _pri["checkFormatTranFunction"] = function (oFun, sMdPath) {
      if ([
        'check?',
        'from',
        'target',
        'to'
      ].some(k => k.slice(-1) == '?' ? false : !oFun[k])) {
        throw new Error('Format Tran Function Error ' + sMdPath);
      }
      _pri.formatTranList.handler = _pri.formatTranList.handler || {};
      var oF = _pri.formatTranList.handler[oFun.from] = _pri.formatTranList.handler[oFun.from] || {
        name: oFun.from,
        check: () => 0,
        toFormat: {}
      };
      oF.check = oFun.check;
      if (oFun.target) {
        oF.toFormat[oFun.target] = oFun;
      }
    };

    _pri["checkModeTranFunction"] = function (oFun, sMdPath) {
      if ([
        'from',
        'check?',
        'fromFormat',
        'toMode'
      ].some(k => k.slice(-1) == '?' ? false : !oFun[k])) {
        throw new Error('Mode Tran Function Error ' + sMdPath);
      }
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




// var creator = (function () {
//    var _fun = function (input, opt) {
//       if (typeof opt == 'string') {
//         opt = {format: opt};
//       }else if (!opt) {
//         opt = {format: 'string'}
//       }

//       return new Promise((ok, err) => {
//         ok(ObjTran(input, opt));
//       });
//    };

//    _fun["file"] = function (filePath) {
//     var str = _fun.getFileStr(filePath);
//     var opt = arguments[1];
//     if (typeof opt == 'string') {
//       opt = {format: opt};
//     }

//     if (!opt || !opt.format) {
//       opt = opt || {
//         format: filePath.split('.').pop()
//       };
//     }

//     return _fun(str, opt);
//   };

//    _fun["json"] = function (oJson, opt) {
//     return _fun(oJson, Object.assign(opt || {}, {format: 'json'}));
//   };

//   _fun["getFileStr"] = function (filePath) {
//     var sFile = $$fs.readFileSync(filePath);
//     return sFile;
//   };

//    return _fun;
// }());



module.exports = creator;


// module.exports = {
//   getFile: function (filePath, opt) {
//     if (typeof opt == 'string') {
//       opt = {format: opt};
//     }
//     var sFile = $$fs.readFileSync(filePath);
    
//   },
//   getJson: function (filePath) {
//     return new Promise((ok, err) => {
//       try {
//         ok(JSON.parse($$fs.readFileSync($$path.join(__dirname, filePath))));
//       } catch (error) {
//         err(error);
//       }
//     });
//   },
//   getCsv: function (filePath) {
//     return new Promise((ok, err) => {
//       try {
//         var sPath = $$path.join(__dirname, filePath);
//         $$csvJson.toJSON(sPath, api => ok(api.data));
//       } catch (error) {
//         err(error);
//       }
//     });
//   },
//   toJsonFile: function (filePath, obj) {
//     $$fs.writeFileSync(filePath, JSON.stringify(obj, 0, 2));
//   }
// }