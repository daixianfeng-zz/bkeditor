/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
	var menulist = [
		{'name':'12px','cmd':'fontsize','param':'12px','styleName':'bke-font12'},
		{'name':'14px','cmd':'fontsize','param':'14px','styleName':'bke-font14'},
		{'name':'18px','cmd':'fontsize','param':'18px','styleName':'bke-font18'},
		{'name':'24px','cmd':'fontsize','param':'24px','styleName':'bke-font24'},
		{'name':'36px','cmd':'fontsize','param':'36px','styleName':'bke-font36'}
   ];
	E.addPlugin({
		id : 'fontsizemenu',
		type : 'panel',
		isEnable : true,
		fill : function(){
			var sizePanel = E.Menu.create(menulist);
			E.fillPanel('fontsizemenu', sizePanel);
		},
		
		// 将当前字号回显到工具栏
		echo: function($btn, value){
			$btn.find('#icon-fontsizemenu').find('.bke-FontSize a').html(value);
		}
	});
})(window.jQuery.jQEditor);