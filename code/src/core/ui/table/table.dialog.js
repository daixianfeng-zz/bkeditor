/**
* @fileoverview
* 表格插入弹窗UI
* @author	daixianfeng@hudong.com
* @createTime	2013.04.01
* @editor
* @updateTime
* @version	0.1
**/
(function(E,$){
	E.addUi({
		id : 'tabledialog',
		submit : function(){
			var curDialog = $('#tabledialog');
			if(curDialog.size() !== 0){
				var title = curDialog.find('[name=title]')[0].checked,
					col = curDialog.find('[name=col]').val(),
					row = curDialog.find('[name=row]').val(),
					//align = curDialog.find('[name=align]:checked').val(),
					float = curDialog.find('[name=float]:checked').val(),
					head = curDialog.find('[name=head]')[0].checked;
				//对于操作复杂的拼接处理，可以使用此方式
				var insertHtml = E.utils.execPlugin('table','preInsert',{
					title : title,
					head : head,
					col : col,
					row : row,
					//align : align
					float : float
				});
				return insertHtml;
			}else{
				return false;
			}
		},
		changeAttr : function(){
			var curDialog = $('#tableattrdialog');
			if(curDialog.size() !== 0){
				var title = curDialog.find('[name=title]')[0].checked,
					col = curDialog.find('[name=col]').val(),
					row = curDialog.find('[name=row]').val(),
				//align = curDialog.find('[name=align]:checked').val(),
					float = curDialog.find('[name=float]:checked').val(),
					head = curDialog.find('[name=head]')[0].checked;
				E.utils.execPlugin('table','changeTableAttr',{
					title : title,
					head : head,
					col : col,
					row : row,
					//align : align
					float : float
				});
			}else{
				return false;
			}
		},
		setValues : function(args){
			var curDialog = $('#tableattrdialog:visible');
			if(curDialog.length > 0){
				curDialog.find('[name=float][value='+args.float+']')[0].checked = true;
				if(args.title){
					curDialog.find('[name=title]')[0].checked = true;
				}else{
					curDialog.find('[name=title]')[0].checked = false;
				}
				if(args.head){
					curDialog.find('[name=head]')[0].checked = true;
				}else{
					curDialog.find('[name=head]')[0].checked = false;
				}
				if(args.row){
					curDialog.find('[name=row]').val(args.row);
				}
				curDialog.find('[name=row]')[0].disabled = true;
				if(args.col){
					curDialog.find('[name=col]').val(args.col);
				}
				curDialog.find('[name=col]')[0].disabled = true;
			}
		}
	});
})(window.jQuery.jQEditor ,window.jQuery);