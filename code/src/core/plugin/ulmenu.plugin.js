/**
* @fileoverview
* 字体颜色插件
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
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