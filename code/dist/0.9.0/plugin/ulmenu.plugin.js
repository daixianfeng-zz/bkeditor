/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
	E.addPlugin({
		id : 'ulmenu',
		type : 'panel',
		isEnable : true,
		fill : function(Eid){
			var familyPanel = '';
			var menulist = [
				{name:'小圆圈',cmd:'insertunorderedlist', param:'disc'},
				{name:'小圆点',cmd:'insertunorderedlist', param:'circle'},
				{name:'小方块',cmd:'insertunorderedlist', param:'square'}
		   ];
			familyPanel = E.Menu.create(menulist);
			E.fillPanel('insertunorderedlistmenu',familyPanel,Eid);
		}
	});
})(window.jQuery.jQEditor);