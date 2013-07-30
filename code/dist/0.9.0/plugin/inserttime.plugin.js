/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
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