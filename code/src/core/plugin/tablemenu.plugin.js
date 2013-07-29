/**
 * @fileoverview
 * 插入表格下拉列表
 * @author	daixianfeng@hudong.com
 * @createTime	2013.04.01
 * @editor
 * @updateTime
 * @version	0.1
 **/
(function(E, $){
	E.addPlugin({
		id : 'tablemenu',
		type : 'panel',
		isEnable : true,
		fill : function(){
			//填充table面板
			E.fillPanel('inserttablemenu', createTablePanel(10,10));
			
			$(document).delegate('.bke-plugin-table td', 'mouseenter',function(e){
			
				var ij =  $(e.target).closest('td[args]').attr('args').split('-'),
					row = parseInt(ij[0]),
					col = parseInt(ij[1]),
					table = $(e.target).closest('.bke-plugin-table');
					
				table.parent().children('.bke-info').text(ij[0]+'行 '+ij[1]+'列');
				table.find('td').removeClass('cell-hover');
				table.find('tr:lt('+row+')').find('td:lt('+col+')').addClass('cell-hover');
				
			}).delegate('.bke-plugin-table', 'mouseleave',function(e){
			
				var table = $(e.target).closest('.bke-plugin-table');
				
				table.parent().children('.bke-info').text('0行 0列');
				table.find('td').removeClass('cell-hover');
			});
		},
		
		getTablePanel: function(){
			return createTablePanel(10,10);
		}
	});

	// 构造表格下拉菜单
	function createTablePanel(row,col){
		//拼接table面板html字符串
		// 面板样式[TODO]
		var tablePanel = document.createElement('div');
		var newTable = document.createElement('table');
		$(newTable).addClass('bke-plugin-table');
		for(var i= 0;i<row;i++){
			$(newTable).append('<tr></tr>');
			for(var j=0;j<col;j++){
				var curTr = $(newTable).find('tr:eq('+i+')');
				curTr.append('<td args="'+(i+1)+'-'+(j+1)+'" cmd="inserttable" param="insert"><a></a></td>');
			}
		}
		var insertMenu = E.Menu.create([{name:'插入表格',cmd:'inserttable', param:'showDialog'}]);
		
		$(tablePanel).append('<div class="bke-info">0行 0列</div>');
		$(tablePanel).append(newTable);
		//$(tablePanel).append(insertMenu);
		return tablePanel.innerHTML;
	}

})(jQuery.jQEditor, jQuery);