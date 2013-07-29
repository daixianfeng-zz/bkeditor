/**
 * 鼠标按下时记录当前元素
 */
(function(E, $){

E.addEvent({
	name: 'cursorelements',
	type: ['mousedown','keyup'],
	area: 'editArea',
	fn: function(e) {
		var target = e.target;
		
		// 注意
		// keyup 事件时得到的e.target是body元素，需要修正为光标处的元素
		if ( $(target).is('body') ) {
			var tree = E.utils.getCurElement();
			tree.pop();
			target = tree.pop();
		}
		
		var els = {}
			, o = E.$(target)
			, hn = o.closest('h1,h2,h3,h4,h5,h6,h7')
			, a = o.closest('a')
			, img = o.closest('img')
			, pre = o.closest('pre')
			, sub = o.closest('sub')
			, refer = o.closest('sup.refer')
			, sup = o.closest('sup')
			, cell = o.closest('td,th')
			, row = cell.closest('tr')
			, table = row.closest('table')
			, ol = o.closest('ol')
			, ul = o.closest('ul')
			, embed = o.closest('embed')
			
		if ( hn.length ) els['hn'] = hn[0]
		if ( a.length ) els['a'] = a[0]
		if ( img.length ) els['img'] = img[0]
		if ( pre.length ) els['pre'] = pre[0]
		if ( sub.length ) els['sub'] = sub[0]
		if ( refer.length ) els['refer'] = refer[0]
		if ( sup.length ) els['sup'] = sup[0]
		if ( cell.length ) els['cell'] = cell[0]
		if ( row.length ) els['row'] = row[0]
		if ( table.length ) els['table'] = table[0]
		if ( ol.length ) els['ol'] = ol[0]
		if ( ul.length ) els['ul'] = ul[0]
		if ( embed.length ) els['embed'] = embed[0]
		
		E.curEditor.cursorElements = els;
	}
});

})(jQuery.jQEditor, jQuery);