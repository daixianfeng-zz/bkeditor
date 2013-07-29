/**
 * 插入代码
 */
(function(E){
var menulist = [
	{'cmd':'insertcode','name':'HTML/XML','param':'html'},
	{'cmd':'insertcode','name':'Javascript','param':'js'},
	{'cmd':'insertcode','name':'CSS','param':'css'},
	{'cmd':'insertcode','name':'PHP','param':'php'},
	{'cmd':'insertcode','name':'Java','param':'java'},
	{'cmd':'insertcode','name':'Python','param':'py'},
	{'cmd':'insertcode','name':'Perl','param':'pl'},
	{'cmd':'insertcode','name':'Ruby','param':'rb'},
	{'cmd':'insertcode','name':'C#','param':'cs'},
	{'cmd':'insertcode','name':'C++/C','param':'c'},
	{'cmd':'insertcode','name':'VB/ASP','param':'vb'},
	{'cmd':'insertcode','name':'Coffee','param':'coffee'},
	{'cmd':'insertcode','name':'Shell','param':'sh'}
];

E.addPlugin({
	id: 'insertcodemenu',
	type: 'panel',
	fill: function() {
		var sizePanel = E.Menu.create(menulist);
		E.fillPanel('insertcodemenu', sizePanel);
	},
	// 将当前字号回显到工具栏
	echo: function($btn, value){
		
	}
});

E.addEvent({
	name: 'insertcode',
	type: ['click', 'keyup'],
	fn: function(arg) {
		var key = arg.event.keyCode;
		if (key && (key < 37 || key >40)) {
			// 键盘事件时，仅需要监听 上下左右 移动鼠标的按键
			return;
		}
		
		var text = '插入代码', pre = E.curEditor.cursorElements.pre;
		if (pre) {
			var code_language = $(pre).attr('name');
			
			
			$.each(menulist, function(i, n){
				if ( n.param.toLowerCase() === code_language ){
					text = n.name;
				}
			})
		}
		E.curEditor.$toolbar.find('#icon-insertcodemenu').find('.bke-InsertCode a').html(text);
	}
});

E.addPlugin({
	id: 'insertcode',
	
	click: function( code_language ) {
		var html = '<pre name="'+ code_language +'" id="prettyprint" class="prettyprint lang-' + code_language + '">&#8203;<br></pre>';
		
		var editor = E.curEditor;
		editor.insert(html);
		
		setTimeout(function(){
			var pre = E.$('#prettyprint').removeAttr('id');
			editor.setCursor(pre[0], true);
		}, 0);
	}
});

})(window.jQuery.jQEditor);