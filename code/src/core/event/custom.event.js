/**
* @fileoverview
* 编辑器自定义事件，添加事件并在指定流程时触发的事件
* 事件类型整理：
*	自定义事件：
*	ready,create,complete,beforeUi,beforePlugin,beforeFilter,afterFilter
*	beforePaste,beforeCommand,afterCommand,afterLoad,active
*	编辑区域事件：
*	@see editarea.event.js
* @author	daixianfeng@hudong.com
* @createTime	2013.01.06
* @editor
* @updateTime
* @version	0.6
**/
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