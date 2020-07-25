var $$path = require('path')
	,$$fs = require('fs');


/**
 * 递归遍历目录文件,获取所有文件路径.
 * @param{String}rootDir
 * @param{Function}filter:过滤函数,返回false就排除目录|文件
 * @param{Function}render:修改filter里的node
 * @return{Object}
 * */
module.exports = (function () {

	var _pub_static = function () {var _pri = {}, _pub = {};
		var _init = function (rootDir, filter, renderNode) {
			_pri["filter"] = filter || _pub_static.defaultFilter;
			_pri["renderNode"] = renderNode || _pub_static.defaultRenderNode;
			_pri["rootDir"] = rootDir;

			_pri.i = 0;
			
			return _pri.walk(rootDir);

		};
		
		_pri["walk"] = function (uri, tree) {
			if(_pri.i++ > 20000) {
				return ;
			}
			var node = _pub_static.getNode(uri, _pri.rootDir);
			if(node.type == 'dir') {
				$$fs.readdirSync(uri).forEach(function(part){
					var u = $$path.join(uri, part);
					var n = _pub_static.getNode(u, _pri.rootDir);
					if(_pri.filter(n) !== false) {
						n = _pri.walk(u);
						n.pNode = node.uri;
						node.children.push(_pri.renderNode(n));
					}
				});

			}
			
			return node;
		};

		
		return _init.apply(_pub, arguments);
	};



	_pub_static["getNode"] = function (uri, rootDir) {
		var stat = $$fs.lstatSync(uri);
		var node = {
			uri : uri,
			path : '/' + $$path.relative(rootDir, uri).replace(/\\/g, '/'),
			name : $$path.basename(uri),
			children	: [],
			type : null,
			pNode : null,
		}; 
		if(stat.isFile()) {
			node.type = 'file';
		}else if(stat.isDirectory()) {
			node.type = 'dir';
		}
		return node;
	};

	_pub_static["defaultRenderNode"] = function (node) {
		return node;
	};

	//用于排除basename以.或者_开头的目录|文件(如.svn,_html,_psd, _a.psd等)
	_pub_static["defaultFilter"] = function (node){
		return true;
	};
	

	return _pub_static;

}());

