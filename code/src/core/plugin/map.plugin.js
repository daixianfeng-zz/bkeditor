/**
* @fileoverview
* 图片插入插件
* @author	daixianfeng@hudong.com
* @createTime	2012.12.20
* @editor
* @updateTime
* @version	0.3
**/
(function(E){
	var win = null;
	E.addPlugin({
		id : 'map',
		type : 'dialog',
		showDialog : function(curEditor){
			var id = curEditor.Eid;
			E.dialog.open({
				id : 'mapdialog',
				editor : id,
				title: '插入地图',
				content: '<iframe src="'+ E.config.cBase.skinDir +'googlemap.htm" name="googlemapframe" style="width: 600px; height: 350px; border: 0px none;" frameborder="0" allowtransparency="true"></iframe>',
				ok: function(){
					E.dialog.revertSelection();
					E.command('mapdialog','submit',win);
				},
				cancel: function(){
					E.dialog.close('mapdialog');
				},
				init: function () {
					win= window.frames['googlemapframe'];
				},
				icon: 'succeed'
			});
		}
	});
})(window.jQuery.jQEditor);