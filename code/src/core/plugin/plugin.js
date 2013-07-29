/**
* @requires core.js , config.js , command-config.js
* @fileoverview
* 编辑器插件处理
* 用于初始化基础插件，构造新插件，对生成的插件进行配置操作
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	// 不需要 scriptAddr，根据路径规则知道id即可拼出完整路径
	// 所有插件的列表，用于确定要加载的插件的位置和配置
	var cmdConfig = E.config.cCommand;
	var allList = {};
	for(var tmpCmd in cmdConfig.pluginCommand){
		var objCmd = cmdConfig.pluginCommand[tmpCmd];
		allList[objCmd.cmd] = {htmlCmd : tmpCmd,isEnable : true,scriptAddr : E.config.cBase.pluginDir+objCmd.cmd+'.plugin.js'};
	}
	/*
	var allList = {
		'forecolormenu' : {
			isEnable : true,
			scriptAddr : './core/plugin/forecolor.plugin.js'
		},
		...
	};*/

	/**
	* @description
	* 加载插件文件
	* @param {string} id 插件名称
	* @param {function} callback 回调函数
	**/
	E.loadPlugin = function(id,callback){
		var addr = allList[id].scriptAddr;
		if(typeof E.pluginList[id] === 'undefined'){
			E.load.loadOneFile(addr,function(){callback && callback();});
		}else{
			callback && callback();
		}
	};
	/**
	* 插件基类
	* @constructor
	* @param {object} attr 插件配置参数
	**/
	function Plugin(attr){
		this.ui = '';
		
		if(attr){
			for(var one in attr){
				this[one] = attr[one];
			}
			var o = Plugin.allList[this.id];
			if( !o ) {
				alert('添加插件之后，还需要到command-conig.js进行注册喲');
			}
			o.title = E.getLang(this.id);
			o.isEnable = this.isEnable;
			this.htmlCmd = o.htmlCmd;
			for(var edit in E.editorList){
				if(typeof E.editorList[edit].pluginEnable[this.id] === 'undefined'){
					E.editorList[edit].pluginEnable[this.id] = this.isEnable;
				}
			}
			this.fill();
		}
	}
	Plugin.allList = allList;
	/**
	* @description
	* 为所有编辑器实例配置插件
	* 根据白名单和黑名单，且优先级更高
	* @param {object} config 插件配置对象
	* @return {object} 插件启用情况对象
	**/
	E.configPlugin = function(config){
		try{
			var pluginEnable = {};
			for(var one in Plugin.allList){
				if(Plugin.allList[one].isEnable === 'undefined'){
					pluginEnable[one] = Plugin.allList[one].isEnable;
				}else{
					pluginEnable[one] = true;
				}
			}
			// 在白名单中出现的均为启用，在黑名单中出现的均为禁用
			// 在白名单黑名单中都出现的为启用，其余为插件中编写的默认情况
			var blackList = config.cPlugin.blackList,
				whiteList = config.cPlugin.whiteList;
			var blackLen = blackList.length,whiteLen = whiteList.length;
			for(var i=0;i<blackLen;i++){
				pluginEnable[blackList[i]] = false;
			}
			for(var i=0;i<whiteLen;i++){
				pluginEnable[whiteList[i]] = true;
			}
			return pluginEnable;
		}catch(ex){
			E.error.writeError('plugin config error: '+ex.message+(ex.stack ? ex.stack : ''),3,'plugin');
		}
	};
	Plugin.prototype = {
		/**
		* @description
		* 初始化插件核心
		**/
		initPlugin : function(){

		},
		/**
		* @description
		* 初始化单个插件，被继承重写
		**/
		init : function(){
			var uiId = this.id+'dialog';
			if(this.type === 'dialog'){
				setTimeout(function(){
					E.loadUi(uiId);
				},0);
			}
		},
		/**
		* @description
		* 插件点击，被继承重写
		* 默认为打开相应的ui弹窗，或面板
		* @override
		**/
		click : function(){
			if(this.type === 'panel'){
				E.toolbar.togglePanel(this.htmlCmd);
			}else if(this.type === 'dialog' && this.showDialog){
				this.showDialog(E.curEditor);
			}
		},
		
		/**
		 * 获取插件相关的值，需重写
		 * @return null
		 */
		getData: function (editor) {
			return {};
		},
		
		/**
		 * 弹窗
		 * @return null
		 */
		showDialog: function(editor) {
			var self = this;
			E.dialog.open({
				id: self.ui,
				editor: editor.Eid,
				title: self.title,
				//content: E.utils.execUi(self.ui,'getHtml'),
				content: E.uiList[self.ui].getHtml(),
				
				ok: function() {
					if ( self.check() ) {
						E.dialog.revertSelection();
						E.command(self.ui);
					} else {
						return false;
					}
				},
				cancel: function(){
					E.dialog.close(self.ui);
				}
			
			// data对象的值，会根据key被自动赋值到弹窗上name=key的表单项里
			// 比如，data={content:'内容'}，则“内容”会被赋值到name="content"的表单项
			}, self.getData(editor));
		},
		
		/**
		 * 检查插件命令是否可以正常执行，默认true
		 * @return boolean 
		 */
		check: function(){
			return true;
		},
		/**
		* @description
		* 插件填充，被继承重写
		* 默认为无填充
		* @override
		**/
		fill : function(){

		},
		/**
		* @description
		* 启用插件
		* @param {object.<Editor>} curEditor 启用插件的编辑器
		**/
		enable : function(curEditor){
			if(!curEditor){
				curEditor = E.curEditor;
			}
			curEditor.pluginEnable[this.id] = true;
		},
		/**
		* @description
		* 禁用插件
		* @param {object.<Editor>} curEditor 禁用插件的编辑器
		**/
		disable : function(curEditor){
			if(!curEditor){
				curEditor = E.curEditor;
			}
			curEditor.pluginEnable[this.id] = false;
		},
		/**
		* @description
		* 获得标题
		**/
		getTitle : function(){
			return E.lang.pluginTitle[this.title];
		},
		/**
		* @description
		* 写日志
		* @param {string} opt 操作
		**/
		writeLog : function(opt){
			var msg = 'The operate '+opt+' !';
			var mod = 'plugin';
			var date = new Date();
			var time = date.toLocaleString();
			E.log.writeLog(msg,mod,time);
		},
		/**
		* @description
		* 写错误
		* @param {string} opt 操作
		* @param {number} level 错误级别
		**/
		writeError : function(opt,level){
			var msg = 'The operate '+opt+' error !';
			var mod = 'plugin';
			var date = new Date();
			var time = date.toLocaleString();
			E.error.writeError(msg,level,mod,time);
		},
		/**
		* @description
		* 显示提示信息
		* @param {string} msg 提示信息
		**/
		showTips : function(msg){
			var tips = '';
			if(!msg){
				msg = this.tips;
			}
			if(E.lang.pluginTips[msg]){
				tips = E.lang.pluginTips[msg];
			}else{
				tips = msg;
			}
			E.utils.showTips(tips);
		},
		
		/**
		 * 加载插件相关UI
		 *
		 */
		loadUiTpl: function(callback) {
			E.utils.loadDialog(this.id, E.config.cBase.uiDir+this.id+'/', callback);
		},
		
		clicked: function( on, id ) {
			id = id || this.id;
			var o = E.curEditor.$toolbar;
			
			o.find('#icon-'+id).closest('.bke-btn')[on?'addClass':'removeClass']('bke-clicked');
		}
	};
	//创建插件基础对象，并初始化，然后赋值到编辑器核心对象jQEditor上
	//将插件的构造函数赋值到编辑器核心对象jQEditor上
	//将加载插件的方法赋值到编辑器核心对象jQEditor上
	var basePlugin = new Plugin();
	basePlugin.initPlugin();
	/**
	* @description
	* 初始化插件，实例一个插件，将它挂载到基础插件 basePlugin下
	* 插件的构造函数被挂载到插件构造对象 pluginCon下
	* @param {object} obj 插件配置参数
	**/
	function addPlugin(obj){
		try{
			if(obj.id){
			//	var pluginAttr = {};
				var pluginId = obj.id;
			//	var objPluginInterface = obj.id;
				/**
				* 单个插件
				* @constructor
				* @extends {object.<Plugin>}
				* @param {object} attr 插件配置参数
				**/
				function Fn(attr){
					Plugin.call(this,attr);
				}
				Fn.prototype = basePlugin;

				E.pluginList[pluginId] = new Fn(obj);
				E.pluginList[pluginId].init();
				E.trigger('afterPlugin');
			}
		}catch(ex){
			E.error.writeError(obj.id+' plugin add error: '+ex.message+(ex.stack ? ex.stack : ''),3,'plugin');
		}
	}
	//初始化插件的方法被挂载到编辑器核心对象jQEditor上
	addPlugin.ready = true;
	E.addPlugin = addPlugin;
	E.plugin = function(id){
		return E.pluginList[id];
	}
})(window.jQuery.jQEditor);