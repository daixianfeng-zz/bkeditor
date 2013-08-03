/**
* @requires core.js , config.js , command-config.js
* @fileoverview
* 事件机制
* 用于绑定浏览器事件，注册取消自定义事件
* 每一个事件都是一个对象，被附加到各个类型当中去
* 每一个编辑器拥有一个索引结构，用来找到事件对象
* @author	daixianfeng@hudong.com
* @createTime	2013.01.05
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	/**
	* 单个事件构造函数
	* @constructor
	* @param {object} attr 事件参数
	**/
	function CustomEvent(attr){
		this.name = attr.name;
		this.type = attr.type;
		this.area = attr.area?attr.area:'custom';
		this.fn = attr.fn;
		this.isEnable = attr.isEnable?attr.isEnable:true;
	}
	/**
	* 事件核心构造函数
	* @constructor
	**/
	function Event(){
		// 编辑区域事件对象
		this.editAreaEvents = {};
		// 自定义事件对象
		this.customEvents = {};
		// 自定义事件列表
		this.customEventList = {};
		this.delegate();
	}

	Event.allList = {};

	Event.prototype = {
		/**
		* @description
		* 添加并初始化一个事件
		* 如果自定义事件列表中没有则向列表中添加，
		* 如果有则将该事件绑定到相应的类型中，如果没有该类型事件，则创建
		* @param {object} attr 事件配置参数
		**/
		addEvent: function(attr) {
			var oneEvent = {};
			if(typeof this.customEventList[attr.name] === 'undefined'){
				oneEvent = new CustomEvent(attr);
			}else{
				oneEvent = this.customEventList[attr.name];
			}
			var len = attr.type.length;
			for(var i=0;i<len;i++){
				if(typeof this.customEvents[attr.type[i]] === 'undefined'){
					this.customEvents[attr.type[i]] = {};
				}
				this.customEvents[attr.type[i]][oneEvent.name] = oneEvent;
			}
			this.customEventList[oneEvent.name] = oneEvent;
		},
		/**
		* @description
		* 启用事件
		* @param {string} name 事件名称
		**/
		bindEvent: function(name) {
			this.customEventList[name].isEnable = true;
		},
		/**
		* @description
		* 禁用事件
		* @param {string} name 事件名称
		**/
		unbindEvent: function(name) {
			this.customEventList[name].isEnable = true;
		},
		/**
		* @description
		* 执行某一类事件
		* @param {string} type 执行事件类型
		* @param {string | undefined} name 执行事件名称
		* @param {object | undefined} arg 执行事件参数
		**/
		triggerEvent : function(type,arg) {
			var exeType = this.customEvents[type];
			//var len = exeType.length;
			for(var name in exeType){
				if(exeType[name].isEnable !== false){
					exeType[name].fn(arg);
				}
			}
		},
		/**
		* @description
		* 移除事件类型
		* @param {string} type 事件类型

		removeEvent: function(type) {
			var listeners = this._listener[type];
			if (listeners instanceof Array) {
				if (typeof key === "function") {
					for (var i=0, length=listeners.length; i<length; i+=1){
						if (listeners[i] === listener){
							listeners.splice(i, 1);
							break;
						}
					}
				} else if (key instanceof Array) {
					for (var lis=0, lenkey = key.length; lis<lenkey; lis+=1) {
						this.removeEvent(type, key[lenkey]);
					}
				} else {
					delete this._listener[type];
				}
			}
			return this;
		},**/

		/**
		注册整个浏览器事件
		**/
		delegate : function(){

		}
	};

	var coreEvent = new Event(E.config);

	/**
	* @description
	* 执行某一类型事件
	* @param {string} type 事件类型
	* @param {object | undefined} arg 执行参数
	**/
	E.trigger = function(type, arg) {
		var bool = true, exeType = coreEvent.customEvents[type];
		if( exeType ){
			for(var name in exeType){
				if(exeType[name] && exeType[name].isEnable !== false){
					try{
						if(arg && arg.targetEditor && arg.targetEditor.baseEvent){
							var config = arg.targetEditor.baseEvent.eventConfig;
							if(config[exeType[name]] !== false){
								if (false === exeType[name].fn(arg)){
									bool = false;
								}
							}
						}else{
							if (false === exeType[name].fn(arg)){
								bool = false;
							}
						}
					}catch(ex){
						E.error.writeError(type+'type-name'+name+' event error: '+ex.message+(ex.stack ? ex.stack : ''),4,'event');
					}
				}
			}
		}
		return bool;
	};
	/**
	* 编辑器实例关联的事件基类
	* @constructor
	* @param {object} editor 编辑器实例
	**/
	function EditorEvent(editor){
		try{
			this.editWin = editor.win;
			this.editDom = editor.dom;
			this.Eid = editor.config.id;
			this.curEditor = editor;
			this.customEvents = {};
			this.editAreaEvents = {};
			this.blackList = editor.config.cEvent.blackList;
			this.eventConfig = {};
			E.listenEditarea(this.curEditor);
			E.listenEditareaExt(this.curEditor);
			this.refreshList();
		}catch(ex){
			E.error.writeError('editor event init error: '+ex.message+(ex.stack ? ex.stack : ''),5,'event');
			E.utils.message(E.lang['initError'],'finish');
		}
	}

	EditorEvent.prototype = {
		/**
		* @description
		* 添加事件，将已知事件绑定到指定类型下面，涉及其他编辑器实例
		* @param {string} name 事件名称
		* @param {string} type 事件类型
		**/
		add : function(type,name){
			var attr = {
				name : name,
				type : type
			};
			coreEvent.addEvent(attr);
		},
		/**
		* @description
		* 查找事件
		* @param {string} name 事件名称
		* @param {string} type 事件类型
		* @return {number | boolean} 是否找到,找到返回索引，没找到返回false
		**/
		_findEvent : function(type,name){
			if(typeof this.customEvents[type] !== 'undefined'){
				var len = this.customEvents[type].length;
				for(var i=0;i<len;i++){
					if(name === this.customEvents[type][i]){
						return i;
					}
				}
			}
			return false;
		},
		/**
		* @description
		* 移除事件，涉及其他编辑器实例的事件
		* @param {string} name 事件名称
		* @param {string} type 事件类型
		**/
		remove : function(type,name){
			try{
				if(type === '*'){
					if(name === '*'){
						for(var tmpType in coreEvent.customEvents){
							coreEvent.customEvents[tmpType] = {};
						}
					}else{
						for(var tmpType in coreEvent.customEvents){
							coreEvent.customEvents[tmpType][name] = undefined;
						}
					}
				}else{
					if(name === '*'){
						coreEvent.customEvents[type] = {};
					}else{
						coreEvent.customEvents[type][name] = undefined;
					}
				}
			}catch(ex){
				E.error.writeError(type+' type - '+name+' remove error: '+ex.message+(ex.stack ? ex.stack : ''),3,'event');
			}
		},
		/**
		* @description
		* 禁用事件，不涉及其他编辑器实例
		* @param {string} name 事件名称
		* @param {string} type 事件类型
		**/
		disable : function(type,name){
			try{
				var index = '';
				if(type === '*'){
					if(name === '*'){
						for(var tmpType in this.customEvents){
							this.customEvents[tmpType] = [];
						}
					}else{
						for(var tmpType in this.customEvents){
							index = this._findEvent(tmpType,name);
							if(index !== false){
								this.customEvents[tmpType].splice(index,1);
							}
						}
					}
				}else{
					if(name === '*'){
						this.customEvents[type] = [];
					}else{
						index = this._findEvent(type,name);
							if(index !== false){
								this.customEvents[type].splice(index,1);
							}
					}
				}
			}catch(ex){
				E.error.writeError(type+' type - '+name+' disable error：'+ex.message+(ex.stack ? ex.stack : ''),3,'event');
			}
		},
		/**
		* @description
		* 启用事件，不涉及其他编辑器实例
		* '*'为全部，可以是全部类型下的某一个事件，也可以是某个类型下的全部事件
		* @param {string} name 事件名称
		* @param {string} type 事件类型
		**/
		enable : function(type,name){
			try{
				var index = '';
				if(type === '*'){
					if(name === '*'){
						for(var tmpType in coreEvent.customEvents){
							var len = coreEvent.customEvents[tmpType].length;
							for(var i=0;i<len;i++){
								index = this._findEvent(tmpType,coreEvent.customEvents[tmpType][i].name);
								if(index === false){
									this.customEvents[tmpType].push(coreEvent.customEvents[tmpType][i].name);
								}
							}
						}
					}else{
						if(typeof coreEvent.customEventList[name] !== 'undefined'){
							for(var tmpType in coreEvent.customEvents){
								index = this._findEvent(tmpType,name);
								if(index === false){
									this.customEvents[tmpType].push(name);
								}
							}
						}
					}
				}else{
					if(name === '*'){
						var len = coreEvent.customEvents[type].length;
						for(var i=0;i<len;i++){
							index = this._findEvent(type,coreEvent.customEvents[type][i].name);
							if(index === false){
								this.customEvents[type].push(coreEvent.customEvents[type][i].name);
							}
						}
					}else{
						index = this._findEvent(type,name);
						if(index === false){
							if(typeof coreEvent.customEventList[name] !== 'undefined'){
								this.customEvents[type].push(name);
							}
						}
					}
				}
			}catch(ex){
				E.error.writeError(type+' type - '+name+' enabel error '+ex.message+(ex.stack ? ex.stack : ''),3,'event');
			}
		},
		/**
		* @description
		* 刷新事件，根据已有的事件，和配置文件
		* 将可用的事件添加到其中
		**/
		refreshList : function(){
			try{
				this.customEvents = {};
				this.eventConfig = {};
				for(var tmpType in coreEvent.customEvents){
					var typeList = coreEvent.customEvents[tmpType];
					if(typeof this.customEvents[tmpType] === 'undefined'){
						this.customEvents[tmpType] = [];
					}
					for(var tmpName in typeList){
						this.customEvents[tmpType].push(tmpName);
						this.eventConfig[tmpName] = true;
					}
				}
				var len = this.blackList.length;
				for(var i=0;i<len;i++){
					var black = this.blackList[i].split('.');
					this.disable(black[0],black[1]);
				}
			}catch(ex){
				E.error.writeError('event refresh error: '+ex.message+(ex.stack ? ex.stack : ''),4,'event');
			}
		}

	};
	EditorEvent.ready = true;
	E.EditorEvent = EditorEvent;
	
	// 支持两种事件绑定方式
	E.addEvent = function( attr ){
		coreEvent.addEvent( attr );
	};
	
	E.bind = function(name, type, fn) {
		if ( typeof type === 'string' ) {
			type = [type];
		}
		
		coreEvent.addEvent( {
			name: name, type: type, fn:fn
		} );
	}
})(window.jQuery.jQEditor);