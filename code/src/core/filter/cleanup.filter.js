/**
 * 标签、属性过滤器
 */
(function(E, $){

//允许保留的标签、属性和样式
/*
var allowTags = {
		'font':[],
		'span' : ['class','style', '.font-weight', '.font-style', '.text-decoration'],
		'div' : ['class','id','style','.width','.text-align'],
		'a' : ['class','href', 'target', 'title', 'alt', 'name'],
		'img' : ['class', 'id', 'src', 'alt', 'title', 'align', 'usemap', 'border', 'name', 'width', '/'],
		'hr' : ['/'],
		'br' : ['/'],
		'p' : ['class','align','style','.text-align'],
		'table' : [
			'class','style','width','.width','align',
			'border','bordercolor', 'cellpadding',
			'.margin', '.margin-left','.margin-right'
			],
		'tbody': [],
		'tr': [],
		'th': ['class','align','colspan','rowspan','width'],
		'td': ['class','align','colspan','rowspan','width'],
		'ol': ['class'],
		'ul': ['class'],
		'li': ['class'],
		'sub': ['class'],
		'sup': ['class','name'],
		'blockquote': ['style', '.margin', '.padding'],
		'h2': [],
		'h3': [],
		'h4': [],
		'h5': [],
		'h6': [],
		'em': [],
		'strong': ['style','.width'],
		'b': [],
		'i':[],
		'u': [],
		'strike': [],
		'object':['classid','class','id','width','height','codebase'],
		'embed' : ['style','src', 'type', 'loop', 'autostart', 'quality', '.width', '.height','flename','width','height','volume','pluginspage','console','controls','/'],
		'param':['name','value'],
		'map':['id', 'name'],
		'area':['shape', 'coords', 'href', 'title', '/']
	};
	*/
var allowTags = {
		'font':[],
		'span' : ['class','style', '.font-weight', '.font-size', '.font-family', '.font-style', '.text-decoration'],
		'div' : ['class','id','style','.width','.text-align'],
		'a' : ['class','href', 'target', 'title', 'alt', 'name'],
		'img' : ['class', 'id', 'src', 'alt', 'title', 'align', 'usemap', 'border', 'name', 'width', '/'],
		'hr' : ['/'],
		'br' : ['/'],
		'p' : ['class','align','style','.text-align','.padding-left','.margin-top','.margin-bottom','.line-height'],
		'table' : [
			'class','style','width','.width','align',
			'border','bordercolor', 'cellpadding',
			'.margin', '.margin-left','.margin-right'
			],
		'tbody': [],
		'tr': [],
		'th': ['class','align','colspan','rowspan','width'],
		'td': ['class','align','colspan','rowspan','width'],
		'ol': ['class','style','.text-align','.padding-left','.margin-top','.margin-bottom','.line-height'],
		'ul': ['class','style','.text-align','.padding-left','.margin-top','.margin-bottom','.line-height'],
		'li': ['class'],
		'sub': ['class'],
		'sup': ['class','name'],
		'pre': ['class','name'],
		'blockquote': ['style', '.margin', '.padding'],
		'h2': [],
		'h3': [],
		'h4': [],
		'h5': [],
		'h6': [],
		'em': [],
		'strong': ['style','.width'],
		'b': [],
		'i':[],
		'u': [],
		'strike': [],
		'object':['classid','class','id','width','height','codebase'],
		'embed' : ['style','src', 'type', 'loop', 'autostart', 'quality', '.width', '.height','flename','width','height','volume','pluginspage','console','controls','/'],
		'param':['name','value'],
		'map':['id', 'name'],
		'area':['shape', 'coords', 'href', 'title', '/']
	};
	
	var nodeAttrs = ['onerror','onclick','onmouseout','onmouseover','onmousemove','align'
	,'color','font','height','vspace','hspace','id','class','style','left'
	,'right','name','rel','size','title','width','valign','bgcolor','dir'];

/**
 * @description
 * 添加该过滤到编辑器的过滤中
 */
E.addFilter({
	name: 'cleanup',
	order: 'first', // 指定过滤器优先级，first优先执行
	type: ['dom'], // beforeSubmit
	replace: function(win, dom){
		scanNodes( dom.body );
	}
});

/**
 * 扫描标签和标签属性，清除到不在保留列表的标签和属性
 * 
 */
function scanNodes ( el ){
	var attList=[], nodes = el.childNodes;
	for (var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		if (1 === node.nodeType){
			// nodeType = 1 是元素节点
			var tagName = node.tagName.toLowerCase();
			
			if (allowTags[tagName]){
				// 2011-07-22 潘雪鹏
				// IE也支持node.attributes属性，但是node.attributes将返回标签支持的所有属性，
				// 多达100多个，而非iE浏览器仅返回标签里面出现的属性，
				// 所以ie下的node.attributes在此处会导致严重的性能问题，
				// 解决办法就是，ie下给一个指定好的属性黑名单。
				var attrList = (E.IE)? nodeAttrs : $.makeArray(node.attributes);
				var attrs = allowTags[tagName], styles = '';
				
				var attrName;
				// 先过滤属性
				for (var j = 0, len = attrList.length; j < len; j++){
					attrName = (E.IE) ? attrList[j] : attrList[j].name.toLowerCase();
					if ($.inArray(attrName, attrs) === -1){
						node.removeAttribute(attrName);
						//E.log('run', '清理标签'+node.tagName+'的属性'+attrName);
						attList[attrName] = node.getAttribute(attrName);
					}
				}
				
				styles = E.IE ? node.style.cssText : node.getAttribute('style');
				
				// 后过滤样式
				if( styles ){
					styles = styles.replace(/; /g, ';').toLowerCase();
					var _style, styleList = styles.split(';');
					for (var j=0, len = styleList.length; j<len; j++){
						_style = styleList[j].split(':');
						if (_style.length === 2 && $.inArray('.'+_style[0], attrs) === -1){
							styles = styles.replace(new RegExp(_style[0]+":"+_style[1]+";?", 'i'), '');
						}
					}
					styles = $.trim(styles);
					if( styles ){
						E.IE ?	(node.style.cssText = styles)
							: node.setAttribute('style', styles);
					}else{
						node.removeAttribute('style');
					}
				}
				
				// 针对表格节点，进行特殊处理
				if( (tagName === 'table') ){
					var table = $(node), bordercolor = table.attr('bordercolor');
					if( !table.hasClass('jqe-table') ){
						table.addClass('jqe-table');
					}
					if( !bordercolor ){
						table.attr('bordercolor', '#cccccc');
					}
					
					table.attr('border', 1);
				}
				
				if (node.hasChildNodes()) {
					scanNodes(node);
				}
			}else if (node.hasChildNodes()){
				//对于有子元素的不合法标签进行深入遍历，保证删除标签而保留其内容。
				for(var j=0; j<node.childNodes.length; j++){
					scanNodes(node.childNodes[j]);
					node.parentNode.insertBefore(node.childNodes[j].cloneNode(true), node);
				}
				node.parentNode.removeChild(node);
			}else{
				//没有子元素的不合法标签，直接删除
				node.parentNode.removeChild(node);
			}
		}
	}
	
	return el.innerHTML;
}

})(jQuery.jQEditor, jQuery);