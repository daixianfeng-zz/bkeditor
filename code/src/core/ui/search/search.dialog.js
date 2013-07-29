/**
* @fileoverview
* 图片插入弹窗UI
* @author	daixianfeng@hudong.com
* @createTime	2012.12.20
* @editor
* @updateTime
* @version	0.3
**/
(function(E,$){
	E.addUi({
		id : 'searchdialog',
		search : function(arg){
			var backward = (arg === 'prev' ? false : true);  
			var curDialog = $('#searchdialog');
			if(curDialog.size() !== 0){
				var sourceword = curDialog.find('#sourceword').val(),
					whole = curDialog.find('[name=whole]')[0].checked,
					sensitive = curDialog.find('[name=sensitive]')[0].checked;
				
				E.utils.execPlugin('search','search',{
					backward : backward,
					sourceword : sourceword,
					whole : whole,
					sensitive : sensitive
				});
				return false;
			}else{
				return false;
			}
		},
		replace : function(){
			var curDialog = $('#searchdialog');
			if(curDialog.size() !== 0){
				var sourceword = curDialog.find('#sourceword').val(),
					targetword = curDialog.find('#targetword').val(),
					whole = curDialog.find('[name=whole]')[0].checked,
					sensitive = curDialog.find('[name=sensitive]')[0].checked;
				
				E.utils.execPlugin('search','replace',{
					backward : true,
					sourceword : sourceword,
					targetword : targetword,
					whole : whole,
					sensitive : sensitive
				});
				return false;
			}else{
				return false;
			}
		}
	});
	
})(window.jQuery.jQEditor ,window.jQuery);