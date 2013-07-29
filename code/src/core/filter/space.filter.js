/**
 * @fileoverview
 * 空节点过滤
 * 使之不存在空的内联节点，没有数据的文本节点
 * 注意：
 * 要保留锚点A标签，如<a name="summary"></a>
 * @author	daixianfeng@hudong.com
 * @createTime	2013.01.04
 * @editor
 * @updateTime
 * @version	0.6
 **/
(function(E){
	var name = 'space';
	var func = function(win,node){
		var nodeInfo = E.utils.getNodeDom(node);
		var dom = nodeInfo.dom;
		node = nodeInfo.node;
		var curSel = win.getSelection();
		var selRange = curSel.rangeCount !== 0 ? curSel.getRangeAt(0) : '';
		var selNode = '';
		var selIn = false;
		var bodyTextList = [];
		if(E.IE){
			bodyTextList = dom.createNodeIterator(node,3);
		}else{
			bodyTextList = dom.createNodeIterator(node,NodeFilter.SHOW_TEXT);
		}
		var queryNode = bodyTextList.nextNode(),queryNode2 = {};
		while(queryNode){
			queryNode2 = bodyTextList.nextNode();
			var space = /(^[ ]+$)/g;
			var newValue = queryNode.nodeValue.replace(space,"");
			space = /([\t\n\r])/g;
			newValue = queryNode.nodeValue.replace(space,"");
			if(newValue !== queryNode.nodeValue ){
				queryNode.nodeValue = newValue;
			}
			//必须使用range的方式删除节点，否则会出现选中区域出错的情况
			
			if(!queryNode.nodeValue){
				if(selRange && selRange.startRange === queryNode){
					selNode = queryNode;
				}else{
					var tmpRange = dom.createRange();
					tmpRange.selectNode(queryNode);
					tmpRange.deleteContents();
					tmpRange.detach();
				}
			}
			queryNode = queryNode2;
		}
		var bodyElementList = [];
		if(E.IE){
			bodyElementList = dom.createNodeIterator(node,1);
		}else{
			bodyElementList = dom.createNodeIterator(node,NodeFilter.SHOW_ELEMENT);
		}
		var queryNode = bodyElementList.nextNode();
		selIn = false;
		while(queryNode){
			queryNode2 = bodyElementList.nextNode();
			if(DTD.$emptyInline[queryNode.nodeName] === 1
				// 不过滤锚点
				|| (queryNode.nodeName.toUpperCase() === 'A' && queryNode.name)
			){
				queryNode = queryNode2;
				continue;
			}
			if(queryNode.children.length == 0 && queryNode.innerText.length === 0 && queryNode !== selNode && DTD.$block[queryNode.nodeName] !== 1 && queryNode.nodeName !== 'BODY'){
				var cutRange = dom.createRange();
				cutRange.selectNode(queryNode);
				//如果范围节点在queryNode上，需要移动，并且重置选择范围
				if(selRange){
					if(queryNode === selRange.startContainer){
						selRange.setStartBefore(queryNode);
						selIn = true;
					}
					if(queryNode === selRange.endContainer){
						selRange.setEndAfter(queryNode);
						selIn = true;
					}
				}
				var spaceNode = queryNode.parentNode;
				//检查空标签的父节点是不是只有空标签本身，如果是，也要删除
				while(spaceNode.firstChild === spaceNode.lastChild && (DTD.$removeEmpty[spaceNode.tagName] === 1 || DTD.$removeEmptyBlock[spaceNode.tagName] === 1)&& spaceNode.tagName !== 'BODY'){
					cutRange.selectNode(spaceNode);
					if(selRange){
						//如果范围节点在spaceNode上，需要移动，并且重置选择范围
						if(spaceNode === selRange.startContainer){
							selRange.setStartBefore(spaceNode);
							selIn = true;
						}
						if(spaceNode === selRange.endContainer){
							selRange.setEndAfter(spaceNode);
							selIn = true;
						}
					}
					spaceNode = spaceNode.parentNode;
				}
				if(selRange){
					//重新设置选中区的范围
					if(selIn){
						curSel.removeAllRanges();
						curSel.addRange(selRange);
					}
				}
				cutRange.deleteContents();
			}
			queryNode = queryNode2;
		}
	};
	E.addFilter({
		name : 'space',
		type : ['afterText','afterTextPre','beforeInsert','afterInsert'],
		order : 'fourth',
		replace : func
	});
})(window.jQuery.jQEditor);