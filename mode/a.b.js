

module.exports = {
	from: 'a',
	check: function (oJson, opt) {
		return 'err str';
	},
	fromFormat: {
		csv: function (csv, opt) {
			debugger;
		}
	},
	toMode: {
		b: function (oJsonA, opt) {
			return oJsonA.map(o => {
				var oR = {};
				oR[`[name]`] = `(${o.name})`;
				oR[`[age]`] = `=${o.age}`;
				return oR;
			});
		}
	}
};

