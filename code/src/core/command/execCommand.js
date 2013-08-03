/**
* @requires core.js , config.js , command-config.js
* @fileoverview
* 命令执行
* 执行命令的统一入口，执行命令时，
* 已经在事件中确定了被激活的编辑器，
* 在命令中，对命令进行过滤，转化和分发。
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	/**
	* 命令核心对象
	* @type {object}
	**/
	var coreCommand = {
		initCommand : function(config){
			this.Eid = config.id;
			this.win = E.curEditor.win;
			this.dom = E.curEditor.dom;
			this.startTime = '';
			this.endTime = '';
		},
		/**
		* @description
		* 修改文本样式命令
		* @param {string} cmd 文本样式方法
		* @param {string} value 文本样式修改值
		**/
		editText: function(cmd, value){

		},
		/**
		* @description
		* 光标处插入
		* @param {string} html 插入的html
		**/
		editInsert: function(html){

		},
		/**
		* @description
		* 命令前执行方法，此处没有用事件的方式，而是直接在该方法中触发事件
		* 是想表示该方法可以做更多的独立操作，不需要寄托在事件中。
		**/
		beforeCommand : function(pcmd){
			this.startTime = +(new Date());
			E.trigger('beforeCommand',{targetEditor : E.curEditor , commandName : pcmd});
			this.endTime = +(new Date());
			E.log.writeLog('command '+pcmd+' after excute '+(this.endTime-this.startTime)+'ms','command');
		},
		/**
		* @description
		* 命令前执行方法，此处没有用事件的方式，而是直接在该方法中触发事件
		* 是想表示该方法可以做更多的独立操作，不需要寄托在事件中。
		* @param {string} pcmd 命令方法
		* @param {string} pvalue 命令值（或pluginCommand对应方法对象的参数）
		* @param {object} args uiCommand对应方法对象的参数
		**/
		excuteCommand : function(pcmd,pvalue,args){
			if(E.curEditor.enable === false){
				E.errorMessage('编辑器已禁用');
				return false;
			}
			var self = this;
			this.beforeCommand(pcmd);
			var commandType = '';
			try{
				for(var cmdType in E.config.cCommand){
					var commandName = E.config.cCommand[cmdType];
					if(commandName[pcmd]){
						if(commandName[pcmd].param !== ''){
							if(pvalue){
								args = pvalue;
							}
							pvalue = commandName[pcmd].param;
						}
						if(typeof commandName[pcmd].args !== 'undefined'){
							args = commandName[pcmd].args;
						}
						pcmd = commandName[pcmd].cmd;
						commandType = cmdType;
						break;
					}
				}
			}catch(ex){
				E.error.writeError('command config error: '+ex.message+(ex.stack ? ex.stack : ''),4,'command');
				E.utils.message(E.lang['commandError'],'finish');
			}
			try{
				if(pcmd === ''){
					throw('config cmd no defined');
				}
				if(commandType === 'textCommand'){
					self.editText(pcmd,pvalue);
				}else if(commandType === 'paragraphCommand'){
					self.editParagraph(pcmd,pvalue);
				}else if(commandType === 'insertCommand'){
					self.editInsert(pvalue);
				}else if(commandType === 'pluginCommand'){
					pvalue = pvalue || 'click';
					args = args || '';
					E.utils.execPlugin(pcmd,pvalue,args);
				}else if(commandType === 'uiCommand'){
					pvalue = pvalue || 'submit';
					args = args || '';
					var insertHtml = false;
					E.utils.execUi(pcmd,pvalue,args,function(insertHtml){
						if(insertHtml !== false && typeof insertHtml !== 'undefined'){
							self.editInsert(insertHtml);
						}
					});
				}else{
					throw(E.lang['noCommand']+pcmd);
				}
			}catch(ex){
				E.error.writeError(pcmd+'-'+pvalue+' running error: '+ex.message+(ex.stack ? ex.stack : ''),4,'command');
			}
			this.endTime = +(new Date());
			this.afterCommand(pcmd);
		},
		/**
		* @description
		* 命令后执行方法，此处没有用事件的方式，而是直接在该方法中触发事件
		* 是想表示该方法可以做更多的独立操作，不需要寄托在事件中。
		**/
		afterCommand : function(pcmd){
			E.trigger('afterCommand',{targetEditor : E.curEditor , commandName : pcmd});
			this.endTime = +(new Date());
			E.log.writeLog('command '+pcmd+' after excute '+(this.endTime-this.startTime)+'ms','command');
		}
	};
	
	E.coreCommand = coreCommand;
	E.command = function(cmd,param,args){
		coreCommand.excuteCommand(cmd,param,args);
	};
	E.command.ready = true;
	
})(window.jQuery.jQEditor);