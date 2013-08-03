/**
 * 定位元素插件
 * @author	daixianfeng@hudong.com
 * @createTime	2012.12.26
 */
(function(E, $){

E.addEvent({
	name : 'elementpath',
	type : ['mouseup'],
	area : 'editArea',
	fn : function(arg){
		var $path = $('#'+E.curId+' .bke-elementpath'),
			elementList = E.utils.getCurElement(),
			html = [];
			
		for(var i=0, len = elementList.length; i<len; i++){
			if( elementList[i].nodeType !==3 ){
				html.push('<a>'+elementList[i].nodeName.toLowerCase()+'</a>');
			}
		}
		
		$path.html('元素路径：'+html.join('&gt;'));
		//附加统计文字数
		var stat = $('#'+E.curId+' .bke-wordcount');
		var textContent = E.curEditor.getTextContent();
		textContent = textContent ? textContent.replace(/\s/g,'') : '';
		stat.html('字数统计:'+textContent.length);
	}
});

})(jQuery.jQEditor, jQuery);