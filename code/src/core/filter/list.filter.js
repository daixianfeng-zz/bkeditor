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
(function(E,$){
	var name = 'list';
	/**
	* @description
	* 合并相邻的并且标签，符号样式相同的列表（ul，ol）
	* @param {object} dom 过滤的document文档
	* @param {object.<node>} queryNode 过滤的根节点
	**/
	var _combineList = function(win,dom,queryNode){
		$(queryNode).find('ul,ol').each(function(){
			if($(this).find('li').length === 0){
				$(this).remove();
			}else if(this.previousSibling && this.previousSibling.nodeName === this.nodeName){
				if($(this.previousSibling).css('list-style-type') === $(this).css('list-style-type')){
					var combineNode = this;
					$(this.previousSibling).find('li').each(function(){
						$(combineNode).prepend(this);
					});
					$(this.previousSibling).remove();
				}
			}
		});
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
		_combineList(win,dom,node);
		return node;
	};
	/**
	* @description
	* 添加该过滤到编辑器的过滤中
	**/
	E.addFilter({
		name : 'list',
		type : ['afterList'],
		replace : func
	});
})(window.jQuery.jQEditor,window.jQuery);