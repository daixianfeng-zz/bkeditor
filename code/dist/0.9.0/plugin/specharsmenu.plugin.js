/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
	var charTable = [
		['±','×','÷','∶','∑','∏','∪','∩','∈','∷'],
		['√','⊥','∥','∠','⌒','∫','∮','≡','≌','≈'],
		['∝','≠','≮','≯','≤','≥','∞','∵','∴','㏑'],
		['㏒'],
		['＄','￠','￡','㏎','㎎','㎏','㎜','㎝','㎞','㎡'],
		['㏄','㏕','№'],
		['ā','á','ǎ','à','ē','é','ě','è','ī','í'],
		['ǐ','ì','ō','ó','ǒ','ò','ū','ú','ǔ','ù'],
		['ǖ','ǘ','ǚ','ǜ','ü']
	];
	
	E.addPlugin({
		id: 'specharsmenu'
		, type: 'panel'
		
		, fill: function(){
			var colorPanel = '';
			E.fillPanel('specharsmenu', getHtml());
		}
		
		, click: function(){
			E.toolbar.togglePanel('specharsmenu');
		}
	});

	function getHtml() {
		var html = '<table>';
		
			for(var i = 0; i < charTable.length; i++) {
			
				var item = charTable[i];
				html += '<tr>';
				
				for(var j= 0; j< item.length; j++) {
					html += '<td><a href="javascript:void(0)"'
						+ ' cmd="spechars" param="'+ item[j] +'"'
						+ ' class="special_num">'
						+ item[j]
						+ '</a></td>';
				}
				
				html+= '</tr>';
			}
			
			html+='</table>';
			
		return html;
	}
	
})(jQuery.jQEditor, jQuery);