/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
// 注册UI插件
E.addUi({
	id: 'videodialog',
	
	html: '<table width="300">\
			<tr>\
			<td>视频地址：</td>\
			<td><input type="text" name="url" style="width:200px"/></td>\
			</tr><tr>\
			<td>宽：</td>\
			<td><input type="text" name="width" value="800" style="width:60px"/> px</td>\
			</tr><tr>\
			<td>高：</td>\
			<td><input type="text" name="height" value="600" style="width:60px"/> px</td>\
			</tr></table>',
	
	// 不检查数据，没入输入文字时直接关闭
	check: function( ) {
		// var data = this.getValues();
		// if ( !data.text ) {
			// return false
		// }
	},
	
	submit: function() {
		var data = this.getValues();
		
		if ( data.url ) {
			var insertHtml = '<embed src="'+data.url+'" quality="high" width="'+data.width+'" height="'+data.height+'" align="middle" allowScriptAccess="sameDomain" allowFullscreen="true" type="application/x-shockwave-flash"></embed>';
			
			E.utils.pasteHTML(insertHtml);
		}
	}
});

// 注册命令插件
E.addPlugin({
	id: 'video'
	, title: '视频'
	, ui: 'videodialog'
	, type: 'dialog'
	, getData: function(editor) {
		var data = {};
		
		return data;
	}
});

})(jQuery.jQEditor, jQuery);