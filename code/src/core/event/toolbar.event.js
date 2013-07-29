/**
* @fileoverview
* 工具条事件
* 用于绑定与编辑器实例无关的事件，在事件发生后判断与那个编辑器相关（或是根本与编辑器无关）
* 这类事件主要是工具条相关委托，也会有少数整个dom、底部导航等委托
* @author	daixianfeng@hudong.com
* @createTime	2013.01.06
* @editor
* @updateTime
* @version	0.6
**/
(function(E,$){
	var $dom = $(document);
	
	// 如需 return false 请详细说明为什么
	/**
	* @description 在点击其他位置时隐藏工具栏的面板
	* @author	戴显峰
	* @createTime 2013.01.11 
	**/
	$dom.bind('click',function(e){
		var o = $(e.target);
		if( !o.closest('.bke-btn').size() ){
			// 如果点击的不是编辑器按钮，则隐藏当前显示的面板
			E.toolbar.hidePanel();
		}
	});
	
	/**
	* @description 点击工具栏按钮时内容区域光标焦点不丢失,并且激活编辑器
	*	如果不在 mousedown 事件返回false，
	*	在ie9下点击工具栏按钮时内容区域将丢失光标焦点，
	*	return false 在ie6/7/8貌似没有效果，
	*	导致命令不能正确应用到选择的文本上。
	*	针对这个问题，还有另外一个解决办法。将工具栏按钮使用a链接标签。
	* @author	潘雪鹏
	* @createTime 2013.01.11 
	**/
	$dom.delegate('.bke-toolbar', 'mousedown', function(e){
		var Eid = $(e.target).closest(".bke-toolbarbox").attr('ref');
		E.curId = Eid;
		E.curEditor = E.editorList[Eid];
		E.curEditor.win.focus();
		return false;
	});
	
	/**
	* @description 点击编辑器工具栏，带有cmd属性时执行相关命令
	* @author	戴显峰
	* @createTime 2013.01.06 
	**/
	$dom.delegate('.bke-toolbar', 'click', function(e){
		var target = $(e.target).closest("[cmd]");
		
		// 使禁用的按钮点击无效
		if( target.closest('.bke-disabled').length ){
			return true;
		}
		
		if( target.length ){
			var cmd = target.attr('cmd'),
				param = target.attr('param'),
				args = target.attr('args');
			
			E.command(cmd, param, args);
			
			return false;
		}
	});
	
	// 点击面板上的命令按钮后，隐藏面板
	$dom.delegate('.bke-submenu [cmd]', 'click', function(e){
		E.toolbar.hidePanel();
	});
	
	
})(jQuery.jQEditor, jQuery);