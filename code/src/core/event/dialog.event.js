/**
* @fileoverview	
* 对话框内的事件
* 用于在弹出的对话框中，委托与编辑器编辑内容相关的事件
* @author	daixianfeng@hudong.com
* @createTime	2013.01.06
* @editor	
* @updateTime	
* @version	0.6
**/
(function(E,$){
	/**
	* @description
	* 委托点击事件，带有cmd属性的，将会执行编辑器命令
	**/
	$('.bke-dialog').live('click',function(e){
		var tar = $(e.target);
		var cmd = tar.attr('cmd');
		var param = tar.attr('param');
		var id = tar.closest(".bke-dialog").attr('id');
		if( tar.attr('cmd') ){
			E.command(id,cmd,param);
			return false;
		}
	});
})(window.jQuery.jQEditor,window.jQuery);