/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){e.addPlugin({id:"inserttime",click:function(){var t=new Date,n=t.getHours(),i=t.getMinutes(),r=t.getSeconds();n=n>9?n:"0"+n,i=i>9?i:"0"+i,r=r>9?r:"0"+r;var o=" "+n+":"+i+":"+r+" ";e.command("insert",o)}})})(window.jQuery.jQEditor);