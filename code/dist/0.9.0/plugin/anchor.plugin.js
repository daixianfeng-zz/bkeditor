/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
// 注册UI插件
E.addUi({
	id: 'anchordialog',
	
	html: '<div style="width:350px;padding:10px;">锚点名称：<input name="name" style="width:200px;height:20px;"/></div>',
	
	submit: function() {
		var name = $('#anchordialog').find('input[name=name]').val();
		name = $.trim(name);
		if ( name ) {
			return '<img name="'+name+'" title="'+name+'" class="bke-anchor"/>';
		}
	}
});

// 注册命令插件
E.addPlugin({
	id: 'anchor'
	, title: '锚点'
	, ui: 'anchordialog'
	, type: 'dialog'
	/*
	, getData: function(editor) {
		var data = {
				name: 'name'
			};
			
		return data;
	}
	*/
});

})(jQuery.jQEditor, jQuery);