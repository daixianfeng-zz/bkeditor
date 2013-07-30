/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){e.addPlugin({id:"ulmenu",type:"panel",isEnable:!0,fill:function(t){var n="",r=[{name:"小圆圈",cmd:"insertunorderedlist",param:"disc"},{name:"小圆点",cmd:"insertunorderedlist",param:"circle"},{name:"小方块",cmd:"insertunorderedlist",param:"square"}];n=e.Menu.create(r),e.fillPanel("insertunorderedlistmenu",n,t)}})})(window.jQuery.jQEditor);