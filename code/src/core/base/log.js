/**
* @requires core.js , config.js
* @fileoverview
* 日志处理
* 用于记录用户的各种操作，表现。
* 可用于分析用户操作习惯，改进编辑器风格。
* 还可以根据用户操作，配合错误，及时发现bug。
* @author	daixianfeng@hudong.com
* @createTime	2012.11.21
* @editor
* @updateTime
* @version	0.3
**/
(function(E,$){
	var log = {
		enabled : true,
		length : 1,
		sendAddr : '',
		logList : [],
		/**
		* @description
		* 初始化日志处理
		* 确定是否开启日志处理，以及日志记录发送地址
		* @param {object} config 日志处理配置参数
		**/
		initLog : function(config){
			if(config.onLog){
				this.enabled = true;
			}else{
				this.enabled = false;
			}
			this.sendAddr = config.sendAddr;
			this.length = config.length;
		},
		/**
		* @description
		* 记录日志信息
		* @param {string} msg 日志消息
		* @param {string} mod 日志位置
		* @param {string} time 发生记录日志时间
		**/
		writeLog : function(msg,mod,time){
			var curTime = new Date();
			time = time || curTime.toString();
			var logStr = mod+' module "'+msg+'" at '+time;
			this.logList.push(logStr);
			if(this.enabled && window.console){
				window.console.log(logStr);
			}
			if(this.logList.length > this.length){
				this.logList.shift();
			}
		},
		/**
		* @description
		* 发送日志到服务器
		**/
		sendLog : function(){
			var self = this;
			$.ajax({
				type : 'POST',
				url : self.sendAddr,
				data : {logList:self.logList},
				success : function(){
					self.logList = [];
				}
			});
		}
	};
	log.initLog(E.config.cLog);
	log.ready = true;
	E.log = log;
})(window.jQuery.jQEditor,window.jQuery);