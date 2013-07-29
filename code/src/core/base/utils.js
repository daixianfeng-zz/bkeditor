/**
* @requires core.js , config.js , command-config.js
* @fileoverview
* 基础函数库
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
(function(E,$){
	var utils = {
		/**
		 * @type {string} 空的文本占位符
		 */
		spaceText : E.IE6 ? '\ufeff' : '\u200B',
		/**
		 * @description 查看节点在父元素中的位置
		 * @param {object.<node>} node 待查看节点
		 * @return {number} 位置索引
		 */
		nodeIndex: function (node) {
			for (var i = 0; node = node.previousSibling; i++) {
				continue;
			}
			return i;
		},
		showTips : function(tips){
			$('#'+E.curId+' .tips').html(tips);
			$('#'+E.curId+' .tips').show();
		},
		/**
		* @description
		* 获得当前光标所在位置的节点
		* @return {array} 当前光标所在位置的节点
		**/
		getCurElement : function(){
			try{
				var elementList = [];
				var curSelect = E.curEditor.win.getSelection();
				if(curSelect.type === 'None'){
					var selRange = E.curEditor.dom.createRange();
					selRange.selectNodeContents(E.curEditor.dom.body);
					selRange.collapse(false);
					curSelect.addRange(selRange);
				}
				var range = curSelect.getRangeAt(0);
				if(range === null){
					E.log.writeLog('get no Element');
				}else{
					var curElement = range.startContainer;
					while(curElement.nodeName && curElement.nodeName !== 'HTML' && curElement !== E.curEditor.dom){
						elementList.unshift(curElement);
						curElement = curElement.parentNode;
					}
					
					// 如果点击的是单标签元素（如img），则将其加入到元素列表
					
					var elem, container = range.commonAncestorContainer;
					if (!range.collapsed 
						&& range.startContainer === range.endContainer 
						&& range.startOffset - range.endOffset < 2
						&& range.startContainer.hasChildNodes()
					){
						elem = range.startContainer.childNodes[range.startOffset];
					}
					while (elem && elem.nodeType == 3 && elem.parentNode) {
						elem = elem.parentNode;
					}
					
					if (elem && elem !== elementList[elementList.length - 1]) {
						elementList.push(elem);
					}
				}
				
				return elementList;
			}catch(ex){
				E.error.writeError('getElement error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		 * @description
		 * 获得选中节点偏移量，为还原准备
		 * @param {object} win 执行在的window区域
		 * @return {array} 当前光标所在位置的节点
		 **/
		getSelectionOffset : function(win){
			try{
				var offsetList = {start:[],end:[]};
				win.focus();
				var curSelect = win.getSelection();
				if(curSelect.type === 'None'){
					var selRange = win.document.createRange();
					selRange.selectNodeContents(win.document.body);
					selRange.collapse(false);
					curSelect.addRange(selRange);
				}
				var sRange = curSelect.getRangeAt(0);
				var curStartElement = sRange.startContainer,
					curEndElement = sRange.endContainer;
				offsetList['start'].unshift(sRange.startOffset);
				offsetList['end'].unshift(sRange.endOffset);
				while(curStartElement.nodeName && curStartElement.nodeName !== 'BODY' && curStartElement !== win.document){
					var startIndex = this.nodeIndex(curStartElement);
					offsetList['start'].unshift(startIndex);
					curStartElement = curStartElement.parentNode;
				}
				while(curEndElement.nodeName && curEndElement.nodeName !== 'BODY' && curEndElement !== win.document){
					var endIndex = this.nodeIndex(curEndElement);
					offsetList['end'].unshift(endIndex);
					curEndElement = curEndElement.parentNode;
				}
				return offsetList;
			}catch(ex){
				E.error.writeError('getSelectionOffset error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		 * @description
		 * 根据节点偏移量还原选中区域
		 * @param {object} win 执行在的window区域
		 **/
		setSelectionByOffset : function(win,oriOffsetList){
			try{
				win.focus();
				var offsetList = [];
				$.extend(true,offsetList,oriOffsetList)
				var dom = win.document;
				var startIndex = offsetList['start'].shift(),
					endIndex = offsetList['end'].shift();
				var startContainer = dom.body,endContainer = dom.body,startOffset = 0,endOffset = 0;
				var tmpStartContainer = dom.body.childNodes[startIndex],
					tmpEndContainer = dom.body.childNodes[endIndex];
				while(1){
					if(!tmpStartContainer){
						startOffset = 0;
						break;
					}
					startContainer = tmpStartContainer;
					startIndex = offsetList['start'].shift();
					if(typeof startIndex !== 'undefined'){
						if(tmpStartContainer.nodeType === 3){
							if(tmpStartContainer.nodeValue.length > startIndex){
								startOffset = startIndex;
							}else{
								startOffset = tmpStartContainer.nodeValue.length;
							}
							break;
						}else{
							if(tmpStartContainer.childNodes.length > startIndex){
								tmpStartContainer = tmpStartContainer.childNodes[startIndex];
								startOffset = startIndex;
							}else{
								startOffset = tmpStartContainer.childNodes.length;
								tmpStartContainer = tmpStartContainer.lastChild;
							}
						}
					}else{
						break;
					}
				}
				while(1){
					if(!tmpEndContainer){
						endOffset = 0;
						break;
					}
					endContainer = tmpEndContainer;
					endIndex = offsetList['end'].shift();
					if(typeof endIndex !== 'undefined'){
						if(tmpEndContainer.nodeType === 3){
							if(tmpEndContainer.nodeValue.length > endIndex){
								endOffset = endIndex;
							}else{
								endOffset = tmpEndContainer.nodeValue.length;
							}
							break;
						}else{
							if(tmpEndContainer.childNodes.length > endIndex){
								tmpEndContainer = tmpEndContainer.childNodes[endIndex];
								endOffset = endIndex;
							}else{
								endOffset = tmpEndContainer.childNodes.length;
								tmpEndContainer = tmpEndContainer.lastChild;
							}
						}
					}else{
						break;
					}
				}
				var curSelect = win.getSelection();
				if(curSelect.type !== 'None'){
					curSelect.removeAllRanges();
				}
				var selRange = dom.createRange();
				selRange.setStart(startContainer,startOffset);
				selRange.setEnd(endContainer,endOffset);
				curSelect.addRange(selRange);
			}catch(ex){
				E.error.writeError('setSelectionByOffset error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		* @description
		* 获得节点所在的dom片段，如果node本身就是dom片段类型，则将node变为body
		* @param {object.<node>} node 待查找节点
		* @return {object.<#document>} 节点所在的document对象
		**/
		getNodeDom : function(node){
			if(node.nodeType === 9){
				node = node.body;
			}
			return {dom:node.ownerDocument,node:node};
		},
		/**
		* @description
		* 弹出消息
		* @param {string} msg 弹出的消息内容
		* @param {boolean} isEnd 是否终止该执行程序
		**/
		message : function(msg , isEnd){
			E.dialog.open({
				id:'error',
				content:msg,
				title:'Error tips'
			});
			if(isEnd){
				throw(E.lang['unexpectedEnd']);
			}
		},
		/**
		* @description
		* 执行插件命令
		* @param {string} pcmd 插件命令名称
		* @param {string} pvalue 插件方法名称
		* @param {object} arg 命令参数,对应html中的arg属性，一般只能带一个字符串参数
		**/
		execPlugin : function(pcmd,pvalue,arg){
			function _exec() {
				var plugin = E.pluginList[pcmd];
				if(E.curEditor.pluginEnable[pcmd]){
					if(typeof plugin[pvalue] === 'function'){
						return plugin[pvalue](arg);
					}else{
						return plugin['click'](pvalue);
					}
				} else {
					E.messageError('plugin '+pcmd+' disabled!');
				}
			}
			
			if ( E.pluginList[pcmd] ) {
				return _exec();
			} else {
				E.loadPlugin(pcmd, _exec);
			}
		},
		/**
		* @description
		* 执行ui命令
		* @param {string} pcmd ui命令名称
		* @param {string} pvalue ui方法名称
		* @param {object} args 命令参数
		* @param {function} callback 回调函数
		**/
		execUi : function(pcmd,pvalue,args,callback){
			var insertHtml = '';
			if(E.uiList[pcmd]){
				insertHtml = E.uiList[pcmd][pvalue](args);
				if(insertHtml && callback){
					callback(insertHtml);
				}
			}else{
				E.loadUi(pcmd,function(){
					insertHtml = E.uiList[pcmd][pvalue](args);
					if(insertHtml && callback){
						callback(insertHtml);
					}
				});
			}
		},
		/**
		* @description
		* 将html字符串转化为node节点
		* @param {string} fromString 传入待转换字符串
		* @param {object.<node> | undefined} toNode 返回节点
		**/
		stringToNode : function(fromString,toNode){
			if(typeof toNode === 'undefined'){
				toNode = document.createElement('div');
			}
			toNode.innerHTML = fromString;
			return toNode;
		},
		/**
		* @description
		* 过滤将传入的html字符串，经过html和dom双重过滤
		* @param {object.<editor>} exeditor 过滤编辑器实例
		* @param {string} fromString 传入待转换字符串
		**/
		filterInner : function(exeditor,fromString){
			try{
				var fliterContent = exeditor.baseFilter.excute('html',fromString);
				var filterNode = this.stringToNode(fliterContent);
				var finalContent = exeditor.baseFilter.excute('beforeInsert',filterNode).innerHTML;
				return finalContent;
			}catch(ex){
				E.error.writeError('filterInner error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		* @description
		* 加载对话框
		* @param {string} dialogId 对话框id
		* @param {string} dialogAddr 对话框地址
		* @param {function} callback 回调函数
		**/
		loadDialog : function(dialogId,dialogAddr,callback){
			if(typeof E.uiList[dialogId+'dialog'] === 'undefined'){
				E.loadUi(dialogId+'dialog',function(){});
			}
			if(typeof dialogAddr !== 'undefined'){
				var htmlAddr = dialogAddr+dialogId+'.dialog.json';
				var dialogSelector = '[ui='+dialogId+']';
				if($(dialogSelector).length === 0){
					if(typeof E.dialogHtml[dialogId+'dialog'] === 'undefined'){
						E.load.loadOneFile(htmlAddr,function(){
							var dialogHtml = E.dialogHtml[dialogId+'dialog'];
							$('#ui-dialog').append(dialogHtml);
							callback && callback();
						});
					}else{
						var dialogHtml = E.dialogHtml[dialogId+'dialog'];
						$('#ui-dialog').append(dialogHtml);
						callback && callback();
					}
				}else{
					callback && callback();
				}
			}
			
		},
		/**
		* @description
		* 获取选中区域的纯文本信息
		* @return {string} 纯文本
		**/
		getSelectionText :function () {
			try{
				var sRange = E.curEditor.win.getSelection().getRangeAt(0);
				return sRange.toString();
			}catch(ex){
				E.error.writeError('getText error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		 * @description
		 * 删除选中区域选中情况
		 * @param win {object} 待处理区域的window对象
		 **/
		removeSelection :function (win) {
			try{
				win.getSelection().removeAllRanges();
			}catch(ex){
				E.error.writeError('removeSelection error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		 * @description
		 * 设置光标位置
		 * @param win {object} 待处理区域的window对象
		 * @param node {object} 光标要设置到的节点
		 * @param start {boolean} 设置在节点头还是尾
		 **/
		setCursor :function (win,node,start) {
			try{
				/*如果为占位符节点一定要设置start的值为true，否则会报错*/
				start = start ? true : false;
				var selRange = {};
				var curSelection = win.getSelection();
				if(curSelection.rangeCount === 0){
					selRange = win.document.createRange();
				}else{
					selRange = curSelection.getRangeAt(0);
				}
				selRange.selectNodeContents(node);
				selRange.collapse(start);
				curSelection.removeAllRanges();
				curSelection.addRange(selRange);
			}catch(ex){
				E.error.writeError('setCursor error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		 * @description
		 * 获得选中区域的范围，没有则设置在文档头
		 * @param win {object} 待处理区域的window对象
		 * @param depend {string} 'node'|'range' 根据节点还是范围,在chrome下range会执行维护，ie不会
		 **/
		getSelectionRange :function (win,depend) {
			try{
				var curSelection = win.getSelection(),selRange = {};
				if(curSelection.type !== 'None'){
					selRange = curSelection.getRangeAt(0);
				}else{
					var newRange = win.document.createRange();
					newRange.selectNodeContents(win.document.body);
					newRange.collapse(true);
					curSelection.addRange(newRange);
					selRange = curSelection.getRangeAt(0);
				}
				if(depend === 'node'){
					selRange = {
						startContainer : selRange.startContainer,
						startOffset : selRange.startOffset,
						endContainer : selRange.endContainer,
						endOffset : selRange.endOffset
					};
				}
				return selRange;
			}catch(ex){
				E.error.writeError('getSelectionRange error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		 * @description
		 * 根据范围设置选中区域,没有范围则设置到文档头处
		 * @param win {object} 待处理区域的window对象
		 * @param range {object} 要选中的范围
		 **/
		setSelectionRange :function (win,range,depend) {
			try{
				var selRange = {};
				if(typeof range !== 'object'){
					selRange = win.document.createRange();
					selRange.selectNodeContents(win.document.body);
					selRange.collapse(true);
				}else if(depend === 'node'){
					selRange = win.document.createRange();
					selRange.setStart(range.startContainer,range.startOffset);
					selRange.setEnd(range.endContainer,range.endOffset);
				}else{
					selRange = range;
				}
				var curSelection = win.getSelection();
				curSelection.removeAllRanges();
				curSelection.addRange(selRange);
			}catch(ex){
				E.error.writeError('setSelectionRange error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		* @description
		* 向光标处添加html代码
		* @param {string} html 要插入的html代码
		**/
		pasteHTML:function ( html ) {
			E.coreCommand.editInsert(html);
		},

		/**
		 * @description
		 * 将剪贴板的内容放到DOM节点上，获取内容进行处理后再放到编辑区域中
		 * 获得剪贴板中的内容
		 * @param {object} curEditor 编辑器实例
		 * @param {function} callback 获取数据后的回调函数
		 **/
		getBoardContent:function (curEditor,callback) {
			var win = curEditor.win , dom = curEditor.dom;
			var domContainer = dom.createElement('div');
			domContainer.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;";
			domContainer.innerHTML = this.spaceText;
			if(false){
				/*ie中也不使用操作剪贴板，剪贴板只能处理纯文本
				* 统一使用在编辑区域的一块新区域上设置光标，等待插入结束
				* 然后将插入内容再经过处理后放在原来应该在的位置上
				* */
			}else{
				try{
					var oriRange = win.getSelection().getRangeAt(0).cloneRange();
					var insertRange = win.getSelection().getRangeAt(0);
					insertRange.setStart(dom.body,0);
					insertRange.collapse(true);
					insertRange.surroundContents(domContainer);
					insertRange.selectNodeContents(domContainer);
					insertRange.collapse(true);
					win.getSelection().removeAllRanges();
					win.getSelection().addRange(insertRange);
				}catch(ex){
					E.error.writeError('getBoardContent error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
				}
				/*
				//等待同步过程将数据插入到光标处（即容器节点中）
				$(domContainer).bind('change',function(){
					alert(3);
					win.getSelection().removeAllRanges();
					win.getSelection().addRange(oriRange);
					callback(domContainer);
					$(domContainer).unbind('change');
					dom.body.removeChild(domContainer);
				});
				*/
				setTimeout(function(){
					win.getSelection().removeAllRanges();
					win.getSelection().addRange(oriRange);
					callback && callback(domContainer);
					dom.body.removeChild(domContainer);
				},0);
			}
		},
		
		/**
		* @description
		* 将选中区域的文本，替换成新文本
		* 如果选中区域不在同一个文本节点中，则不替换
		* @param {string} newText 新文本
		*/
		replaceSelectedText : function(win,newText){
			try{
				var curSelection = win.getSelection(),selRange = {};
				if(curSelection.type !== 'None'){
					selRange = curSelection.getRangeAt(0);
					if(selRange.startContainer.nodeType === 3 && selRange.startContainer === selRange.endContainer){
						var textParent = selRange.startContainer.parentNode;
						var textFrag = selRange.extractContents();
						textFrag.firstChild.nodeValue = newText;
						selRange.insertNode(textFrag);
						E.curEditor.baseFilter.excuteOne('combine',textParent);
					}else{
						return false;
					}
				}else{
					return false;
				}
			}catch(ex){
				E.error.writeError('replaceSelectedText error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		/**
		* @description
		* 使一个节点处于选中状态
		* @param {object} win 选中区的window对象
		* @param {object.<node>} node 带选中节点
		**/
		selectNode : function(win,node){
			try{
				var selRange = {};
				var dom = typeof node === 'object' ? node.ownerDocument : doucment;
				if(dom === win.document){
					selRange = dom.createRange();
					if(typeof node !== 'object'){
						selRange.selectNodeContents(dom.body);
						selRange.collapse(true);
					}else{
						selRange.selectNode(node);
					}
					var curSelection = win.getSelection();
					curSelection.removeAllRanges();
					curSelection.addRange(selRange);
				}
			}catch(ex){
				E.error.writeError('selectNode error: '+ex.message+(ex.stack ? ex.stack : ''),3,'utils');
			}
		},
		
		//new API function
		/**
		* @description
		* 新API函数需求书写规范，在此处添加函数
		* 说明详细功能，输入输出，记得加上[TODO]说明待实现
		* @param {string} arg1 参数1
		* @param {string} arg2 参数2
		* @return {string} 返回值
		**/
		newApi : function(arg1,arg2){
			alert(arg1+arg2);
			//[TODO] 输出arg1+arg2
		},
		
		
		/**
		 * html特殊字符转义为html实体字符串
		 * @param {String} html
		 * @returns {String}
		 */
		escape: function(html) {
			if(!html || typeof html !== 'string'){return html}
			return html.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/ /g, "&nbsp;");
		}
	};
	utils.ready = true;
	E.utils = utils;
})(window.jQuery.jQEditor,window.jQuery);