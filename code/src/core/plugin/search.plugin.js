/**
* @fileoverview
* 查找插件
* @author	daixianfeng@hudong.com
* @createTime	2012.12.20
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	E.addPlugin({
		id : 'search',
		type : 'dialog',
		init : function(){
			E.utils.loadDialog(this.id, E.config.cBase.uiDir+'search/');
		},
		showDialog : function(curEditor){
			var self = this;
			var id = curEditor.Eid;
			E.dialog.open({
				id : 'searchdialog',
				editor : id,
				title: '查找',
				content: $('[ui=searchdialog]'),
				button : [
					{value:'<< 查找',callback:function(){
						E.command('searchdialog','search','prev');
						return false;
					}},
					{value:'查找 >>',callback:function(){
						E.command('searchdialog','search','next');
						return false;
					}},
					{value:'替换 ≒',callback:function(){
						E.command('searchdialog','replace');
						return false;
					}}
				],
				icon: 'succeed'
			});
		},
		search : function(args){
			var win = E.curEditor.win;
			var searchResult = false;
			if(E.IE){
				var bodyRange = win.document.body.createTextRange();
				win.focus();
				var selRange = win.document.selection.createRange().duplicate();
				try{
					if(args.backward){
						bodyRange.setEndPoint('StartToEnd',selRange);
					}else{
						bodyRange.setEndPoint('EndToStart',selRange);
					}
				}catch(e){
					win.focus();
				}
				var searchword = args.sourceword,
					wholeBit = args.whole === true ? 2 : 0,
					sensitiveBit = args.sensitive === true ? 4 : 0,
					towardBit = args.backward === true ? 0 : -1;
				var searchBit = wholeBit | sensitiveBit;
				
				searchResult = bodyRange.findText(searchword,towardBit,searchBit);
				searchResult && bodyRange.select();
			}else{
				var searchword = args.sourceword,
					wholeBool = args.whole,
					sensitiveBool = args.sensitive,
					towardBool = args.backward === true ? false : true;
				searchResult = win.find(searchword,sensitiveBool,towardBool,false,wholeBool);
				
			}
			if(!searchResult){
				E.errorMessage('没有找到目标！');
			}
		},
		replace : function(args){
			var win = E.curEditor.win;
			var selectedText = E.utils.getSelectionText();
			if(selectedText.toLowerCase() !== args.sourceword.toLowerCase()){
				this.search(args);
			}else{
				E.utils.replaceSelectedText(E.curEditor.win,args.targetword);
				this.search(args);
			}
			
		}
	});

})(window.jQuery.jQEditor);