/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
E.addPlugin({
	id : 'baikelink',
	isEnable : true,
	linkName : 'baikelink',
	
	click: function( ){
		var self = this,
			url = "http://www.baike.com/wiki/",
			html='',
			text = E.utils.getSelectionText();
		if( text ){
			if( text.length > 80 ){
				E.errorMessage('百科链接，不能选择超过80个字符的长度！');
			}else if( /[`~!\\\/]/.test(text) ){
				E.errorMessage('百科链接，不能包含特殊字符“`~!\/”！');
			}else{
				html = '<a href="'+url + encodeURIComponent (text) +'" class="'+self.linkName+'" title="'+text+'" target="_blank">'+text+'</a>';
				E.utils.pasteHTML( html );
			}
		}else{
			E.errorMessage('请选择需要设置为百科链接的文字！');
		}
		return 1;
	}
});
})(jQuery.jQEditor);