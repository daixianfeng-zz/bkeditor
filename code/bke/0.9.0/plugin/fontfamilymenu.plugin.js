/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){var n=[{name:"宋体",cmd:"fontfamily",param:"SimSun",styleName:"bke-SimSun"},{name:"仿宋体",cmd:"fontfamily",param:"FangSong_GB2312",styleName:"bke-FangSong_GB2312"},{name:"微软雅黑",cmd:"fontfamily",param:"Microsoft YaHei",styleName:"bke-Microsoft_YaHei"},{name:"黑体",cmd:"fontfamily",param:"SimHei",styleName:"bke-SimHei"},{name:"楷体",cmd:"fontfamily",param:"KaiTi_GB2312",styleName:"bke-KaiTi_GB2312"},{name:"Impact",cmd:"fontfamily",param:"Impact",styleName:"bke-Impact"},{name:"Georgia",cmd:"fontfamily",param:"Georgia",styleName:"bke-Georgia"},{name:"Arial",cmd:"fontfamily",param:"Arial",styleName:"bke-Arial"},{name:"Verdana",cmd:"fontfamily",param:"Verdana",styleName:"bke-Verdana"},{name:"Tahoma",cmd:"fontfamily",param:"Tahoma",styleName:"bke-Tahoma"}];e.addPlugin({id:"fontfamilymenu",type:"panel",isEnable:!0,fill:function(t){var r=e.Menu.create(n);e.fillPanel("fontfamilymenu",r,t)},echo:function(e,r){r=r.replace(/'/g,"")||"",r=r.toLowerCase(),t.each(n,function(t,n){return n.param.toLowerCase()===r?(e.find("#icon-fontfamilymenu").find(".bke-Font a").html(n.name),!1):void 0})}})})(jQuery.jQEditor,jQuery);