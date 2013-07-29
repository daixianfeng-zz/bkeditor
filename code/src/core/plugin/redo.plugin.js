/**
* @fileoverview
* 重做插件
* @author	daixianfeng@hudong.com
* @createTime	2012.01.21
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	E.addPlugin({
		id : 'redo',
		isEnable : true,
		click : function(){
			E.curEditor.baseHistory.redo();
		}
	});
})(window.jQuery.jQEditor);