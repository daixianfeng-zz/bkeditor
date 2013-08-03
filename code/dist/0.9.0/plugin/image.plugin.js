/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
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
(function(E){E.dialogHtml["imagedialog"] ="<div ui=\"imagedialog\" style=\"width:580px; height:300px\"><div class=\"bke-tabs\"><a class=\"bke-tabs-first bke-tabs-selected\" name=\"tab1\">\u5355\u5f20\u63d2\u5165<\/a><a name=\"tab2\">\u6279\u91cf\u4e0a\u4f20<\/a><\/div><div name=\"tab1\"><table><tr><td width=\"60\">\u5730 \u5740\uff1a<span style=\"color:red\">*<\/span><\/td><td width=\"300\"><input type=\"text\" name=\"url\" style=\"width:280px\"\/><\/td><td width=\"180\" rowspan=\"8\" align=\"right\" valign=\"top\"><div class=\"bke-image-preview\">\u56fe\u7247\u9884\u89c8<\/div><div class=\"bke-image-size\"><\/div><\/td><\/tr><tr><td><\/td><td id=\"container1\">\u8f93\u5165\u56fe\u7247\u5730\u5740 \u6216 <a id=\"pickfile\" title=\"\u4e0a\u4f20\u6210\u529f\u4e4b\u540e\uff0c\u4f1a\u81ea\u52a8\u751f\u6210\u5730\u5740\">\u4e0a\u4f20\u4e00\u5f20\u56fe\u7247<\/a> <span><\/span><\/td><\/tr><tr><td>\u94fe \u63a5\uff1a<\/td><td><input type=\"text\" name=\"link\" style=\"width:280px\"\/><\/td><\/tr><tr><td><\/td><td><select name=\"target\"><option value=\"_blank\" selected=\"selected\">\u65b0\u7a97\u53e3\u6253\u5f00\u94fe\u63a5<\/option><option value=\"_top\">\u5f53\u524d\u7a97\u53e3\u6253\u5f00\u94fe\u63a5<\/option><\/select><\/td><\/tr><tr><td>\u63cf \u8ff0\uff1a<\/td><td><input type=\"text\" name=\"title\" style=\"width:280px\"\/><\/td><\/tr><tr><td>\u5bbd \u5ea6\uff1a<\/td><td><input type=\"text\" name=\"width\"\/> px<\/td><\/tr><tr><td>\u9ad8 \u5ea6\uff1a<\/td><td><input type=\"text\" name=\"height\"\/> px<\/td><td>&nbsp;<\/td><\/tr><tr><td>\u5bf9 \u9f50\uff1a<\/td><td><select name=\"align\"><option value=\"left\" selected=\"selected\">\u56fe\u7247\u5c40\u5de6<\/option><option value=\"center\">\u56fe\u7247\u5c45\u4e2d<\/option><option value=\"right\">\u56fe\u7247\u5c40\u53f3<\/option><\/select><\/td><\/tr><\/table><\/div><div name=\"tab2\" style=\"display:none; \"><div id=\"container2\" style=\"line-height:25px;\"><a id=\"pickfiles\">\u9009\u62e9\u56fe\u7247<\/a><span><\/span><\/div><div id=\"filelist\" class=\"bke-image-filelist\"><\/div><\/div><\/div>"})(jQuery.jQEditor);
(function(E){
E.addPlugin({
	id : 'image',
	type : 'dialog',
	waitTime : 0,
	init : function(){
		E.load.loadOneFile(E.config.cBase.libDir+'plupload/plupload.js');
		E.utils.loadDialog(this.id, E.config.cBase.uiDir+'image/');
	},
	showDialog : function(curEditor){
		var self = this;
		if(typeof plupload !== 'undefined'){
			var id = curEditor.Eid;
			E.dialog.open({
				id: 'imagedialog',
				editor: id,
				title: '图片',
				content: $('[ui=imagedialog]'),
				ok: function(){
					if ( E.ui('imagedialog').check() ) {
						E.dialog.revertSelection();
						E.command('imagedialog');
					} else {
						return false;
					}
				},
				cancel: function(){
					E.dialog.close('imagedialog');
				},
				init: function(){
					E.ui('imagedialog').callback();
				},
				beforeunload: function(){
					E.ui('imagedialog').beforeunload();
				},
				icon: 'succeed'
			});
		}else{
			if(self.waitTime > 10000){
				E.error.writeError('no mirror_lib error: codemirror.js loading timeout',3,'plugin');
			}
			setTimeout(function(){
				self.showDialog(curEditor);
			},200);
			self.waitTime += 200;
		}
	},
	imgFloat : function(arg){
		var floatStyle = '';
		arg = parseInt(arg);
		switch(arg){
			case 1 : floatStyle = 'left';break;
			case 2 : floatStyle = 'none';break;
			case 3 : floatStyle = 'right';break;
			default :floatStyle = 'none';break;
		}
		var curImg = getCurrentImg();
		$(curImg).css('float',floatStyle);
	},
	preInsert : function(args){
		return '<a href="'+args.link+'" target="'+args.target+'"><img src="'+args.url+'" style="width:'+args.width+';height:'+args.height+';"/></a>';
	}
});

function getCurrentImg(){
	//获取光标所在的图片
	var selectTable = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectImgClass);
	if(selectTable.length > 0){
		return selectTable;
	}else{
		return $(E.utils.getCurElement().pop()).prev('img');
	}
}
})(jQuery.jQEditor);