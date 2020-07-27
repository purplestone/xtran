


var Tran = (function () {
	var _pub_static = function () {var _pub = {}, _pri = {}, _pro = {};
		var _init = function (input, opt, ctx) {
			_pub.data = input;
			_pub.format = opt.format;
			_pub.mode = opt.mode;
			_pub.opt = opt;
			_pri.ctx = ctx;

			_pri.oFormatTran = _pri.ctx.format.get(_pub.format);
			_pri.oFormatTran.check && _pri.oFormatTran.check(input);


		};

		_pub["toFormat"] = function (sFormat, opt) {
			var oTranFun = _pri.oFormatTran.toFormat[sFormat];
			return Promise.resolve(oTranFun.to(_pub.data, opt))
				.then(oTarget => Promise.resolve(Tran(oTarget, Object.assign(opt || {}, { format: sFormat}), _pri.ctx)))
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
						oTranFun = () =>_pub.data;
					}else{
						throw new Error('toMode data must be json format.');
					}
					_pub.mode = sMode;
				}else{
					oTranFun = _pri.oModeTran.toMode[sMode];
				}
			}
			return Tran(oTranFun(_pub.data, opt), Object.assign(opt || {}, { format: 'json', mode: _pub.mode}), _pri.ctx);
		};

		_pub["canToMode"] = function (sMode) {

		};

		_pub["to"] = function (opt) {
			var oR;
			if (opt.mode) {
				oR = _pub.toMode(opt.mode);
			}
			if (opt.format) {
				return oR.toFormat(opt.format);
			}
			return oR;
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