/**
 * 默认过滤器
 *
 */
(function(E, $){

E.addFilter({
	name: 'default',
	type: ['html'],
	replace: function(win, html) {
		if(typeof html !== 'string' || !html){ return html; }
		// 去掉多余空白
		html = html.replace(/^\s+/g, '');
		html = html.replace(/\s+$/g, '');
		html = html.replace(/>\s+</g, '><');
		
		// 给空td标签添加空格&nbsp;
		html = html.replace(/(<td[^>]*>)<\/td>/g, '$1&#8203;<br></td>');
		
		// 将参考资料标签sup前后各添加&nbsp;以方便用户输入
		html = html.replace(/<\/sup>(\s|&nbsp;)*/ig, '<\/sup> ');
		
		html = html.replace(/(\s|&nbsp;)*<sup/ig, '<sup');
		
		html = html.replace(/<\/?textarea>/ig, '');
		html = html.replace(/<!--[\s\S]*?-->/gi, '');
		
		if( /http:\/\/www\.(hudong|baike)\.com\/editdocauth/i.test(location.href) ){
			//替换所有的font标签
			html = html.replace(/<\/?font[^>]*>/ig, '');
		}
		
		//替换掉所有的空标签
		//需保留锚点a标签
		html = html.replace(/<(div|strong|span)[^>]*?>\s*<\/\1>/ig, '');
		
		// 替换无意义的多余标签，如<span>abc</span>替换为abc
		html = html.replace(/<(span|font)>([^<]+)<\/\1>/ig, '$2');		
		//
		html = html.replace(/<\??xml(:\w+)?(\s+[^>]*?)?>([\s\S]*?<\/xml>)?/ig, '');
		html = html.replace(/<\/?(html|head|body|meta|title|iframe|frame)(\s+[^>]*?)?>/ig, '');

		//
		html = html.replace(/<link(\s+[^>]*?)?>/ig, '');
		//
		html = html.replace(/<script(\s+[^>]*?)?>[\s\S]*?<\/script>/ig, '');
		//
		html=html.replace(/(<\w+)(\s+[^>]*?)?\s+on(?:error|click|dblclick|mousedown|mouseup|mousemove|mouseover|mouseout|mouseenter|mouseleave|keydown|keypress|keyup|change|select|submit|reset|blur|focus|load|unload)\s*=\s*(["']?).*?\3((?:\s+[^>]*?)?\/?>)/ig,'$1$2$4');
		//
		html = html.replace(/<style(\s+[^>]*?)?>[\s\S]*?<\/style>/ig, '');
		
		// 2011-11-09 潘雪鹏
		// 下面这个替换会导致问题，暂时取消。比如当p标签嵌套div时
		//html=html.replace(/(<\w+)(\s+[^>]*?)?\s+(style|class)\s*=\s*(["']?).*?\3((?:\s+[^>]*?)?\/?>)/ig,'$1$2$4');
		
		html=html.replace(/<\/(strong|b|u|strike|em|i)>((?:\s|<br\/?>|&nbsp;)*?)<\1(\s+[^>]*?)?>/ig,'$2');
		/*
		if(!Consts.IE){
			//非IE浏览器，则需将 strong 和 em 标签转为 b 和 i，
			//否则加粗、斜体操作对于已经存在的strong和em不起作用。
			html = html.replace(/<(\/?)(strong|em)>/ig, function($0, $1, $2){
				var o={strong:'b', em:'i'};
				return '<'+$1+o[$2]+'>';
			});
		}*/
		
		html = html.replace(/class=\"Apple-style-span\"/ig, '');
		// 去除jQuery添加到临时属性
		html = html.replace(/ jquery\d+=\"?\d+\"?/ig, ' ');
		
		// word
		html = cleanWord(html);
		return html;
	}
});

function cleanWord(html){
	// Remove <!--[if gte mso 9|10]>...<![endif]-->
	html = html.replace(/<!--\[if gte mso [0-9]{1,2}\]>[\s\S]*?<!\[endif\]-->/ig, "");

	// Remove <style> ...mso...</style>
	html = html.replace(/<style>[\s\S]*?mso[\s\S]*?<\/style>/ig, "");

	// Remove lang="..."
	html = html.replace(/ lang=".+?"/ig, "");

	// Remove <o:p></o:p>
	html = html.replace(/<o:p><\/o:p>/ig, "");

	// Remove class="MsoNormal"
	html = html.replace(/ class="Mso.+?"/ig, "");
	
	html = html.replace(/ mso-spacerun: 'yes'/ig, "");
	return html;
}

})(jQuery.jQEditor, jQuery);