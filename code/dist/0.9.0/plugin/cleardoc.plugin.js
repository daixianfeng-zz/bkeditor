/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
	E.addPlugin({
		id: 'cleardoc',
		title: '清空文档',
		isEnable: true,
		click: function() {
			if ( confirm('确定要删除当前所有内容吗？') ) {
				var body = E.get('body'),
					editor = E.get('editor');
				
				var p = editor.dom.createElement('p');
				p.innerHTML = '&#8203;';
				$(body).empty().append(p);
				E.utils.setCursor(editor.win, p, true);
			}
		}
	});
})(jQuery.jQEditor, jQuery);