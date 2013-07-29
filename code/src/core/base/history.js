/**
* @requires core.js , config.js
* @fileoverview
* 历史记录处理
* 为每一个编辑器实例构建一个历史记录类
* lastHistory为目前的状态，
* 通过目前状态与历史中的状态相比较决定是否记录历史（添加到历史数组中）
* 对于历史的还原与重做需要维护还原和重做数组，可用状态，还有lastHistory
* @author	daixianfeng@hudong.com
* @createTime	2012.11.21
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	/**
	* 编辑历史记录类
	* @constructor
	* @param {object} editor 编辑器实例
	**/
	var History = function(editor){
		this.initHistory(editor);
		this.redoList = [];
		this.revertList = [];
		this.lastRecordTime = +(new Date());
	};
	History.prototype = {
		/**
		* @type {object} 编辑区域的body
		*/
		frameBody : {},
		enabled : true,
		length : 3,
		redoState : false,
		revertState : false,
		/**
		* @description
		* 初始化历史记录
		* @param {object} editor 编辑器实例
		**/
		initHistory : function(editor){
			if(editor.config.cHistory.onHistory){
				this.enabled = true;
			}else{
				this.enabled = false;
			}
			this.length = editor.config.cHistory.times;
			this.frameBody = editor.dom.body;
			this.lastHistory = {historyHtml : editor.config.oriHtml,historySelect : ''};
			this.win = editor.win;
		},
		/**
		 * @description
		 * 置空重做数组
		 **/
		getLastTime : function(){
			return this.lastRecordTime;
		},
		/**
		* @description
		* 置空重做数组
		* @param {string} firstHtml 初始内容
		**/
		setFirstHistory : function(firstHtml){
			this.redoList = [];
			this.revertList = [];
			this.lastHistory = {historyHtml : firstHtml,historySelect : ''};
		},
		/**
		* @description
		* 置空重做数组
		**/
		emptyRedo : function(){
			this.redoList = [];
		},
		/**
		* @description
		* 预记录历史，为历史添加选择状态
		**/
		prepareHistory : function(){
			//为lastHistory添加选择状态
			this.lastHistory.historySelect = E.utils.getSelectionOffset(this.win);
		},
		/**
		* @description
		* 记录历史
		* @param {number} recordLv 记录级别
		* 0：普通级别（默认），1：强制级别
		**/
		recordHistory : function(recordLv){
			recordLv = recordLv ? 1 : 0;
			var isDiff = (this.lastHistory.historyHtml !== this.frameBody.innerHTML);
			var diffLen = this.lastHistory.historyHtml.length - this.frameBody.innerHTML.length;
			if(diffLen > 3 || diffLen < -3 || (isDiff && recordLv===1)){
				var his = {};
				his.historyHtml = this.frameBody.innerHTML;
				if(this.lastHistory){
					this.revertList.push(this.lastHistory);
				}
				this.lastHistory = his;
				if(this.revertList.length > this.length){
					this.revertList.unshift();
				}
				this.emptyRedo();
			}
			this.changeState();
			this.lastRecordTime = +(new Date());
		},
		/**
		* @description
		* 重做
		**/
		redo : function(){
			var content = this.redoList.pop();
			if(content){
				if(this.lastHistory){
					this.revertList.push(this.lastHistory);
				}
				this.lastHistory = content;
				this.frameBody.innerHTML = content.historyHtml;
				E.utils.setSelectionByOffset(this.win,content.historySelect);
				if(this.revertList.length > this.length){
					this.revertList.unshift();
				}
			}
			this.changeState();
		},
		/**
		* @description
		* 还原
		**/
		revert : function(){
			var content = this.revertList.pop();
			if(content){
				if(this.lastHistory){
					this.redoList.push(this.lastHistory);
				}
				this.lastHistory = content;
				this.frameBody.innerHTML = content.historyHtml;
				E.utils.setSelectionByOffset(this.win,content.historySelect);
				if(this.redoList.length > this.length){
					this.redoList.unshift();
				}
			}
			this.changeState();
		},
		/**
		* @description
		* 变更重做与还原图标状态
		**/
		changeState : function(){
			this.redoState = this.redoList.length >0 ? true : false;
			this.revertState = this.revertList.length >0 ? true : false;
		}
	};
	History.ready = true;
	E.EditorHistory = History;
})(window.jQuery.jQEditor);