var $$fs = require('fs');
var $$path = require('path');


var Tran = (function () {
	var _pub_static = function () {var _pub = {}, _pri = {}, _pro = {};
		var _init = function (input, opt, ctx) {
			_pub.data = input;
			_pub.format = opt.format;
			_pub.mode = opt.mode;
			_pri.opt = opt;
			_pri.ctx = ctx;
			_pub.bindData = _pri.ctx.bindData;

			_pri.oFormatTran = _pri.ctx.format.get(_pub.format);
			_pri.oFormatTran.check && _pri.oFormatTran.check(input);

			if (opt.format == 'json') {
				if (opt.indent) {
					
				}
			}


		};

		_pub["toFormat"] = function (sFormat, opt) {
			if (_pub.format == sFormat) {
				return Promise.resolve(_pub);
			}
			var oTranFun = _pri.oFormatTran.toFormat[sFormat];
			return Promise.resolve(oTranFun.to.call(_pub, _pub.data, _pri.opt))
				.then(oTarget => Tran(oTarget, Object.assign(opt || {}, { format: sFormat, mode: _pub.mode}), _pri.ctx))
			;
		};

		_pub["toMode"] = function (sMode, opt) {
			_pri.oModeTran = _pri.ctx.mode.get(_pub.mode);
			var oTranFun;
			if (_pub.mode && _pub.mode == sMode) {
				return _pub;
			}else{
				if (!_pub.mode) {
					if (_pub.format == 'json') {
						if (_pub.mode != sMode) {
							try {
								_pub.data = _pri.oModeTran[sMode].fromFormat[_pub.format].call(_pub, _pub.data, opt);
							} catch (error) {}
							
							// throw new Error('to mode ' + opt.mode + ' must ')
						}
						oTranFun = () => _pub.data;
					}else{
						throw new Error('toMode data must be json format.');
					}
					_pub.mode = sMode;
				}else{
					oTranFun = _pri.oModeTran.toMode[sMode];
				}
			}
			return Tran(oTranFun.call(_pub, _pub.data, opt), Object.assign(opt || {}, { format: 'json', mode: _pub.mode}), _pri.ctx);
		};

		_pub["canToMode"] = function (sMode) {

		};

		_pub["to"] = function (opt) {
			var oR;
			var oThen = Promise.resolve(_pub);
			if (opt.mode != _pub.mode && _pub.format != 'json') {
				oThen = oThen.then(o => o.toFormat('json', _pri.opt));
				// throw new Error('to mode ' + opt.mode + ' must ')
			}
			if (opt.opts) {
				_pri.opt = opt.opts;
			}
			if (opt.mode) {
				oThen = oThen.then(o => o.toMode(opt.mode));
			}
			if (opt.format) {
				oThen = oThen.then(o => o.toFormat(opt.format, opt.opts));
			}
			return oThen;
		};

		_pub["saveFile"] = function (filePath, opt) {
			opt = opt || {};
			var oFile = _pub.data;
			if ({}.toString.call(oFile) == '[object Object]' || {}.toString.call(oFile) == '[object Array]') {
				oFile = JSON.stringify(oFile, 0, +opt.indent);
			}
			$$fs.writeFileSync($$path.resolve(_pri.ctx.cwd, filePath), oFile);
		};

		_pub["canToFormat"] = function (sFormat) {
			if (sFormat) {
				return !!_pri.oFormatTran.toFormat[sFormat];
			} else {
				return Object.keys(_pri.oFormatTran.toFormat);
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


  
module.exports = Tran;