/**
* @requires core.js , config.js
* @fileoverview
* 文件加载
* 用于动态加载文件
* @author	daixianfeng@hudong.com
* @createTime	2012.11.21
* @editor
* @updateTime
* @version	0.3
**/
(function(E,$){
	var load = {
		delayFile : [],
		/**
		初始化载入，载入用得上的js文件。
		**/
		initLoad : function(config){
			this.delayFile = config.delayFile;
		},
		/**载入延时加载的文件**/
		loadDelayFile : function(){
			setTimeout(function(){
				var len = self.delayFile.length;
				for(var i=0;i<len;i++){
					$.getScript(E.config.cBase.pluginDir+self.delayFile[i]);
				}
			},100);
		},
		/**载入单个文件**/
		loadOneFile : function(addr,callback){
			$.getScript(addr,function(){
				E.trigger('afterLoad');
				callback && callback();
			});
		},
		/**载入多个文件，应该压缩**/
		loadMultiFile : function(){}
		
	};
	load.initLoad(E.config.cBase);
	load.ready = true;
	E.load = load;
})(window.jQuery.jQEditor,window.jQuery);