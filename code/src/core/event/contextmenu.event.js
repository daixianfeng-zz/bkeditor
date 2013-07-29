/**
 * 右键菜单
 */
(function(E, $){

E.addEvent({
	name: 'contextmenu',
	type: ['contextmenu'],
	area: 'editArea',
	fn: function( e ) {
		var shortcutmenu = E.plugin("shortcutmenu");
		if( shortcutmenu && !shortcutmenu.contextmenu() ){
			return;
		}
		var menulist = [];
		menulist.push(
			{name: '全选', cmd: 'selectall', icon: 'bke-SelectAll'},
			{name: '清空文档', cmd: 'cleardoc', icon:'bke-ClearDoc'},
			{name: 'separator'}
		);
		
		var $table = $(e.target).closest('table');
		if ( $table.length ) {
			menulist = intable(menulist, $table);
		} else {
			menulist.push(
				{name: '段落格式', icon:'bke-JustifyFull', submenu: [
					{name:'左对齐',cmd:'justifyleft', icon:'bke-JustifyLeft'},
					{name:'右对齐',cmd:'justifyright', icon:'bke-JustifyRight'},
					{name:'居中对齐',cmd:'justifycenter', icon:'bke-JustifyCenter'},
					{name:'两端对齐',cmd:'justifyfull', icon:'bke-JustifyFull'}
				]},
				{name: '插入表格', icon:'bke-InsertTable', submenu: E.utils.execPlugin('tablemenu','getTablePanel')}
			);
		}
		
		menulist.push(
			{name: 'separator'},
			{name: '段前插入段落', cmd: 'insertparagraphbefore', param: ''},
			{name: '段后插入段落', cmd: 'insertparagraphafter', param: ''},
			{name: '复制(Ctrl + c)', icon:'bke-Copy', cmd: 'copy'},
			{name: '粘帖(Ctrl + v)', icon:'bke-Paste', cmd: 'paste'},
			{name: '插入代码', icon:'bke-Code', cmd: 'highlightcode'}
		);
		
		E.Menu.contextmenu(menulist, e);
		
		// 选中区域点击
		if($(e.target).hasClass('selectCellClass')){
			
		}
	}
});

// 构造表格相关右键菜单
function intable(menulist, $table) {
	var tmenu = {
		name: '表格',
		icon: 'bke-InsertTable', 
		submenu: [
			{name:'删除表格', icon:'bke-RemoveTable', cmd:'deletetable'},
			{name:'-'},
			{name:'左插入列', icon:'bke-ColumnInsertBefore', cmd:'insertcolbefore'},
			{name:'右插入列', icon:'bke-ColumnInsertAfter', cmd:'insertcolafter'},
			{name:'上插入行', icon:'bke-RowInsertBefore', cmd:'insertrowbefore'},
			{name:'下插入行', icon:'bke-RowInsertAfter', cmd:'insertrowafter'},
			{name:'-'},
			{},
			{},
			{name:'-'},
			{name:'合并单元格', icon:'bke-CellCombine', cmd:'combinecells'},
			{name:'向下合并', icon:'bke-RowMergeAfter', cmd:'combinerowafter'},
			{name:'向右合并', icon:'bke-ColumnMergeAfter', cmd:'combinecolafter'},
			{name:'-'},
			{name:'表格属性', icon:'bke-TableProps', cmd:'tableprops'}
		]};
	
	if( $table.find('caption').length ){
		tmenu.submenu[7] = {name:'删除表格名称', cmd:'tabletitle'};
	} else {
		tmenu.submenu[7] = {name:'插入表格名称', cmd:'tabletitle'};
	}
	
	if( $table.find('th').length ){
		tmenu.submenu[8] = {name:'删除表格标题行', cmd:'tablehead'};
	} else {
		tmenu.submenu[8] = {name:'插入表格标题行', cmd:'tablehead'};
	}
	menulist.push(tmenu);
	
	menulist.push(
		{name:'单元格对齐方式', icon:'bke-JustifyFull', submenu:[
			{name:'居左', cmd:'celljustify', param:'4'},
			{name:'居中', cmd:'celljustify', param:'5'},
			{name:'居右', cmd:'celljustify', param:'6'},
			{name:'-'},
			{name:'居左（靠上）', cmd:'celljustify', param:'1'},
			{name:'居中（靠上）', cmd:'celljustify', param:'2'},
			{name:'居右（靠上）', cmd:'celljustify', param:'3'},
			{name:'-'},
			{name:'居左（靠下）', cmd:'celljustify', param:'7'},
			{name:'居中（靠下）', cmd:'celljustify', param:'8'},
			{name:'居右（靠下）', cmd:'celljustify', param:'9'}
		]},
		{name:'表格对齐方式', submenu:[
			{name:'左浮动', cmd:'tablefloat', param:'1'},
			{name:'居中', cmd:'tablefloat', param:'2'},
			{name:'右浮动', cmd:'tablefloat', param:'3'}
		]}
	);
	
	var cellBackgroundColor = {
			name: '单元格背景色',
			submenu: E.utils.execPlugin('colormenu','getCellcolorPicker')
		};
		
	menulist.push(cellBackgroundColor);
	
	return menulist;
}

})(jQuery.jQEditor, jQuery);