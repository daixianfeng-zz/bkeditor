/**
 * 超链接
 */
(function(E, $){
// 注册UI插件
E.addUi({
	id: 'linkdialog',
	
	html: '<table width="300">\
		  <tr>\
			<td>链接文字：</td>\
			<td><input type="text" name="text" style="width:200px"/></td>\
		  </tr>\
		  <tr>\
			<td>链接地址：</td>\
			<td><input type="text" name="link" value="http://" style="width:200px"/></td>\
		  </tr>\
		  <tr>\
			<td></td>\
			<td><select name="target">\
				<option value="_blank" selected="true">新窗口打开</option>\
				<option value="_top">当前窗口打开</option>\
			</select></td>\
		  </tr>\
		  </table>',
	
	// 不检查数据，没入输入文字时直接关闭
	check: function( ) {
		// var data = this.getValues();
		// if ( !data.text ) {
			// return false
		// }
	},
	
	submit: function() {
		var data = this.getValues();
		
		if ( data.text ) {
			var insertHtml = '<a href="'+data.link+'" target="'+data.target+'">'+data.text+'</a>';
			E.utils.pasteHTML(insertHtml);
		}
	}
});

// 注册命令插件
E.addPlugin({
	id: 'link'
	, title: '超链接'
	, ui: 'linkdialog'
	, type: 'dialog'
	, getData: function(editor) {
		var data = {
				text: E.utils.getSelectionText()
			};
			
		return data;
	}
});

})(jQuery.jQEditor, jQuery);