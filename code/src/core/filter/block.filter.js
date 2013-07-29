/**
* @fileoverview	
* 块元素过滤
* 使之不存在直接暴露在body上的内联元素
* @author	daixianfeng@hudong.com
* @createTime	2013.01.04
* @editor	
* @updateTime	
* @version	0.6
**/
(function(E){
	var name = 'block';
	/**
	* @description
	* 添加p标签，是内联元素不会直接出现在body的子节点上
	* @param {object} dom 过滤的document文档
	* @param {object.<node>} queryNode 过滤的根节点
	**/
	var _addOneBlock = function(win,dom,queryNode){
		var tmpNode = {};
		var inlineFlag = false;
		var optNode = queryNode.firstChild;
		if(optNode === null){
			return;
		}
		var optNodeNext = {};
		var addRange = dom.createRange();
		addRange.setStartBefore(optNode);
		addRange.collapse(true);
		while(optNode !== null){
			optNodeNext = optNode.nextSibling;
			if(typeof DTD.$inline[optNode.tagName] !== 'undefined' || (optNode.nodeType === 3 && /\S/.test(optNode.nodeValue))){
				//内联节点或者是非空文本节点，设置可加 p 标签位为true
				addRange.setEndAfter(optNode);
				inlineFlag = true;
			}else if(typeof DTD.$block[optNode.tagName] !== 'undefined'){
				//块节点时，就到了加 p 标签的时候了，加完之后将位设为false
				if(inlineFlag === true){
					var tmpP = dom.createElement('p');
					addRange.surroundContents(tmpP);
				}
				addRange.setStartAfter(optNode);
				addRange.collapse(true);
				inlineFlag = false;
			}
			if(optNode === queryNode.lastChild && inlineFlag === true){
				//如果最后都没发现块标签，但是需要加 p 标签则添加
				var tmpP = dom.createElement('p');
				addRange.surroundContents(tmpP);
			}
			optNode = optNodeNext;
		}
		return;
	};
	/**
	* @description
	* 执行过滤
	* @param {object} node 过滤的跟节点
	**/
	var func = function(win,node){
		var nodeInfo = E.utils.getNodeDom(node);
		var dom = nodeInfo.dom;
		node = nodeInfo.node;
		_addOneBlock(win,dom,node);
		return node;
	};
	/**
	* @description
	* 添加该过滤到编辑器的过滤中
	**/
	E.addFilter({
		name : 'block',
		type : ['afterText','afterInsert'],
		replace : func
	});
})(window.jQuery.jQEditor);