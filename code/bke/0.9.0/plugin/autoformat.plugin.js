/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){function n(e){e.children().eq(0).size()&&(e=e.children().eq(0),e.html(e.html().replace(i,"")),n(e))}function r(e){for(var r,o=t("body",e)[0].childNodes,a=0,s=o.length;s>a;a++)if(r=o[a],1===r.nodeType){var l=t(r);/^(p|h2|h3)$/i.test(r.nodeName)&&(l.html(l.html().replace(i,"a")),n(l))}}var i=/^(\s|&nbsp;|　)+/i;e.addPlugin({id:"autoformat",click:function(){r(e.curEditor.dom)}})})(jQuery.jQEditor,jQuery);