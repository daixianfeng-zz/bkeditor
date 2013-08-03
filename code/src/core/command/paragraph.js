/**
* @requires execCommand.js
* @requires myDTD.js
* @fileoverview 
*	段落处理
*	对编辑区域某个地方做出修改，这个修改时对这个地方所在段落的修改
*	找到所在段落，找出要修改的段落标签，进行修改
*	预计涉及的段落包括：对齐方式，缩进，段间距，行间距，文本间距，边框，浮动
*	最好能实现ol，ul，li，dl，dt，dd
*	入口：
*	初始化：paragraph(cmd,value);创建段落处理对象，根据jQEditor的激活编辑器确定window和document
*	执行修改：editParagraph(styleType,styleValue);
*	执行思想：
*	根据段落块标签，以及要修改的样式，排除优先级
*	如果优先级高的块标签存在，则在这个块标签上进行修改
*	如果不存在，则找到最底层的块标签进行修改
*	如果裸露在body下面，则添加p标签包裹，再进行修改
*	修改规则：
*	@see myDTD.js
* @author	daixianfeng@hudong.com
* @createTime	2013.04.22
* @editor
* @updateTime
* @version	0.3 
*/
(function(E,$){
	var _win,_dom;
	/**
	* @description 段落修改入口，每次修改段落生成一个新的对象
	* @param {string} cmd 修改命令
	* @param {string} value 修改参数
	* @return {boolean} 是否修改成功
	*/
	var paragraph = function(cmd,value){
		var result = true;
		var paragraphObj = new Paragraph();
		var selRangeObj = paragraphObj.init(_win,_dom);
		paragraphObj.mainRange = selRangeObj.rangeSet[0];
		for(var i=0;i<selRangeObj.len;i++){
			paragraphObj.mainRange = selRangeObj.rangeSet[i];
			result = paragraphObj.changeParagraph(cmd,value);
		}
		return result;
	};
	/**
	* 段落对象构造函数
	* @constructor
	*/
	function Paragraph(){
		_win = E.curEditor.win;
		_dom = E.curEditor.dom;
	}
	Paragraph.prototype = {
		mainRange : {},
		mainSelection : {},
		document : {},
		win : {},
		/**
		* @description 修改段落对象初始化
		* @param {object} win 修改执行的window对象
		* @param {object} dom 修改执行的document对象
		*/
		init : function(win,dom){
			var rangeObj = {len:0,rangeSet:[]};
            this.win = win;
			this.document = dom;
			var mainRange = dom.createRange();
			this.mainSelection = win.getSelection();
			/*表格选中情况区分多个带改变范围*/
			var selectedCell = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectCellClass);
			var selectedTable = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectTableClass);
			if(selectedTable.length !== 0){
				rangeObj.len = selectedTable.length;
				for(var i=0;i<selectedTable.length;i++){
					mainRange.selectNodeContents(selectedTable[i]);
					rangeObj.rangeSet[i] = mainRange.cloneRange();
				}
			}else if(selectedCell.length !== 0){
				rangeObj.len = selectedCell.length;
				for(var i=0;i<selectedCell.length;i++){
					mainRange.selectNodeContents(selectedCell[i]);
					rangeObj.rangeSet[i] = mainRange.cloneRange();
				}
			}else{
				if(this.mainSelection.rangeCount === 0 || this.mainSelection.type === 'None'){
					rangeObj.len = 0;
				}else{
					rangeObj.len = 1;
					rangeObj.rangeSet[0] = this.mainSelection.getRangeAt(0);
				}
			}
			return rangeObj;
		},
		/**
		 * @description 执行段落修改操作
		 * @param {string} styleType 待修改的样式
		 * @param {string} styleValue 修改的参数值
		 */
		changeParagraph : function(styleType,styleValue){
			var on_off = '';
			if(!styleValue){
				if(styleType === 'ul'){
					styleValue = 'disc';
				}
				if(styleType === 'ol'){
					styleValue = 'decimal';
				}
			}else{
				if(styleType === 'padding-left'){
					var tmpValue = styleValue;
					styleValue =  function(index,value){
						var finalValue = parseFloat(value) + parseFloat(tmpValue);
						return (finalValue > 0 ? finalValue : 0) + 'px';
					};
				}
			}
			var changeRange = this.mainRange;
			var commonAncestor = changeRange.commonAncestorContainer;
			var oriOptArea = {
				ancestor : commonAncestor,
				firstNode : changeRange.startContainer,
				firstOffset : changeRange.startOffset,
				lastNode : changeRange.endContainer,
				lastOffset : changeRange.endOffset,
				styleNode : $()
			};
			var comStartRange = changeRange.cloneRange();
			comStartRange.collapse(true);
			var comEndRange = changeRange.cloneRange();
			comEndRange.collapse(false);
			if(styleType === 'ul' || styleType === 'ol'){
				on_off = this.judgeValue(styleType,styleValue);
				this._setParagraph(oriOptArea,styleType,styleValue,on_off);
				return true;
			}
			var ancestorList = {};
			if(navigator.userAgent.indexOf("MSIE") <= 0){
				ancestorList = this.document.createNodeIterator(commonAncestor,NodeFilter.SHOW_TEXT);
			}else{
				ancestorList = this.document.createNodeIterator(commonAncestor,3);
			}
			var endRange = {},startRange = {},midRange = {};
			var queryNode = ancestorList.nextNode();
			var queryNode2 = {};
			var startOpt = 0,endOpt = 1;
			while(queryNode){
				queryNode2 = ancestorList.nextNode();
				if(startOpt === 0){
					var comRange = this.document.createRange();
					comRange.selectNode(queryNode);
					var inStart = comRange.compareBoundaryPoints(comRange.START_TO_START,comStartRange);
				}
				if(endOpt === 1){
					if(queryNode2){
						var comRange2 = this.document.createRange();
						comRange2.selectNode(queryNode2);
						var	inEnd = comRange2.compareBoundaryPoints(comRange2.START_TO_START,comEndRange);
					}else{
						var	inEnd = -1;
					}
				}
				var startCome = inStart > -1 && startOpt === 0;
				var endCome = inEnd > -1 && startOpt === 1 && endOpt === 1;
				if(queryNode === oriOptArea.lastNode || endCome){
					endRange = this._setStyle(queryNode,oriOptArea,styleType,styleValue);
					endOpt = 0;
					break;
				}
				if(startOpt && endOpt){
					midRange = this._setStyle(queryNode,oriOptArea,styleType,styleValue);
				}
				if( !startOpt && (queryNode === oriOptArea.firstNode || startCome) ){
					startRange = this._setStyle(queryNode,oriOptArea,styleType,styleValue);
					startOpt = 1;
				}
				//指向下一个要修改的节点
				queryNode = queryNode2;
			}
		},
		_setStyle : function(queryNode,oriOptArea,styleType,styleValue){
			var dom = this.document;
			var isDoneNode = $(queryNode).closest(oriOptArea.styleNode).length;
			if(isDoneNode){
				return ;
			}else{
				var specialTag = 'td,th,dt,dd,li';
				var paragraphTag = [],needChildTag = [],childNodeTag = [];
				for(var oneTag in DTD.$paragraph){
					oneTag = oneTag.toLowerCase();
					if(DTD.$paragraph[oneTag] === 1){
						paragraphTag.push(oneTag);
					}else if(DTD.$paragraph[oneTag] === 0){
						needChildTag.push(oneTag);
					}
				}
				paragraphTag = paragraphTag.join(',');
				needChildTag = needChildTag.join(',');
				var hasSpecial = $(queryNode).closest(specialTag);
				if(hasSpecial.length > 0){
					$(hasSpecial[0]).css(styleType,styleValue);
					oriOptArea.styleNode = hasSpecial[0];
				}else{
					var hasParentOnly = $(queryNode).closest(needChildTag);
					if(hasParentOnly.length > 0){
						var parentTag = hasParentOnly[0].nodeName;
						if(parentTag.toLowerCase() === 'body' || parentTag.toLowerCase() === 'div'){
							var hasParagraph = $(queryNode).closest(paragraphTag);
							if(hasParagraph.length > 0){
								$(hasParagraph[0]).css(styleType,styleValue);
								oriOptArea.styleNode = hasParagraph[0];
							}else{
								var defaultChild = dom.createElement(DTD[parentTag]['child']);
								var childLen = hasParentOnly[0].childNodes.length;
								for(var i=0;i<childLen;i++){
									childNodeTag = hasParentOnly[0].childNodes[i];
									if(childNodeTag.nodeType === 3 || DTD[parentTag][childNodeTag.nodeName] !== 1){
										$(childNodeTag).wrap(defaultChild);
										if($(queryNode).closest(childNodeTag).length > 0){
											$(childNodeTag.parentNode).css(styleType,styleValue);
											oriOptArea.styleNode = defaultChild;
										}
									}
								}
							}
						}
						else{
							var defaultChild = dom.createElement(DTD[parentTag]['child']);
							var childLen = hasParentOnly[0].childNodes.length;
							for(var i=0;i<childLen;i++){
								childNodeTag = hasParentOnly[0].childNodes[i];
								if(childNodeTag.nodeType === 3 || DTD[parentTag][childNodeTag.nodeName] !== 1){
									$(childNodeTag).wrap(defaultChild);
									if($(queryNode).closest(childNodeTag).length > 0){
										$(childNodeTag.parentNode).css(styleType,styleValue);
										oriOptArea.styleNode = defaultChild;
									}
								}
							}
						}
					}else{
						E.utils.message('has no paragraph');
					}
				}
			}
		},
		_setParagraph : function(oriOptArea,styleType,styleValue,on_off){
			var startNode = this.mainRange.startContainer,
				endNode = this.mainRange.endContainer;
			var startBlock = {},endBlock = {};
			var startList = $(startNode).closest('ol,ul'),endList = $(endNode).closest('ol,ul');
			var on_off_array = on_off.split('_');
			var blockTag = [];
			for(var oneTag in DTD.$block){
				oneTag = oneTag.toLowerCase();
				if(DTD.$block[oneTag] === 1 && DTD.$listItem[oneTag] !== 1 && DTD.$list[oneTag] !== 1){
					blockTag.push(oneTag);
				}
			}
			blockTag = blockTag.join(',');
			if(startList.length > 0){
				startBlock = $(startNode).closest('li')[0];
				startList = startList[0];
			}else{
				startBlock = $(startNode).closest(blockTag)[0];
				startList = '';
			}
			if(endList.length > 0){
				endBlock =$(endNode).closest('li')[0];
				endList = endList[0];
			}else{
				endBlock =$(endNode).closest(blockTag)[0];
				endList = '';
			}
			var firstRange = this.document.createRange(),
				lastRange = firstRange.cloneRange();
			var cutRange = this.document.createRange();
			if($(oriOptArea.ancestor).closest(startBlock).length > 0){
				oriOptArea.ancestor = startBlock.parentNode;
			}
			if($(oriOptArea.ancestor).closest(endBlock).length > 0){
				oriOptArea.ancestor = endBlock.parentNode;
			}
			if($(oriOptArea.ancestor).closest(startList).length > 0){
				oriOptArea.ancestor = startList.parentNode;
			}
			if($(oriOptArea.ancestor).closest(endList).length > 0){
				oriOptArea.ancestor = endList.parentNode;
			}
			firstRange.selectNodeContents(oriOptArea.ancestor);
			firstRange.setEndBefore(startBlock);
			lastRange.selectNodeContents(oriOptArea.ancestor);
			lastRange.setStartAfter(endBlock);
			var lastCut = lastRange.extractContents();
			lastRange.insertNode(lastCut);
			var firstCut = firstRange.extractContents();
			firstRange.insertNode(firstCut);
			cutRange.setEnd(lastRange.startContainer,lastRange.startOffset);
			cutRange.setStart(firstRange.endContainer,firstRange.endOffset);
			var cutNodefrag = cutRange.extractContents();
			var queryNode = cutNodefrag.firstChild,queryNode2 = {};
			while(queryNode){
				queryNode2 = queryNode.nextSibling;
				var innerList = '';
				if(queryNode.nodeName !== 'UL' && queryNode.nodeName !== 'OL'){
					innerList = $(queryNode).find('ul,ol');
				}else{
					innerList = $(queryNode);
				}
				innerList.each(function(){
					var removeList = this;
					$(this).find('li').children().each(function(){
						removeList.parentNode.insertBefore(this,removeList);
					});
					$(this).remove();
				});
				queryNode = queryNode2;
			}
			cutRange.insertNode(cutNodefrag);
			if(on_off_array[0] === 'on'){
				var newList = this.document.createElement(styleType);
				newList.style['list-style-type'] = styleValue;
				var ListitemTpl = this.document.createElement('li');
				cutRange.surroundContents(newList);
				$(newList).children().each(function(){
					$(this).wrap(ListitemTpl.cloneNode());
				});
			}
			E.curEditor.baseFilter.excute('afterList');
			this.mainRange.setStart(oriOptArea.firstNode,oriOptArea.firstOffset);
			this.mainRange.setEnd(oriOptArea.lastNode,oriOptArea.lastOffset);
			this.mainSelection.removeAllRanges();
			this.mainSelection.addRange( this.mainRange );
		},
		judgeValue : function(styleType,styleValue){
			var startNode = this.mainRange.startContainer,
				endNode = this.mainRange.endContainer;
			var on_off_array = [];
			if($(startNode).closest(styleType).length > 0){
				if($(startNode).closest(styleType).css('list-style-type') === styleValue){
					on_off_array[0] = 'off';
				}else{
					on_off_array[0] = 'on';
				}
			}else{
				on_off_array[0] = 'on';
			}
			if($(endNode).closest(styleType).length > 0){
				if($(endNode).closest(styleType).css('list-style-type') === styleValue){
					on_off_array[1] = 'off';
				}else{
					on_off_array[1] = 'on';
				}
			}else{
				on_off_array[1] = 'on';
			}
			return on_off_array.join('_');
		}
	};
	E.coreCommand.editParagraph = paragraph;
})(window.jQuery.jQEditor,window.jQuery);