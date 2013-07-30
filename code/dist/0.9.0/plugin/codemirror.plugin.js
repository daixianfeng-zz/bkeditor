/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
var selOffset = '';
var isShowSource = false, codeEditor;

// 注册命令插件
E.addPlugin({
	id: 'codemirror',
	title: '源代码',
	waitTime : 0,
	init:function(){
		E.loadCss(E.config.cBase.libDir+'codemirror/codemirror.css');
		E.load.loadOneFile(E.config.cBase.libDir+'codemirror/codemirror.js',function(){
			E.load.loadOneFile(E.config.cBase.libDir+'codemirror/xml.js');
		});
	},
	click: function() {
		var self = this;
		if(typeof CodeMirror !== 'undefined'){
			var editor = E.curEditor,
				textarea = $("#"+editor.Eid+" textarea"),
				content = '';
			
			if ( isShowSource ) {
				// 显示编辑状态，将源码内容写道iframe当中
				content = codeEditor.getValue();
				editor.setContent(content);
				$(".CodeMirror").remove();
				$("#"+editor.Eid+" iframe").show();
				isShowSource = false;
				this.clicked(false);
				if(selOffset){
					E.utils.setSelectionByOffset(E.curEditor.win,selOffset);
				}
				selOffset = '';
			} else {
				// 显示源码状态
				selOffset = E.utils.getSelectionOffset(editor.win);
				this.clicked(true);
				content = formatHtml(editor.getContent());
				textarea.val( content );
				var iframe = $("#"+editor.Eid+" iframe");
				iframe.hide();
				codeEditor = CodeMirror.fromTextArea(textarea[0], {
					//mode: {name: "xml",alignCDATA: true},
					mode: 'text/html',
					lineNumbers: true,
					lineWrapping: true,
					tabMode: "indent",
					autoCloseTags: true
				});
				isShowSource = true;
				
				iframe.closest('.bke-iframeholder').height($(".CodeMirror").height());
			}
			
			editor.isShowSource = isShowSource;
			self.waitTime = 0;
		}else{
			if(self.waitTime > 10000){
				E.error.writeError('no mirror_lib error: codemirror.js loading timeout',3,'plugin');
			}
			setTimeout(function(){
				self.click();
			},200);
			self.waitTime += 200;
		}
	}
});

// 源码简单格式化
function formatHtml( html ){
	html = html.replace(/\n+/g, '');
	
	var wrap = $('<div></div>').append( html ),
		itemHtml='',
		child = null;
		
	wrap.children().each(function(i, el){
		// jquery-1.4.2 IE下会出现异常
		try{
			child = $(this);
			// itemHtml = child.text();
			// if(itemHtml.length > 80){
				// child.html('\n'+itemHtml+'\n');
			// }
			child.after('\n\n');
		}catch(e){}
	});
	
	var table = wrap.find("table");
	if( table.size() ){
		table.find("tr,td,th").after('\n').before('\n');
	}
	
	html = wrap.html();
	html = html.replace(/\n{3,}/g, '\n\n');
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