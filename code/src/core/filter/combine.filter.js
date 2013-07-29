/**
 * @fileoverview
 * 合并标签
 * 合并相邻的，并且有相同名称和样式的标签，（还有文本节点）是编辑的内容更加简化
 * @author	daixianfeng@hudong.com
 * @createTime	2013.01.04
 * @editor
 * @updateTime
 * @version	0.6
 **/
(function(E){
	var name = 'combine';
	var func = function(win,node){
		var nodeInfo = E.utils.getNodeDom(node);
		var dom = nodeInfo.dom;
		node = nodeInfo.node;
		var curSel = win.getSelection();
		var selRange = curSel.rangeCount !== 0 ? curSel.getRangeAt(0) :' ';
		var ancestorList = [];
		if(navigator.userAgent.indexOf("MSIE") <= 0){
			ancestorList = dom.createNodeIterator(node,NodeFilter.SHOW_ELEMENT);
		}else{
			ancestorList = dom.createNodeIterator(node,1);
		}
		var queryNode = ancestorList.nextNode();
		while(queryNode){
			var selIn = false;
			queryLoop : 
			while(queryNode.nextSibling && queryNode.tagName === queryNode.nextSibling.tagName && DTD.$font[queryNode.tagName] === 1){
				if(queryNode.tagName === 'SPAN'){
					var len = queryNode.style.cssText.split(';').length;
					var nextLen = queryNode.nextSibling.style.cssText.split(';').length;
					if(len !== nextLen){
						break queryLoop;
					}
					for(var i=0;i<len;i++){
						if(queryNode.nextSibling.style[queryNode.style[i]] !== queryNode.style[queryNode.style[i]]){
							break queryLoop;
						}
					}
				}
				var startSel = {},endSel = {};
				if(selRange){
					startSel = {
						container : selRange.startContainer,
						offset: selRange.startOffset
					},endSel = {
						container : selRange.endContainer,
						offset: selRange.endOffset
					};
					if(selRange.startContainer.childNodes[selRange.startOffset] === queryNode.nextSibling){
						selRange.setStartAfter(queryNode);
						selIn = true;
					}
					if(selRange.endContainer.childNodes[selRange.endOffset] === queryNode.nextSibling){
						selRange.setEndAfter(queryNode);
						selIn = true;
					}
					var outIndex = E.utils.nodeIndex(queryNode.nextSibling);
					if(selRange.startContainer === queryNode.parentNode && selRange.startOffset > outIndex){
						startSel.offset = outIndex;
						selIn = true;
					}
					if(selRange.endContainer === queryNode.parentNode && selRange.endOffset > outIndex){
						endSel.offset = outIndex;
						selIn = true;
					}
				}

				var insertRange = dom.createRange();
				var cutRange = dom.createRange();
				insertRange.selectNodeContents(queryNode);
				insertRange.collapse(false);
				cutRange.selectNodeContents(queryNode.nextSibling);
				var cutValue = cutRange.extractContents();
				cutRange.selectNode(queryNode.nextSibling);
				cutRange.deleteContents();
				insertRange.insertNode(cutValue);
				if(selRange){
					selRange.setStart(startSel.container,startSel.offset);
					selRange.setEnd(endSel.container,endSel.offset);
					curSel.removeAllRanges();
					curSel.addRange(selRange);
				}
			}
			queryNode = ancestorList.nextNode();
		}
		if(navigator.userAgent.indexOf("MSIE") <= 0){
			ancestorList = dom.createNodeIterator(node,NodeFilter.SHOW_TEXT);
		}else{
			ancestorList = dom.createNodeIterator(node,3);
		}
		var combineFlag = false;
		queryNode = ancestorList.nextNode();
		while(queryNode){
			if(queryNode.nextSibling && queryNode.nextSibling.nodeType === 3){
				combineFlag = true;
			}else{
				if(combineFlag === true){
					var combineNode = queryNode.previousSibling;
					while(combineNode && combineNode.nodeType === 3){
						var startSel = {},endSel = {},selOut = '',selIn = '';
						if(selRange){
							selOut = false;
							selIn = false;
							startSel = {
									container : selRange.startContainer,
									offset: selRange.startOffset
								},endSel = {
									container : selRange.endContainer,
									offset: selRange.endOffset
								};
							var outIndex = E.utils.nodeIndex(combineNode.nextSibling);
							if(selRange.startContainer === queryNode.parentNode){
								if(outIndex < selRange.startOffset){
									selOut = 'start';
									startSel.offset =  selRange.startOffset - 1;
									selIn = true;
								}
							}else if(selRange.startContainer === combineNode.nextSibling){
								var combineLen = combineNode.length;
								startSel.offset =  combineLen + selRange.startOffset;
								selIn = true;
							}else if(selRange.startContainer === combineNode){
								startSel.container = combineNode.nextSibling;
								selIn = true;
							}

							if(selRange.endContainer === queryNode.parentNode){
								if(outIndex < selRange.startOffset){
									selOut = 'end';
									endSel.offset =  selRange.endOffset - 1;
									selIn = true;
								}
							}else if(selRange.endContainer === combineNode.nextSibling){
								var combineLen = combineNode.length;
								endSel.offset =  combineLen + selRange.endOffset;
								selIn = true;
							} else if(selRange.endContainer === combineNode){
								endSel.container = combineNode.nextSibling;
								selIn = true;
							}
						}
						queryNode.nodeValue = combineNode.nodeValue + queryNode.nodeValue;
						var preNode = combineNode.previousSibling;
						combineNode.parentNode.removeChild(combineNode);
						combineNode = preNode;
						if(selRange){
							selRange.setStart(startSel.container,startSel.offset);
							selRange.setEnd(endSel.container,endSel.offset);
							if(selIn === true){
								curSel.removeAllRanges();
								curSel.addRange(selRange);
							}
						}
					}
					combineFlag = false;
				}
			}
			queryNode = ancestorList.nextNode();
		}
	};
	E.addFilter({
		name : 'combine',
		type : ['afterText','beforeInsert','afterInsert'],
		order : 'second',
		replace : func
	});
})(window.jQuery.jQEditor);