/**
* @fileoverview
* 粘贴插件，处理剪切板中的内容，然后进行插入
* ----基础插件，满足编辑器基本工作的插件----
* @author	daixianfeng@hudong.com
* @createTime	2013.04.27
* @editor
* @updateTime
* @version	0.6
**/
(function(E,$){

	E.addPlugin({
		id : 'paste',
		isEnable : true,
		// 点击右键菜单粘帖操作时执行
		click : function(){
			if(window.clipboardData){
				E.curEditor.dom.execCommand('paste');
			}else{
				E.errorMessage('请使用 Ctrl+v 进行粘贴');
			}
		},
		
		// 点击右键菜单剪切操作时执行
		cut : function(){
			if(E.IE){
				E.curEditor.dom.execCommand('cut');
			}else{
				E.errorMessage('请使用 Ctrl+x 进行剪切');
			}
		},
		
		// 点击右键菜单复制操作时执行
		copy : function(){
			if(E.IE){
				E.curEditor.dom.execCommand('copy');
			}else{
				E.errorMessage('请使用 Ctrl+c 进行复制');
			}
		},

		// 发生粘帖事件时执行
		paste : function(){
			var self = this;
			E.utils.getBoardContent(E.curEditor,function(container){
				var afterFilterHtml = '';
				if( E.curEditor.isPastetotext ) {
					afterFilterHtml = $(container).text();
				} else {
					afterFilterHtml = E.utils.filterInner(E.curEditor,container.innerHTML);
				}
				
				E.command('insert', afterFilterHtml);
			});
			if( E.IE ){
				return false;
			}
		},

		// 点击工具栏粘帖纯文本按钮时执行
		toggleTextpaste : function(){
			var isText = E.curEditor.isPastetotext = !E.curEditor.isPastetotext;
			this.clicked(isText, 'pastetotext');
		}
	});
})(window.jQuery.jQEditor,window.jQuery);