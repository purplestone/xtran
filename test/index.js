var $$xtran = require('../lib/main.js');
var $$Tran = require('../lib/Tran.js');

var oTran = $$Tran.call('test');



require('./csv.json/tran.js');
require('./a.b/a.b.js');


// var o = {
// 	data: {
// 		title: null,
// 		body: null,
// 	},
// 	getTitle: function (title) {
// 		return this.handler(new Promise((ok, err) => {
// 			setTimeout(() => {
// 				console.log('getTitle >>');
// 				this.title = title;
// 				ok();
// 			}, 1000);
// 		}))
// 	},
// 	getBody: function (body) {
// 		return this.handler(new Promise((ok, err) => {
// 			setTimeout(() => {
// 				console.log('getBody >>');
// 				this.body = body;
// 				ok();
// 			}, 1000);
// 		}))
// 	},
// 	goLog: function () {
// 		console.log(this.data);
// 	},
// 	handler: function (promise) {
// 		promise.then()
// 		return this;
// 	}
// };


// o.getTitle('ttt').getBody(o => 'bbb' + o.title).toLog();





