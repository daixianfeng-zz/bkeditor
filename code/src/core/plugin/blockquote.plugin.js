/**
 * 引用插件
 * 
 * @createTime 2013-05-15
 **/
(function(E, $){
	// 注册命令插件
	E.addPlugin({
		id: 'blockquote'
		, title: '引用'
		, click: function(){
			var editor = E.curEditor
				// 记录光标范围
				, range = E.utils.getSelectionRange(editor.win, 'node')
				, eles = null
				, startContainer = null
				, endContainer = null
			
			// 将范围区域的body子节点全部放到blockquote标签里面
			eles = $(range.startContainer).parents().get();
			eles.pop(); // html
			eles.pop(); // body
			startContainer = eles.pop(); // body 的子元素
			
			eles = $(range.endContainer).parents().get();
			eles.pop(); // html
			eles.pop(); // body
			endContainer = eles.pop(); // body 的子元素
			
			var o = $(startContainer);
			
			if ( startContainer === endContainer ) {
				if ( o.is('blockquote') ) {
					//o.replaceWith(o.html()); // 取消引用时会导致选取丢失
					
					// 这种方式取消引用时不会导致选取丢失
					o.after(o.children()).remove();
				} else {
					o.wrap('<blockquote></blockquote>');
				}
				
			} else {
			
				var blockquote = editor.dom.createElement('blockquote');
				o.before(blockquote);
				
				o.nextAll().each(function() {
					$(blockquote).append(this);
					if  ( endContainer === this ) {
						return false;
					}
				});
				
				$(blockquote).prepend(startContainer);
			}
			
			// 还原光标范围
			E.utils.setSelectionRange(editor.win, range, 'node');
		}
	});
	
})(jQuery.jQEditor, jQuery);