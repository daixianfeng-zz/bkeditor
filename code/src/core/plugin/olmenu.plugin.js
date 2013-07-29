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
		id : 'olmenu',
		type : 'panel',
		isEnable : true,
		fill : function(Eid){
			var familyPanel = '';
			var menulist = [
				{name:'1.2.3...',cmd:'insertorderedlist', param:'decimal'},
				{name:'a,b,c...',cmd:'insertorderedlist', param:'lower-alpha'},
				{name:'A,B,C...',cmd:'insertorderedlist', param:'upper-alpha'},
				{name:'i,ii,iii...',cmd:'insertorderedlist', param:'lower-roman'},
				{name:'I,II,III...',cmd:'insertorderedlist', param:'upper-roman'}
		   ];
			familyPanel = E.Menu.create(menulist);
			E.fillPanel('insertorderedlistmenu',familyPanel,Eid);
		}
	});
})(window.jQuery.jQEditor);