/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E,$){
	E.addPlugin({
		id : 'colormenu',
		type : 'panel',
		isEnable : true,
		fill : function(){
			var colorPanel = '';
			E.fillPanel('forecolormenu',genColorPicker('清除颜色','forecolor',E));
			E.fillPanel('backcolormenu',genColorPicker('清除颜色','backcolor',E));
			E.fillPanel('cellcolormenu',genColorPicker('清除颜色','cellcolor',E));
		},
		forecolor:function(){
			E.toolbar.togglePanel('forecolormenu');
		},
		backcolor:function(){
			E.toolbar.togglePanel('backcolormenu');
		},
		cellcolor:function(){
			E.toolbar.togglePanel('cellcolormenu');
		},
		getCellcolorPicker:function(){
			return genColorPicker('清除颜色','cellcolor',E);
		}
	});
	
	$(document).delegate('.edui-box td a', 'mouseenter', function(){
		var o = $(this),
			preview = $('.edui-colorpicker-preview');
		preview.css({'background-color':o.attr('param')});
	});
	
	$(document).delegate('.edui-box td a', 'mouseleave', function(){
		var o = $(this),
			preview = $('.edui-colorpicker-preview');
		preview.css({'background-color':''});
	});
	
	function genColorPicker(noColorText,cmd,editor){
		var COLORS = (
            'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
            'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
            'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
            'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
            'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
            '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
            'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');
        var html = '<div id="##" class="edui-colorpicker">' +
            '<div class="edui-colorpicker-topbar edui-clearfix">' +
             '<div unselectable="on" id="##_preview" class="edui-colorpicker-preview"></div>' +
             '<div unselectable="on" class="edui-colorpicker-nocolor" >'+ noColorText +'</div>' +
            '</div>' +
            '<table  class="edui-box" style="border-collapse: collapse;" cellspacing="0" cellpadding="0">' +
            '<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px"><td colspan="10">'+editor.getLang("themeColor")+'</td> </tr>'+
            '<tr class="edui-colorpicker-tablefirstrow" >';
        for (var i=0; i<COLORS.length; i++) {
            if (i && i%10 === 0) {
                html += '</tr>'+(i==60?'<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;"><td colspan="10">'+editor.getLang("standardColor")+'</td></tr>':'')+'<tr'+(i==60?' class="edui-colorpicker-tablefirstrow"':'')+'>';
            }
            html += i<70 ? '<td style="padding: 0 2px;"><a hidefocus cmd="'+cmd+'" title="'+COLORS[i]+'" onclick="return false;" href="javascript:" unselectable="on" class="edui-box edui-colorpicker-colorcell"' +
                        ' param="#'+ COLORS[i] +'"'+
                        ' style="background-color:#'+ COLORS[i] +';border:solid #ccc;'+
                        (i<10 || i>=60?'border-width:1px;':
                         i>=10&&i<20?'border-width:1px 1px 0 1px;':

                        'border-width:0 1px 0 1px;')+
                        '"' +
                    '></a></td>':'';
        }
        html += '</tr></table></div>';
        return html;
    }
})(window.jQuery.jQEditor,window.jQuery);