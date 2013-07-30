/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){e.addPlugin({id:"baikelink",isEnable:!0,linkName:"baikelink",click:function(){var t=this,n="http://www.baike.com/wiki/",i="",r=e.utils.getSelectionText();return r?r.length>80?e.errorMessage("百科链接，不能选择超过80个字符的长度！"):/[`~!\\\/]/.test(r)?e.errorMessage("百科链接，不能包含特殊字符“`~!/”！"):(i='<a href="'+n+encodeURIComponent(r)+'" class="'+t.linkName+'" title="'+r+'" target="_blank">'+r+"</a>",e.utils.pasteHTML(i)):e.errorMessage("请选择需要设置为百科链接的文字！"),1}})})(jQuery.jQEditor);