/**
 * BKEditor - WYSIWYG HTML Editor for Internet
 * Copyright (c) 2013, BKEditor.com All rights reserved.
 * MIT Licensed.
 * Depends: jQuery1.32+
 * Date: 2012.12.12
 * Version: 0.9.0
 * 
 * 编辑器核心文件
 * 
 * 核心开发人员：戴显峰 潘雪鹏
 */
(function($){

// 编辑器核心，内部对象，对外不可见
var jQEditor = {
	IE: window.VBArray ? true : false,
	IE6: (window.VBArray && !window.XMLHttpRequest) ? true : false,
	FF:	(navigator.userAgent.indexOf("Firefox")!==-1),
	
	// 编辑器状态
	state : 'loading',
	// 编辑器实例集合
	editorList : {},
	// 当前激活的编辑器id
	curId : '',
	// 当前活动的编辑器实例对象
	curEditor : {},
	// 当前活动的编辑器实例对象
	curToolbar : jQuery(),
	// 日志处理对象
	log : {},
	// 错误处理对象
	error : {},
	// 插件集合
	pluginList : {},
	// 插件的UI集合
	uiList : {},
	// 语言包对象
	lang : {},
	// 监听编辑区域事件
	listenEditarea : {},
	// 监听编辑区域事件扩展
	listenEditareaExt : {},
	// 添加过滤器接口
	addFilter : function(){},
	// 挂载各种内部实现命令，为其他文件提供挂在位置，执行其下面命令不走命令大流程
	coreCommand : {},
	// 执行命令接口
	command : function(cmd,param){},
	// 历史记录核心对象
	histroy : {},
	// 通用方法集对象
	utils : {},
	// 文件加载器对象
	load :{},
	// 工具栏关联对象
	toolbar : {},
	// 工具栏下拉菜单缓存
	toolbarPanel : {},
	// 对话框html缓存
	dialogHtml : {},
	// 对话框接口对象
	dialog : {},
	// 主题列表，用于判断主题是否加载。
	themeList : {
		toolbar:{},
		editArea:{}
	},
	/**
	* @description
	* 初始化JQEditor，加载config文件，合并options配置，根据config加载并初始化各个对象
	* @param {object} options 配置参数
	**/
	init : function(options){

	},

	// 创建编辑器，使用jQuery方法的，比较简洁

	/**
	* @description
	* 绘制编辑器，获取html，css添加到dom中，注册编辑区域事件
	* @param {object.<jQEditor>} targetObj 创建的目标编辑器
	* @param {function} callback 回调函数
	**/
	create: function(targetObj,callback){
		var self = this,
			conf = targetObj.config,
			textarea = null;
			
		//添加指定id的编辑器
		var timestamp = +new Date();
		//var timestamp = 'debug';
		var editorHtml = '<div id="'+conf.id+'" ref="editor" style="width:'+conf.editWidth+';">';
		editorHtml += '<div class="bke-toolbarbox" ref="'+conf.id+'"></div>';
		editorHtml += '<div class="bke-contentarea">';
			editorHtml += '<div class="bke-iframeholder" style="height:'+conf.editHeight+';"></div>';
				editorHtml += '<div class="bke-bottombar">';
					editorHtml += '<span class="bke-elementpath">元素路径：<a>body</a></span>';
					editorHtml += '<span class="bke-wordcount">字数统计</span>';
				editorHtml += '</div>';
			editorHtml += '</div>';
		editorHtml += '</div>';
		
		if(conf.position instanceof jQuery){
			conf.position.before(editorHtml);
			conf.position.hide();
			textarea = conf.position;
		}else{
			// 这个分支是针对工具栏和内容区域分别指定位置
			// 需要在配置文件当中给position项指定
			// 如{content: $(el), toolbar: $(el)}
			conf.position.content.before(editorHtml);
			var toolbarObj = conf.position.content.prev().find('.bke-toolbarbox');
			conf.position.toolbar.append(toolbarObj);
			conf.position.content.hide();
			textarea = conf.position.content;
		}
		conf.textarea = textarea;
		
		// 该区域用来存放编辑器需要加载的弹窗
		if($(document.body).find('#ui-dialog').length === 0){
			$(document.body).append('<div id="ui-dialog" style="display:none;"></div>');
		}
		//添加编辑区域iframe
		var iframe = document.createElement('iframe');
		$(iframe).height(conf.editHeight).attr({
			frameBorder: 0,
			tabIndex: '0',
			'width': '100%',
			scrolling: conf.editScroll
		}).addClass('show-content');
		
		$('#'+conf.id).find('.bke-iframeholder')
			.append(iframe)
			.append(textarea)
			.append('<div class="bke-shortcutmenu"></div>')
			.append('<a class="bke-selecttablebar"></a>');
			
		// 获取编辑区域的document和window对象，添加到配置中，
		// 这样才能对相应的编辑区域做出操作和绑定事件，相当重要
		var win = iframe.contentWindow, dom = win.document;
		// 向编辑区域的iframe中添加应有的元素，如果是ie浏览器还要加载仿Range，Selection内容
		dom.open();
		var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" ';
		html+= '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		html+= '<html><head>';
		html+= '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
		html+= '<link rel="stylesheet" type="text/css" href="'+conf.cBase.skinDir+'skin-inner.css">';
		html+= '<!--[if IE]>';
		html+= '<script type="text/javascript" src="'+conf.cBase.ieDir+'DOMRange.js?'+timestamp+'"></script>';
		html+= '<![endif]-->';
		html+='</head><body contentEditable="true" style="height:98%"></body></html>';
		dom.write(html);
		dom.close();
		
		self.editWin = win;
		self.editDom = dom;
		targetObj.win  = win;
		targetObj.dom  = dom;

		// 填充工具条区域 不支持同一页面多种风格的工具条
		// 此处必须使用原生的DOM方法加载css文件，不能使用jQuery的append方法加载
		// 主题的变换目前以加载不同css的方法实现，不能满足同一页面多种风格的需求
		if( !self.themeList.toolbar[conf.skin]) {
			self.loadCss(conf.cBase.skinDir+conf.skin+'/skin.css');
			self.themeList.toolbar[conf.skin] = true;
		}
		
		var rangeCheck = setInterval(function(){
			if(typeof self.editWin.getSelection !== 'undefined'){
				var toolbar = 'toolbar';
				if ( conf.toolbar && conf.toolbar !== 'default') {
					toolbar += '_'+conf.toolbar;
				}
				var toolsrc = conf.cBase.skinDir+conf.skin+'/'+toolbar+'.json';
				
				if( self[toolsrc] ){
					$('[ref="'+conf.id+'"].bke-toolbarbox').html(self[toolsrc]);
					callback && callback();
				} else {
					$.get(toolsrc,function(data){
						// 工具条的html内容为被编译好的json对象，存储在jQEditor.tool中
						// 如果toolbar文件加载成功，jQEditor.tool就会有相应的html代码
						$('[ref="'+conf.id+'"].bke-toolbarbox').html(data);
						
						callback && callback();
						self[toolsrc] = data;
					});
				}
				clearInterval(rangeCheck);
			}
		},50);
	},
	/**
	* @description
	* 触发已注册的事件
	* @param {string} type 事件类型
	* @param {object} arg 事件参数
	* @override
	**/
	trigger : function(type,arg){},
	/**
	* @description
	* 填充下拉菜单，如果已经加载了E.toolbar则直接填充
	* 	如果没有则填充到缓存，等待E.toolbar加载时填充所有缓存
	* @param {string} cmd 要填充到的插件命令
	* @param {string} html 填充的html
	* @override
	**/
	fillPanel : function(cmd,html){
		if(this.toolbar.fillPanel){
			this.toolbar.fillPanel(cmd,html);
		}else{
			this.toolbarPanel[cmd] = html;
		}
	},
	/**
	* @description
	* 获得JQEditor的属性
	* @return {object} 编辑器属性
	**/
	getAttr : function(){},
	/**
	* @description
	* 使编辑器获得焦点，在编辑区域
	**/
	focus : function(){
		var focusId = this.curId;
		if(this.editorList[focusId]){
			this.editorList[focusId].focus();
		}
	},
	/**
	* @description
	* 锁定编辑器，使编辑器变得不可编辑
	**/
	lock : function(){},
	/**
	* @description
	* 解锁编辑器
	**/
	unlock : function(){},
	/**
	* @description
	* 销毁编辑器
	**/
	destroy : function(Eid){
		if(this.editorList[Eid]){
			this.editorList[deId].destroy();
		}
	},
	/**
	* @description
	* 编辑器核心准备就绪
	* @param {function} callback 回调函数
	**/
	ready : function(callback){
		var self = this, stateChange = '', stateCheck = '';
		
		if(self.state !== 'ready'){
			stateChange = setInterval(function(){
				var coreReady = (
					self.error.ready
					&& self.log.ready
					&& self.load.ready
					&& self.utils.ready
					&& self.command.ready
					&& self.EditorEvent.ready
					&& self.EditorFilter.ready
					&& self.EditorHistory.ready
					&& self.addPlugin.ready
					&& self.addUi.ready
					&& self.dialog.ready
				);
				
				if(coreReady === true){
					self.state = 'ready';
					var ieScript = '';
					ieScript += '<!--[if IE]>';
					ieScript+= '<script type="text/javascript" src="'+self.config.cBase.ieDir+'DOMRange.js?"></script>';
					ieScript+= '<![endif]-->';
					$('head').append(ieScript);
					clearInterval(stateChange);
				}
			},50);
			stateCheck = setInterval(function(){
				if(self.state === 'ready'){
					callback && callback();
					clearInterval(stateCheck);
				}
			},50);
		}else{
			callback && callback();
		}
	},
	getLang:function (path) {
		var lang = {};
		lang = this.lang;
		path = (path || "").split( "." );
		for ( var i = 0, ci; ci = path[i++]; ) {
			lang = lang[ci];
			if ( !lang ){
				break;
			}
		}
		return lang === undefined ? path[path.length-1]: lang ;
	},
	
	// 在工具栏下方显示红色信息条
	errorMessage: function(msg) {
		this.curEditor.error(msg);
	},
	
	// 在工具栏下方显示绿色信息条
	message: function(msg, timeout) {
		this.curEditor.error(msg, 'green', timeout);
	},
	
	// 获取当前编辑的某个对象
	get: function(name){
		switch(name){
			case 'editor':
				return jQEditor.curEditor;
			break;
			case 'list':
				return jQEditor.editorList;
			break;
			case 'window':
				return jQEditor.curEditor.win;
			break;
			case 'document':
				return jQEditor.curEditor.dom;
			break;
			case 'body':
				return jQEditor.curEditor.dom.body;
			break;
		}
	},
	
	$: function(selector){
		return $(selector, this.curEditor.dom);
	},
	
	// 主题的变换目前以加载不同css的方法实现，不能满足同一页面多种风格的需求
	loadCss: function( url ) {
		var link = document.createElement("link");
		
		link.setAttribute('type', 'text/css');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', url);
		
		// 此处必须使用原生的DOM方法加载css文件，不能使用jQuery的append方法加载
		$("head")[0].appendChild(link);
	}
};

//创建编辑器核心对象，并初始化，然后赋值到jquery上
jQEditor.init();
$.jQEditor = jQEditor;

/*******************************************************************/

/**
* @description
* 封装编辑器构造函数为方法
* @param {object} options 编辑器配置参数
* @return {object.<Editor>} 编辑器实例
**/
var editor = function(options){
	jQEditor.trigger('create',{Eid:options.id});
	return new Editor(options);
};
/**
* 单个编辑器
* @constructor
* @param {object} options 编辑器配置参数
**/
function Editor(options){
	var self = this;
	this.state = 'init';
	this.enable = true;
	options.id = options.id ? options.id : 'bkeditor_'+(new Date()).getTime();
	this.Eid = options.id;
	jQEditor.editorList[this.Eid] = this;
	this.config = $.extend(true,{},jQEditor.config,options);
	jQEditor.curEditor = this;
	jQEditor.curId = this.Eid;
	this.pasteToText = false;
	this.pasteToWord = false;
	this.revertList = [];
	this.redoList = [];
	this.cursorElements = {};// 当前元素
	jQEditor.create(this,function(){
		var config = self.config;
		// 将历史，过滤器，事件核心实例化，将实例附加到jQEditor上
		self.baseEvent = new jQEditor.EditorEvent(self);
		self.baseHistory = new jQEditor.EditorHistory(self);
		self.baseFilter = new jQEditor.EditorFilter(self);
		self.pluginEnable = jQEditor.configPlugin(config);
		self.toolbar = new jQEditor.Toolbar(self);
		self.fillPanel();
		// 为编辑器编辑区域内容赋值
		var content = config.oriHtml;
		
		// 在初始化时，对原始内容进行全面过滤
		var finalContent = jQEditor.utils.filterInner(self, content);
		self.dom.body.innerHTML = finalContent;
		$(self.dom.body).css(config.bodyStyle);
		self.baseFilter.excute('dom');
		
		//初始化历史记录的第一个值
		self.baseHistory.setFirstHistory(self.dom.body.innerHTML);
		self.state = 'ready';
		jQEditor.trigger('complete',{Eid:options.id});
		
		// 在外部表单提交时，自动将编辑器内容更新到对应的表单项当中
		$(config.textarea).closest('form').submit(function(){
			$(config.textarea).val(self.getContent());
		});
	});
}
Editor.prototype = {
	pluginEnable : {},
	/**
	* @description
	* 编辑器核心准备就绪
	* @param {function} callback 回调函数
	**/
	ready : function(callback){
		var self = this;
		var stateChange = '',stateCheck = '' ;
		if(self.state !== 'ready'){
			stateCheck = setInterval(function(){
				if(self.state === 'ready'){
					callback();
					clearInterval(stateCheck);
				}
			},50);
		}else{
			callback();
		}
	},
	/**
	* @description
	* 填充插件的面板区域
	**/
	fillPanel : function(){
		try{
			for(var plugin in jQEditor.pluginList){
				jQEditor.pluginList[plugin].fill();
			}
		}catch(ex){
			jQEditor.error.writeError('fill panel error: '+ex.message+(ex.stack ? ex.stack : ''),3,'plugin');
		}
	},

	/**
	* @description
	* 改变某一个编辑器实例的主题
	* 主题以中的css均以.{theme} 开头，这样只需要在改变主题时改变toolbar或是editor的class即可
	* @param {string} theme 主题样式
	* @param {enum}{'editArea'|'toolbar'} position 哪的主题
	**/
	changeTheme : function(theme,position){
		//[TODO]
		if(position !== 'editArea'){
			if(typeof jQEditor.themeList.toolbar[theme] === false){

			}
		}
		if(position !== 'toolbar'){
			if(typeof jQEditor.themeList.editArea[theme] === false){

			}
		}
	},
	
	// 获取编辑器内容
	getContent: function() {
		var html = this.dom.body.innerHTML;
		return jQEditor.utils.filterInner(this, html);
	},
	
	// 设置编辑器内容
	setContent: function( html ) {
		this.dom.body.innerHTML = html;
		this.baseFilter.excute('dom');
	},
	
	// 获取纯文本内容
	getTextContent: function() {
		var textContent = jQEditor.FF ? this.dom.body.textContent : this.dom.body.innerText;
		return textContent;
	},
	
	// 激活编辑器
	enable: function(){
		this.enable = true;
		this.dom.body.contentEditable = true;
	},

	// 禁用编辑器
	disable: function(){
		this.enable = false;
		this.dom.body.contentEditable = false;
	},

	// 执行命令
	execCommand: function(){

	},

	// 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
	queryCommandState: function(){

	},

	// 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
	queryCommandValue: function(){

	},

	/**
	* @description
	* 向光标处插入html代码
	* @param {string} html 要插入的html代码
	**/
	insert: function ( html ) {
		jQEditor.command('insert', html);
	},
	
	// 在工具栏下方显示红色信息条
	error: function(msg, color, timeout) {
		color = color || 'red';
		if ( typeof color === 'number' ) {
			timeout = color;
			color = 'red';
		}
		timeout = timeout || 3000;
		var o = $("#"+this.Eid).find('.bke-message');
		o.stop().text(msg).css({color:color}).fadeIn(200);
		
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			o.fadeOut(100);
		}, timeout);
	},
	
	// 全选编辑区域内容
	selectAll: function() {
		this.dom.execCommand("selectAll");
		this.win.focus();
		return this;
	},
	
	focus: function(){
		this.win.focus();
		return this;
	},
	
	// 获取光标处的元素
	getCursorElement: function() {
		var elsTree = jQEditor.utils.getCurElement();
		return elsTree.pop();
	},
	
	getRange: function() {
		return jQEditor.utils.getSelectionRange(this.win);
	},
	
	getSelectionText: function(){
		var range = jQEditor.utils.getSelectionRange(this.win);
		return range.toString();
	},
	
	insertNode: function(node) {
		var range = jQEditor.utils.getSelectionRange(this.win);
		range.insertNode(node);
	},
	
	setCursor: function(node, start) {
		jQEditor.utils.setCursor(this.win, node, true);
	},
	
	selectNode: function(node) {
		jQEditor.utils.selectNode(this.win, node);
	}
};
//将编辑器实例构造方法复制到jQuery上
$.editor = editor;

