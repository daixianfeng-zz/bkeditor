/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){function n(e){e.children().eq(0).size()&&(e=e.children().eq(0),e.html(e.html().replace(r,"")),n(e))}function i(e){for(var i,o=t("body",e)[0].childNodes,a=0,s=o.length;s>a;a++)if(i=o[a],1===i.nodeType){var l=t(i);/^(p|h2|h3)$/i.test(i.nodeName)&&(l.html(l.html().replace(r,"a")),n(l))}}var r=/^(\s|&nbsp;|　)+/i;e.addPlugin({id:"autoformat",click:function(){i(e.curEditor.dom)}})})(jQuery.jQEditor,jQuery);