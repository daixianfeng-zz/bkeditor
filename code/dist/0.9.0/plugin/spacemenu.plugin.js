/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
	var bottommenulist = [
		{'name':'0px','cmd':'spacebottom','param':'0px','styleName':''},
		{'name':'5px','cmd':'spacebottom','param':'5px','styleName':''},
		{'name':'10px','cmd':'spacebottom','param':'10px','styleName':''},
		{'name':'15px','cmd':'spacebottom','param':'15px','styleName':''},
		{'name':'20px','cmd':'spacebottom','param':'20px','styleName':''}
   ];
   var topmenulist = [
		{'name':'0px','cmd':'spacetop','param':'0px','styleName':''},
		{'name':'5px','cmd':'spacetop','param':'5px','styleName':''},
		{'name':'10px','cmd':'spacetop','param':'10px','styleName':''},
		{'name':'15px','cmd':'spacetop','param':'15px','styleName':''},
		{'name':'20px','cmd':'spacetop','param':'20px','styleName':''}
   ];
   var linemenulist = [
		{'name':'0行距','cmd':'linespace','param':'1em','styleName':''},
		{'name':'0.5倍行距','cmd':'linespace','param':'1.5em','styleName':''},
		{'name':'单倍行距','cmd':'linespace','param':'2em','styleName':''},
		{'name':'1.25倍行距','cmd':'linespace','param':'2.25em','styleName':''},
		{'name':'1.5倍行距','cmd':'linespace','param':'2.5em','styleName':''},
		{'name':'1.75倍行距','cmd':'linespace','param':'2.75em','styleName':''},
		{'name':'2倍行距','cmd':'linespace','param':'3em','styleName':''},
		{'name':'3倍行距','cmd':'linespace','param':'4em','styleName':''}
   ];
	E.addPlugin({
		id : 'spacemenu',
		type : 'panel',
		isEnable : true,
		fill : function(){
			var topPanel = E.Menu.create(topmenulist);
			var bottomPanel = E.Menu.create(bottommenulist);
			var linePanel = E.Menu.create(linemenulist);
			E.fillPanel('spacebottommenu', bottomPanel);
			E.fillPanel('spacetopmenu', topPanel);
			E.fillPanel('linespacemenu', linePanel);
		},
		bottom:function(){
			E.toolbar.togglePanel('spacebottommenu');
		},
		top:function(){
			E.toolbar.togglePanel('spacetopmenu');
		},
		line:function(){
			E.toolbar.togglePanel('linespacemenu');
		}
	});
})(window.jQuery.jQEditor);