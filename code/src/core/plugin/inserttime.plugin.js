/**
* @fileoverview
* 时间插入插件
* @author	daixianfeng@hudong.com
* @createTime	2012.12.20
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	E.addPlugin({
		id : 'inserttime',
		click : function(){
			var time = new Date();
			var tmpH = time.getHours(),tmpM = time.getMinutes(),tmpS = time.getSeconds();
			tmpH = tmpH>9?tmpH:'0'+tmpH;
			tmpM = tmpM>9?tmpM:'0'+tmpM;
			tmpS = tmpS>9?tmpS:'0'+tmpS;
			var timeStr = ' '+tmpH+':'+tmpM+':'+tmpS+' ';
			E.command('insert',timeStr);
		}
	});
})(window.jQuery.jQEditor);