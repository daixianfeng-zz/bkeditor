/**
* @fileoverview
* 还原插件
* @author	daixianfeng@hudong.com
* @createTime	2012.01.21
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	E.addPlugin({
		id : 'revert',
		isEnable : true,
		click : function(){
			E.curEditor.baseHistory.revert();
		}
	});
})(window.jQuery.jQEditor);