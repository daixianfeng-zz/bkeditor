/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
// 注册UI插件
E.addUi({
	id: 'pasteworddialog',
	
	html: '<p>请将Word当中的内容粘贴到下面的方框里，然后点击确定按钮。</p>\
		<textarea id="content" name="content" rows="20" cols="75"></textarea>',
	
	submit: function() {
		var data = this.getValues();
		
		if ( data.url ) {
			var html = '';
			
			E.utils.pasteHTML(html);
		}
	}
});

// 注册命令插件
E.addPlugin({
	id: 'pasteword'
	, title: '从 MS Word 粘帖'
	, ui: 'pasteworddialog'
	, type: 'dialog'
	, getData: function(editor) {
		var data = {};
		
		return data;
	}
});

})(jQuery.jQEditor, jQuery);