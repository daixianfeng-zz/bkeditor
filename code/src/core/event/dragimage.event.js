/**
 * 图片拖动
 */
 
(function(E, $) {

E.addPlugin({
	id: 'dragimage',
	
	// 此属性在 ajaxupload.event.js 被使用
	mousedown: false
});

var index = 0

// 给图片和其外部的div增加id属性
function reset() {
	var imgs = E.$("img");
	
	imgs.each(function() {
		var o = $(this);
		o.attr('id', "img-"+index);
		o.closest('div.img').attr('id', "wrap-img-"+index);
		index += 1;
	});
}

// 拖动图片
// @param img {jQueryElement}
function dragImage(img) {
	var wrap = img.closest("div.img"),
		id = img.attr('id');
		
	// 如果图片未被拖拽走，则终止
	if ( wrap.length ) {
		return;
	}
	
	
	// 2012-01-17 22:24 潘雪鹏
	// 必须延迟执行，ie否则可能不成功
	// 当图片外面有超链接时，拖动时会带着超链接一起拖走
	
	E.$("#wrap-"+id).hide();
	E.curEditor.baseHistory.prepareHistory();
	setTimeout(function() {
		var img = E.$("#"+id), wrap = E.$("#wrap-"+id);
		if( img.parent().is('a') ) {
			img.parent().after( wrap );
			wrap.prepend( img.parent() );
		} else {
			img.after( wrap );
			wrap.prepend( img );
		}
		wrap.show();
		E.curEditor.baseHistory.recordHistory(1);
		E.trigger('mouseup');
	}, 0);
}

var image;
E.addEvent({
	name : 'dragimage-mousedown',
	type : ['mousedown'],
	area : 'editArea',
	fn : function(e) {
		if( e.target.nodeName.toLowerCase() === 'img' ){
			// 将图片选中
			image = e.target;
			E.plugin("dragimage").mousedown = true;
			// 针对 ie8/7/6 需要在这里绑定dragend事件
			if (/MSIE [678]\.0/i.test(navigator.userAgent)) {
				E.$(image).unbind('dragend').bind('dragend', function(){
					dragImage( E.$(this) );
				});
			}
		} else {
			image = null;
		}
		
	}
});

E.bind('dragimage-mouseup', 'mouseup', function() {
	E.plugin("dragimage").mousedown = false;
});

// 目前(2013-05-31)
// dragend 事件 chrome/firefox/ie9+ 都支持，ie8/7/6需将此事件绑定到图片节点上
E.addEvent({
	name : 'dragimage-dragend',
	type : ['dragend'],
	area : 'editArea',
	fn : function( ) {
		if ( image ) {
			dragImage( E.$(image) );
		}
		
		// chrome下面有点特殊
		// 当使用鼠标点击图片并拖动时，会丢失超链接
		// 如果是先点击一下图片，放开鼠标，再拖动图片则可以带着超链接一起拖动
	}
});

// 初始化图片id，给拖动操作使用
E.addEvent({
	name : 'dragimage-complete',
	type : ['complete'],
	fn : function( ) {
		reset();
	}
});
})(jQuery.jQEditor, jQuery);
