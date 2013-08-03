/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
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
(function(E, $){
var isToolbarFixed = false;

// 要想避免IE6下滚动时，固定(通过css表达式)元素发生抖动，
// 给 html 或 body 设置背景静止定位即可。
// 注意：IE6下如 body 已设置了背景静止定位，
// 	     再给 html 标签设置会让 body 设置的背景静止失效

if (E.IE6 && document.body.currentStyle.backgroundAttachment !== 'fixed') {
	var html = document.getElementsByTagName('html')[0];
	html.style.backgroundImage = 'url(about:blank)';
	html.style.backgroundAttachment = 'fixed';
}

// 调整所有编辑器的高度
E.addEvent({
	name : 'autoHeight',
	type : ['complete'],
	fn : function(arg){
		function f(t) {
			setTimeout(function(){
				$.each(E.editorList, function(i, editor){
					if ( editor.config.autoHeight) {
						autoHeight(editor);
					}
				});
			}, t);
			return f;
		}
		f(0)(300)(1000)(2000)(5000);
	}
});

// 调整当前编辑器的高度
E.addEvent({
	name : 'autoHeight',
	type : ['afterCommand', 'keyup'],
	fn : function(arg){
		if( E.curEditor.config.autoHeight) {
			autoHeight(E.curEditor);
		}
	}
});

// 必须激活当前编辑器，工具栏才会浮动
$(window).scroll(function(){
	$.each(E.editorList, function(i, editor){
		if ( E.curEditor === editor ) {
			fixedToolbar(editor);
		} else {
			var option = editor.config
				, toolbar = $('#'+editor.Eid).find('.bke-toolbar');
			if(toolbar.length === 0){
				toolbar = $('[ref='+editor.Eid+'] .bke-toolbar');
			}

			toolbar.removeClass( option.fixedClassName );
		}
	});
});

// 记录每个编辑器工具栏距离顶部的距离
// 内容区域变化导致页面高度变化时，不会触发resize事件
// 所以，当编辑器被激活时，需要即时计算一下
function setToolbarTop(){
	function f( editor ) {
		var option = editor.config,
			toolbar = $('#'+editor.Eid).find('.bke-toolbar');
		if(toolbar.length === 0){
			toolbar = $('[ref='+editor.Eid+'] .bke-toolbar');
		}
			
		if( toolbar.size() ){
			option.toolbarTop = toolbar.offset().top ? toolbar.offset().top : option.toolbarTop;
			// 给工具栏的父标签
			toolbar.parent().height( toolbar.height() );
		}
	}
	
	$.each(E.editorList, function(i, editor){
		f( editor );
	});
}

E.addEvent({
	name : 'setToolbarTop',
	type : ['complete', 'active'],
	fn : function(arg){
		setTimeout(function(){setToolbarTop()}, 0);
	}
});

var timer2 = 0;
$(window).resize(function(){
	clearTimeout(timer2);
	timer2 = setTimeout(function(){setToolbarTop()}, 200);
});

// 根据内容自动调整编辑器的高度
function autoHeight( editor ){
	var dom = editor.dom,
		height = 0,
		tmpDiv = dom.createElement("DIV");
	
	tmpDiv.style.clear = "both";
	tmpDiv.style.display = "block";
	dom.body.appendChild(tmpDiv);
	
	height = Math.max(tmpDiv.offsetTop + 20, parseInt(editor.config.editHeight,10));
	dom.body.removeChild(tmpDiv);
	
	var o = $('#'+editor.Eid);
	
	if ( o.find('iframe').is(':visible') ){
		o.find('iframe:visible').height( height );
		o.find('.bke-iframeholder').height(height);
	}
	o.find('.bke-iframeholder textarea').height(height);
}

// 滚动时，将工具栏固定在页面顶部
function fixedToolbar( editor ){
	var scrollTop = $(window).scrollTop(),
		option = editor.config,
		o = $('#'+editor.Eid),
		toolbar = o.find('.bke-toolbar'),
		maxScroll = 0;
	if(toolbar.length === 0){
		toolbar = $('[ref='+editor.Eid+'] .bke-toolbar');
	}
	
	if( !toolbar.size() || !option.autoHeight ){
		return;
	}
	// 编辑器的左上角Y坐标 + 编辑器的高度 - 30
	maxScroll = o.offset().top + o.height() - 30;
	
	if( option.toolbarTop && (scrollTop < option.toolbarTop || scrollTop > maxScroll)){
		// 满足如下条件时，还原工具栏
		// 1. 工具栏超过了编辑器区域最下面的边
		// 2. 页面滚动的高度尚未达到工具栏最小浮动高度
		
		toolbar.removeClass( option.fixedClassName );
		if ( E.IE6 ) {
			toolbar[0].style.removeExpression('top');
			toolbar[0].style.position='static';
		}
		isToolbarFixed = false;
	}else{
		// 仅首次浮动事件触发操作
		if( !isToolbarFixed ){
			toolbar.width(toolbar.width()).addClass(option.fixedClassName);
			if ( E.IE6 ) {
				toolbar[0].style.setExpression('top', 'eval(document.documentElement.scrollTop)+"px"');
				toolbar[0].style.position='absolute';
			}
		}
		
		isToolbarFixed = true;
	}
}
})(jQuery.jQEditor, jQuery);
(function(E, $){

E.addEvent({
	name: 'contextmenu',
	type: ['contextmenu'],
	area: 'editArea',
	fn: function( e ) {
		var shortcutmenu = E.plugin("shortcutmenu");
		if( shortcutmenu && !shortcutmenu.contextmenu() ){
			return;
		}
		var menulist = [];
		menulist.push(
			{name: '全选', cmd: 'selectall', icon: 'bke-SelectAll'},
			{name: '清空文档', cmd: 'cleardoc', icon:'bke-ClearDoc'},
			{name: 'separator'}
		);
		
		var $table = $(e.target).closest('table');
		if ( $table.length ) {
			menulist = intable(menulist, $table);
		} else {
			menulist.push(
				{name: '段落格式', icon:'bke-JustifyFull', submenu: [
					{name:'左对齐',cmd:'justifyleft', icon:'bke-JustifyLeft'},
					{name:'右对齐',cmd:'justifyright', icon:'bke-JustifyRight'},
					{name:'居中对齐',cmd:'justifycenter', icon:'bke-JustifyCenter'},
					{name:'两端对齐',cmd:'justifyfull', icon:'bke-JustifyFull'}
				]},
				{name: '插入表格', icon:'bke-InsertTable', submenu: E.utils.execPlugin('tablemenu','getTablePanel')}
			);
		}
		
		menulist.push(
			{name: 'separator'},
			{name: '段前插入段落', cmd: 'insertparagraphbefore', param: ''},
			{name: '段后插入段落', cmd: 'insertparagraphafter', param: ''},
			{name: '复制(Ctrl + c)', icon:'bke-Copy', cmd: 'copy'},
			{name: '粘帖(Ctrl + v)', icon:'bke-Paste', cmd: 'paste'},
			{name: '插入代码', icon:'bke-Code', cmd: 'highlightcode'}
		);
		
		E.Menu.contextmenu(menulist, e);
		
		// 选中区域点击
		if($(e.target).hasClass('selectCellClass')){
			
		}
	}
});

// 构造表格相关右键菜单
function intable(menulist, $table) {
	var tmenu = {
		name: '表格',
		icon: 'bke-InsertTable', 
		submenu: [
			{name:'删除表格', icon:'bke-RemoveTable', cmd:'deletetable'},
			{name:'-'},
			{name:'左插入列', icon:'bke-ColumnInsertBefore', cmd:'insertcolbefore'},
			{name:'右插入列', icon:'bke-ColumnInsertAfter', cmd:'insertcolafter'},
			{name:'上插入行', icon:'bke-RowInsertBefore', cmd:'insertrowbefore'},
			{name:'下插入行', icon:'bke-RowInsertAfter', cmd:'insertrowafter'},
			{name:'-'},
			{},
			{},
			{name:'-'},
			{name:'合并单元格', icon:'bke-CellCombine', cmd:'combinecells'},
			{name:'向下合并', icon:'bke-RowMergeAfter', cmd:'combinerowafter'},
			{name:'向右合并', icon:'bke-ColumnMergeAfter', cmd:'combinecolafter'},
			{name:'-'},
			{name:'表格属性', icon:'bke-TableProps', cmd:'tableprops'}
		]};
	
	if( $table.find('caption').length ){
		tmenu.submenu[7] = {name:'删除表格名称', cmd:'tabletitle'};
	} else {
		tmenu.submenu[7] = {name:'插入表格名称', cmd:'tabletitle'};
	}
	
	if( $table.find('th').length ){
		tmenu.submenu[8] = {name:'删除表格标题行', cmd:'tablehead'};
	} else {
		tmenu.submenu[8] = {name:'插入表格标题行', cmd:'tablehead'};
	}
	menulist.push(tmenu);
	
	menulist.push(
		{name:'单元格对齐方式', icon:'bke-JustifyFull', submenu:[
			{name:'居左', cmd:'celljustify', param:'4'},
			{name:'居中', cmd:'celljustify', param:'5'},
			{name:'居右', cmd:'celljustify', param:'6'},
			{name:'-'},
			{name:'居左（靠上）', cmd:'celljustify', param:'1'},
			{name:'居中（靠上）', cmd:'celljustify', param:'2'},
			{name:'居右（靠上）', cmd:'celljustify', param:'3'},
			{name:'-'},
			{name:'居左（靠下）', cmd:'celljustify', param:'7'},
			{name:'居中（靠下）', cmd:'celljustify', param:'8'},
			{name:'居右（靠下）', cmd:'celljustify', param:'9'}
		]},
		{name:'表格对齐方式', submenu:[
			{name:'左浮动', cmd:'tablefloat', param:'1'},
			{name:'居中', cmd:'tablefloat', param:'2'},
			{name:'右浮动', cmd:'tablefloat', param:'3'}
		]}
	);
	
	var cellBackgroundColor = {
			name: '单元格背景色',
			submenu: E.utils.execPlugin('colormenu','getCellcolorPicker')
		};
		
	menulist.push(cellBackgroundColor);
	
	return menulist;
}

})(jQuery.jQEditor, jQuery);
(function(E, $){

E.addEvent({
	name: 'cursorelements',
	type: ['mousedown','keyup'],
	area: 'editArea',
	fn: function(e) {
		var target = e.target;
		
		// 注意
		// keyup 事件时得到的e.target是body元素，需要修正为光标处的元素
		if ( $(target).is('body') ) {
			var tree = E.utils.getCurElement();
			tree.pop();
			target = tree.pop();
		}
		
		var els = {}
			, o = E.$(target)
			, hn = o.closest('h1,h2,h3,h4,h5,h6,h7')
			, a = o.closest('a')
			, img = o.closest('img')
			, pre = o.closest('pre')
			, sub = o.closest('sub')
			, refer = o.closest('sup.refer')
			, sup = o.closest('sup')
			, cell = o.closest('td,th')
			, row = cell.closest('tr')
			, table = row.closest('table')
			, ol = o.closest('ol')
			, ul = o.closest('ul')
			, embed = o.closest('embed')
			
		if ( hn.length ) els['hn'] = hn[0]
		if ( a.length ) els['a'] = a[0]
		if ( img.length ) els['img'] = img[0]
		if ( pre.length ) els['pre'] = pre[0]
		if ( sub.length ) els['sub'] = sub[0]
		if ( refer.length ) els['refer'] = refer[0]
		if ( sup.length ) els['sup'] = sup[0]
		if ( cell.length ) els['cell'] = cell[0]
		if ( row.length ) els['row'] = row[0]
		if ( table.length ) els['table'] = table[0]
		if ( ol.length ) els['ol'] = ol[0]
		if ( ul.length ) els['ul'] = ul[0]
		if ( embed.length ) els['embed'] = embed[0]
		
		E.curEditor.cursorElements = els;
	}
});

})(jQuery.jQEditor, jQuery);
(function(E,$){
	/**
	* @description 为工具条上的各个图标添加a标签，防止编辑器失去焦点，并且添加说明
	* @author	潘雪鹏
	* @createTime 2013.01.21 
	**/
	function _appendA(o){
		var method='html', text = '', cmd=o.closest('[cmd]').attr('cmd'), title="";
		if ($.trim(o.text())) {
			text = o.text();
			title = o.text();
		} else {
			title = E.getLang('labelMap.'+cmd.toLowerCase()) || o.text();
		}
		
		if ( o.children().size() ) {
			method = 'prepend';
		}
		
		o[method]('<a href="javascript: void(\''+ cmd +'\')" title="'+title+'">'+text+'</a>');
	}	
	/****************************************************************************/
	/** 编辑器执行流程时相关事件                                               **/
	/****************************************************************************/

	// E.addEvent({
		// name : 'initCustomEvent',
		// type : ['ready','create','complete','afterUi','afterPlugin',
				// 'beforePaste','beforeCommand','afterCommand','afterLoad'],
		// fn : function(arg){
		//	E.log.writeLog('Custom-Event Start.','event');return false;
		// }
	// });
	
	// 在执行命令之前隐藏工具栏的面板、记录历史记录
	E.addEvent({
		name: 'commandHidePanel',
		type: ['beforeCommand'],
		fn: function(arg){
			var cmd = arg.commandName;
			E.toolbar.hidePanel(cmd);
			
			if (E.curEditor.baseHistory) {
				if(cmd !== 'revert' && cmd !== 'redo' && cmd !== 'codemirror' && cmd !== 'source'){
					E.curEditor.baseHistory.prepareHistory();
				}
			}
		}
	});
	
	// 在命令执行之后记录历史记录
	E.addEvent({
		name : 'recordHistory',
		type : ['afterCommand'],
		fn : function(arg){
			if(E.curEditor.baseHistory){
				if(arg.commandName !== 'revert' && arg.commandName !== 'redo'){
					E.curEditor.baseHistory.recordHistory();
				}
			}
			
			// 这这些代码应该以事件形式，分别放到各自的代码里面
			// if(E.pluginList['element']){
				// E.pluginList['element'].click();
			// }
			// if(E.pluginList['icon']){
				// E.pluginList['icon'].click();
			// }
		}
	});
	
	/**
	* @description 在编辑器实例化完成时，初始化工具条，并填充面板（菜单）
	* @author	方龙
	* @createTime 2013.01.21 
	**/
	E.addEvent({
		name : 'toolbarinit',
		type : ['complete'],
		fn : function(arg){
			var config = E.editorList[arg.Eid].config;
			var toolbar =$('[ref="'+arg.Eid+'"] .bke-toolbar');
			
			toolbar.find('.bke-icon, .bke-caret').each(function(){
				_appendA($(this));
			});
			
			//根据配置cTools让工具栏显示隐藏
			// var tools = [];
			// if(typeof config.toolbar !== 'string'){
				// tools = config.toolbar;
			// }else if(typeof config.cTools[config.toolbar] === 'undefined'){
				// tools = config.cTools['all'];
			// }else{
				// tools = config.cTools[config.toolbar];
			// }
			
			toolbar.find('div[cmd],span[cmd]').each(function(){
				var o = $(this),
					cmd = o.attr('cmd');
					
				// 暂时不考虑根据配置文件修改工具条
				// if (!o.hasClass('bke-caret')){
					// if ($.inArray(cmd.toLowerCase(),tools)<0){
						// var submenu = o.closest('.bke-submenu');
						// if(!submenu.size()){
							// var menu = o.closest('.bke-icon-menu');
							// if (menu.size()){
								// menu.hide();
							// } else {
								// o.hide();
							// }
						// }
						
					// }
				// }
				
				//为了定位图标节点，使用id查找在ie下查找会快很多
				o.attr('id','icon-'+cmd);
			});
			toolbar.find('.bke-text').each(function(){
				var o = $(this);
				if( o.find('.bke-caret').size() ){
					o.find('.bke-caret').prev().each(function(){
						_appendA($(this));
					});
				} else {
					_appendA(o);
				}
			});
			
			//根据配置cTools调整工具栏显示顺序
			/*
			for (var i=0;i< tools.length; i++){
				var currentcmd = toolbar.find('div[cmd='+tools[i]+'],span[cmd='+tools[i]+']'),
					closestcmd = currentcmd.closest('.bke-icon-menu');
				if (closestcmd.size()){
					toolbar.append(closestcmd);
				} else {
					toolbar.append(currentcmd);
				}
			}
			*/
			//$('#'+arg.Eid+' .bke-toolbarbox').show();

			// 在编辑器创建完成时重置工具栏图标
			//if(E.pluginList['icon']){
			//	E.pluginList['icon'].click();
			//}
		}
	});
})(jQuery.jQEditor, jQuery);
(function(E,$){
	/**
	* @description
	* 委托点击事件，带有cmd属性的，将会执行编辑器命令
	**/
	$(document).delegate('.bke-dialog','click',function(e){
		var tar = $(e.target);
		var cmd = tar.attr('cmd');
		var param = tar.attr('param');
		var id = tar.closest(".bke-dialog").attr('id');
		if( tar.attr('cmd') ){
			E.command(id,cmd,param);
			return false;
		}
	});
})(window.jQuery.jQEditor,window.jQuery);
(function(E, $) {

E.addPlugin({
	id: 'dragimage',
	
	// 此属性在 ajaxupload.event.js 被使用
	mousedown: false
});

var index = 0

// 给图片和其外部的div增加id属性
function reset() {
	var imgs = E.$("img");
	
	imgs.each(function() {
		var o = $(this);
		o.attr('id', "img-"+index);
		o.closest('div.img').attr('id', "wrap-img-"+index);
		index += 1;
	});
}

// 拖动图片
// @param img {jQueryElement}
function dragImage(img) {
	var wrap = img.closest("div.img"),
		id = img.attr('id');
		
	// 如果图片未被拖拽走，则终止
	if ( wrap.length ) {
		return;
	}
	
	
	// 2012-01-17 22:24 潘雪鹏
	// 必须延迟执行，ie否则可能不成功
	// 当图片外面有超链接时，拖动时会带着超链接一起拖走
	
	E.$("#wrap-"+id).hide();
	E.curEditor.baseHistory.prepareHistory();
	setTimeout(function() {
		var img = E.$("#"+id), wrap = E.$("#wrap-"+id);
		if( img.parent().is('a') ) {
			img.parent().after( wrap );
			wrap.prepend( img.parent() );
		} else {
			img.after( wrap );
			wrap.prepend( img );
		}
		wrap.show();
		E.curEditor.baseHistory.recordHistory(1);
		E.trigger('mouseup');
	}, 0);
}

var image;
E.addEvent({
	name : 'dragimage-mousedown',
	type : ['mousedown'],
	area : 'editArea',
	fn : function(e) {
		if( e.target.nodeName.toLowerCase() === 'img' ){
			// 将图片选中
			image = e.target;
			E.plugin("dragimage").mousedown = true;
			// 针对 ie8/7/6 需要在这里绑定dragend事件
			if (/MSIE [678]\.0/i.test(navigator.userAgent)) {
				E.$(image).unbind('dragend').bind('dragend', function(){
					dragImage( E.$(this) );
				});
			}
		} else {
			image = null;
		}
		
	}
});

E.bind('dragimage-mouseup', 'mouseup', function() {
	E.plugin("dragimage").mousedown = false;
});

// 目前(2013-05-31)
// dragend 事件 chrome/firefox/ie9+ 都支持，ie8/7/6需将此事件绑定到图片节点上
E.addEvent({
	name : 'dragimage-dragend',
	type : ['dragend'],
	area : 'editArea',
	fn : function( ) {
		if ( image ) {
			dragImage( E.$(image) );
		}
		
		// chrome下面有点特殊
		// 当使用鼠标点击图片并拖动时，会丢失超链接
		// 如果是先点击一下图片，放开鼠标，再拖动图片则可以带着超链接一起拖动
	}
});

// 初始化图片id，给拖动操作使用
E.addEvent({
	name : 'dragimage-complete',
	type : ['complete'],
	fn : function( ) {
		reset();
	}
});
})(jQuery.jQEditor, jQuery);

