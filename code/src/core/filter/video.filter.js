/**
 * 视频过滤器
 */
(function(E, $){

E.addFilter({
	name: 'video',
	type: ['dom'],
	
	replace: function(win, dom) {
		var video_whiteList = E.curEditor.config.video_whiteList 
			|| ["youku.com","tudou.com","iqiyi.com","qiyi.com","sohu.com","sina.com.cn","sina.com","qq.com","xunlei.com","ku6.com","56.com","cntv.cn","cctv.com","ifeng.com","baofeng.com","joy.cn","pps.tv","mtime.com","m1905.com","pptv.com","baidu.com","163.com"];
		
		if(typeof dom !=='object' 
			|| !(video_whiteList instanceof Array)
		){
			return;
		}
		
		var video_urls = video_whiteList.slice(0),//复制一份合法的域名
			videos = $('object,embed', dom),
			reg = null,
			del = true, 
			tmp = '', 
			obj = null ,
			item='';
			
		//把所有网址都转为正则表达式，同时去掉http://
		video_urls = video_urls.join('|').toUpperCase().replace(/http:\/\//ig, '').replace(/\./g,'\\\.');
		video_urls = '('+ video_urls + ')$';
		reg = new RegExp(video_urls,'i');
		videos.each(function(){
			obj = $(this);
			tmp = obj.attr('src');
			if(tmp.length){
				tmp = tmp.replace('http://','').replace(/(\?|#)/g,'/').split('/');//去掉src的http://
				if(tmp && tmp.length > 0){
					if(reg.test(tmp[0])){
						del = false;
					}
				}
			}
			if(del){
				obj.remove();
			}
			del = true;
		});
	}
});

})(jQuery.jQEditor, jQuery);