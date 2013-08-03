/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){e.addPlugin({id:"insertparagraph",title:"插入段落",isEnable:!0,click:function(n){var i=e.curEditor,r=i.getCursorElement(),o=t(r).closest("p,pre,table,ul,ol,div"),a=i.dom.createElement("p");a.innerHTML="&#8203;",o[n](a),e.utils.setCursor(i.win,a,!0)}})})(jQuery.jQEditor,jQuery);