/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e){function t(){for(var e="<table>",t=0;n.length>t;t++){var i=n[t];e+="<tr>";for(var r=0;i.length>r;r++)e+='<td><a href="javascript:void(0)" cmd="spechars" param="'+i[r]+'"'+' class="special_num">'+i[r]+"</a></td>";e+="</tr>"}return e+="</table>"}var n=[["±","×","÷","∶","∑","∏","∪","∩","∈","∷"],["√","⊥","∥","∠","⌒","∫","∮","≡","≌","≈"],["∝","≠","≮","≯","≤","≥","∞","∵","∴","㏑"],["㏒"],["＄","￠","￡","㏎","㎎","㎏","㎜","㎝","㎞","㎡"],["㏄","㏕","№"],["ā","á","ǎ","à","ē","é","ě","è","ī","í"],["ǐ","ì","ō","ó","ǒ","ò","ū","ú","ǔ","ù"],["ǖ","ǘ","ǚ","ǜ","ü"]];e.addPlugin({id:"specharsmenu",type:"panel",fill:function(){e.fillPanel("specharsmenu",t())},click:function(){e.toolbar.togglePanel("specharsmenu")}})})(jQuery.jQEditor,jQuery);