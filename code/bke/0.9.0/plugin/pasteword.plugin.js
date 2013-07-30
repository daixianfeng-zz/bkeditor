/*! Bkeditor - v0.9.0 - 2013-07-30
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){e.addUi({id:"pasteworddialog",html:'<p>请将Word当中的内容粘贴到下面的方框里，然后点击确定按钮。</p>		<textarea id="content" name="content" rows="20" cols="75"></textarea>',submit:function(){var t=this.getValues();if(t.url){var n="";e.utils.pasteHTML(n)}}}),e.addPlugin({id:"pasteword",title:"从 MS Word 粘帖",ui:"pasteworddialog",type:"dialog",getData:function(){var e={};return e}})})(jQuery.jQEditor,jQuery);