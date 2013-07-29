/**
* @fileoverview
* 字体颜色插件
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
(function(E, $){
	var menulist = [
		{name:'宋体',cmd:'fontfamily', param:'SimSun','styleName':'bke-SimSun'},
		{name:'仿宋体',cmd:'fontfamily', param:'FangSong_GB2312','styleName':'bke-FangSong_GB2312'},
		{name:'微软雅黑',cmd:'fontfamily', param:'Microsoft YaHei','styleName':'bke-Microsoft_YaHei'},
		{name:'黑体',cmd:'fontfamily', param:'SimHei','styleName':'bke-SimHei'},
		{name:'楷体',cmd:'fontfamily', param:'KaiTi_GB2312','styleName':'bke-KaiTi_GB2312'},
		//{name:'CourierNew',cmd:'fontfamily', param:'Courier New','styleName':'bke-Courier_New'},
		//{name:'TimesNewRoman',cmd:'fontfamily', param:'Times New Roman','styleName':'bke-Times_New_Roman'},
		{name:'Impact',cmd:'fontfamily', param:'Impact','styleName':'bke-Impact'},
		{name:'Georgia',cmd:'fontfamily', param:'Georgia','styleName':'bke-Georgia'},
		{name:'Arial',cmd:'fontfamily', param:'Arial','styleName':'bke-Arial'},
		{name:'Verdana',cmd:'fontfamily', param:'Verdana','styleName':'bke-Verdana'},
		{name:'Tahoma',cmd:'fontfamily', param:'Tahoma','styleName':'bke-Tahoma'}
	];
	
	E.addPlugin({
		id: 'fontfamilymenu',
		type: 'panel',
		isEnable: true,
		fill: function(Eid){
			var familyPanel = E.Menu.create(menulist);
			E.fillPanel('fontfamilymenu', familyPanel, Eid);
		},
		
		// 将当前字体回显到工具栏
		echo: function($btn, value){
			value = value.replace(/'/g, '')||'';
			value = value.toLowerCase();
			
			$.each(menulist, function(i, n){
				if ( n.param.toLowerCase() === value ){
					$btn.find('#icon-fontfamilymenu').find('.bke-Font a').html(n.name);
					return false;
				}
			})
		}
	});
})(jQuery.jQEditor, jQuery);