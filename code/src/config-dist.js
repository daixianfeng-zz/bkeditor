/**
 * 编辑器配置文件
 * 只在打包的时候需要，修改文件路径，需要与初始化参数合并
 */
(function(E , $){
	var rootDir = './code/bke/0.9.0/';
	
	var param = window.location.search;
	if(param.search('debug=true') === -1){
		rootDir = './code/dist/0.9.0/';
	}
	
	var config = {
		rootDir : rootDir,
		cBase : {
			libDir : rootDir+'libs/',
			ieDir : rootDir+'ie/',
			pluginDir : rootDir+'plugin/',
			uiDir : rootDir+'ui/',
			skinDir : rootDir+'skin/'
		}
	};
	
	E.config = $.extend(true, {}, E.config, config);
	
})(jQuery.jQEditor, jQuery);