jQEditor.ready(function(){
	// 此处必须使用原生的DOM方法加载css文件，不能使用jQuery的append方法加载
	// 主题的变换目前以加载不同css的方法实现，不能满足同一页面多种风格的需求
	
	// console.log("editTheme"+jQEditor.config.editTheme)
	// if(jQEditor.config.editTheme && !jQEditor.themeList.editArea[jQEditor.config.editTheme]){
		// jQEditor.loadCss(jQEditor.config.cBase.skinDir+jQEditor.config.editTheme+'/skin-'+jQEditor.config.editTheme+'.css');
		// jQEditor.themeList.editArea[jQEditor.config.editTheme] = true;
	// }
	
	$('textarea.bkeditor').each(function(i, el){
		var o = $(el)
			, timestamp = (new Date()).getTime()
		var preId = o.attr('id') ? o.attr('id')+'_' : 'bkeditor_';
		var confObj = {
			id : preId+timestamp,
			position : o,
			editWidth : o.css('width'),
			editHeight : o.css('height'),
			oriHtml : o.val()
		}
		if(o.data('toolbar')){
			confObj.toolbar = o.data('toolbar');
		}
		if(o.data('skin')){
			confObj.skin = o.data('skin');
		}
		var newEditor = editor(confObj);
		
		// 将编辑器实例挂到元素对象上
		o.data('editor', newEditor);
	});
});
})(window.jQuery);