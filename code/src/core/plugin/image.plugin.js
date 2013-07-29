/**
 * 图片插入插件
 */
(function(E){
E.addPlugin({
	id : 'image',
	type : 'dialog',
	waitTime : 0,
	init : function(){
		E.load.loadOneFile(E.config.cBase.libDir+'plupload/plupload.js');
		E.utils.loadDialog(this.id, E.config.cBase.uiDir+'image/');
	},
	showDialog : function(curEditor){
		var self = this;
		if(typeof plupload !== 'undefined'){
			var id = curEditor.Eid;
			E.dialog.open({
				id: 'imagedialog',
				editor: id,
				title: '图片',
				content: $('[ui=imagedialog]'),
				ok: function(){
					if ( E.ui('imagedialog').check() ) {
						E.dialog.revertSelection();
						E.command('imagedialog');
					} else {
						return false;
					}
				},
				cancel: function(){
					E.dialog.close('imagedialog');
				},
				init: function(){
					E.ui('imagedialog').callback();
				},
				beforeunload: function(){
					E.ui('imagedialog').beforeunload();
				},
				icon: 'succeed'
			});
		}else{
			if(self.waitTime > 10000){
				E.error.writeError('no mirror_lib error: codemirror.js loading timeout',3,'plugin');
			}
			setTimeout(function(){
				self.showDialog(curEditor);
			},200);
			self.waitTime += 200;
		}
	},
	imgFloat : function(arg){
		var floatStyle = '';
		arg = parseInt(arg);
		switch(arg){
			case 1 : floatStyle = 'left';break;
			case 2 : floatStyle = 'none';break;
			case 3 : floatStyle = 'right';break;
			default :floatStyle = 'none';break;
		}
		var curImg = getCurrentImg();
		$(curImg).css('float',floatStyle);
	},
	preInsert : function(args){
		return '<a href="'+args.link+'" target="'+args.target+'"><img src="'+args.url+'" style="width:'+args.width+';height:'+args.height+';"/></a>';
	}
});

function getCurrentImg(){
	//获取光标所在的图片
	var selectTable = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectImgClass);
	if(selectTable.length > 0){
		return selectTable;
	}else{
		return $(E.utils.getCurElement().pop()).prev('img');
	}
}
})(jQuery.jQEditor);