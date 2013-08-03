/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){e.addPlugin({id:"baikelink",isEnable:!0,linkName:"baikelink",click:function(){var t=this,n="http://www.baike.com/wiki/",r="",i=e.utils.getSelectionText();return i?i.length>80?e.errorMessage("百科链接，不能选择超过80个字符的长度！"):/[`~!\\\/]/.test(i)?e.errorMessage("百科链接，不能包含特殊字符“`~!/”！"):(r='<a href="'+n+encodeURIComponent(i)+'" class="'+t.linkName+'" title="'+i+'" target="_blank">'+i+"</a>",e.utils.pasteHTML(r)):e.errorMessage("请选择需要设置为百科链接的文字！"),1}})})(jQuery.jQEditor);