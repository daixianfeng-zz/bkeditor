/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){e.addUi({id:"anchordialog",html:'<div style="width:350px;padding:10px;">锚点名称：<input name="name" style="width:200px;height:20px;"/></div>',submit:function(){var e=t("#anchordialog").find("input[name=name]").val();return e=t.trim(e),e?'<img name="'+e+'" title="'+e+'" class="bke-anchor"/>':void 0}}),e.addPlugin({id:"anchor",title:"锚点",ui:"anchordialog",type:"dialog"})})(jQuery.jQEditor,jQuery);