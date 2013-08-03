/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
	E.addUi({
		id : 'mapdialog',
		submit : function(win){
			var curDialog = $('#mapdialog');
			if(curDialog.size() !== 0){
				var Main = win.Main,
					geocoder = Main.geocoder,
					map = Main.map,
					center = map.getCenter().lat() + ',' + map.getCenter().lng(),
					marker = Main.marker ? Main.marker.position : center,
					zoom = map.getZoom(),
					maptype = map.getMapTypeId(),
					// http://maps.googleapis.com/maps/api/staticmap
					src = 'http://maps.google.com/maps/api/staticmap'
						+ '?center=' + center
						+ '&zoom=' + zoom
						+ '&size=520x340'
						+ '&maptype=' + maptype
						+ '&markers=' + marker
						+ '&language=zh-cn'
						+ '&sensor=false',
					html = '<img class="googlemap" src="'+ src +'" title="'+Main.address+'" alt="'+Main.address+'"/>';
				E.utils.pasteHTML(html);
			}else{
				return false;
			}
		}
	});
})(window.jQuery.jQEditor);
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