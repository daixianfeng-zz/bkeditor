/**
 * artDialog 接口
 */
(function(E,$){

// 用于记录初始的选中范围，这样会防止在操作弹窗的时候范围丢失
// 在打开弹窗的时候记录，关闭弹窗的时候恢复
var oriRange = '', currentId = null, newDialog

function ArtDialog() {}

ArtDialog.prototype = {
	/**
	* @description
	* 初始化弹窗
	* @return {object.<Art>} 新生成的artDialog对象
	**/
	init : function(attr){
		var dialogID = attr.id,
			content = attr.content instanceof jQuery ?attr.content[0].outerHTML:attr.content,
			title = attr.title,
			ok = attr.ok,
			cancel = attr.cancel,
			init = attr.init|| attr.initialize,
			button = attr.button,
			url = attr.url;
			
		newDialog = $.artDialog({
				id: dialogID,
				content: content,
				title: title,
				//lock: true,
				fixed: true,
				ok: ok,
				cancel: cancel,
				button: button,
				okValue: ' 确定 ',
				cancelValue: ' 取消 ',
				initialize: init
			});
			
		newDialog.dom.dialog
			.addClass('bke-dialog')
			.attr('id', attr.id)
			.find('.d-buttons').prepend('<div class="d-error"></div>');
			
		return newDialog;

	},
	/**
	* @description
	* 打开弹窗
	* @param {object} attr 弹窗配置
	**/
	open: function(attr,args){
		oriRange = E.utils.getSelectionRange(E.curEditor.win);
		if($.artDialog.get(attr.id)){
			$.artDialog.get(attr.id).dom.dialog.attr('editor',attr.editor);
		}else{
			newDialog = this.init(attr);
			newDialog.dom.dialog.attr('editor',attr.editor);
		}
		if(typeof args !== 'undefined'){
			currentId = attr.ui ? attr.ui : attr.id;
			E.utils.execUi(currentId,'setValues',args);
		}
	},
	/**
	* @description
	* 关闭弹窗
	* @param {string} id 弹窗id
	**/
	close: function(id){
		id = id || currentId;
		if($.artDialog.get(id)){
			$.artDialog.get(id).close();
		}
		this.revertSelection();
		E.curEditor.win.focus();
	},
	/**
	* @description
	* 弹窗中提交
	* @param {string} 弹窗id
	**/
	submit: function(id ){
		this.close(id);
	},
	revertSelection: function() {
		if (oriRange) {
			E.utils.setSelectionRange(E.curEditor.win,oriRange);
		}
	},
	
	// 显示错误提示
	error: function(msg, color) {
		color = color || 'red'
		newDialog.dom.dialog
			.find('.d-error').css('color', color).html(msg).show();
	},
	
	// 显示成功提示
	success: function(msg) {
		this.error(msg, 'green');
	},
	
	// 清楚提示信息
	clear: function() {
		newDialog.dom.dialog.find('.d-error').fadeOut();
	}
};
//art.dialog.open('login_iframe.html', {title: '提示'});
var dialog = new ArtDialog();
dialog.ready = true;
E.dialog = dialog;

// 窗口输入框被点击时，清除提示消息
$(document).delegate('.d-content :input', 'click', function(){
	dialog.clear();
})

})(jQuery.jQEditor, jQuery);