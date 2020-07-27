module.exports = {
	disable: true,
	from: 'modeNameA',
	check: function (oJson, opt) {
		return true;
	},
	fromFormat: {
		formatNameC: function (input, opt) {
			debugger;
		}
	},
	toMode: {
		modeNameB: function (input, opt) {
			debugger;
			return input.map(o => {
				var oR = {};
				// todo
				return oR;
			});
		}
	}
};

