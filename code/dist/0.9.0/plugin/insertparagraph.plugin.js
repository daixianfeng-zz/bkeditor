/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
	E.addPlugin({
		id: 'insertparagraph',
		title: '插入段落',
		isEnable: true,
		click: function( action ) {
			var editor = E.curEditor;
			var el = editor.getCursorElement();
			var $o = $(el).closest('p,pre,table,ul,ol,div');
			var p = editor.dom.createElement('p');
			p.innerHTML = '&#8203;';
			$o[action](p);
			E.utils.setCursor(editor.win, p, true);
		}
	});
})(jQuery.jQEditor, jQuery);