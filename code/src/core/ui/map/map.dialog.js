/**
* @fileoverview
* 图片插入弹窗UI
* @author	daixianfeng@hudong.com
* @createTime	2012.12.20
* @editor
* @updateTime
* @version	0.3
**/
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