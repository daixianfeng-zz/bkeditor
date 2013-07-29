/**
* 菜单对象
*/
(function (E, $) {
var menuLeft = 0, menuTop = 0, timer = 0, $menu;

setTimeout(function(){
	$('body').append('<div id="bke-contextmenu" class="bke-contextmenu" style="display:none;"></div>');
}, 0);

// 隐藏右键菜单
$(document).bind('click',function(e){
	$('#bke-contextmenu').hide();
});

var Menu = {
	create: function(menu ) {
		var htmlstr = '<div class="bke-menu">'
						+'<div class="bke-shadow bke-default"></div>'
						+'<div class="bke-menu-body">';
				
		var menuLen = menu.length
		for (var i=0;i < menuLen ; i++ ){
			var submenu ='', divmore = '';
			
			if ( menu[i].submenu ) {
			
				submenu = (typeof menu[i].submenu === 'object') 
					? Menu.create(menu[i].submenu) 
					: '<div class="bke-menu">'+menu[i].submenu+'</div>';
					
				divmore = '<div class="bke-menu-more"></div>';
			}
			
			if (menu[i].name === 'separator' || menu[i].name === '-'){
				htmlstr +='<div class="bke-menu-separator">'
							+'<div class="bke-menu-separator-inner"></div>'
						+'</div>';
			} else {
			
				var icon =  menu[i].icon || '',
					cmdStr = '',
					styleName = '';
					
				if (menu[i].disabled){
					icon += ' disabled';
				}

				if (menu[i].styleName){
					styleName = menu[i].styleName;
				}
				if(menu[i]['cmd']){
					cmdStr = ' cmd="'+menu[i]['cmd']+'"';
				}
				if(menu[i]['param']){
					cmdStr += ' param="'+menu[i]['param']+'"';
				}
				if(menu[i]['args']){
					cmdStr += ' args="'+menu[i]['args']+'"';
				}
				htmlstr += '<div class="bke-menu-item '+styleName+'"'+ cmdStr +'>'
								+ '<div class="bke-menu-icon '+icon +'"></div>'
								+ '<div class="bke-menu-label"><a href="javascript:'+menu[i]['cmd']+'" onclick="return false;">'
									+menu[i].name
								+ '</a></div>'
								+ divmore
								+ submenu
							+ '</div>';
			}
		}

		htmlstr += '</div></div>';
		return htmlstr;
	},
	
	contextmenu: function(conf, event) {
		var self = this;
		$menu = $('#bke-contextmenu');
		
		$menu.html( self.create(conf) );
		self._show($menu, event);
		self._setEvent($menu);
	},
	
	_show: function(menu, event){
		menu.css({'z-index':10, 'top':-1000, 'left':-1000}).show();
		
		var self = this, 
			pos = self._setPosition(menu, event);
		
		//设置菜单的位置
		menu.css(pos);
	},
	
	// 绑定事件
	_setEvent: function(menu) {
		// 事件绑定仅需要执行一次
		this._setEvent = function(){};
		
		var self = this, dom = E.curEditor.dom;
		$(dom).bind('click.contextmenu', function(){
			// 单击时清除右键菜单
			menu.hide();
		});
		
		menu.delegate('.bke-menu-item', 'mouseenter', function(e){
			var children = $(this).find('.bke-menu, .bke-submenu');
			clearTimeout(timer);
			
			if (children.size()) {
				timer = setTimeout(function(){children.show ()}, 200);
				/*
				var pos = $(this).position(),
					swidth = children.outerWidth(),
					sheight = children.outerHeight();
				
				// 二级子菜单，默认是和一级菜单水平位置，向下显示
				// 如果下面的空间不足，而上面的空间足，则向上显示
				// 如果上下空间都不足，则二级菜单的底边和窗口底边对齐即可
				if (menuTop + pos.top + sheight > $(window).height()) {
					var h =-1-sheight+25;
					//children.css({'top':h});
				}
				
				if (menuLeft + pos.left + $('.bke-menu').width() + swidth > $(window).width()) {
					var w =0-swidth;
					children.css({'left':w});
				}
				*/
				var pos = self._setSubPosition(children, e);
				children.css( pos );
				children.css({'z-index':150});
			}
			
		}).delegate('.bke-menu-item', 'mouseleave', function(){
		
			$(this).find('.bke-menu').hide();
			
		}).delegate('.bke-menu-item', 'mousedown', function(e){
		
			E.curEditor.win.focus();
			return false;
			
		}).delegate('.bke-menu-item', 'click', function(e){
		
			var target = $(e.target).closest("[cmd]");
			if( target.length ){
				var cmd = target.attr('cmd'),
					param = target.attr('param'),
					args = target.attr('args');
					
				E.command(cmd, param, args);
				menu.hide();
			}
			
			return false;
		});
	},
	
	// 设置一级菜单的位置
	_setPosition: function (menu, event) {
		var offset = $('#'+E.curId).find('iframe').offset(),
			frameX = offset.left,
			frameY = offset.top,
			scrollTop = $(document).scrollTop(),
			scrollLeft = $(document).scrollLeft(),
			clientX = event.clientX + frameX +5,
			clientY = event.clientY + frameY +5 - scrollTop,
			redge = $(window).width() - clientX, // 当前鼠标点击的点距离视窗右边距的距离
			bedge = $(window).height() - clientY; // 当前鼠标点击的点距离视窗下边距的距离
			
		if (redge < menu.outerWidth()) {
			menuLeft = scrollLeft + clientX - menu.outerWidth();
		}else{
			menuLeft = scrollLeft + clientX;
		}
		
		if (bedge < menu.outerHeight()){
			if ( clientY > menu.outerHeight() ) {
				menuTop = scrollTop + clientY - menu.outerHeight();
			} else {
				menuTop = scrollTop + 30;
			}
		}else{
			menuTop = scrollTop + clientY;
		}
		
		return ({'top':menuTop, 'left':menuLeft});
	},
	
	// 设置二级菜单的位置
	_setSubPosition: function (submenu, event) {
		
		
		
		
		return ({'top':0});
	}
}

	E.Menu = Menu ;
})(jQuery.jQEditor ,jQuery);