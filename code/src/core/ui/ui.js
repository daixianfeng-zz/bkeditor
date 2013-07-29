/**
* @requires core.js , config.js , command-config.js
* @fileoverview
* 编辑器UI处理
* 用于初始化基础UI，构造新UI，对生成的UI进行配置操作
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
(function(E,$){
	// 不需要 scriptAddr，根据路径规则知道id即可拼出完整路径
	// 所有UI的列表，用于确定要加载的UI的位置和配置
	var cmdConfig = E.config.cCommand;
	var allList = {};
	for(var tmpCmd in cmdConfig.uiCommand){
		var objCmd = cmdConfig.uiCommand[tmpCmd];
		var shortId = objCmd.cmd.replace('dialog','');
		allList[objCmd.cmd] = {isEnable : true,scriptAddr : E.config.cBase.uiDir+shortId+'/'+shortId+'.dialog.js'};
	}/*
	var allList = {
		'colorPanel' : {
			id : 'colorPanel',
			scriptAddr : './core/ui/color/color.panel.js'
		},
		'linkDialog' : {
			id : 'linkDialog',
			scriptAddr : './core/ui/link/link.dialog.js'
		},
		'videoDialog' : {
			id : 'videoDialog',
			scriptAddr : './core/ui/video/video.dialog.js'
		},
		'mapDialog' : {
			id : 'mapDialog',
			scriptAddr : './core/ui/map/map.dialog.js'
		},
		'pastewordDialog' : {
			id : 'pastewordDialog',
			scriptAddr : './core/ui/pasteword/pasteword.dialog.js'
		},
		'imageDialog' : {
			id : 'imageDialog',
			scriptAddr : './core/ui/image/image.dialog.js'
		}
	};*/
	/**
	* @description
	* 加载UI文件
	* @param {string} id UI名称
	* @param {function} callbcak 回调函数
	**/
	E.loadUi = function(id,callback){
		if(allList[id]){
			var addr = allList[id].scriptAddr;
			if(typeof E.uiList[id] === 'undefined'){
				E.load.loadOneFile(addr,function(){callback && callback();});
			}else{
				callback && callback();
			}
		}
	};
	/**
	* UI基类
	* @constructor
	* @param {object} attr UI配置参数
	**/
	function Ui(attr){
		this.html = '';
		
		if(attr){
			for(var one in attr){
				this[one] = attr[one];
			}
			/*
			this.id = attr.id;
			this.isEnable = attr.isEnable;
			this.scriptAddr = attr.scriptAddr;
			*/
		}
	}
	Ui.prototype = {
		initUi : function(){
			this.allList = allList;
			// 该区域用来存放编辑器需要加载的弹窗
			if($(document.body).find('#ui-dialog').length === 0){
				$(document.body).append('<div id="ui-dialog" style="display:none;"></div>');
			}
		},
		//点击确定按钮时，提前验证的方法
		check : function(){
			return true;
		},
		//点击确定按钮
		submit : function(){
			return false;
		},
		//点击取消按钮
		cancel : function(){
			return false;
		},
		// 返回UI的html
		getHtml: function(){
			return this.html;
		},
		
		/**
		* @description
		* ui获取信息
		* @override
		**/
		getValues : function(){
			var data = {}, inputs = $('#'+this.id+' :input');
			inputs.each(function(){
				if (this.name) {
					data[this.name] = $(this).val();
				}
			});
			return data;
		},
		
		/**
		 * @description
		 * 设置ui中的值，被继承重写
		 * @override
		 **/
		setValues : function(args){
			var inputs = $('#'+this.id+' :input');
			inputs.each(function(){
				if ( this.name && typeof args[this.name] !== 'undefinded' ) {
					$(this).val( args[this.name] );
				}
			});
		},
		/**
		* @description
		* 隐藏ui，被继承重写
		* @override
		**/
		hide : function(){

		},
		/**
		* @description
		* 启用UI
		**/
		enable : function(){
			this.isEnable = true;
		},
		/**
		* @description
		* 禁用UI
		**/
		disable : function(){
			this.isEnable = false;
		},
		
		
		// 显示错误提示
		error: function(msg){
			E.dialog.error(msg);
		},
		
		// 显示成功提示
		success: function(msg){
			E.dialog.success(msg);
		},
		
		/**
		* @description
		* 写日志
		* @param {string} opt 操作
		**/
		writeLog : function(opt){
			var msg = 'The operate '+opt+' !';
			var mod = 'ui';
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
			var mod = 'ui';
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
			if(E.lang.UiTips[msg]){
				tips = E.lang.UiTips[msg];
			}else{
				tips = msg;
			}
			E.utils.showTips(tips);
		}
	};
	// 创建UI基础对象，并初始化，然后赋值到编辑器核心对象jQEditor上
	// 将UI的构造函数赋值到编辑器核心对象jQEditor上
	// 将加载UI的方法赋值到编辑器核心对象jQEditor上
	var baseUi = new Ui();
	baseUi.initUi();
	/**
	* @description
	* 初始化UI，实例一个UI，将它挂载到基础UI baseUi下
	* UI的构造函数被挂载到UI构造对象 UiCon下
	* @param {object} obj UI配置参数
	**/
	function addUi(obj){
		try{
			if(obj.id){
				var uiId = obj.id;
				/**
				* 单个Ui
				* @constructor
				* @extends {object.<Ui>}
				* @param {object} attr ui配置参数
				**/
				function Fn(attr){
					Ui.call(this,attr);
				}
				Fn.prototype = baseUi;

				E.uiList[uiId] = new Fn(obj);
				E.uiList[uiId].initUi();
				E.trigger('afterUi');
			}
		}catch(ex){
			E.error.writeError(obj.id+' ui add error: '+ex.message+(ex.stack ? ex.stack : ''),3,'ui');
		}
	}
	//初始化UI的方法被挂载到编辑器核心对象jQEditor上
	addUi.ready = true;
	E.addUi = addUi;
	E.ui = function(id){
		return E.uiList[id];
	}
})(window.jQuery.jQEditor,window.jQuery);