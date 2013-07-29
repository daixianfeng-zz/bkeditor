var DTD = (function() {
	function _( s ) {
        for (var k in s) {
            s[k.toUpperCase()] = s[k];
        }
        return s;
    }
    function con( t ) {
        var a = arguments;
        for ( var i=1; i<a.length; i++ ) {
            var x = a[i];
            for ( var k in x ) {
                if (!t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    }

	/**
	 * 标签对应的可以嵌套的标签，键为目标标签，值为可以嵌套的标签
	 * 没有对应的值标签为不能嵌套，值标签对应的数字为
	 * 0：不能嵌套，1：可以正常嵌套，2：嵌套冲突（有你没我的），3：意义相同（理论可以替代），parent：不能独立存在，需要父节点存在才能存在 ，child：不能为空，需要有默认的子元素
	 */
    var block = _({address:1,blockquote:1,center:1,dir:1,div:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,menu:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1,li:1,noscript:1}),
        //针对优酷的embed他添加了结束标识，导致粘贴进来会变成两个，暂时去掉 ,embed:1
        empty =  _({area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1,embed:1}),
		inline = _({iframe:1,sub:1,img:1,embed:1,object:1,sup:1,basefont:1,map:1,applet:1,font:1,big:1,small:1,b:1,acronym:1,bdo:1,'var':1,'#':1,abbr:1,code:1,br:1,i:1,cite:1,kbd:1,u:1,strike:1,s:1,tt:1,strong:1,q:1,samp:1,em:1,dfn:1,span:1,ins:1,del:1,script:1,style:1,input:1,button:1,select:1,textarea:1,label:1,a:1});
	var font = _({strong:1,em:1,sub:1,sup:1,span:1,b:1,i:1,u:1,font:1,tt:1,big:1,small:1,q:1,code:1,cite:1,dfn:1,samp:1,kbd:1,abbr:1,acronym:1,bdo:1});
	return  _({

        // $ 表示自定的属性
		//:2表示互斥，不可以相互嵌套，只能替换
		
        //块结构元素列表
        $block : con( {}, block ),

        //内联元素列表
        $inline : con( _({a:0}), inline ),
		
		//文字样式标签
		$font : font,
		
        $body : con( _({script:1,style:1}), block ),

        $cdata : _({script:1,style:1}),

        //自闭和元素
        $empty : empty,

        //不是自闭合，但不能让range选中里边
        $nonChild : _({iframe:1,textarea:1}),
        //列表元素列表
        $listItem : _({dd:1,dt:1,li:1}),

        //列表根元素列表
        $list: _({ul:1,ol:1,dl:1}),

        //不能认为是空的元素
        $isNotEmpty : _({table:1,ul:1,ol:1,dl:1,iframe:1,area:1,base:1,col:1,hr:1,img:1,embed:1,input:1,link:1,meta:1,param:1}),
		//可以为空的内联元素
		$emptyInline : _({'hr':1,'br':1,'img':1,'embed':1}),
        //如果没有子节点就可以删除的元素列表，像span,a
        $removeEmpty : _({a:1,abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1}),

        $removeEmptyBlock : _({'p':1,'div':1,'ol':1,'ul':1,'dl':1}),
		
        //在table元素里的元素列表
		$tableContent : _({caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1,table:1}),
        //不转换的标签
        $notTransContent : _({pre:1,script:1,style:1,textarea:1}),
		//段落样式标签
		$paragraph : con(_({body:0,legend:1,caption:1,dl:0,ul:0,ol:0,dir:0,div:0,table:0}),block),
		
		html : _({body:1,script:1}),
		body : con(_({child:'p'}),block,inline),
		/**	block标签
		*/
		ul : con(_({li:1,ol:2,dir:2,child:'li'}),block),
		ol : con(_({li:1,ul:2,dir:2,child:'li'}),block),
		li : con(_({li:0,parent:'ul'}),block,inline),
		dir : _({li:1,ul:2,ol:2,child:'dd'}),
		dl : _({dt:1,dd:1,child:'dd'}),
		dt : con(_({dd:2,parent:'dl'}),inline),
		dd : con(_({dt:2,parent:'dl'}),inline,block),
		table : _({thead:1,tbody:1,tfoot:1,tr:1,colgroup:1,caption:1,col:1,child:'tbody'}),
		tbody : _({thead:2,tfoot:2,tr:1,parent:'table',child:'tr'}),
		tfoot : _({thead:2,tbody:2,tr:1,parent:'table',child:'tr'}),
		thead : _({tbody:2,tfoot:2,tr:1,parent:'table',child:'tr'}),
		caption : con(_({parent:'table'}),inline),
		colgroup : _({col:1,parent:'table'}),
		col : {},
		tr : _({td:1,th:1,parent:'tbody',child:'td'}),
		td : con(_({th:2,parent:'tr'}),block,inline),
		th : con(_({td:2,parent:'tr'}),block,inline),
		center : con(block,inline),
		p : inline,
		h1 : inline,
		h2 : inline,
		h3 : inline,
		h4 : inline,
		h5 : inline,
		h6 : inline,
		div : con(_({child:'p'}),block,inline),
		pre : con(_({img:0,object:0,big:0,small:0,sub:0,sup:0}),inline),
		blockquote : block,
		noscript : con(block,inline),
		address : inline,
		fieldset : con(_({legend:1}),block,inline),
		legend : inline,
		form : con(_({form:0}),block,inline),
		/**	inline标签
		*/
		img : {},
		span : _({br:1}),
		i : _({span:1,em:3,cite:2}),
		cite : _({span:1,em:3,i:3}),
		b : _({span:1,em:1,strong:3}),
		em : _({span:1,i:2,cite:2}),
		u : _({span:1,i:1,cite:1}),
		strong : _({span:1,em:1,cite:1,i:1,b:2}),
		sub : _({span:1,em:1,cite:1,i:1,sup:2,strong:1}),
		sup : _({span:1,em:1,cite:1,i:1,sub:2,strong:1}),
		big : _({span:1,em:1,cite:1,i:1,sub:1,sup:1,strong:1,small:2}),
		small : _({span:1,em:1,cite:1,i:1,sub:1,sup:1,strong:1,big:2}),
		font : _({span:1,em:1,cite:1,i:1,sub:1,sup:1,strong:1,small:1,big:1}),
		code : _({span:1,em:1,cite:1,i:1,sub:1,sup:1,strong:1,small:1,big:1,font:1,samp:2}),
		samp : _({span:1,em:1,cite:1,i:1,sub:1,sup:1,strong:1,small:1,big:1,font:1,code:2}),
		tt : con(_({tt:0,kbd:2}),inline),
		kbd : con(_({kbd:0,tt:2}),inline),
		dfn : con(_({dfn:0}),inline),
		abbr : con(_({abbr:0}),inline),
		acronym : con(_({acronym:0}),inline),
		q : con(_({q:0}),inline),
		bdo: con(_({bdo:0}),inline),
		label : con(_({label:0}),inline),
		br : {},
		hr : {},
		input : {},
		textarea : {},
		iframe : {},
		a : con(_({a:0}),inline),
		select : _({optgroup:1,option:1}),
		optgroup : _({option:1}),
		option : {},
		object : con(_({param:1}),block,inline),
		param : {},
		map : con(_({area:1}),block),
		area : {},
		button : con(_({a:0,input:0,select:0,textarea:0,label:0,button:0,form:0,fieldset:0}),block,inline)
    });
})();