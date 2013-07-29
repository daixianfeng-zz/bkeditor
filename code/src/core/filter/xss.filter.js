/**
 * 防范XSS攻击
 */
(function(E, $){
var re = /^javascript:/i;

E.addFilter({
	name: 'xss',
	type: ['dom'],
	
	replace: function(win, dom) {
	
		if ( typeof dom !=='object') {
			return ;
		}
		
		$('a', dom).each(function(){
			var o = $(this), url = o.attr('href');
			if(!url) {return;}
			url = url.replace(/\s/g, '');
			if( re.test(url) ){
				o.replaceWith( o.html() );
			}
		});
		
		$('img', dom).each(function(){
			var o = $(this), url = o.attr('src');
			if(!url) {return;}
			url = url.replace(/\s/g, '');
			if( re.test(url) ){
				o.remove();
			}
		});
	}
});

})(jQuery.jQEditor, jQuery);