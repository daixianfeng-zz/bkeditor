/**
 * 编辑器内容区域高度自适应内容的高度
 */
(function(E, $){
var isToolbarFixed = false;

// 要想避免IE6下滚动时，固定(通过css表达式)元素发生抖动，
// 给 html 或 body 设置背景静止定位即可。
// 注意：IE6下如 body 已设置了背景静止定位，
// 	     再给 html 标签设置会让 body 设置的背景静止失效

if (E.IE6 && document.body.currentStyle.backgroundAttachment !== 'fixed') {
	var html = document.getElementsByTagName('html')[0];
	html.style.backgroundImage = 'url(about:blank)';
	html.style.backgroundAttachment = 'fixed';
}

// 调整所有编辑器的高度
E.addEvent({
	name : 'autoHeight',
	type : ['complete'],
	fn : function(arg){
		function f(t) {
			setTimeout(function(){
				$.each(E.editorList, function(i, editor){
					if ( editor.config.autoHeight) {
						autoHeight(editor);
					}
				});
			}, t);
			return f;
		}
		f(0)(300)(1000)(2000)(5000);
	}
});

// 调整当前编辑器的高度
E.addEvent({
	name : 'autoHeight',
	type : ['afterCommand', 'keyup'],
	fn : function(arg){
		if( E.curEditor.config.autoHeight) {
			autoHeight(E.curEditor);
		}
	}
});

// 必须激活当前编辑器，工具栏才会浮动
$(window).scroll(function(){
	$.each(E.editorList, function(i, editor){
		if ( E.curEditor === editor ) {
			fixedToolbar(editor);
		} else {
			var option = editor.config
				, toolbar = $('#'+editor.Eid).find('.bke-toolbar')

			toolbar.removeClass( option.fixedClassName );
		}
	});
});

// 记录每个编辑器工具栏距离顶部的距离
// 内容区域变化导致页面高度变化时，不会触发resize事件
// 所以，当编辑器被激活时，需要即时计算一下
function setToolbarTop(){
	function f( editor ) {
		var option = editor.config,
			toolbar = $('#'+editor.Eid).find('.bke-toolbar');
			
		if( toolbar.size() ){
			option.toolbarTop = toolbar.offset().top ? toolbar.offset().top : option.toolbarTop;
			// 给工具栏的父标签
			toolbar.parent().height( toolbar.height() );
		}
	}
	
	$.each(E.editorList, function(i, editor){
		f( editor );
	});
}

E.addEvent({
	name : 'setToolbarTop',
	type : ['complete', 'active'],
	fn : function(arg){
		setTimeout(function(){setToolbarTop()}, 0);
	}
});

var timer2 = 0;
$(window).resize(function(){
	clearTimeout(timer2);
	timer2 = setTimeout(function(){setToolbarTop()}, 200);
});

// 根据内容自动调整编辑器的高度
function autoHeight( editor ){
	var dom = editor.dom,
		height = 0,
		tmpDiv = dom.createElement("DIV");
	
	tmpDiv.style.clear = "both";
	tmpDiv.style.display = "block";
	dom.body.appendChild(tmpDiv);
	
	height = Math.max(tmpDiv.offsetTop + 20, editor.config.height);
	dom.body.removeChild(tmpDiv);
	
	var o = $('#'+editor.Eid);
	
	if ( o.find('iframe').is(':visible') ){
		o.find('iframe:visible').height( height );
		o.find('.bke-iframeholder').height(height);
	}
	o.find('.bke-iframeholder textarea').height(height);
}

// 滚动时，将工具栏固定在页面顶部
function fixedToolbar( editor ){
	var scrollTop = $(window).scrollTop(),
		option = editor.config,
		o = $('#'+editor.Eid),
		toolbar = o.find('.bke-toolbar'),
		maxScroll = 0;
	
	if( !toolbar.size() || !option.autoHeight ){
		return;
	}
	// 编辑器的左上角Y坐标 + 编辑器的高度 - 30
	maxScroll = o.offset().top + o.height() - 30;
	
	if( option.toolbarTop && (scrollTop < option.toolbarTop || scrollTop > maxScroll)){
		// 满足如下条件时，还原工具栏
		// 1. 工具栏超过了编辑器区域最下面的边
		// 2. 页面滚动的高度尚未达到工具栏最小浮动高度
		
		toolbar.removeClass( option.fixedClassName );
		if ( E.IE6 ) {
			toolbar[0].style.removeExpression('top');
			toolbar[0].style.position='static';
		}
		isToolbarFixed = false;
	}else{
		// 仅首次浮动事件触发操作
		if( !isToolbarFixed ){
			toolbar.width(toolbar.width()).addClass(option.fixedClassName);
			if ( E.IE6 ) {
				toolbar[0].style.setExpression('top', 'eval(document.documentElement.scrollTop)+"px"');
				toolbar[0].style.position='absolute';
			}
		}
		
		isToolbarFixed = true;
	}
}
})(jQuery.jQEditor, jQuery);