/**
 * @fileoverview
 * 替换不合理的标签
 * 标签有很多有同样效果的标签，为了保持一致性，还是要统一标签的形式
 * @author	daixianfeng@hudong.com
 * @createTime	2013.01.04
 * @editor
 * @updateTime
 * @version	0.6
 **/
(function(E){
	var name = 'replace';
	//设置节点的style属性
	var setStyleType = function(styleType,styleValue,optNode){
		optNode.style.cssText += styleType + ': ' + styleValue;
	};
	var tagChange = {
		'B' : {styleType:'STRONG',styleValue:undefined},
		'I' : {styleType:'EM',styleValue:undefined},
		'U' : {styleType:'text-decoration',styleValue:'underline'},
		'DEL' : {styleType:'text-decoration',styleValue:'line-through'}
	};
	var _addSpan = function(dom,optNode,styleType,styleValue){
		var tmpSpan = dom.createElement("span");
		if(optNode.nodeType === 3 && /\S/.test(optNode.nodeValue)){//Text节点
			var tmpRange = dom.createRange();
			tmpRange.selectNode(optNode);
			var midRange = tmpRange.cloneRange();
			if(optNode.parentNode.tagName === 'SPAN'){
				setStyleType(styleType,styleValue,optNode.parentNode);
			}else{
				//直接包裹span标签
				setStyleType(styleType,styleValue,tmpSpan);
				tmpRange.surroundContents(tmpSpan);
			}
		}
	};
	var _replaceOneTag = function(win,dom,queryNode){
		if(queryNode.nodeType === 3){
			return;
		}else if(tagChange[queryNode.tagName] !== undefined){
			var styleType = tagChange[queryNode.tagName].styleType,
				styleValue = tagChange[queryNode.tagName].styleValue;
			if(styleValue === undefined){
				var outerRange = dom.createRange();
				outerRange.selectNodeContents(queryNode);
				var innerNode = outerRange.extractContents();
				outerRange.selectNode(queryNode);
				outerRange.deleteContents();
				outerRange.insertNode(innerNode);
				var newTag = dom.createElement(styleType);
				outerRange.surroundContents(newTag);
			}else{
				var ancestorList = {};
				if(E.IE){
					ancestorList = dom.createNodeIterator(queryNode,3);
				}else{
					ancestorList = dom.createNodeIterator(queryNode,NodeFilter.SHOW_TEXT);
				}
				var optNode = ancestorList.nextNode(),optNode2 = {};
				while(optNode){
					//指向下一个节点，因为可能会对当前节点做修改
					optNode2 = ancestorList.nextNode();
					_addSpan(dom,optNode,styleType,styleValue);
					optNode = optNode2;
				}
				var outerRange = dom.createRange();
				outerRange.selectNodeContents(queryNode);
				var innerNode = outerRange.extractContents();
				outerRange.selectNode(queryNode);
				outerRange.deleteContents();
				outerRange.insertNode(innerNode);
			}
		}
		return;
	};
	var _replaceLoop = function(win,dom,node){
		var optNode = node.firstChild;
		if(optNode === null){
			return;
		}
		var optNodeNext = {};
		while(optNode !== null){
			optNodeNext = optNode.nextSibling;
			_replaceLoop(win,dom,optNode);
			_replaceOneTag(win,dom,optNode);
			optNode = optNodeNext;
		}
		return;
	};
	var func = function(win,node){
		var nodeInfo = E.utils.getNodeDom(node);
		var dom = nodeInfo.dom;
		node = nodeInfo.node;
		_replaceLoop(win,dom,node);
	};
	E.addFilter({
		name : 'replace',
		type : ['beforeInsert'],
		replace : func
	});
})(window.jQuery.jQEditor);