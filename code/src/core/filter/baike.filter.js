/**
 * 百科外链过滤器
 * 同时，将旧的div目录转弯h2/h3
 */
(function(E, $){

var reBaike=/^http:\/\/(\w+\.){0,2}(?:hudong|baike|hoodong)\.com/i,
	
	// 0 不过滤；1 过滤(默认)
	isFilterExternal = (typeof g_filterExternal === "function") 
		? g_filterExternal
		: function(){return 1};
	
E.addFilter({
	name: 'baike',
	type: ['dom'],
	
	replace: function(win, dom) {
	
		if(typeof dom !== 'object' || !dom.body){return dom;}
		var links = $('a', dom);
		
		links.each(function(){
			var link = $(this),
				href = link.attr('href'),
				text = link.text();
			
			if (
				( link.is('.innerlink,.baikelink') || /www\.(hudong|baike)\.com\/wiki\//i.test( href ) ) 
				&& !reBaike.test(text)
			){
			// 修复百科链接
				link.attr('href', 'http:/'+'/www.baike.com/wiki/' + encodeURI(text) );
			}else if( href && isFilterExternal() ){
				href = href.toLowerCase();
				var pos = href.indexOf(location.hostname);
				
				if( /^\w+:/i.test(href) 
					&& (!reBaike.test(href) && (!location.hostname || pos < 0 || pos > 10) )
				) {
					link.replaceWith(link.html());
				}
			}
		});
		
		// 过滤旧的目录，将div转为h2/3
		$('.hdwiki_tmml', dom).each(function(){
			var o = $(this),
				text = o.text();
			o.replaceWith('<h2>'+ text +'</h2>');
		});
		$('.hdwiki_tmmll', dom).each(function(){
			var o = $(this),
				text = o.text();
			o.replaceWith('<h3>'+ text +'</h3>');
		});
	}
});

})(jQuery.jQEditor, jQuery);