(function(E,$){
	var elist = 'click,mousedown,mouseup,mouseenter,mouseleave,scroll,keypress,keyup,keydown,paste,beforepaste,dragenter,dragover,drop,dragleave,dragend'.split(',');
	
	// 事件关联
	function ln($dom, type, curEditor) {
		// IE 下的粘帖事件不能绑定到document上，否则不起作用
		if ( E.IE && /paste/i.test(type) ) {
			$dom = $dom.find('body');
		}
		
		$dom.bind(type, function(e) {
			return E.trigger(type, {
				targetElement: e.target,
				target: e.target,
				event: e,
				targetEditor: curEditor
			});
		});	
	}
	
	/**
	* @description
	* 监听编辑区域浏览事件
	* 之后触发对应自定义事件，
	* ps:编辑区域的事件相当于特殊的自定义事件，需要在此委托到浏览器
	**/
	E.listenEditarea = function(curEditor){
		var $dom = $(curEditor.dom);
		
		// 处理右键菜单
		$dom.bind('contextmenu', function(e) {
			if( e.ctrlKey || e.shiftKey || e.altKey ){
				return true;
			} else {
				E.trigger('contextmenu', {
					targetElement: e.target,
					target: e.target,
					clientX: e.clientX,
					clientY: e.clientY,
					targetEditor: curEditor
				});
				return false;
			}
		});
		
		for( var i=0, len=elist.length; i< len; i++ ){
			var type = $.trim(elist[i]);
			ln($dom, type, curEditor);
		}
		var pasteTime = E.IE ? 'beforepaste' : 'paste';
		//必须绑定到dom下面的某一个节点上面，不能绑定到dom上，在ie不会被触发
		$dom.find('body').bind(pasteTime,function(e){
			E.utils.execPlugin('paste','paste');
		});
		$dom.find('body').bind('beforecopy',function(e){
			$dom.find('body').unbind(pasteTime);
			setTimeout(function(){
				$dom.find('body').bind(pasteTime,function(e){
					E.utils.execPlugin('paste','paste');
				});
			},0);
			E.IE && E.errorMessage('请使用 Ctrl+v 进行粘贴');
		});
		$dom.bind('keydown',function(e){
			if (e.shiftKey && e.which === 13){//shift+enter
			//alert(1);return false;
			}else if (e.ctrlKey && e.which === 13){//ctrl+enter
			//alert(2);return false;
			}else if (e.ctrlKey && e.which === 67){//ctrl+c
				//alert(3);
			}else if (e.ctrlKey && e.which === 86){//ctrl+v
				//alert(4);
			}else if (e.ctrlKey && e.which === 88){//ctrl+x
				//alert(5);
			}else if (e.ctrlKey && e.which === 66){//ctrl+b
				E.command('bold');return false;
			}else if (e.ctrlKey && e.which === 73){//ctrl+i
				E.command('italic');return false;
			}else if (e.ctrlKey && e.which === 85){//ctrl+u
				E.command('underline');return false;
			}else if (e.ctrlKey && e.which === 90){//ctrl+z
				E.command('undo');return false;
			}else if (e.ctrlKey && e.which === 89){//ctrl+y
				E.command('redo');return false;
			}else if (e.ctrlKey && e.which === 65){//ctrl+a
				E.curEditor.selectAll();return false;
			}else if (e.ctrlKey && e.which === 70){//ctrl+f
				E.command('search');return false;
			}else if (e.ctrlKey && e.which === 72){//ctrl+h
				E.command('replace');return false;
			}else if (e.ctrlKey && e.which === 83){//ctrl+s
			alert(11);return false;
			}else if (e.which === 13){//enter
				E.curEditor.baseHistory.prepareHistory();
				setTimeout(function(){
					E.curEditor.baseHistory.recordHistory();
				},0);
			}else if (e.which === 8){//backspace

			}else if (e.which === 46){//delete

			}else{

			}
			setTimeout(function(){
				var curTime = +(new Date());
				if(curTime - curEditor.baseHistory.getLastTime() > 3000){
					E.curEditor.baseHistory.prepareHistory();
					E.curEditor.baseHistory.recordHistory();
				}
			},0);
		});

		// 鼠标移入到某个编辑区域时，设置相关属性值
		$dom.bind('mouseenter',function(e){
			if ( E.curId !== curEditor.Eid ) {
				E.curId = curEditor.Eid;
				E.curEditor = curEditor;
				// 触发编辑器激活事件
				E.trigger('active', {editor:curEditor});
			}
		}).bind('mousedown',function(e){
		
			$dom.bind('mousemove.drag',function(e){
				E.trigger('drag',{
					targetElement : e,
					targetEditor : curEditor
				});
			});
		}).bind('mouseup',function(e){
			$dom.unbind('mousemove.drag');
		});
	};
	/****************************************************************************/
	/** 编辑器内容区域相关事件                                                 **/
	/****************************************************************************/
	
	// 在点击编辑区域或是编辑区域输入时隐藏工具栏的面板
	E.addEvent({
		name : 'editareaHidePanel',
		type : ['mousedown','keydown'],
		area : 'editArea',
		fn : function(){
			E.toolbar.hidePanel();
		}
	});
	
	// webkit内核浏览器下，点击图片默认不会像ie/firefox一样选中图片
	// 需特殊处理，使其点击图片将图片处于选中状态
	if (/AppleWebKit/i.test(navigator.userAgent)) {
		E.addEvent({
			name : 'selectimg',
			type : ['mousedown'],
			area : 'editArea',
			fn : function(arg) {
				if( arg.target.nodeName.toLowerCase() === 'img' ){
					// 将图片选中
					E.utils.selectNode(E.curEditor.win, arg.target);
				}
				
			}
		});
	}
})(window.jQuery.jQEditor,window.jQuery);
(function(E,$){

	/****************************************************************************/
	/** 编辑器执行流程时相关事件                                               **/
	/****************************************************************************/

	
	/****************************************************************************/
	/** 编辑器内容区域相关事件                                                 **/
	/****************************************************************************/
	E.listenEditareaExt = function(curEditor){
		var $dom = $(curEditor.dom);
		/******************************************************/
		/** 表格相关扩展事件                                 **/
		/******************************************************/
		var selectTableClass = E.config.selectTableClass;
		var selectCellClass = E.config.selectCellClass;
		
		$dom.delegate('td,th', 'mousedown', function(e){
			// 这里不再需要设置E.Eid等属性
			// 鼠标一进步编辑区域就会自动设置上这些属性
			
			//开始操作前更新表格，防止属性遗失不能操作;
			E.utils.execPlugin('table','freshTableIndex',$(e.target).closest('table'));
			// 如果是拖动边线调整单元格大小则不选中
			var cursorState = $dom.find('body').css('cursor');
			if(cursorState === 'row-resize' || cursorState === 'col-resize'){
				//不影响后续事件触发（调整单元格大小）
				return true;
			}
			// [TODO]
			if(e.which === 1){
				//记录起始位置
				var scope = {
					col_1 : $(e.target).attr('col'),
					row_1 : $(e.target).attr('row')
				};
				var $cells = $(e.target).closest('table').find('th,td');
				//绑定选中事件（鼠标移动事件）
				$cells.not($(e.target)).bind('mousemove.selectCell',function(e2){
					var $target = $(e2.target), $table = $target.closest('table');
					//选中
					E.utils.removeSelection(E.curEditor.win);
					$cells.removeClass(selectCellClass);
					scope['col_2'] = $target.attr('col');
					scope['row_2'] = $target.attr('row');
					var col_2 = Math.max(scope['col_1'],scope['col_2']),
						col_1 = Math.min(scope['col_1'],scope['col_2']);
					var row_2 = Math.max(scope['row_1'],scope['row_2']),
						row_1 = Math.min(scope['row_1'],scope['row_2']);
					//获取最小范围的矩形，已知的两端坐标
					var selectIndex = getRectangleCells($table,{colStart:col_1,colEnd:col_2,rowStart:row_1,rowEnd:row_2});
					col_2 = selectIndex['colEnd'],col_1 = selectIndex['colStart'];
					row_2 = selectIndex['rowEnd'],row_1 = selectIndex['rowStart'];
					var selTr = $table.find('tr:not(:gt('+row_2+'),:lt('+row_1+'))');
					/*
					不能这样写，因为如果同一行有th又有td会错位
					var selTd = selTr.find('td:not(:gt('+col_2+'),:lt('+col_1+')),th:not(:gt('+col_2+'),:lt('+col_1+'))');
					*/
					var selTd = $();
					selTr.each(function(){
						selTd = selTd.add($(this).find('td,th').not(':gt('+col_2+'),:lt('+col_1+')'));
					});
					selTd.addClass(selectCellClass);
					E.utils.removeSelection(E.curEditor.win);
				});
				$cells.bind('mouseenter',function(e2){
					$cells.removeClass(selectCellClass);
					var curSel = E.curEditor.win.getSelection();
					if(curSel.rangeCount === 0 || curSel.type === 'None'){
						/*当拖动时移出编辑器内容区时，会产生编辑器内容区域无选中区*/
						$cells.unbind('mouseenter mousemove.selectCell');
					}else{
						E.utils.setCursor(E.curEditor.win,e.target,true);
					}
				}).bind('mouseup',function(e2){
					$cells.unbind('mouseenter');
				});
			}
		});
		
		$dom.delegate('body', 'mousedown', function(e){
			// 点击内容区域取消表格选中效果
			
			if(e.which === 1){
				var o = $(this);
				o.find('table').removeClass(selectTableClass);
				o.find('td,th').removeClass(selectCellClass);
			}
			
		}).delegate('body', 'mouseup', function(e){
			// 解除单元格的事件绑定
			// this = body 元素
			$(this).find('td,th').unbind('mouseenter mousemove.selectCell mouseup');
			
		});
		
		var timer = 0;
		// 鼠标移动掉表格上时
		// 在表格左上角显示一个全选表格的小图标
		$dom.delegate('table', 'mouseenter', function(){
			clearTimeout(timer);
			//显示全选图标
			var o = $(this),
				offset = o.offset();
				
			$('.bke-selecttablebar').data('table', o).css({
				top: offset.top - 20,
				left: offset.left - 20
			}).show();
			
		}).delegate('table', 'mouseleave', function(){
			// 鼠标手势变成默认情况
			$dom.find('body').css('cursor','default');
			// 鼠标移出表格时删除全选图标
			clearTimeout(timer);
			timer = setTimeout(function(){
				$('.bke-selecttablebar').hide();
			}, 200);
		});
		
		$('#'+curEditor.Eid).delegate('.bke-selecttablebar', 'click', function(){
			// 全选表格时，是给整个表格加背景色，不再针对单元格
			var table = $(this).data('table');
			
			// 移除单元格背景样式
			table.find('td,th').removeClass(selectCellClass);
			
			// 给表格加背景样式
			table.toggleClass(selectTableClass);
			
			return false;
		}).delegate('.bke-selecttablebar', 'mouseenter', function(){
			clearTimeout(timer);
		}).delegate('.bke-selecttablebar', 'mouseleave', function(){
			// 鼠标移出表格时删除全选图标
			clearTimeout(timer);
			timer = setTimeout(function(){
				$('.bke-selecttablebar').hide();
			}, 200);
		});
		
		$dom.delegate('td','mousemove.cursorState',function(e){
			lineState(e);
		});
		
	};
	
	// 获取一个矩形的单元格选择区域
	function getRectangleCells(table,index){
		var pluTable = E.pluginList['table'];
		var maxRow = $(table).find('tr').length-1;
		var maxCol = $(table).find('tr:first').find('th,td').length-1;
		var colStart = index.colStart,
			colEnd = index.colEnd,
			rowStart = index.rowStart,
			rowEnd = index.rowEnd;
		checkall:while(1){
			var curCell = {};
			var colInfo = {},rowInfo = {};
			if(colStart > 0){
				checkleft:for(var i=rowStart;i<=rowEnd;i++){
					curCell = $(table).find('[col='+colStart+'][row='+i+']');
					rowInfo = pluTable._rowInfo(curCell);
					if(rowInfo.isInRow < 0){
						if(rowInfo.lastColspan > 1){
							if(rowInfo.isInRow + rowInfo.lastColspan > 0){
								colStart -= 1;
								continue checkall;
							}
						}
					}else{
						colInfo = pluTable._colInfo(curCell);
						if(colInfo.isInCol >= 0){
							colStart -= 1;
							continue checkall;
						}
					}
				}
			}else{
				colStart = 0;
			}
			if(rowStart > 0){
				checktop:for(var j=colStart;j<=colEnd;j++){
					curCell = $(table).find('[row='+rowStart+'][col='+j+']');
					colInfo = pluTable._colInfo(curCell);
					if(colInfo.isIncol < 0){
						if(colInfo.lastRowspan > 1){
							if(colInfo.isIncol + colInfo.lastRowspan > 0){
								rowStart -= 1;
								continue checkall;
							}
						}
					}else{
						rowInfo = pluTable._rowInfo(curCell);
						if(rowInfo.isInRow >= 0){
							rowStart -= 1;
							continue checkall;
						}
					}
				}
			}else{
				rowStart = 0;
			}
			if(colEnd < maxCol){
				checkright:for(var i=rowStart;i<=rowEnd;i++){
					curCell = $(table).find('[col='+colEnd+'][row='+i+']');
					rowInfo = pluTable._rowInfo(curCell);
					if(rowInfo.isInRow < 0){
						if(rowInfo.lastColspan > 1){
							if(rowInfo.isInRow < -1){
								colEnd += 1;
								continue checkall;
							}
						}
					}
				}
			}else{
				colEnd = maxCol;
			}
			if(rowEnd < maxRow){
				checkbottom:for(var j=colStart;j<=colEnd;j++){
					curCell = $(table).find('[row='+rowEnd+'][col='+j+']');
					colInfo = pluTable._colInfo(curCell);
					if(colInfo.isInCol < 0){
						if(colInfo.lastRowspan > 1){
							if(colInfo.isInCol < -1){
								rowEnd += 1;
								continue checkall;
							}
						}
					}
				}
			}else{
				rowEnd = maxRow;
			}
			break checkall;
		}
		return {
			colStart :colStart,
			colEnd : colEnd,
			rowStart: rowStart,
			rowEnd : rowEnd
		};
	}
	function lineState(e){
		var curTd = e.target,
			curTable = $(curTd).closest('table'),
			curBody = $(curTd).closest('body');
		var cursorLeft = e.offsetX;
		var tdWidth = curTd.offsetWidth;
		var cursorTop = e.offsetY;
		var tdHeight = curTd.offsetHeight;
		curTable.unbind('mousedown.dragLine');
		if(cursorLeft < 4){
			curBody.css('cursor','col-resize');
			dragLine(curTable,{leftTd:$(curTd).prev('td').not(':hidden')[0] ,rightTd:curTd},false);
		}else if(tdWidth - cursorLeft < 4){
			curBody.css('cursor','col-resize');
			dragLine(curTable,{leftTd:curTd,rightTd:$(curTd).next('td').not(':hidden')[0]},false);
		}else if(cursorTop < 4){
			curBody.css('cursor','row-resize');
			var colIndex = parseInt($(curTd).attr('col'));
			var topTd = $(curTd.parentNode).prev('tr').length ? $(curTd.parentNode).prev('tr').find('td').eq(colIndex).not(':hidden')[0] : undefined;
			dragLine(curTable,{topTd:topTd,bottomTd:curTd},true);
		}else if(tdHeight - cursorTop < 4){
			curBody.css('cursor','row-resize');
			var bottomTd = $(curTd.parentNode).next('tr').length ? $(curTd.parentNode).next('tr').find('td').eq(colIndex).not(':hidden')[0] : undefined;
			dragLine(curTable,{topTd:curTd,bottomTd:bottomTd},true);
		}else{
			curBody.css('cursor','default');
			curTable.unbind('mousedown.dragLine');
		}
	}
	function dragLine(curTable,changeTd,ver){
		var curBody = $(curTable).closest('body');
		if(changeTd.topTd === undefined && ver === true){
			return 0;
		}else if(changeTd.leftTd === undefined && ver === false){
			return 0;
		}
		$(curTable).bind('mousedown.dragLine',function(e){
			$(curTable).find('td').unbind('mousemove.cursorState');
			var oriClientX = e.clientX;
			var oriClientY = e.clientY;
			$(curTable).parent().append('<div></div>');
			var cellLine = $(curTable).parent().children(':last');
			cellLine.css('position','absolute');
			cellLine.css('display','block');
			cellLine.css('width','1px');
			cellLine.css('height','1px');
			cellLine.css('z-index','11');
			ver  === true ? cellLine.width($(curTable).find('tbody').width()) : cellLine.height($(curTable).find('tbody').height());
			var tdTop = $(curTable).offset()['top'],tdLeft = $(curTable).offset()['left'];
			ver  === true ? tdTop += $(changeTd.topTd)[0].offsetTop + $(changeTd.topTd)[0].offsetHeight : tdLeft += $(changeTd.leftTd)[0].offsetLeft + $(changeTd.leftTd)[0].offsetWidth;
			cellLine.css('top',tdTop);
			cellLine.css('left',tdLeft);
			cellLine.css('background-color','green');
			$(curBody).bind('mousemove.changeCell',function(e){
				E.utils.removeSelection(E.curEditor.win);
				var newClientX = e.clientX;
				var newClientY = e.clientY;
				if(ver){
					if(newClientY-oriClientY + $(changeTd.topTd)[0].offsetHeight > 45){
						cellLine.css('top',tdTop+newClientY-oriClientY);
					}
				}else{
					if(newClientX-oriClientX + $(changeTd.leftTd)[0].offsetWidth > 45 && (!changeTd.rightTd || $(changeTd.rightTd)[0].offsetWidth - (newClientX-oriClientX) > 45)){
						cellLine.css('left',tdLeft+newClientX-oriClientX);
					}
				}
				E.utils.removeSelection(E.curEditor.win);
			}).bind('mouseup.changeCell',function(e){
				var newClientX = e.clientX;
				var newClientY = e.clientY;
				var changePx = 0;
				if(ver){
					if(newClientY-oriClientY + $(changeTd.topTd)[0].offsetHeight > 45){
						changePx = newClientY-oriClientY;
					}else{
						changePx = 45-$(changeTd.topTd)[0].offsetHeight;
					}
				}else{
					if(newClientX-oriClientX + $(changeTd.leftTd)[0].offsetWidth > 45 && (!changeTd.rightTd || $(changeTd.rightTd)[0].offsetWidth - (newClientX-oriClientX) > 45)){
						changePx = newClientX-oriClientX;
					}else if(newClientX-oriClientX + $(changeTd.leftTd)[0].offsetWidth > 45){
						changePx = $(changeTd.rightTd)[0].offsetWidth-45;
					}else{
						changePx = 45-$(changeTd.leftTd)[0].offsetWidth;
					}
				}
				moveLine(changeTd,changePx,ver);
				E.utils.removeSelection(E.curEditor.win);
				$(curTable).find('td').bind('mousemove.cursorState',function(e2){
					lineState(e2);
				});
				cellLine.remove();
				$(curTable).unbind('mousedown.dragLine');
				curBody.unbind('mousemove.changeCell');
				curBody.unbind('mouseup.changeCell');
			});
		});
	}
	function moveLine(curTd,changePx,ver){
		if(ver){
			// 只改变选择线顶部的单元格的高度
			var rows = $(curTd.topTd).attr('rowspan') ? parseInt($(curTd.topTd).attr('rowspan')) : 1;
			var rowIndex = parseInt($(curTd.topTd).attr('row'))+rows;
			var changeCells = [];
			$(curTd.topTd).closest('table').find('td:visible,th:visible').each(function(){
				var tmpRows = $(this).attr('rowspan') ? parseInt($(this).attr('rowspan')) : 1;
				if(parseInt($(this).attr('row'))+tmpRows === rowIndex){
					var oriTopHeight = parseFloat($(this).height());
					changeCells.push({cell:$(this),height:oriTopHeight+changePx});
				}
			});
			var changeLen = changeCells.length;
			for(var i=0;i<changeLen;i++){
				changeCells[i].cell.height(changeCells[i].height);
			}
		}else{
			// 同时改变选择线左侧和右侧的宽度
			var cols = $(curTd.leftTd).attr('colspan') ? parseInt($(curTd.leftTd).attr('colspan')) : 1;
			var changeCells = [];
			var colIndex = parseInt($(curTd.leftTd).attr('col'))+cols;
			$(curTd.leftTd).closest('table').find('td:visible,th:visible').each(function(){
				var tmpCols = $(this).attr('colspan') ? parseInt($(this).attr('colspan')) : 1
				if(parseInt($(this).attr('col'))+tmpCols === colIndex){
					var oriLeftWidth = parseFloat($(this).width());
					var oriRightWidth = parseFloat($(this).next('td,th').width());
					changeCells.push({cell:$(this),width:oriLeftWidth+changePx});
					
					$(this).next('td,th').length && changeCells.push({cell:$(this).next('td,th'),width:oriRightWidth-changePx});
					var maxTableWidth = 760;
					var finalWidth = parseFloat($(this).closest('table').width())+changePx > 760 ? 760 : parseFloat($(this).closest('table').width())+changePx;
					$(this).next('td,th').length || changeCells.push({cell:$(this).closest('table'),width:finalWidth});
				}
			});
			var changeLen = changeCells.length;
			for(var i=0;i<changeLen;i++){
				changeCells[i].cell.width(changeCells[i].width);
			}
		}
	}
})(window.jQuery.jQEditor,window.jQuery);
(function(E){
	// 编辑器核心完成时，记录日志
	E.addEvent({
		name : 'readyLog',
		type : ['ready'],
		fn : function(arg){
			E.log.writeLog('Core is ready','core');return false;
		}
	});
	// 编辑器实例创建前，记录日志
	E.addEvent({
		name : 'createLog',
		type : ['create'],
		fn : function(arg){
			E.log.writeLog('Editor '+arg.Eid+' is creating','core');return false;
		}
	});
	// 编辑器实例创建完成，记录日志
	E.addEvent({
		name : 'completeLog',
		type : ['complete'],
		fn : function(arg){
			E.log.writeLog('Editor '+arg.Eid+' is completed','core');return false;
		}
	});
})(window.jQuery.jQEditor);
(function(E,$){
	var $dom = $(document);
	
	// 如需 return false 请详细说明为什么
	/**
	* @description 在点击其他位置时隐藏工具栏的面板
	* @author	戴显峰
	* @createTime 2013.01.11 
	**/
	$dom.bind('click',function(e){
		var o = $(e.target);
		if( !o.closest('.bke-btn').size() ){
			// 如果点击的不是编辑器按钮，则隐藏当前显示的面板
			E.toolbar.hidePanel();
		}
	});
	
	/**
	* @description 点击工具栏按钮时内容区域光标焦点不丢失,并且激活编辑器
	*	如果不在 mousedown 事件返回false，
	*	在ie9下点击工具栏按钮时内容区域将丢失光标焦点，
	*	return false 在ie6/7/8貌似没有效果，
	*	导致命令不能正确应用到选择的文本上。
	*	针对这个问题，还有另外一个解决办法。将工具栏按钮使用a链接标签。
	* @author	潘雪鹏
	* @createTime 2013.01.11 
	**/
	$dom.delegate('.bke-toolbar', 'mousedown', function(e){
		var Eid = $(e.target).closest(".bke-toolbarbox").attr('ref');
		E.curId = Eid;
		E.curEditor = E.editorList[Eid];
		E.curEditor.win.focus();
		return false;
	});
	
	/**
	* @description 点击编辑器工具栏，带有cmd属性时执行相关命令
	* @author	戴显峰
	* @createTime 2013.01.06 
	**/
	$dom.delegate('.bke-toolbar', 'click', function(e){
		var target = $(e.target).closest("[cmd]");
		
		// 使禁用的按钮点击无效
		if( target.closest('.bke-disabled').length ){
			return true;
		}
		
		if( target.length ){
			var cmd = target.attr('cmd'),
				param = target.attr('param'),
				args = target.attr('args');
			
			E.command(cmd, param, args);
			
			return false;
		}
	});
	
	// 点击面板上的命令按钮后，隐藏面板
	$dom.delegate('.bke-submenu [cmd]', 'click', function(e){
		E.toolbar.hidePanel();
	});
	
	
})(jQuery.jQEditor, jQuery);
(function(E, $){

E.addEvent({
	name : 'elementpath',
	type : ['mouseup'],
	area : 'editArea',
	fn : function(arg){
		var $path = $('#'+E.curId+' .bke-elementpath'),
			elementList = E.utils.getCurElement(),
			html = [];
			
		for(var i=0, len = elementList.length; i<len; i++){
			if( elementList[i].nodeType !==3 ){
				html.push('<a>'+elementList[i].nodeName.toLowerCase()+'</a>');
			}
		}
		
		$path.html('元素路径：'+html.join('&gt;'));
		//附加统计文字数
		var stat = $('#'+E.curId+' .bke-wordcount');
		var textContent = E.curEditor.getTextContent();
		textContent = textContent ? textContent.replace(/\s/g,'') : '';
		stat.html('字数统计:'+textContent.length);
	}
});

})(jQuery.jQEditor, jQuery);
(function(E, $){
	var menulist = [
		{name:'宋体',cmd:'fontfamily', param:'SimSun','styleName':'bke-SimSun'},
		{name:'仿宋体',cmd:'fontfamily', param:'FangSong_GB2312','styleName':'bke-FangSong_GB2312'},
		{name:'微软雅黑',cmd:'fontfamily', param:'Microsoft YaHei','styleName':'bke-Microsoft_YaHei'},
		{name:'黑体',cmd:'fontfamily', param:'SimHei','styleName':'bke-SimHei'},
		{name:'楷体',cmd:'fontfamily', param:'KaiTi_GB2312','styleName':'bke-KaiTi_GB2312'},
		//{name:'CourierNew',cmd:'fontfamily', param:'Courier New','styleName':'bke-Courier_New'},
		//{name:'TimesNewRoman',cmd:'fontfamily', param:'Times New Roman','styleName':'bke-Times_New_Roman'},
		{name:'Impact',cmd:'fontfamily', param:'Impact','styleName':'bke-Impact'},
		{name:'Georgia',cmd:'fontfamily', param:'Georgia','styleName':'bke-Georgia'},
		{name:'Arial',cmd:'fontfamily', param:'Arial','styleName':'bke-Arial'},
		{name:'Verdana',cmd:'fontfamily', param:'Verdana','styleName':'bke-Verdana'},
		{name:'Tahoma',cmd:'fontfamily', param:'Tahoma','styleName':'bke-Tahoma'}
	];
	
	E.addPlugin({
		id: 'fontfamilymenu',
		type: 'panel',
		isEnable: true,
		fill: function(Eid){
			var familyPanel = E.Menu.create(menulist);
			E.fillPanel('fontfamilymenu', familyPanel, Eid);
		},
		
		// 将当前字体回显到工具栏
		echo: function($btn, value){
			value = value.replace(/'/g, '')||'';
			value = value.toLowerCase();
			
			$.each(menulist, function(i, n){
				if ( n.param.toLowerCase() === value ){
					$btn.find('#icon-fontfamilymenu').find('.bke-Font a').html(n.name);
					return false;
				}
			})
		}
	});
})(jQuery.jQEditor, jQuery);
(function(E, $){
/**
 * @type {object} 工具条图标列表
 */
var cmdConfig = E.config.cCommand
var iconList = {
	browserChecked : {},
	customChecked : {},
	browserValue : {},
	customValue : {},
	tableChecked : {}
};
for(var cmdType in cmdConfig){
	for(var tmpCmd in cmdConfig[cmdType]){
		var objCmd = cmdConfig[cmdType][tmpCmd];
		if(objCmd.icon !== ''){
			if(objCmd.icon === 'customChecked' || objCmd.icon === 'browserChecked'){
				if(objCmd.param === ''){
					iconList[objCmd.icon][tmpCmd] = {tag : objCmd.cmd,state:'_off'};
				}else if(cmdType === 'pluginCommand'){
					iconList[objCmd.icon][tmpCmd] = {tag : objCmd.param,state:'_off'};
				}else{
					iconList[objCmd.icon][tmpCmd] = {style : objCmd.cmd,value : objCmd.param,state:'_off'};
				}
			}else{
				iconList[objCmd.icon][tmpCmd] = {style : objCmd.cmd, value : objCmd.param, state : '_off'};
			}
		}
	}
}
//表格相关图标的状态，_off为可用状态，_unknown为需继续判定状态
var tableIconState = {
	tableSelect : {
		tableprops : '_off',
		deletetable : '_off'
	},
	cellSelect : {
		cellcolor : '_off',
		cellcolormenu : '_off',
		insertcolbefore : '_off',
		insertcolafter : '_off',
		insertrowbefore : '_off',
		insertrowafter : '_off',
		deletecol : '_off',
		deleterow : '_off',
		combinecells : '_off',
		tableprops : '_off',
		deletetable : '_off'
	},
	cellIn : {
		cellcolor : '_off',
		cellcolormenu : '_off',
		deletecol : '_off',
		deleterow : '_off',
		splittocols : '_split',
		splittorows : '_split',
		splittocells : '_split',
		combinecolafter : '_combine',
		combinerowafter : '_combine',
		insertcolbefore : '_off',
		insertcolafter : '_off',
		insertrowbefore : '_off',
		insertrowafter : '_off',
		tableprops : '_off',
		deletetable : '_off'
	},
	tableOut : {
		inserttable : '_off',
		inserttablemenu : '_off'
	}
};

E.addEvent({
	name: 'iconstate',
	type: ['mouseup','keyup', 'afterCommand'],
	area: 'editArea',
	fn: function(e) {
		main();
	}
});

function main(){
	var iconState = {};
	var tagList = {};
	var styleList = {};
	var elementList = E.utils.getCurElement();
	var Elen = elementList.length;
	var cmdName = '';
	/**
	* @description 查找并合并父节点的样式
	**/
	for(var i=0;i<Elen;i++){
		var tagName = elementList[i].nodeName.toLowerCase();
		tagList[tagName] = true;
		if($(elementList[i]).attr('style')){
			var cssArr = $(elementList[i]).attr('style').split(';');
			var Slen = cssArr.length;
			for(var j=0;j<Slen;j++){
				var styleArr = cssArr[j].split(':');
				if(typeof styleArr[1] === 'string'){
					styleArr[0] = styleArr[0].replace(/^[ ]+/g,"");
					styleList[styleArr[0]] = styleArr[1].replace(/^[ ]+/g,"");
				}
				//styleList[elementList[i].style[j]] = elementList[i].style[elementList[i].style[j]];
			}
		}
	}
	/**
	* @description 自定义判断图标状态是否开启
	**/
	for(cmdName in iconList.customChecked){
		var iconTag = iconList.customChecked[cmdName].tag;
		var iconStyle = iconList.customChecked[cmdName].style;
		if(iconTag && tagList[iconTag] === true){
			iconState[cmdName] = '_on';
		}else if(iconStyle && styleList[iconStyle] === iconList.customChecked[cmdName].value){
			iconState[cmdName] = '_on';
		}else{
			iconState[cmdName] = '_off';
		}
		if(iconState['justifycenter'] === '_off' && iconState['justifyright'] === '_off'){
			iconState['justifyleft'] = '_on';
		}
	}
	/**
	* @description 自定义获取图标的值
	**/
	for(cmdName in iconList.customValue){
		var iconStyle = iconList.customValue[cmdName].style;
		if(iconStyle && styleList[iconStyle]){
			iconState[cmdName] = styleList[iconStyle];
		}else{
			iconState[cmdName] = iconList.customValue[cmdName].state;
		}
	}
	/**
	* @description 浏览器判断图标状态是否开启
	**/
	for(cmdName in iconList.browserChecked){
		if(E.curEditor.dom.queryCommandState(cmdName) === true){
			iconState[cmdName] = '_on';
		}else{
			iconState[cmdName] = '_off';
		}
	}
	/**
	* @description 浏览器获取图标的值
	**/
	for(cmdName in iconList.browserValue){
		if(E.curEditor.dom.queryCommandValue(cmdName)){
			iconState[cmdName] = E.curEditor.dom.queryCommandValue(cmdName);
			if(cmdName === 'ForeColor' || cmdName === 'BackColor'){
				var regColor = /[0-9]+/g;
				var colorArr = iconState[cmdName].match(regColor);
				iconState[cmdName] = '#';
				for(var i=0;i<colorArr.length;i++){
					var oriColor = parseInt(colorArr[i],16);
					if(oriColor < 128){
						iconState[cmdName] += '0';
					}
					iconState[cmdName] += oriColor;
				}
			}
		}else{
			iconState[cmdName] = iconList.browserValue[cmdName].state;
		}
	}
	/**
	 * @description 判断表格图标
	 **/
	var selectedTableLen = $(E.curEditor.dom).find('table.'+ E.curEditor.config.selectTableClass).length;
	var selectedCellLen = $(E.curEditor.dom).find('td.'+ E.curEditor.config.selectCellClass,'th.'+ E.curEditor.config.selectCellClass).length ;
	for(cmdName in iconList.tableChecked){
		iconState[cmdName] = '_freeze';
		if(selectedTableLen !== 0){
			//表格被整体选中的时候
			if(typeof tableIconState.tableSelect[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.tableSelect[cmdName];
			}
		}else if(selectedCellLen !== 0){
			//表格中单元格处于选中状态的时候
			if(typeof tableIconState.cellSelect[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.cellSelect[cmdName];
			}
		}else if(tagList['td'] === true || tagList['th'] === true){
			//tagList在判断自定义样式的时候已经被复制，所以有依赖关系
			//光标在表格的单元格中的时候
			if(typeof tableIconState.cellIn[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.cellIn[cmdName];
			}
			if(iconState[cmdName] === '_split'){
				//还需其他判定的时候，拆分判断
				var curTd = $(E.utils.getCurElement().pop()).closest('td,th');
				iconState[cmdName] = '_freeze';
				if(curTd.attr('colspan') && parseInt(curTd.attr('colspan')) > 1){
					iconState['splittocols'] = '_off';
					iconState['splittocells'] = '_off';
				}
				if(curTd.attr('rowspan') && parseInt(curTd.attr('rowspan')) > 1){
					iconState['splittorows'] = '_off';
					iconState['splittocells'] = '_off';
				}
			}
			if(iconState[cmdName] === '_combine'){
				//还需其他判定的时候，合并判断
				iconState[cmdName] = '_freeze';
				if(E.utils.execPlugin('table','combineRowAfter',true)){
					iconState['combinerowafter'] = '_off';
				}
				if(E.utils.execPlugin('table','combineColAfter',true)){
					iconState['combinecolafter'] = '_off';
				}
			}
		}else{
			//与表格无关的时候
			if(typeof tableIconState.tableOut[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.tableOut[cmdName];
			}
		}
	}
	/**
	* @description 特殊情况Redo，Undo,pastetotext,stylebrush
	**/
	var historyTmp = E.curEditor.baseHistory;
	if(historyTmp){
		iconState['redo'] = historyTmp.redoState ? '_off':'_freeze';
		iconState['undo'] = historyTmp.revertState ? '_off':'_freeze';
	}
	if(E.curEditor.pasteToText === true){
		iconState['pastetotext'] = '_on';
	}
	if(E.pluginList['font']){
		iconState['formatmatch'] = E.pluginList['font'].brushOn[E.curId] ? '_on' : '_off';
	}
	
	// 当前标签是目录时，需要禁用的功能
	if (E.curEditor.cursorElements) {
		$.each(['hn', 'table', 'a', 'sub', 'sup', 'pre'], function(i, tagname){
			if (E.curEditor.cursorElements[tagname]) {
				$.each(E.curEditor.config.cTagDisable[tagname], function(i, n){
					iconState[n] = '_freeze';
				});
			}
		});
	}
	
	/**
	* @description 更新工具条图标状态
	**/
	var o = E.curEditor.$toolbar;
	
	// 显示源码时，禁用所有工具栏按钮，除了源码、帮助、全屏等按钮
	if ( E.curEditor.isShowSource ) {
		o.children('.bke-btn').not('[cmd=codemirror],[cmd=about],[cmd=fullscreen]').addClass('bke-disabled');
		return;
	}
	
	
	/*对于有下拉菜单的项不能移除checked样式，会导致已经打开的面板被隐藏掉
	* 是由于checked样式直接影响打开面板（即图标状态与面板显示耦合）
	* */
	o.children('.bke-btn').not(':has(div.bke-submenu)').removeClass('bke-checked');
	o.children('.bke-btn').removeClass('bke-disabled');

	for(cmdName in iconState){
		if(iconState[cmdName] === '_on'){
			o.find('#icon-'+cmdName).closest('.bke-btn').addClass('bke-checked');
		}else if(iconState[cmdName] === '_freeze'){
			o.find('#icon-'+cmdName).closest('.bke-btn').addClass('bke-disabled');
		}else if(iconState[cmdName] === '_off'){
			// nothing to do
		}else{
			// 字体、字号、颜色、背景色需要将值设置到指定位置
			if (cmdName === 'backcolor' || cmdName === 'forecolor') {
				o.find('#icon-'+cmdName).find('i').css('backgroundColor', iconState[cmdName]);
			} else if (cmdName === 'fontsize' || cmdName === 'fontfamily'){
				var Plugin = E.plugin(cmdName+'menu');
				if ( Plugin && typeof Plugin.echo === 'function' ) {
					Plugin.echo(o, iconState[cmdName]);
				}
			}
		}
	}
}

})(jQuery.jQEditor, jQuery);
(function(E,$){

	E.addPlugin({
		id : 'paste',
		isEnable : true,
		// 点击右键菜单粘帖操作时执行
		click : function(){
			if(window.clipboardData){
				E.curEditor.dom.execCommand('paste');
			}else{
				E.errorMessage('请使用 Ctrl+v 进行粘贴');
			}
		},
		
		// 点击右键菜单剪切操作时执行
		cut : function(){
			if(E.IE){
				E.curEditor.dom.execCommand('cut');
			}else{
				E.errorMessage('请使用 Ctrl+x 进行剪切');
			}
		},
		
		// 点击右键菜单复制操作时执行
		copy : function(){
			if(E.IE){
				E.curEditor.dom.execCommand('copy');
			}else{
				E.errorMessage('请使用 Ctrl+c 进行复制');
			}
		},

		// 发生粘帖事件时执行
		paste : function(){
			var self = this;
			E.utils.getBoardContent(E.curEditor,function(container){
				var afterFilterHtml = '';
				if( E.curEditor.isPastetotext ) {
					afterFilterHtml = $(container).text();
				} else {
					afterFilterHtml = E.utils.filterInner(E.curEditor,container.innerHTML);
				}
				
				E.command('insert', afterFilterHtml);
			});
			if( E.IE ){
				return false;
			}
		},

		// 点击工具栏粘帖纯文本按钮时执行
		toggleTextpaste : function(){
			var isText = E.curEditor.isPastetotext = !E.curEditor.isPastetotext;
			this.clicked(isText, 'pastetotext');
		}
	});
})(window.jQuery.jQEditor,window.jQuery);
(function(E){
	E.addPlugin({
		id : 'redo',
		isEnable : true,
		click : function(){
			E.curEditor.baseHistory.redo();
		}
	});
})(window.jQuery.jQEditor);
(function(E){
	E.addPlugin({
		id : 'revert',
		isEnable : true,
		click : function(){
			E.curEditor.baseHistory.revert();
		}
	});
})(window.jQuery.jQEditor);
(function(E, $){
	E.addPlugin({
		id: 'selectall',
		title: '清空文档',
		isEnable: true,
		click: function() {
			E.curEditor.selectAll();
		}
	});
})(jQuery.jQEditor, jQuery);
(function(E, $){
	E.addPlugin({
		id : 'tablemenu',
		type : 'panel',
		isEnable : true,
		fill : function(){
			//填充table面板
			E.fillPanel('inserttablemenu', createTablePanel(10,10));
			
			$(document).delegate('.bke-plugin-table td', 'mouseenter',function(e){
			
				var ij =  $(e.target).closest('td[args]').attr('args').split('-'),
					row = parseInt(ij[0]),
					col = parseInt(ij[1]),
					table = $(e.target).closest('.bke-plugin-table');
					
				table.parent().children('.bke-info').text(ij[0]+'行 '+ij[1]+'列');
				table.find('td').removeClass('cell-hover');
				table.find('tr:lt('+row+')').find('td:lt('+col+')').addClass('cell-hover');
				
			}).delegate('.bke-plugin-table', 'mouseleave',function(e){
			
				var table = $(e.target).closest('.bke-plugin-table');
				
				table.parent().children('.bke-info').text('0行 0列');
				table.find('td').removeClass('cell-hover');
			});
		},
		
		getTablePanel: function(){
			return createTablePanel(10,10);
		}
	});

	// 构造表格下拉菜单
	function createTablePanel(row,col){
		//拼接table面板html字符串
		// 面板样式[TODO]
		var tablePanel = document.createElement('div');
		var newTable = document.createElement('table');
		$(newTable).addClass('bke-plugin-table');
		for(var i= 0;i<row;i++){
			$(newTable).append('<tr></tr>');
			for(var j=0;j<col;j++){
				var curTr = $(newTable).find('tr:eq('+i+')');
				curTr.append('<td args="'+(i+1)+'-'+(j+1)+'" cmd="inserttable" param="insert"><a></a></td>');
			}
		}
		var insertMenu = E.Menu.create([{name:'插入表格',cmd:'inserttable', param:'showDialog'}]);
		
		$(tablePanel).append('<div class="bke-info">0行 0列</div>');
		$(tablePanel).append(newTable);
		//$(tablePanel).append(insertMenu);
		return tablePanel.innerHTML;
	}

})(jQuery.jQEditor, jQuery);