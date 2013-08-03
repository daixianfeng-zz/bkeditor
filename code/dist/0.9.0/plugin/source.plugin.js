/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E,$){
	

})(jQuery.jQEditor, jQuery);
(function(E, $){
	var selOffset = '';
	// 注册UI插件
	E.addUi({
		id: 'sourcedialog',
		html: '<textarea name="content" style="width:700px;height:400px;resize:none;"></textarea>',
		
		submit: function() {
			var content = $('#sourcedialog').find('textarea').val();
			E.curEditor.setContent(content);
			if(selOffset){
				E.utils.setSelectionByOffset(E.curEditor.win,selOffset);
			}
			selOffset = '';
		}
	});
	
	// 注册命令插件
	E.addPlugin({
		id: 'source',
		title: '源代码',
		ui: 'sourcedialog',
		type: 'dialog',
		
		getData: function(editor) {
			selOffset = E.utils.getSelectionOffset(editor.win);
			var data = {
					content: formatHtml(editor.getContent())
				};
				
			return data;
		}
		/*
		, check: function() {
			var self = this;
			//var values = E.uiList[self.ui].getValues();
			
			return true;
		}
		*/
	});
	
	
	function formatHtml( html ){
		html = html.replace(/\n+/g, '');
		
		var wrap = $('<div></div>').append( html ),
			itemHtml='',
			child = null;
			
		wrap.children().each(function(i, el){
			// jquery-1.4.2 IE下会出现异常
			try{
				child = $(this);
				itemHtml = child.html();
				if(itemHtml.length > 50){
					child.html('\n'+itemHtml+'\n');
				}
				child.after('\n');
			}catch(e){}
		});
		
		var table = wrap.find("table");
		if( table.size() ){
			table.find("tr,td,th").after('\n').before('\n');
		}
		
		html = wrap.html();
		html = html.replace(/\n+/g, '\n');
		html = html.replace(/<BR>/ig, '<br>\n');
		
		html = html.replace(/<.+?>/ig, function($0){
			$0 = $0.replace(/COLOR:/g, 'color:');
			$0 = $0.replace(/rgb\(\d+,(?: |&nbsp;)?\d+,(?: |&nbsp;)?\d+\)/ig, function($0){
				return Utils.colorToHex($0);
			});
			return $0;
		});
		
		// IE下将标签转为小写
		if( E.IE ){
			html = html.replace(/<(\w+)/ig, function($0, tagName){
				return '<'+tagName.toLowerCase();
			});
			html = html.replace(/(\w+)>/ig, function($0, tagName){
				return tagName.toLowerCase()+'>';
			});
		}
		
		return html;
	}
})(jQuery.jQEditor, jQuery);