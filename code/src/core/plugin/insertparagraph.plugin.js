/**
* 段前/后插入段落
**/
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