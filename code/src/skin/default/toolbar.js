(function(E, $){
function Toolbar(editor) {
	if ( editor ) {
		editor.$toolbar = $('#'+editor.Eid+' .bke-toolbar');
		if(editor.$toolbar.length === 0){
			editor.$toolbar = $('[ref='+editor.Eid+'] .bke-toolbar');
		}
	}
}

Toolbar.prototype = {
	isShow : function(cmd){
		var target = $('#'+E.curId+' [cmd='+cmd+']');
		if(target.length === 0){
			target = $('[ref='+E.curId+'] .bke-toolbar  [cmd='+cmd+']');
		}
		return target.closest('.bke-btn').hasClass('bke-checked');
	},
	openPanel : function(cmd){
		var target = $('#'+E.curId+' [cmd='+cmd+']');
		if(target.length === 0){
			target = $('[ref='+E.curId+'] .bke-toolbar [cmd='+cmd+']');
		}
		var btn = target.closest('.bke-btn');
		var submenu = btn.find('.bke-submenu');
		if( submenu.length ){
			btn.addClass('bke-checked');
		}
	},
	closePanel : function(cmd){
		var target = $('#'+E.curId+' [cmd='+cmd+']');
		if(target.length === 0){
			target = $('[ref='+E.curId+'] .bke-toolbar [cmd='+cmd+']');
		}
		var btn = target.closest('.bke-btn');
		var submenu = btn.find('.bke-submenu');
		if( submenu.length ){
			btn.removeClass('bke-checked');
		}
	},
	fillPanel : function(cmd, html){
		var target = $('[cmd='+cmd+']');
		var btn = target.closest('.bke-btn');
		var submenu = btn.find('.bke-submenu');
		
		if( submenu.length ){
			submenu.each(function(){
				var o = $(this);
				if($.trim(o.html()) === ''){
					o.html(html);
				}
			});
		}
	},
	clearPanel : function(cmd){
		var target = $('[cmd='+cmd+']');
		var btn = target.closest('.bke-btn');
		var submenu = btn.find('.bke-submenu');
		if( submenu.length ){
			submenu.empty();
		}
	},
	hidePanel : function(except){
		var hideObj = E.curEditor.$toolbar.children('.bke-checked').has('div.bke-submenu');
		if(except){
			var target = E.curEditor.$toolbar.find('#icon-'+except);
			var btn = target.closest('.bke-btn');
			hideObj = hideObj.not(btn);
		}
		
		hideObj.removeClass('bke-checked');
	},
	
	togglePanel: function(cmd){
		if( !this.isShow(cmd) ){
			this.openPanel(cmd);
		}else{
			this.closePanel(cmd);
		}
	},
	
	// 禁用工具栏按钮，除了在names数组中指定的几个
	disabledAll: function( names ) {
		if ( !names || !(names instanceof Array) ) {
			names = [];
		}
		
		var cmds = [], o = E.curEditor.$toolbar;
		$.each(names, function(i, n){
			cmds.push('[cmd='+n+']')
		});
		
		o.children('.bke-btn').not(cmds.join(',')).addClass('bke-disabled');
	}
};

var toolbar = new Toolbar();
toolbar.ready = true;

//将缓存中的需要填充到下拉菜单中
//for(var panelCmd in E.toolbarPanel){
//	toolbar.fillPanel(panelCmd,E.toolbarPanel[panelCmd]);
//}

E.toolbar = toolbar;
E.Toolbar = Toolbar;

// ie6 下给工具栏增加鼠标触摸样式
if ( E.IE6 ) {
	$(document).delegate(".bke-btn", "mouseover", function(){
		$(this).addClass('bke-clicked');
	}).delegate(".bke-btn", "mouseleave", function(){
		$(this).removeClass('bke-clicked');
	});
	
	$(document).delegate(".bke-menu-item", "mouseover", function(){
		$(this).addClass('bke-menu-item-hover').children('.bke-menu-icon').addClass('bke-menu-icon-hover');
	}).delegate(".bke-menu-item", "mouseleave", function(){
		$(this).removeClass('bke-menu-item-hover').children('.bke-menu-icon').removeClass('bke-menu-icon-hover');
	});
}
})(jQuery.jQEditor, jQuery);