/**
 * 帮助关于插件
 * 
 * @createTime 2013-05-14
 **/
(function(E, $){
	// 注册UI插件
	E.addUi({
		id: 'aboutdialog',
		
		html: '<p><strong style="color:blue;">version</strong> : '+'0.7.0'+'</p>'+
				'<p style="text-indent:2em;">编辑器正处于开发阶段，欢迎各种意见及建议</p>'+
				'<p><strong style="color:blue;">快捷键</strong></p>'+
				'<p style="text-indent:2em;">1,	ctrl+a : 全选</p>'+
				'<p style="text-indent:2em;">2,	ctrl+c : 复制</p>'+
				'<p style="text-indent:2em;">3,	ctrl+x : 剪切</p>'+
				'<p style="text-indent:2em;">4,	ctrl+v : 粘贴</p>'+
				'<p style="text-indent:2em;">5,	ctrl+z : 撤销</p>'+
				'<p style="text-indent:2em;">6,	ctrl+y : 重做</p>'+
				'<p style="text-indent:2em;">7,	ctrl+s : 保存</p>'+
				'<p style="text-indent:2em;">8,	ctrl+b : 加粗</p>'+
				'<p style="text-indent:2em;">9,	ctrl+i : 斜体</p>'+
				'<p style="text-indent:2em;">10,ctrl+u : 下划线</p>'
		
	});
	
	// 注册命令插件
	E.addPlugin({
		id: 'about',
		title: '关于',
		ui: 'aboutdialog',
		type: 'dialog'
	});
	
})(jQuery.jQEditor, jQuery);