/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){var n=(location.hostname,[]);e.addPlugin({id:"uploadremoteimage",domains:[location.hostname],click:function(){r.check(e.curEditor.dom)}});var r={index:0,check:function(r){var i,o,a=r.getElementsByTagName("img"),s=e.plugin("uploadremoteimage"),l=0,d=a.length;for(n=[],l=0;d>l;l++)i=e.$(a[l]).attr("src"),o=this.getHostname(i),o&&t.inArray(o,s.domains)&&n.push(a[l]);n.length?(e.message("有 "+n.length+" 张图片等待上传，请稍等..."),this.upload()):e.message("未检测到需要上传的图片")},getHostname:function(e){var n,r="";return e=t.trim(e),/^https?:/i.test(e)&&(n=e.split("/"),r=n[2]),r},upload:function(){var r=this,i=n.shift(),o=t(i).attr("src"),a="/upload.php?action=saveFromUrl";r.index+=1,t.ajax({type:"POST",url:a,data:{saveFromUrl:o},dataType:"json",success:function(t){e.$(i).attr("src",t.url)},complete:function(){n.length?(e.message("第 "+r.index+" 张图片上传完成"),setTimeout(function(){r.upload()},500)):(r.index=0,e.message("所有图片上传完成"))}})}}})(jQuery.jQEditor,jQuery);