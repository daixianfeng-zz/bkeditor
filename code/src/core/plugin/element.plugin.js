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
	}
});

})(jQuery.jQEditor, jQuery);