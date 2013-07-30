/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){e.addPlugin({id:"hn",isEnable:!0,paramStr:function(t){var n="",r=e.utils.getSelectionText();return r?r.length>80?e.log.writeLog("不能选择超过80个字符的长度！"):/[`~!\\\/]/.test(r)?e.log.writeLog("不能包含特殊字符“`~!/”！"):(n="<"+t+' class="'+t+'">'+r+"</"+t+">",e.utils.pasteHTML(n)):e.log.writeLog("请选择需要设置为百科链接的文字！"),1},h2:function(){this.paramStr("h2")},h3:function(){this.paramStr("h3")}})})(window.jQuery.jQEditor);