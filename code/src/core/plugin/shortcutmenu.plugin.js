/**
 * 快捷菜单
 * 
 * 图片、目录、链接、参考资料等插件有快捷菜单
 *
 * 实现思路： 
 * 绑定一个mousedown事件，记录一下当前需要显示快捷菜单的事件
 * 绑定一个mouseup事件，显示快捷菜单
 * 给快捷菜单绑定点击事件
 * 
 * @createTime	2013.06.05
 **/
(function(E, $){

var element, position, ismove = false;

E.addPlugin({
	id : 'shortcutmenu',
	
	// 转换成文本
	totext: function(){
		var text = $(element).text();
		E.$(element).replaceWith( text );
	},
	
	// 取消链接
	unlink: function(){
		var html = $(element).html();
		E.$(element).replaceWith( html );
		return true;
	},
	
	// 删除
	remove: function(){
		element.parentNode.removeChild(element);
	},
	
	// 编辑参考资料
	editRefer : function() {
		
		return true;
	},
	
	// 删除图片
	removeImage: function() {
		
		var o = $(element);
		
		if(o.closest('div.img').length){
			o = o.closest('div.img');
		}else if(o.closest('a').length){
			o = o.closest('a');
		}
		
		if ( confirm('确定删除这个图片？') ) {
			o.remove();
		}
	},
	
	// 调整图片对齐方式
	alignImage: function(args) {
		Img.update(element, args, 'align');
	},
	
	// 调整图片尺寸
	resizeImage: function(args) {
		Img.update(element, args, 'resize');
	},
	
	// 移动图片
	moveImage: function() {
		ismove = true;
	},
	
	// 图片添加描述
	descImage: function() {
		var parentNode = $(element).closest('div.img'),
			align_class = '';
		if(parentNode.length) {
			align_class = parentNode.attr('class');
			if(align_class.indexOf('img_l') > -1){
				align_class = 'left';
			}else if(align_class.indexOf('img_c') > -1) {
				align_class = 'center';
			}else if(align_class.indexOf('img_r') > -1) {
				align_class = 'right';
			}
		}
		Img.update(element, align_class, 'desc');
	},
	
	// 右键时取消移动
	// 此方法在 contextmenu.event.js 被使用
	contextmenu: function() {
		if (ismove) {
			ismove = false;
			return false;
		}
		
		return true;
	},
	
	// 选中
	select: function() {
		E.curEditor.selectNode( element );
	}
});

/**
 * 点击快捷菜单，带有cmd属性时执行相关命令
 * 
 */
$(document).delegate('.bke-shortcutmenu', 'click', function(e){
	var target = $(e.target).closest("[cmd]");
	// 被禁用的按钮点击无效
	if ( target.closest('.bke-disabled').length ) {
		return true;
	}
	
	if ( target.length ) {
		var cmd = target.attr('cmd'),
			param = target.attr('param'),
			args = target.attr('args');
		
		E.command(cmd, param, args);
		
		// 隐藏快捷菜单
		$(this).css({top: '-2000px'});
		return false;
	}
});

// 鼠标按下时记录当前元素
E.addEvent({
	name : 'shortcutmenu-mousedown',
	type : ['mousedown'],
	area : 'editArea',
	fn : function(e) {
		var o = E.$(e.target);
		if ( ismove ) {
			// 什么也不做...
			
		} else {
			position = null;
			element = null;
			
			if ( o.is('img') ) {
				if ( o.closest('div.img').length ) {
					o = o.closest('div.img');
				}
			}
			
			if ( o.is('div.img,img,h2,h3,a,sup.refer,pre') ) {
				position = o.offset()
				position.top += o.outerHeight() + 2;
				
				element = e.target;
			} else {
				// 表格判断优先级低
				// if ( o.closest('table').length ) {
					// o = o.closest('table');
					// position = o.offset();
					// position.top += o.outerHeight() + 2;
					// element = o[0];
				// }
			}
		}
	}
	
});

// 显示快捷菜单
// 2013-06-05 潘雪鹏
// 提示：
// 绑定click事件，则ie下首次点击图片时不触发click事件，比较奇怪。
// 按下鼠标拖动后，放开鼠标将不会再出发mouseup事件，
// 所以不用担心拖动操作也会出发快捷菜单。
E.addEvent({
	name : 'shortcutmenu-mouseup',
	type : ['mouseup'],
	area : 'editArea',
	fn : function(e) {
		var o = E.$(e.target);
		// 排除右键操作
		if ( e.event.which === 3 ) {
			return;
		}
		if ( ismove ) {
			// 将图片插入到当前位置
			
			if ( o.is('div.img,img,h2,h3,a,sup.refer') ) {
				// 图片、链接、参考资料、目录等标签不能放置图片
				E.errorMessage('此处不适合放置图片，请重新选择');
			} else {
				var range = E.curEditor.getRange();
				if ( $(element).closest('div.img').length ) {
					element = $(element).closest('div.img')[0];
				}
				range.insertNode(element);
				ismove = false;
			}
		} else {
			o = $('.bke-shortcutmenu');
			var $el = $(element)
				, tagName = null
				
			if ( position ) {
				tagName = element.tagName.toLowerCase();
				o.removeClass('bke-shortcutmenu-img bke-shortcutmenu-sup bke-shortcutmenu-other');
				
				if ( $el.is('img') ) {
					o.addClass('bke-shortcutmenu-img');
					// 图片快捷菜单
					setTimeout(function(){
						Img.callback(element, o);
					}, 0);
				} else if ( $el.is('sup') ) {
					o.addClass('bke-shortcutmenu-sup');
				} else if ( $el.is('pre') ) {
					o.addClass('bke-shortcutmenu-pre');
				} else {
					o.addClass('bke-shortcutmenu-other');
				}
				
				o.css(position);
				o.html( HTML[tagName]() );
				
			} else {
				o.css({top: '-2000px'});
			}
		}
	}
});

E.addEvent({
	name : 'shortcutmenu-keyup',
	type : ['keyup'],
	area : 'editArea',
	fn : function(e) {
		if ( e.event.keyCode === 27 ) {
			var text = '';
			if ( text ) {
				// 设置百科链接
				
			} else {
				E.plugin('shortcutmenu').totext();
			}
		}
	}
});


var HTML = {
	h2: function() {
		var html = [];
		html.push('<a cmd="shortcutmenu" param="totext">取消目录(Esc)</a>');
		html.push('<span class="bke-vline">|</span>');
		html.push('<a  cmd="shortcutmenu" param="remove">删除目录</a>');
		return html.join('');
	},
	
	h3: function (){return this.h2()},
	
	a: function() {
		var html = [], o = $(element),
		text = o.text(), url, href = o.attr('href');
		
		html.push('<a cmd="shortcutmenu" param="unlink" title="将链接转为纯文本">取消链接(Esc)</a>');
		if( href ){
			if( /^http:\/\/www\.(hudong|baike)\.com\/wiki\//.test(href)
				|| o.hasClass('baikelink')
				|| o.hasClass('innerlink')
			){
				url = 'http://www.baike.com/wiki/'+encodeURI(text);
			}else{
				url = href;
			}
			
			html.push('<span class="bke-vline">|</span>');
			html.push(' <a href="'+url+'" title="'+url+'" target="_blank">打开链接</a>');
		}
		return html.join('');
	},
	
	sup: function() {
		return '<a cmd="shortcutmenu" param="editRefer">编辑</a><span class="bke-vline">|</span><a cmd="shortcutmenu" param="remove">删除</a>';
	},
	
	pre: function() {
		return '<a cmd="shortcutmenu" param="select">选中</a><span class="bke-vline">|</span><a cmd="shortcutmenu" param="remove">删除</a>';
	},
	
	img: function( ) {
		var html = []
			// 只有互动的图片才可以调整尺寸
			, is_hdong_img = /a\d\.att\.(hudong|baike)\.com/i.test(element.src)
		
		html.push('<a cmd="shortcutmenu" param="descImage">添加描述</a>');
		html.push('<span class="bke-vline">|</span>');
		html.push('<a cmd="shortcutmenu" param="moveImage" title="点击我，然后将光标移到到新的位置，左键插入右键取消">移动图片</a>');
		html.push('<a cmd="shortcutmenu" param="removeImage" style="float:right;color:red;">删除</a>');
		
		html.push('<div class="bke-dottedline"></div>');
		html.push('排版：');
		html.push('<a cmd="shortcutmenu" param="alignImage" args="left">居左</a> ');
		html.push('<a cmd="shortcutmenu" param="alignImage" args="center">居中</a> ');
		html.push('<a cmd="shortcutmenu" param="alignImage" args="right">居右</a>');
		html.push('<span class="bke-vline">|</span>');
		if (is_hdong_img) {
			html.push('<a cmd="shortcutmenu" param="resizeImage" args="_950">大图</a> ');
			html.push('<a cmd="shortcutmenu" param="resizeImage" args="_s">中图</a> ');
			html.push('<a cmd="shortcutmenu" param="resizeImage" args="_140">小图</a>');
		} else {
			html.push('大图 中图 小图');
		}
		
		return html.join('');
	},
	
	table: function() {
		return '<a cmd="shortcutmenu" param="editRefer">表格全选</a><span class="bke-vline">|</span><a cmd="shortcutmenu" param="remove">行列拖拽</a>';
	}
}

// 图片快捷菜单操作对象
var Img = {
	/**
		el : 图片节点
		param : 参数【对齐方式或者大小】
		action : 标志操作类型[resize:大小，align：对齐方式，desc ：添加描述]
	*/
	update: function(el, param, action) {
		var max_width= 600,
			img_obj = $(el),
			img_width = img_obj.width(),
			align_list = {'left': 'img_l', 'center': 'img_c', 'right': 'img_r'},
			title = '',
			new_src = '';
		
		//判断是否是站点图片
		if (action=='resize' && /a\d\.att\.(hudong|baike)\.com/i.test(img_obj.attr('src'))) {
			new_src = img_obj.attr('src').replace(/_140|_s|_950/i, param);
			img_obj.attr('src',new_src);
			var tmp_img = new Image();
			tmp_img.onload = function(){
				img_obj.attr('width',tmp_img.width);
				update_view(tmp_img.width);
			};
			tmp_img.src = new_src;
		}else {
			update_view();
		}
		
		function update_view(new_width) {
			//这里需要在后面获取src值
			var link = img_obj.attr('src'),
				align_class = align_list[param] ? align_list[param]: 'img_c';//默认值img_c;跟大小操作无关，所以可以在这里赋值
			if(typeof new_width == 'number') {
				img_width = new_width;
			}
			//图片宽度超过最大值这加width属性
			if(img_width > max_width) {
				img_width = max_width;
				img_obj.width = img_width;
			}
			//外层有a标签则将a标签和img标签看陈一个整体
			if(img_obj.closest('a').length) {
				img_obj = img_obj.closest('a');
			}
			var parentNode = img_obj.closest('div.img');//div
			//img_obj外面有div.img标签情况
			if(parentNode.length) {
				if(action =='resize') {
					parentNode.width(img_width).find('img').width(img_width);
				}else {
					parentNode.removeClass('img_l img_c img_r').addClass(align_class);
				}
			}else {
				parentNode = E.$('<div class="img '+align_class+'" style="width:'+img_width+'px"></div>').append(img_obj.clone());
				img_obj.replaceWith(parentNode);
			}
			
			if(action == 'desc'){
				if( img_obj.attr('title') ){
					title = img_obj.attr('title');
				}else if( img_obj.attr('alt') ){
					title = img_obj.attr('alt');
				} else {
					title = '图片描述';
				}
				
				if( parentNode.find('strong').length ){
					parentNode.find('strong').text(title);
				}else{
					parentNode.append('<strong>'+title+'</strong>');
				}
			}else{
				//删除描述strong标签style属性，该属性中的width会导致图片大小缩放是文字不居中
				parentNode.find('strong').removeAttr('style');
			}
		}
	},
	
	// 重置图片快捷菜单的当前状态
	// 如图片已经是居右状态时，则将“右”置为不可操作状态
	callback: function(el, menu) {
		var parentNode = $(el).closest('div.img'),//div
			selected_size = null,
			selected_align = null,
			align_list = {'left': 'img_l', 'center': 'img_c', 'right': 'img_r'},
			size_list = ['_950', '_s', '_140'],
			selected_css = {'color': '#666666','cursor': 'default','text-decoration': 'none'};
			//判断最外层是否有DIV标签
		if(parentNode.length) {
			//判断是否有img样式类
			if(parentNode.attr('class').indexOf('img') > -1) {
				var class_value = parentNode.attr('class');
				//判断是否有控制位置的类
				for(var key in align_list) {
					var item = align_list[key];
					if(class_value.indexOf(item) > -1) {
						selected_align = key;
						break;
					}
				}
				if(selected_align) {
					var align_obj = menu.find('[args='+selected_align+']');
					align_obj.css(selected_css).removeAttr('cmd');
				}
				//是否存在描述标签，并且内容不为空
				var disc_obj = parentNode.find('strong');
				if(disc_obj.length > 0 && $.trim(disc_obj.text()) ) {
					disc_obj = menu.find('[param=descImage]');
					disc_obj.css(selected_css).removeAttr('cmd').attr('title', '已存在图片描述，直接修改即可');
				}
			}
		}
		
		//是互动的图片
		if(/a\d\.att\.(hudong|baike)\.com/i.test(el.src)) {
			var img_src = el.src;
			for(var i = 0; i < size_list.length ; i++) {
				var item = size_list[i];
				if(img_src.indexOf(item) > -1) {
					var size_obj = menu.find('[args='+item+']');
					size_obj.css(selected_css).removeAttr('cmd');
					break;
				}
			}
		}
	}
}


})(jQuery.jQEditor, jQuery);