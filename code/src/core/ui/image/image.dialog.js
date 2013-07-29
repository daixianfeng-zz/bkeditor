/**
 * 图片插入弹窗UI
 */
(function(E, $){
E.addUi({
	id: 'imagedialog',
	
	// 点击弹窗确定按钮时会先执行此验证
	// 返回false时将组织弹窗关闭
	// 同时，可以使用shis.error()方法显示错误提示信息
	// 信息会显示在弹窗的左下角
	check: function( ) {
		if ( $(".bke-dialog div[name=tab1]").is(":visible") ) {
		// 如果是单张插入，则需要输入图片地址
			var data = this.getValues();
			if ( !data.link ) {
				this.error('请输入正确的图片地址');
				return false
			}
		} else {
		// 批量上传，不需要检查
			return true;
		}
	},
	
	// 要判断当前显示的是哪个标签，单张插入 or 批量上传
	submit: function() {
		var html = '';
		
		if ( $(".bke-dialog div[name=tab1]").is(":visible") ) {
			// 单张插入
			var data = this.getValues();
			
			html = '<a href="'+data.link+'" target="'+data.target+'"><img src="'+data.url+'"';
			if (data.title) html += ' title="'+data.title+'"';
			if (data.align) html += ' align="'+data.align+'"';
			if (data.width) html += ' width="'+data.width+'"';
			if (data.height) html += ' height="'+data.height+'"';
			
			html += '/></a>';
		} else {
			// 多张上传
			$(".bke-dialog .bke-image-filelist img").each(function(){
				html += '<img src="'+$(this).attr('src')+'"/>';
			})
			
		}
		
		return html
	},
	
	callback: function() {
		setTimeout(function(){
			onePlupload();
			multPlupload();
		}, 0);
	},
	
	// 在弹窗关闭时销毁上传实例
	beforeunload: function(){
		uploader1.destroy();
		uploader2.destroy();
	}
});

// 标签切换
$(document).delegate('.bke-tabs a', 'click', function() {
	var name = $(this).attr('name');
	$('.bke-tabs a')
	.removeClass('bke-tabs-selected')
	.filter('a[name='+name+']').addClass('bke-tabs-selected');
	
	$("div[name=tab1],div[name=tab2]").hide();
	$("div[name="+name+"]").show();
	if ( name === 'tab2' ) {
		multPlupload();
	}
});

// 单张插入时，图片预览
$(document).delegate('.bke-dialog :input[name=url]', 'change', function() {
	var url = $.trim(this.value);
	if ( url ) {
		var img = new Image()
		
		img.onload = function(){
			$('.bke-dialog .bke-image-preview').html('<img src="'+url+'" width="160" />');
			$('.bke-dialog .bke-image-size').html('宽：'+this.width+'px<br>高：'+this.height+'px');
		}
		img.onerror = function(){
			$('.bke-dialog .bke-image-preview').html('图片加载失败！');
			$('.bke-dialog .bke-image-size').html('');
		}
		
		img.src = url;
		
	}
});

var uploader1, uploader2;

// 单张插入
function onePlupload() {
	if ( $(".bke-dialog div[name=tab1]").is(":hidden") ) {
		return;
	}
	if (uploader1) {
		uploader1.destroy();
	}
	
	var conf = E.curEditor.config.cBase.plupload;
	
	uploader1 = new plupload.Uploader({
		runtimes : 'flash',
		browse_button : 'pickfile',
		multi_selection : false,
		container : 'container1',
		max_file_size : conf.max_file_size,
		url : conf.url,
		flash_swf_url : conf.pluploadswf,
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"}
		],
		resize : {width : 1024, height : 768, quality : 90}
	});

	uploader1.init();

	uploader1.bind('FilesAdded', function(up, files) {
		up.refresh(); // Reposition Flash/Silverlight
		uploader1.start();
	});

	uploader1.bind('UploadProgress', function(up, file) {
		$('#container1 span').html('已上传'+file.percent + '%');
	});

	uploader1.bind('Error', function(up, err) {
		up.refresh(); // Reposition Flash/Silverlight
	});

	uploader1.bind('FileUploaded', function(up, file, obj) {
		eval('var o = '+obj.response);
		if ( o.url ) {
			$('#imagedialog').find('input[name=url]').val(o.url);
		}
		setTimeout(function(){$('#container1 span').html('');}, 1000);
	});
}

// 批量上传
function multPlupload() {
	if ( $(".bke-dialog div[name=tab2]").is(":hidden") ) {
		return;
	}
	if (uploader2) {
		uploader2.destroy();
	}
	var conf = E.curEditor.config.cBase.plupload;
	uploader2 = new plupload.Uploader({
		runtimes : 'flash',
		browse_button : 'pickfiles',
		container : 'container2',
		max_file_size : conf.max_file_size,
		url : conf.url,
		flash_swf_url : conf.pluploadswf,
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"}
		],
		resize : {width : 1024, height : 768, quality : 90}
	});
	
	uploader2.init();

	uploader2.bind('FilesAdded', function(up, files) {
		$.each(files, function(i, file) {
			$('#filelist').append(
				'<a id="' + file.id + '" class="bke-image-thumb">' +
				file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
			'</a>');
		});

		up.refresh(); // Reposition Flash/Silverlight
		uploader2.start();
	});

	uploader2.bind('UploadProgress', function(up, file) {
		$('#' + file.id + " b").html(file.percent + "%");
	});

	uploader2.bind('Error', function(up, err) {
		$('#filelist').append("<div>Error: " + err.code +
			", Message: " + err.message +
			(err.file ? ", File: " + err.file.name : "") +
			"</div>"
		);

		up.refresh(); // Reposition Flash/Silverlight
	});

	uploader2.bind('FileUploaded', function(up, file, obj) {
		eval('var o = '+obj.response);
		if ( o.url ) {
			$('#' + file.id).html('<img src="'+o.url+'" width="100%"><span title="删除">×</span>');
		} else {
			
		}
	});
}
})(jQuery.jQEditor ,jQuery);