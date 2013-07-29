/**
* @requires core.js , config.js
* @fileoverview
* 错误处理
* 对错误进行统一处理，一般在catch中调用错误记录
* 可以通过定时或者开关的方式，向服务器发送ajax请求
* 这样可以使用户发现错误，根据用户的操作记录，及时更正错误
* @author	daixianfeng@hudong.com
* @createTime	2012.11.21
* @editor
* @updateTime
* @version	0.3
**/
(function(E,$){
	var error = {
		enabled : true,
		length : 1,
		sendAddr : '',
		errorList : [],
		errorCache : {},
		/**
		* @description
		* 初始化错误处理
		* 确定是否开启错误处理，以及错误报告发送地址
		* @param {object} config 错误处理配置参数
		**/
		initError : function(config){
			if(config.onError){
				this.enabled = true;
			}else{
				this.enabled = false;
			}
			this.sendAddr = config.sendAddr;
			this.length = config.length;
		},
		/**
		* @description
		* 记录错误信息
		* @param {string} msg 错误消息
		* @param {number} level 错误级别
		* @param {string} mod 错误位置
		* @param {string} time 发生错误时间
		**/
		writeError : function(msg,level,mod,time){
			var curTime = new Date();
			time = time || curTime.toString();
			var errorStr = 'level'+level+' error:'+mod+' module "'+msg+'" at '+time;
			this.errorList.push(errorStr);
			if(this.enabled && window.console){
				window.console.error(errorStr);
			}
			for(var i=0;i<this.errorList.length;i++){
				if(this.errorList[i] !== errorStr){
					this.sendError();
					E.log.sendLog();
					this.errorList.shift();
				}
			}
		},
		/**
		* @description
		* 发送错误报告到服务前，连带着发送相关日志
		**/
		sendError : function(){
			var self = this;
			$.ajax({
				type : 'POST',
				url : self.sendAddr,
				data : {errorList:self.errorList},
				success : function(){
					self.errorList = [];
				}
			});
		}
	};

	error.initError(E.config.cError);
	error.ready = true;
	E.error = error;
})(window.jQuery.jQEditor,window.jQuery);