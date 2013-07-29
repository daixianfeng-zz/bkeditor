/**
* 全选
**/
(function(E, $){
	E.addPlugin({
		id: 'selectall',
		title: '清空文档',
		isEnable: true,
		click: function() {
			E.curEditor.selectAll();
		}
	});
})(jQuery.jQEditor, jQuery);