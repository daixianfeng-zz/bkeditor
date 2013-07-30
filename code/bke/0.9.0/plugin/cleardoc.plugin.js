/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){e.addPlugin({id:"cleardoc",title:"清空文档",isEnable:!0,click:function(){if(confirm("确定要删除当前所有内容吗？")){var n=e.get("body"),i=e.get("editor"),r=i.dom.createElement("p");r.innerHTML="&#8203;",t(n).empty().append(r),e.utils.setCursor(i.win,r,!0)}}})})(jQuery.jQEditor,jQuery);