/**
 * 拖拽、粘帖图片/或其他文件到编辑器
 * 
 */
 
(function(E){
if( !window.FileReader || !window.XMLHttpRequest ){return;}

// 注册UI插件
E.addUi({
	id: 'ajaxuploaddialog',
	html: '<div class="bke-ajaxupload-progress"><div>文件上传中,请稍等...</div><span>10% ( 1.1MB / 2.0MB )</span><ol></ol></div>'
});

// 注册命令插件
E.addPlugin({
	id: 'ajaxupload',
	title: '文件上传',
	ui: 'ajaxuploaddialog',
	type: 'dialog'
});

// html5 粘帖剪切板图片到编辑器
// 火狐下不需要特殊处理，图片可以直接粘帖到编辑器
// chrome浏览器需要添加这个事件
if (/Chrome/i.test(navigator.userAgent)) {
	E.bind('ajaxupload-paste', 'paste', function(e){
		if( !e ){ return; }
		var clipboardData = e.event.originalEvent.clipboardData,
			items = clipboardData.items,
			item = items[0];
		
		if( item.kind=='file' && item.type.match(/^image\//i) ){
			var imagefile = item.getAsFile(),
				reader = new FileReader();
				
			reader.onload = function( ev ){
				var sHtml='<img src="'+ev.target.result+'"/>';
				E.pasteHTML(sHtml);
			}
			reader.readAsDataURL(imagefile);
			return false;
		}
	});
}

E.bind('ajaxupload-dragover', 'dragover', function(e) {
	// 如果编辑器内有选中的文本内容，则直接返回
	// 否则会导致文字不同用鼠标拖动
	var text = E.curEditor.getSelectionText();
	if ( text ) {
		return;
	}
	
	var dragimage = E.plugin("dragimage");
	if( dragimage && dragimage.mousedown ) {
		// 什么也不做
	} else {
		e.event.stopPropagation();
		e.event.preventDefault();
	}
});

E.bind('ajaxupload-drop', 'drop', function(e) {
	if( !e.event.originalEvent.dataTransfer.files.length ) {
		return;
	}
	
	var files = [],
		errors = [],
		conf = E.curEditor.config.cBase.ajaxupload,
		plugin = E.plugin('ajaxupload'),
		Client = {
			event: e.event,
			minsize: 1024*1024,
			maxsize: 1024*1024*1024*10,
			action: conf.uploadUrl,
			inputName: 'filedata',
			init: function( fileList ){
				plugin.click();
			},
			onprogress: function( o ){
				var el = $("#ajaxuploaddialog").find(".bke-ajaxupload-progress span");
				el.text(o.totalPercent+'% ( '+o.completeCount +'/'+o.totalCount+' )');
			},
			
			callback: function( file , data ){
				if( typeof data === 'object' ){
					if ( data.success ) {
						files.push( {url:data.url, file:file} );
					} else {
						// 上传失败时，要给出提示信息
						file.data = data;
						errors.push(file);
						var msg = data.msg || '未知错误';
						this.error(file, msg);
					}
				}
			},
			
			// 上传完成，将图片插入到编辑器
			oncomplete: function(){
				var html = []
				
				for( var i in files ){
					if ( files[i]['file'].type.match(/^image\//i) ) {
						html.push('<img src="'+ files[i].url +'" style="max-width:600px;" />');
					} else {
						html.push('<a href="'+ files[i].url +'" target="_blank">'+files[i].file.name+'</a>');
					}
				}
				
				E.curEditor.insert(html.join(''));
				
				// 有错误，弹窗不关闭
				if ( errors.length ) {
					setTimeout(function(){
						$("#ajaxuploaddialog").find(".bke-ajaxupload-progress div").html('');
					}, 500);
				} else {
				// 如果没有错误，则弹窗自动关闭
					setTimeout(function(){
						E.dialog.close();
					}, 1000);
				}
				
			},
			
			
			
			error: function(file, msg) {
				$("#ajaxuploaddialog").find(".bke-ajaxupload-progress ol")
					.append('<li>'+ file.name +' 上传失败，原因: '+msg+'</li>')
			}
		};
	MainAjaxUpload.ondrop( Client );
});

// ajax 上传对象
var MainAjaxUpload = {
	xhr: new XMLHttpRequest(),
	
	// 调用者
	Client: null,
	
	// 已经完成上传的文件数
	completeCount: 0,
	
	// 所有文件的总数
	totalCount: 0,
	
	// 所有文件的总大小
	totalSize: 0,
	
	// 上传完成的文件总大小，默认值是1
	completeSize: 1,
	
	//是否正在上传图片
	isUploading: false,
	
	// 待上传的文件列表
	fileList: [],
	
	// 上传成功的文件列表
	successFileList: [],
	
	// 上传失败的文件列表
	failureFileList: [],
	
	// 初始化
	init: function( fileList ){
		if( this.isUploading ){
			return;
		}
		
		var self = this;
		self.completeCount = 1;
		//self.totalSize = 0;
		//self.completeSize = 0;
		
		self.fileList = fileList;
		self.successFileList = [];
		self.failureFileList = [];
		self.isUploading = true;
		self.totalCount = fileList.length;
		self.start( );
	},
	
	
	ondrop: function( Client ){
		var self = this,
			dataTransfer = Client.event.originalEvent.dataTransfer,
			fileList = [],
			files = dataTransfer.files;
			
		self.Client = Client;
		Client.event.stopPropagation();
		Client.event.preventDefault();
		
		for (var i=0, len = files.length; i<len; i++) {
			if ( files[i].size ) {
				fileList.push( files[i] );
				self.totalSize += files[i].size;
			}
		}
		
		if ( fileList.length ) {
			Client.init( fileList );
			self.init(fileList);
		}
	},
	
	// 开始上传
	start: function( ){
		var self = this,
			fileList = self.fileList,
			file = fileList.shift();
			
		if( file ){
			self.post( file );
		}else{
			// 所有文件上传完成
			self.complete();
		}
	},
	
	// 所有文件上传完成
	complete: function( ){
		var self = this;
		//setTimeout(function(){
			self.Client.oncomplete( );
			self.isUploading = false;
		//}, 1000);
	},
	
	// 每个文件上传完毕后调用
	callback: function( file, responseText ){
		var self = this, data;
		self.completeCount += 1;
		self.completeSize += (file.size || file.fileSize);
		
		try{
			data = $.parseJSON(responseText);
		}catch(e){};
		
		//self.Client.callback( self.fileList[0], data ); // ? nextfile
		self.Client.callback( file, data );
	},
	
	// 显示进度条
	onprogress: function( ev, file ){
		var self = this;
		if( ev && ev.loaded >= 0 ) {
			var size = file.size || file.fileSize,
				currentPercent = Math.round( (ev.loaded * 100)/ size ),
				totalPercent = Math.round( ((ev.loaded + self.completeSize) * 100) / self.totalSize );
			var progress = {
				totalPercent: totalPercent, // 总进度百分数
				currentPercent: currentPercent, //当前文件进度百分数
				loaded: self.formatBytes(ev.loaded), //当前上传的块大小
				size: self.formatBytes(size), //当前上传的文件大小
				name: file.name || file.fileName, //当前上传的文件名称
				
				//当前已经上传完成的总大小
				completeSize: self.formatBytes(ev.loaded + self.completeSize), 
				totalSize: self.formatBytes(self.totalSize), //所有文件总大小
				completeCount: self.completeCount, //正在上传第几个文件
				totalCount: self.totalCount //总文件数
			};
			self.Client.onprogress( progress );
		} else {
			//不支持进度
			
		}
	},
	
	// 使用ajax方式向服务器发送文件
	// 每次发送一个文件
	post: function( file ){
		var self = this, xhr = self.xhr;
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4) {
				if ( xhr.status == 200 ) {
					// 上传成功
					self.successFileList.push( file );
					self.callback( file, xhr.responseText );
					// 继续下一个文件上传
					self.start();
				} else {
					// 上传错误
					self.failureFileList.push( file );
				}
			}
		};
		
		if ( xhr.upload ) {
			xhr.upload.onprogress = function( ev ){
				self.onprogress( ev, file );
			};
		} else {
			self.onprogress( false ); //不支持进度
		}
		
		xhr.open("POST", self.Client.action);
		xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		xhr.setRequestHeader('Content-Disposition', 'attachment; name="'+self.Client.inputName+'"; filename="'+(file.name||file.fileName)+'"');
		
		if ( xhr.sendAsBinary ) {
			// Firefox 支持 sendAsBinary() 和 send() 方法
			// sendAsBinary() 不是标准方法，只能在firefox3.6+当中使用
			xhr.sendAsBinary( file.getAsBinary() );
		} else {
			// 2011-07-21
			// Chrome 浏览器不支持sendAsBinary方法，使用send()方法
			xhr.send(file);
		}
	},
	
	formatBytes: function(bytes) {
		var s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(bytes)/Math.log(1024));
		return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+s[e];
	}
}

})(jQuery.jQEditor);