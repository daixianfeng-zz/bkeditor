/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E){
	E.addPlugin({
		id : 'datemenu',
		type : 'panel',
		isEnable : true,
		fill : function(Eid){
			var familyPanel = '';
			var menulist = [
				{name:'Y-m-d',cmd:'insertdate', param:'type_1'},
				{name:'Y/m/d',cmd:'insertdate', param:'type_2'},
				{name:'Y.m.d',cmd:'insertdate', param:'type_3'},
				{name:'Y年m月d日',cmd:'insertdate', param:'type_4'}
		   ];
			familyPanel = E.Menu.create(menulist);
			E.fillPanel('datemenu',familyPanel,Eid);
		},
		type_1:function (){
			E.utils.pasteHTML(getDate ('Y-m-d'));
		},
		type_2:function (){
			E.utils.pasteHTML(getDate ('Y/m/d'));
		},
		type_3:function (){
			E.utils.pasteHTML(getDate ('Y.m.d'));
		},
		type_4:function (){
			E.utils.pasteHTML(getDate ('Y年m月d日'));
		}
	});

	function getDate( name ){
		if( typeof name !== "string" || !name ){
			name = "Y-m-d";
		}
		var D = new Date(), s = {}, d = '';
		s.Y = D.getFullYear();
		s.m = D.getMonth() + 1;
		s.d = D.getDate();

		return name.replace("Date_", "").replace("Y", s.Y).replace("m", s.m).replace("d", s.d);
	}
})(window.jQuery.jQEditor);