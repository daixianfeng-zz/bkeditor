/**
* @fileoverview	
* 面板相关事件
* @author	daixianfeng@hudong.com
* @createTime	2013.01.06
* @editor	
* @updateTime	
* @version	0.6
**/
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