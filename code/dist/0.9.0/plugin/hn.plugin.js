/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
	E.addPlugin({
		id : 'hn',
		isEnable : true,
		paramStr: function(htype){
			var html='',
				text = E.utils.getSelectionText();
			
			if( text ){
				if( text.length > 80 ){
					E.log.writeLog('不能选择超过80个字符的长度！');
				}else if( /[`~!\\\/]/.test(text) ){
					E.log.writeLog('不能包含特殊字符“`~!\/”！');
				}else{
					html = '<'+htype+' class="'+htype+'">'+text+'</'+htype+'>';
					
					E.utils.pasteHTML( html );
				}
			}else{
				E.log.writeLog('请选择需要设置为百科链接的文字！');
			}
			return 1;
		},
		h2:function () {
			this.paramStr ('h2');
		},
		h3:function () {
			this.paramStr ('h3');
		}
	});
})(window.jQuery.jQEditor);