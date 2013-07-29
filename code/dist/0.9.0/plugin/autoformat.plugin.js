/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
	// 仅匹配开通的空格，不是匹配所有空格
	var space = /^(\s|&nbsp;|　)+/i;

	// 注册插件
	E.addPlugin({
		id: 'autoformat',
		
		click: function() {
			autoFormat(E.curEditor.dom);
		}
	});
	
	// 替换空格
	function replaceSpace(o) {
		if( o.children().eq(0).size() ){
			o = o.children().eq(0);
			o.html( o.html().replace(space, '') );
			replaceSpace(o);
		}
	}

	function autoFormat( dom ){
		var node, childs = $("body", dom)[0].childNodes;
		
		for (var i = 0, len = childs.length; i < len; i++){
			node = childs[i];
			if (1 === node.nodeType){
				var o = $(node);
				if( /^(p|h2|h3)$/i.test(node.nodeName) ){
					// && space.test(o.text()) ie下匹配失败 ？
					o.html( o.html().replace(space, 'a') );
					replaceSpace(o);
				}
			}
		}
	}
})(jQuery.jQEditor, jQuery);