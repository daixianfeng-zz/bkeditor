/**
 * 上传远程图片到服务器
 */
(function(E, $){

var domain = location.hostname
	, remoteImages = []

E.addPlugin({
	id: 'uploadremoteimage'
	, domains: [location.hostname]
	, click: function(){
		Main.check(E.curEditor.dom);
	}
});

var Main = {
	//正在上传第几张图片
	index: 0,
	
	// 检查内容当中是否存在需要上传的远程图片
	check: function( dom ) {
		var images = dom.getElementsByTagName('img'),
			plugin = E.plugin('uploadremoteimage'),
			i=0, len = images.length,
			src, host;
			
		remoteImages = [];
		
		for(i=0; i<len; i++ ) {
			src = E.$(images[i]).attr('src');
			host = this.getHostname(src);
			
			if ( host && $.inArray(host, plugin.domains) ) {
				remoteImages.push(images[i]);
			}
		}
		
		if ( remoteImages.length ) {
			// 提示有几张图片需要上传
			E.message('有 '+ remoteImages.length +' 张图片等待上传，请稍等...');
			this.upload();
		} else {
			// 提示没有需要上传的图片
			E.message('未检测到需要上传的图片')
		}
	},
	
	getHostname: function( url ){
		var parts, host='';
		url = $.trim(url);
		if ( /^https?:/i.test(url) ){
			parts = url.split('/');
			host = parts[2];
		}
		return host;
	},
	
	// 上传图片
	upload: function( ){
		var self = this
			, image = remoteImages.shift()
			, src = $(image).attr('src')
			, remoteImgSaveAction = '/upload.php?action=saveFromUrl';
			
		self.index += 1;

		$.ajax({
			type: 'POST',
			url: remoteImgSaveAction,
			data: {saveFromUrl: src},
			dataType: 'json',
			success: function( data ) {
				E.$(image).attr('src', data['url'] );
			},
			
			complete: function(xhr, status) {
				// 检查下一张
				if ( remoteImages.length ) {
					E.message('第 '+self.index+' 张图片上传完成');
					setTimeout(function(){self.upload()}, 500);
				} else {
					// 上传完毕
					self.index = 0;
					E.message('所有图片上传完成');
				}
			}
		});
	}
}
})(jQuery.jQEditor, jQuery);