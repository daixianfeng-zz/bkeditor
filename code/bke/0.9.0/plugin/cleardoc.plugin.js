/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){e.addPlugin({id:"cleardoc",title:"清空文档",isEnable:!0,click:function(){if(confirm("确定要删除当前所有内容吗？")){var n=e.get("body"),r=e.get("editor"),i=r.dom.createElement("p");i.innerHTML="&#8203;",t(n).empty().append(i),e.utils.setCursor(r.win,i,!0)}}})})(jQuery.jQEditor,jQuery);