/*! Bkeditor - v0.9.0 - 2013-08-03
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E,$){
	E.addUi({
		id : 'tabledialog',
		submit : function(){
			var curDialog = $('#tabledialog');
			if(curDialog.size() !== 0){
				var title = curDialog.find('[name=title]')[0].checked,
					col = curDialog.find('[name=col]').val(),
					row = curDialog.find('[name=row]').val(),
					//align = curDialog.find('[name=align]:checked').val(),
					float = curDialog.find('[name=float]:checked').val(),
					head = curDialog.find('[name=head]')[0].checked;
				//对于操作复杂的拼接处理，可以使用此方式
				var insertHtml = E.utils.execPlugin('table','preInsert',{
					title : title,
					head : head,
					col : col,
					row : row,
					//align : align
					float : float
				});
				return insertHtml;
			}else{
				return false;
			}
		},
		changeAttr : function(){
			var curDialog = $('#tableattrdialog');
			if(curDialog.size() !== 0){
				var title = curDialog.find('[name=title]')[0].checked,
					col = curDialog.find('[name=col]').val(),
					row = curDialog.find('[name=row]').val(),
				//align = curDialog.find('[name=align]:checked').val(),
					float = curDialog.find('[name=float]:checked').val(),
					head = curDialog.find('[name=head]')[0].checked;
				E.utils.execPlugin('table','changeTableAttr',{
					title : title,
					head : head,
					col : col,
					row : row,
					//align : align
					float : float
				});
			}else{
				return false;
			}
		},
		setValues : function(args){
			var curDialog = $('#tableattrdialog:visible');
			if(curDialog.length > 0){
				curDialog.find('[name=float][value='+args.float+']')[0].checked = true;
				if(args.title){
					curDialog.find('[name=title]')[0].checked = true;
				}else{
					curDialog.find('[name=title]')[0].checked = false;
				}
				if(args.head){
					curDialog.find('[name=head]')[0].checked = true;
				}else{
					curDialog.find('[name=head]')[0].checked = false;
				}
				if(args.row){
					curDialog.find('[name=row]').val(args.row);
				}
				curDialog.find('[name=row]')[0].disabled = true;
				if(args.col){
					curDialog.find('[name=col]').val(args.col);
				}
				curDialog.find('[name=col]')[0].disabled = true;
			}
		}
	});
})(window.jQuery.jQEditor ,window.jQuery);
(function(E){E.dialogHtml["tabledialog"] ="<TABLE ui=\"tabledialog\"><TR><TD>\u8868\u683c\u6a21\u677f<\/TD><TD><select id=\"table-template\" name=\"template\"><option value=\"tpl1\" selected=\"selected\">\u6a21\u677f1<\/option><option value=\"tpl2\">\u6a21\u677f2<\/option><\/select><\/TD><TD> &nbsp <\/TD><\/TR><TR><TD>\u8868\u683c\u6807\u9898<\/TD><TD><input type=\"checkbox\" id=\"table-title\" name=\"title\" \/><\/TD><\/TR><TR><TD>\u8868\u5934<\/TD><TD><input type=\"checkbox\" id=\"table-head\" name=\"head\" \/><\/TD><TD> &nbsp <\/TD><\/TR><TR><TD>\u884c<\/TD><TD><input type=\"text\" id=\"table-col\" name=\"row\" value=\"4\"\/><\/TD><TD> &nbsp <\/TD><\/TR><TR><TD>\u5217<\/TD><TD><input type=\"text\" id=\"table-row\" name=\"col\" value=\"3\"\/><\/TD><TD> &nbsp <\/TD><\/TR><TR><TD>\u6d6e\u52a8\u65b9\u5f0f<\/TD><TD><p><input type=\"radio\" id=\"table-float-left\" name=\"float\" value=\"1\"\/>\u5de6\u6d6e\u52a8<input type=\"radio\" id=\"table-align-center\" name=\"float\" checked=\"checked\" value=\"2\"\/>\u5c45\u4e2d<input type=\"radio\" id=\"table-align-right\" name=\"float\" value=\"3\"\/>\u53f3\u6d6e\u52a8<\/p><\/TD><!--<TD><p><input type=\"radio\" id=\"table-align-lt\" name=\"align\" value=\"1\"\/>\u5c45\u5de6\u4e0a<input type=\"radio\" id=\"table-align-ct\" name=\"align\" value=\"2\"\/>\u5c45\u4e2d\u4e0a<input type=\"radio\" id=\"table-align-rt\" name=\"align\" value=\"3\"\/>\u5c45\u53f3\u4e0a<\/p><p><input type=\"radio\" id=\"table-align-lm\" name=\"align\" value=\"4\"\/>\u5c45\u5de6\u4e2d<input type=\"radio\" id=\"table-align-cm\" name=\"align\" checked=\"checked\" value=\"5\"\/>\u5c45&nbsp&nbsp\u4e2d<input type=\"radio\" id=\"table-align-rm\" name=\"align\" value=\"6\"\/>\u5c45\u53f3\u4e2d<\/p><p><input type=\"radio\" id=\"table-align-lb\" name=\"align\" value=\"7\"\/>\u5c45\u5de6\u4e0b<input type=\"radio\" id=\"table-align-cb\" name=\"align\" value=\"8\"\/>\u5c45\u4e2d\u4e0b<input type=\"radio\" id=\"table-align-rb\" name=\"align\" value=\"9\"\/>\u5c45\u53f3\u4e0b<\/p><\/TD>  --><TD> &nbsp <\/TD><\/TR><\/TABLE>"})(jQuery.jQEditor);
(function(E,$){
	E.addPlugin({
		id : 'table',
		type : 'dialog',
		selectCellClass : 'bke-cell-selected',
		selectTableClass : 'bke-table-selected',
		tableFreshed : '',
		init : function(){
			E.utils.loadDialog(this.id,E.config.cBase.uiDir+'table/');
		},
		showDialog : function(curEditor){
			//加载表格弹窗，初始化并打开
			var id = curEditor ? curEditor.Eid : E.curEditor.Eid;
			E.dialog.open({
				id : 'tabledialog',
				editor : id,
				title: '插入表格',
				content: $('[ui=tabledialog]'),
				ok : function(){
					E.dialog.revertSelection();
					E.command('tabledialog');
				},
				cancel : function(){
					E.dialog.close('tabledialog');
				},
				icon: 'succeed'
			});
		},
		insert : function(col_row){
			//插入表格到当前光标处
			var ij =  col_row.split('-');
			var inAttr = {
				row : ij[0],
				col : ij[1],
				floatStyle : '',
				head : 0,
				title : ''
			}
			var tableHtml = this.getTableHtml(inAttr);
			E.coreCommand.editInsert(tableHtml);
		},
		
		getTableHtml: function( conf ) {
			
			var row = parseInt(conf.row) < 50 ? parseInt(conf.row) : 4,
				col = parseInt(conf.col) < 20 ? parseInt(conf.col) : 3,
				className = '';
			
			className = conf.floatStyle? ' table-'+conf.floatStyle : '';
			
			var html = '<table class="table '+className+'" border="1" cellpadding="0" border-style="solid" style="width:760px"><tbody>';
			
			// 表格名称行
			if(conf.title){
				html += '<caption>'+E.utils.spaceText+'</caption>';
			}
			
			for(var i= 0;i<row;i++){
				html += '<tr>';
				for(var j=0;j<col;j++){
					if(conf.head && i === 0){
						// 表格标题行
						html += '<th row="'+i+'" col="'+j+'">'+E.utils.spaceText+'</th>';
					}else{
						html += '<td row="'+i+'" col="'+j+'">'+E.utils.spaceText+'</td>';
					}
				}
				html += '</tr>';
			}
			
			html += '</tbody></table>';
			return html;
		},
		
		preInsert : function(attr){
			//插入弹窗前，进行html拼接
			var newTable = E.curEditor.dom.createElement('table');
			//表格基本参数
			var row = parseInt(attr.row) < 50 ? parseInt(attr.row) : 4,
				col = parseInt(attr.col) < 20 ? parseInt(attr.col) : 3,
				//align = parseInt(attr.align) < 10 ? parseInt(attr.align) : 5,
				float = parseInt(attr.float) < 4 ? parseInt(attr.float) : 2,
				title = attr.title ? true : false,
				head = attr.head ? true : false;
				
			//此处定义表格的基本样式
			$(newTable).attr({'border':1, 'Cellpadding':0, 'border-style':'solid'});
			
			//表格的宽度选择
			$(newTable).width('100%');
			
			//标题
			if(title){
				$(newTable).prepend('<caption>title</caption>');
			}
			//内容区域，是否有表头
			for(var i= 0;i<row;i++){
				$(newTable).append('<tr></tr>');
				for(var j=0;j<col;j++){
					var curTr = $(newTable).find('tr:eq('+i+')');
					if(head && i === 0){
						curTr.append('<th row='+i+' col='+j+'>'+E.utils.spaceText+'</th>');
					}else{
						curTr.append('<td row='+i+' col='+j+'>'+E.utils.spaceText+'</td>');
					}
				}
			}
			//浮动方式
			var floatStyle = '';
			switch(float){
				case 1 : floatStyle = 'left';break;
				case 2 : floatStyle = 'none';break;
				case 3 : floatStyle = 'right';break;
				default : floatStyle = 'none';break;
			}
			$(newTable).css('float',floatStyle);
			return newTable.outerHTML;
		},
		insertRow : function(pos){
			/*插入一行，pos选择在上还是在下插入*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var selectRectangle = getSelectedRectangle();
			//总列数
			var colNums = $(selectRectangle.curTable).find('tr').first().find('th,td').length;
			var insertColPosition = {},newCell = {},oldCell = {};
			//选中区域跨的行数，循环次数为要插入的行数
			for(var i=selectRectangle.startRow;i<=selectRectangle.endRow;i++){
					var newTr = E.curEditor.dom.createElement('tr');
					//hideBefore为前一个插入的单元格是否是隐藏的单元格，并且隐藏还未结束
					//使用整型变量控制，正数时对应该单元格仍需继续隐藏
					var cloneCell = {},hideBefore = 0;
					if(pos === 'forward'){
						//获得待复制的行，然后逐个复制单元格,向上插入为选中区域最顶行
						insertColPosition = $(selectRectangle.curTable).find('tr:eq('+i+')');
						for(var j=0;j<colNums;j++){
							oldCell = insertColPosition.find('td,th').eq(j);
							cloneCell = this._cloneRowCell(oldCell,pos,hideBefore);
							newCell = cloneCell['cloneCell'];
							hideBefore = cloneCell['hideCells'] ? cloneCell['hideCells'] :hideBefore - 1;
							$(newTr).append(newCell);
						}
						insertColPosition.before($(newTr));
					}else if(pos === 'backward'){
						//获得待复制的行，然后逐个复制单元格,向下插入为选中区域最底行
						insertColPosition = $(selectRectangle.curTable).find('tr:eq('+selectRectangle.endRow+')');
						for(var j=0;j<colNums;j++){
							oldCell = insertColPosition.find('td,th').eq(j);
							cloneCell = this._cloneRowCell(oldCell,pos,hideBefore);
							newCell = cloneCell['cloneCell'];
							hideBefore = cloneCell['hideCells'] ? cloneCell['hideCells'] :hideBefore - 1;
							$(newTr).append(newCell);
						}
						insertColPosition.after($(newTr));
					}else{
						E.errorMessage('参数错误');
					}
			}
			//插入结束之后要重新整理表格的索引col，row属性
			this.freshTableIndex(selectRectangle.curTable,true);
		},
		insertCol : function(pos){
			/*插入一列，pos选择在左还是在右插入*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var selectRectangle = getSelectedRectangle();
			//总行数
			var rowNums = $(selectRectangle.curTable).find('tr').length;
			var insertCellPosition = {},curInsertCol = {},newCell = {};
			//hideBefore为前一个插入的单元格是否是隐藏的单元格，并且隐藏还未结束
			//使用整型变量控制，正数时对应该单元格仍需继续隐藏
			var cloneCell = {},hideBefore = 0;
			for(var j=0;j<rowNums;j++){
				curInsertCol = $(selectRectangle.curTable).find('tr:eq('+j+')');
				//选中区域跨的列数，循环次数为要插入的列数
				for(var i=selectRectangle.startCol;i<=selectRectangle.endCol;i++){
					if(pos === 'forward'){
						//获得待复制的单元格，向前插入为选中区域最左边
						insertCellPosition = curInsertCol.find('td,th').eq(i);
						cloneCell = this._cloneColCell(insertCellPosition,pos,hideBefore);
						newCell = cloneCell['cloneCell'];
						insertCellPosition.before(newCell);
					}else if(pos === 'backward'){
						//获得待复制的单元格，向后插入为选中区域最右边
						insertCellPosition = curInsertCol.find('td,th').eq(selectRectangle.endCol);
						cloneCell = this._cloneColCell(insertCellPosition,pos,hideBefore);
						newCell = cloneCell['cloneCell'];
						insertCellPosition.after(newCell);
					}else{
						E.errorMessage('参数错误');
					}
				}
				hideBefore = cloneCell['hideCells'] ? cloneCell['hideCells'] :hideBefore - 1;
			}
			//插入结束之后要重新整理表格的索引col，row属性
			this.freshTableIndex(selectRectangle.curTable,true);
		},
		combineCell : function(){
			/*合并单元格，根据选择区域*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var selectedCell =  getSelectedCell();
			var cellLen = selectedCell.length;
			if(cellLen > 1){
				//选取最后一个单元格，获得最后一个单元格的行列，合并行，合并列属性
				//[warning]与表格选择的耦合性很大，需要确定最后一个选择的单元格时最右下角的单元格
				var oldColSpan = $(selectedCell[cellLen-1]).attr('colspan') ? parseInt($(selectedCell[cellLen-1]).attr('colspan')) : 1,
					oldRowSpan = $(selectedCell[cellLen-1]).attr('rowspan') ? parseInt($(selectedCell[cellLen-1]).attr('rowspan')) : 1;
				//与第一个单元格位置做差，得到合并后的单元格需要的合并行，和并列属性
				var newRowSpan = parseInt($(selectedCell[cellLen-1]).attr('row')) - parseInt($(selectedCell[0]).attr('row')),
					newColSpan= parseInt($(selectedCell[cellLen-1]).attr('col')) - parseInt($(selectedCell[0]).attr('col'));
				$(selectedCell[0]).attr('colspan',newColSpan+oldColSpan);
				$(selectedCell[0]).attr('rowspan',newRowSpan+oldRowSpan);
				selectedCell.not(selectedCell[0]).hide();
				selectedCell.not(selectedCell[0]).attr('rowspan',1).attr('colspan',1);
				selectedCell.not(selectedCell[0]).removeClass(E.curEditor.config.selectCellClass);
			}
		},
		combineColAfter : function(judge){
			/*合并单元格，同行向后一个单元格合并*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var curCell = getCurrentCell();
			if(curCell.length > 0){
				var oldRowSpan = $(curCell[0]).attr('rowspan') ? parseInt($(curCell[0]).attr('rowspan')) : 1,
					oldColSpan = $(curCell[0]).attr('colspan') ? parseInt($(curCell[0]).attr('colspan')) : 1;
				//获取同行，之后列中第一个不隐藏的单元格
				var nextCell = $(curCell[0]).nextAll('td,th').eq(oldColSpan-1).not(':hidden');
				if(nextCell.length > 0){
					var nextRowSpan = nextCell.attr('rowspan') ? parseInt(nextCell.attr('rowspan')) : 1,
						nextColSpan = nextCell.attr('colspan') ? parseInt(nextCell.attr('colspan')) : 1;
					//如果所占行数一样，则可以合并
					if(oldRowSpan === nextRowSpan){
						if(judge){
							return true;
						}else{
							nextCell.attr('colspan','1').attr('rowspan','1').hide();
							curCell.attr('colspan',oldColSpan+nextColSpan);
						}
					}else{
						if(judge){
							return false;
						}else{
							E.errorMessage('合并失败，单元格行跨度不一致');
						}
					}
				}else{
					if(judge){
						return false;
					}else{
						E.errorMessage('没有单元格可以合并');
					}
				}
			}
		},
		combineRowAfter : function(judge){
			/*合并单元格，同列向后一个单元格合并*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var curCell = getCurrentCell();
			if(curCell.length > 0){
				var oldRowSpan = $(curCell[0]).attr('rowspan') ? parseInt($(curCell[0]).attr('rowspan')) : 1,
					oldColSpan = $(curCell[0]).attr('colspan') ? parseInt($(curCell[0]).attr('colspan')) : 1;
				var oldCol = parseInt($(curCell[0]).attr('col'));
				//获取同列，下面行中第一个不隐藏的单元格
				var nextCell = $(curCell[0]).closest('tr').nextAll('tr:eq('+(oldRowSpan-1)+')').first().find('td[col='+oldCol+']:visible,th[col='+oldCol+']:visible');
				if(nextCell.length > 0){
					var nextRowSpan = nextCell.attr('rowspan') ? parseInt(nextCell.attr('rowspan')) : 1,
						nextColSpan = nextCell.attr('colspan') ? parseInt(nextCell.attr('colspan')) : 1;
					//如果所占列数一样，则可以合并
					if(nextColSpan === oldColSpan){
						if(judge){
							return true;
						}else{
							nextCell.attr('colspan','1').attr('rowspan','1').hide();
							curCell.attr('rowspan',oldRowSpan+nextRowSpan);
						}
					}else{
						if(judge){
							return false;
						}else{
							E.errorMessage('合并失败，单元格列跨度不一致');
						}
					}
				}else{
					if(judge){
						return false;
					}else{
						E.errorMessage('没有单元格可以合并');
					}
				}
			}
		},
		splitCellWhole : function(cell){
			/*完全拆分单元格*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var curCell = typeof cell === 'object' ? $(cell) : getCurrentCell();
			if(curCell.length > 0){
				var oldRowSpan = $(curCell[0]).attr('rowspan') ? parseInt($(curCell[0]).attr('rowspan')) : 1;
				var oldColSpan = $(curCell[0]).attr('colspan') ? parseInt($(curCell[0]).attr('colspan')) : 1;
				var oldCol = parseInt($(curCell[0]).attr('col'));
				//获取那些因为当前单元格的列合并，行合并所隐藏的单元格
				var nextCell = $(curCell[0]).closest('tr').nextAll('tr:lt('+(oldRowSpan-1)+')').andSelf().find('td:lt('+(oldCol+oldColSpan)+'):gt('+(oldCol-1)+'),th:lt('+(oldCol+oldColSpan)+'):gt('+(oldCol-1)+')').not(':visible');
				if(nextCell.length > 0){
					curCell.attr('colspan','1').attr('rowspan','1').addClass(E.curEditor.config.selectCellClass);
					nextCell.attr('colspan','1').attr('rowspan','1').addClass(E.curEditor.config.selectCellClass).show();
				}else{
					E.errorMessage('没有单元格供拆分');
				}
			}
		},
		splitToRows : function(cell){
			/*拆分成行单元格，根据光标位置*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var curCell = typeof cell === 'object' ? $(cell) : getCurrentCell();
			if(curCell.length > 0){
				var oldRowSpan = $(curCell[0]).attr('rowspan') ? parseInt($(curCell[0]).attr('rowspan')) : 1;
				var oldColSpan = $(curCell[0]).attr('colspan') ? parseInt($(curCell[0]).attr('colspan')) : 1;
				var oldCol = parseInt($(curCell[0]).attr('col'));
				//获取那些因为当前单元格的列合并所隐藏的单元格
				var nextCell = $(curCell[0]).closest('tr').nextAll('tr:lt('+(oldRowSpan-1)+')').find('td[col='+oldCol+']:hidden,th[col='+oldCol+']:hidden');
				if(nextCell.length > 0){
					curCell.attr('rowspan','1').addClass(E.curEditor.config.selectCellClass);
					if(oldColSpan > 1){
						nextCell.attr('colspan',oldColSpan);
					}
					nextCell.attr('rowspan','1').addClass(E.curEditor.config.selectCellClass).show();
				}else{
					E.errorMessage('没有行单元格供拆分');
				}
			}
		},
		splitToCols : function(cell){
			/*拆分列单元格，根据光标位置*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var curCell =  typeof cell === 'object' ? $(cell) : getCurrentCell();
			if(curCell.length > 0){
				var oldRowSpan = $(curCell[0]).attr('rowspan') ? parseInt($(curCell[0]).attr('rowspan')) : 1;
				var oldColSpan = $(curCell[0]).attr('colspan') ? parseInt($(curCell[0]).attr('colspan')) : 1;
				//获取那些因为当前单元格的行合并所隐藏的单元格
				var nextCell = $(curCell[0]).nextAll('td:lt('+(oldColSpan-1)+'),th:lt('+(oldColSpan-1)+')').not(':visible');
				if(nextCell.length > 0){
					curCell.attr('colspan','1').addClass(E.curEditor.config.selectCellClass);
					if(oldRowSpan > 1){
						nextCell.attr('rowspan',oldRowSpan);
					}
					nextCell.attr('colspan','1').addClass(E.curEditor.config.selectCellClass).show();
				}else{
					E.errorMessage('没有列单元格供拆分');
				}
			}
		},
		deleteCol : function(){
			/*删除一行，根据光标位置*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var selectRectangle = getSelectedRectangle();
			//总列数
			var colNums = $(selectRectangle.curTable).find('tr').first().find('th,td').length;
			var deleteColPosition = {},oldCell = {};
			//使用遍历选中行的方式，从后到前依次便利，不会带来因为删除而要用的索引值错误的情况
			for(var i=selectRectangle.endRow;i>=selectRectangle.startRow;i--){
				deleteColPosition = $(selectRectangle.curTable).find('tr:eq('+i+')');
				//从后到前依次便利，不会带来因为删除而要用的索引值错误的情况
				for(var j=colNums-1;j>=0;j--){
					oldCell = deleteColPosition.find('td,th').eq(j);
					var colInfo = this._colInfo(oldCell);
					//单元格在一个行合并区域（详见 _colInfor 函数）
					if(colInfo.isInCol < 0){
						//拥有行合并属性
						if(colInfo.lastRowspan > 1){
							// if在行合并区域的顶端,else在行合并区域的中间或底端
							if(colInfo.isInCol + colInfo.lastRowspan === 0){
								var nextRowCell = deleteColPosition.next('tr').find('[col='+j+']');
								nextRowCell.attr('rowspan',colInfo.lastRowspan-1).show();
							}else{
								colInfo.lastVisibleCell.attr('rowspan',colInfo.lastRowspan-1);
							}
						}
					}
					oldCell.remove();
				}
				deleteColPosition.remove();
			}
			//删除结束之后要重新整理表格的索引col，row属性
			this.freshTableIndex(selectRectangle.curTable,true);
		},
		deleteRow : function(){
			/*删除一列，根据光标位置*/
			//开始操作前更新表格，防止属性遗失不能操作;
			this.freshTableIndex(getCurrentTable());
			var selectRectangle = getSelectedRectangle();
			var rowNums = $(selectRectangle.curTable).find('tr').length;
			var deleteCellPosition = {},curDeleteCol = {};
			//使用便利所有的方式，从后到前依次便利，不会带来因为删除而要用的索引值错误的情况
			for(var j=rowNums-1;j>=0;j--){
				curDeleteCol = $(selectRectangle.curTable).find('tr:eq('+j+')');
				//遍历选中列，从后到前依次便利，不会带来因为删除而要用的索引值错误的情况
				for(var i=selectRectangle.endCol;i>=selectRectangle.startCol;i--){
					deleteCellPosition = curDeleteCol.find('td,th').eq(i);
					var rowInfo = this._rowInfo(deleteCellPosition);
					//单元格在一个列合并区域（详见 _rowInfo 函数）
					if(rowInfo.isInRow < 0){
						//拥有列合并属性
						if(rowInfo.lastColspan > 1){
							// if在列合并区域的左端,else在列合并区域的中间或右端
							if(rowInfo.isInRow + rowInfo.lastColspan === 0){
								var nextRowCell = deleteCellPosition.next('td,th');
								nextRowCell.attr('colspan',rowInfo.lastColspan-1).html('del').show();
							}else{
								rowInfo.lastVisibleCell.attr('colspan',rowInfo.lastColspan-1);
							}
						}
					}
					deleteCellPosition.remove();
				}
			}
			//删除结束之后要重新整理表格的索引col，row属性
			this.freshTableIndex(selectRectangle.curTable,true);
		},
		//deleteColRow : function(){/*删除所在行和列，根据选择区域*/},
		deleteTable : function(){
			/*删除整个表格，根据光标位置或整个选择的表*/
		    var curTable = getCurrentTable();
			$(curTable).remove();
		},
		tableAttrDialog : function(){
			/*打开弹窗*/
			var curTable = getCurrentTable();
			//为打开的弹窗设置待显示的参数
			var args = {};
			switch(curTable.css('float')){
				case 'left' : args.float = 1;break;
				case 'none' : args.float = 2;break;
				case 'right' : args.float = 3;break;
				default : args.float = 2;break;
			}
			var hasTh = curTable.find('th').length;
			args.head = hasTh ? true : false;
			var hasTitle = curTable.find('caption:first-child').length;
			args.title = hasTitle ? true : false;
			var rowLen = curTable.find('tr').length;
			args.row = rowLen ? rowLen : false;
			var colLen = curTable.find('tr:first').find('th,td').length;
			args.col = colLen ? colLen : false;
			//ui属性指定要使用的ui类，默认为id
			var id = E.curEditor.Eid;
			E.dialog.open({
				id : 'tableattrdialog',
				editor : id,
				ui : 'tabledialog',
				title: '表格属性',
				content: $('[ui=tabledialog]'),
				ok : function(){
					E.command('tabledialog','changeAttr');
				},
				cancel : function(){
					E.dialog.close('tabledialog');
				},
				icon: 'succeed'
			},args);
		},
		freshTableIndex : function(tableNode,force){
			if(this.tableFreshed === $(tableNode)[0] && force !== true){
				return ;
			}
			var curSelect = E.utils.getSelectionRange(E.curEditor.win,'node');
			var jTable = tableNode ? $(tableNode) : $(E.curEditor.dom).find('table');
			//遍历所有表格，如果传递了待修改的表格，则只修改传递的表格
			jTable.each(function(e1){
				var cellArr = [];
				var colIndex = 0,rowIndex = 0;
				var maxColLen = 0;
				//优先移除所有隐藏的单元格，方便定位，这样也不会影响现有显示的单元格的内容
				$(this).find('td:hidden,th:hidden').remove();
				var jTr = $(this).find('tr');
				//遍历行
				jTr.each(function(e2){
					var jCell = $(this).find('td,th');
					//为表格数组拓展第二维空间
					if(typeof cellArr[rowIndex] === 'undefined'){
						cellArr[rowIndex] = [];
					}
					//遍历行内单元格
					jCell.each(function(e3){
						var sCol = $(this).attr('colspan') ? parseInt($(this).attr('colspan')) : 1;
						var sRow = $(this).attr('rowspan') ? parseInt($(this).attr('rowspan')) : 1;
						var colIndexTmp = colIndex;
						//使用占位方式，如果已经有其他单元格占位则向后边空位置占位
						while(typeof cellArr[rowIndex][colIndexTmp] !== 'undefined'){
							colIndexTmp += 1;
						}
						cellArr[rowIndex][colIndexTmp] = $(this);
						//有行列合并的情况
						if(sCol > 1 || sRow > 1){
							//遍历行（列合并数）
							while(sCol > 1){
								//克隆一个隐藏的单元格，重置行列合并属性，占位
								var newCellCol = $(this).clone(true);
								newCellCol.attr('colspan','1').attr('rowspan','1');
								newCellCol.html(' ').hide();
								cellArr[rowIndex][colIndexTmp+sCol-1] = newCellCol;
								var sRowTmp = sRow;
								//如果还有rowspan属性
								while(sRowTmp > 1){
									//克隆一个隐藏的单元格，重置行列合并属性，占位
									var newCellRow = $(this).clone(true);
									newCellRow.attr('colspan','1').attr('rowspan','1');
									newCellRow.html(' ').hide();
									if(typeof cellArr[rowIndex+sRowTmp-1] === 'undefined'){
										cellArr[rowIndex+sRowTmp-1] = [];
									}
									cellArr[rowIndex+sRowTmp-1][colIndexTmp+sCol-1] = newCellRow;
									sRowTmp -= 1;
								}
								sCol -= 1;
								$(this).after(newCellCol);
							}
							//遍历列（行合并数）
							while(sRow > 1){
								//克隆一个隐藏的单元格，重置行列合并属性，占位
								var newCellRow = $(this).clone(true);
								newCellRow.attr('colspan','1').attr('rowspan','1');
								newCellRow.html(' ').hide();
								if(typeof cellArr[rowIndex+sRow-1] === 'undefined'){
									cellArr[rowIndex+sRow-1] = [];
								}
								cellArr[rowIndex+sRow-1][colIndexTmp] = newCellRow;
								sRow -= 1;
							}
						}
						colIndex += 1;
					});
					//获取最大的列数
					maxColLen = Math.max(maxColLen,cellArr[rowIndex].length);
					rowIndex += 1;
					colIndex = 0;
				});
				var rowLen = cellArr.length;
				var jTrLen = $(this).find('tr').length;
				//根据数组的占位补全行
				while(jTrLen < rowLen){
					$(this).append('<tr></tr>');
					jTrLen += 1;
				}
				//遍历数组，重排填充表格，如果数组内为 undefined，则用新单元格补齐
				for(var i=0;i<rowLen;i++){
					var colLen = Math.max(maxColLen,cellArr[i].length);
					var jTrContain = $(this).find('tr:eq('+i+')');
					for(var j=0;j<colLen;j++){
						if(typeof cellArr[i][j] === 'undefined'){
							cellArr[i][j] = $('<td row="'+i+'" col="'+j+'"></td>');
						}
						(cellArr[i][j]).attr('row',i).attr('col',j);
						jTrContain.append(cellArr[i][j]);
					}
				}
			});
			E.utils.setSelectionRange(E.curEditor.win,curSelect,'node');
			this.tableFreshed = tableNode ? $(tableNode)[0] : '';
		},
		toggleHead : function(hasHead){
			//设置取消表格列头
			var curTable = getCurrentTable();
			if(typeof hasHead === 'undefined' || hasHead === ''){
				hasHead = $(curTable).find('tr:first').find('th').length !== 0 ? true : false;
			}
			if(!hasHead && $(curTable).find('tr:first').find('th').length === 0){
				var colLen = $(curTable).find('tr:first').find('td').length;
				var trContain = E.curEditor.dom.createElement('tr'), th=[];
				for(var i=0;i<colLen;i++){
					th[i] = E.curEditor.dom.createElement('th');
					th[i].innerHTML = '&#8203;';
					$(trContain).append(th[i]);
				}
				$(curTable).find('tr:first').before(trContain);
				E.utils.setCursor(E.curEditor.win, th[0], true);
				this.freshTableIndex(curTable,true);
			}else if(hasHead && $(curTable).find('tr:first').find('th').length !== 0){
				$(curTable).find('tr:first').remove();
				this.freshTableIndex(curTable,true);
			}
		},
		
		// 设置取消表格标题名称
		// 插入成功后将光标定位到表格名称处
		toggleTitle : function(hasTitle){
			var curTable = getCurrentTable();
			if(typeof hasTitle === 'undefined' || hasTitle === ''){
				hasTitle = $(curTable).find('caption:first-child').length !== 0 ? true : false;
			}
			if(!hasTitle && $(curTable).find('caption:first-child').length === 0){
				var editor = E.curEditor;
				var caption = editor.dom.createElement('caption');
				caption.innerHTML = '&#8203;';
				$(curTable).prepend(caption);
				E.utils.setCursor(editor.win, caption, true);
			}else if(hasTitle && $(curTable).find('caption:first-child').length !== 0){
				$(curTable).find('caption:first-child').remove();
			}
		},
		changeTableAttr : function(attr){
			/*改变表格属性，根据attr修改*/
			var curTable = getCurrentTable();
			var //align = parseInt(attr.align) < 10 ? parseInt(attr.align) : 5,
				float = parseInt(attr.float) < 4 ? parseInt(attr.float) : 2,
				title = attr.title ? true : false,
				head = attr.head ? true : false;
			//标题
			this.toggleTitle(!title);
			
			//表头
			this.toggleHead(!head);
			//表格浮动
			var floatStyle = '';
			switch(float){
				case 1 : floatStyle = 'left';break;
				case 2 : floatStyle = 'none';break;
				case 3 : floatStyle = 'right';break;
				default : floatStyle = 'none';break;
			}
			$(curTable).css('float',floatStyle);
		},
		cellJustify : function(align){
			var alignStyle = '',valignStyle = '';
			align = parseInt(align);
			switch(align){
				case 1 : alignStyle = 'left';valignStyle = 'top';break;
				case 2 : alignStyle = 'center';valignStyle = 'top';break;
				case 3 : alignStyle = 'right';valignStyle = 'top';break;
				case 4 : alignStyle = 'left';valignStyle = 'middle';break;
				case 5 : alignStyle = 'center';valignStyle = 'middle';break;
				case 6 : alignStyle = 'right';valignStyle = 'middle';break;
				case 7 : alignStyle = 'left';valignStyle = 'bottom';break;
				case 8 : alignStyle = 'center';valignStyle = 'bottom';break;
				case 9 : alignStyle = 'right';valignStyle = 'bottom';break;
				default :alignStyle = 'center';valignStyle = 'middle';break;
			}
			var selectedCell = getSelectedCell();
			if($(selectedCell).length === 0){
				selectedCell = getCurrentCell();
				if($(selectedCell).length === 0){
					return ;
				}
			}
			$(selectedCell).css('text-align',alignStyle);
			$(selectedCell).css('vertical-align',valignStyle);
		},
		cellColor : function(color){
			var selectedCell = $(E.curEditor.dom).find('body table .'+E.curEditor.config.selectCellClass);
			if(selectedCell.length === 0){
				selectedCell = $(E.utils.getCurElement().pop()).closest('td,th');
			}
			selectedCell.css('background-color',color);
		},
		tableFloat : function(arg){
			var floatStyle = '';
			arg = parseInt(arg);
			switch(arg){
				case 1 : floatStyle = 'left';break;
				case 2 : floatStyle = 'none';break;
				case 3 : floatStyle = 'right';break;
				default :floatStyle = 'none';break;
			}
			var curTable = getCurrentTable();
			$(curTable).css('float',floatStyle);
		},
		/**
		 * @desciption 为插入行克隆单元格，需要确定克隆后的单元格是否需要被隐藏
		 * @param oldCell {object} 待克隆的单元格
		 * @param toward {string} emnu['forward','backward'] 向前还是后插入的克隆
		 * @param hideBefore {number} 隐藏信息，正数为隐藏
		 * @returns {object} 克隆单元格，及其隐藏信息
		 * @private
		 */
		_cloneRowCell : function(oldCell,toward,hideBefore){
			var returnCell = {};
			var newCell = oldCell.clone().html('newcell');
			var towardFlag = toward === 'forward' ? true : false;
			var rowInfo = this._rowInfo(oldCell);
			//在合并行中
			if(rowInfo.isInRow < 0){
				//向后插入并且有行合并属性
				if(!towardFlag && rowInfo.addRowspan > 1){
					newCell.hide();
					//就是拥有行合并属性的单元格，第一个增加了rowspan的值，之后的不增加
					if(rowInfo.isInRow + rowInfo.lastColspan === 0){
						rowInfo.lastVisibleCell.attr('rowspan',rowInfo.addRowspan+1);
					}
				}else{
					newCell.show();
				}
			}else{
				var colInfo = this._colInfo(oldCell);
				//在合并列中
				if(colInfo.isInCol < 0){
					//拥有行合并属性
					if(colInfo.lastRowspan > 1){
						//向后插入并且不在最后，向前插入并且不在最前
						if((!towardFlag && colInfo.isInCol < -1) || (towardFlag && colInfo.isInCol + colInfo.lastRowspan > 0)){
							newCell.hide();
							//增加隐藏信息，为下一个单元格准备
							returnCell['hideCells'] = colInfo.addColspan;
							colInfo.lastVisibleCell.attr('rowspan',colInfo.lastRowspan+1);
						}else{
							newCell.show();
						}
					}else{
						newCell.show();
					}
				}else{
					if(hideBefore > 0){
						newCell.hide();
					}else{
						newCell.show();
					}
				}
			}
			newCell.removeClass(E.curEditor.config.selectCellClass);
			newCell.attr('colspan',1).attr('rowspan',1);
			newCell.attr('col',-1).attr('row',-1);
			returnCell['cloneCell'] = newCell;
			return returnCell;
		},
		/**
		 * @desciption 为插入行克隆单元格，需要确定克隆后的单元格是否需要被隐藏
		 * @param oldCell {object} 待克隆的单元格
		 * @param toward {string} emnu['before','after'] 向前还是后插入的克隆
		 * @param hideBefore {number} 隐藏信息，正数为隐藏
		 * @returns {object} 克隆单元格，及其隐藏信息
		 * @private
		 */
		_cloneColCell : function(oldCell,toward,hideBefore){
			var returnCell = {};
			var newCell = oldCell.clone().html('&#8203;');
			var towardFlag = toward === 'forward' ? true : false;
			var colInfo = this._colInfo(oldCell);
			//在合并列中
			if(colInfo.isInCol < 0){
				//向后插入并且有列合并属性
				if(!towardFlag && colInfo.addColspan > 1){
					newCell.hide();
					//就是拥有列合并属性的单元格，第一个增加了colspan的值，之后的不增加
					if(colInfo.isInCol + colInfo.lastRowspan === 0){
						colInfo.lastVisibleCell.attr('colspan',colInfo.addColspan+1);
					}
				}else{
					newCell.show();
				}
			}else{
				var rowInfo = this._rowInfo(oldCell);
				//在合并行中
				if(rowInfo.isInRow < 0){
					//拥有列合并属性
					if(rowInfo.lastColspan > 1){
						//向后插入并且不在最右，向前插入并且不在最左
						if((!towardFlag && rowInfo.isInRow < -1) || (towardFlag && rowInfo.isInRow + rowInfo.lastColspan > 0)){
							newCell.hide();
							//增加隐藏信息，为下一个单元格准备
							returnCell['hideCells'] = rowInfo.addRowspan;
							rowInfo.lastVisibleCell.attr('colspan',rowInfo.lastColspan+1);
						}else{
							newCell.show();
						}
					}else{
						newCell.show();
					}
				}else{
					if(hideBefore > 0){
						newCell.hide();
					}else{
						newCell.show();
					}
				}
			}
			newCell.removeClass(E.curEditor.config.selectCellClass);
			newCell.attr('colspan',1).attr('rowspan',1);
			newCell.attr('col',-1).attr('row',-1);
			returnCell['cloneCell'] = newCell;
			return returnCell;
		},
		_rowInfo : function(oldCell){
			//同行前一个未隐藏的单元格，也可以是自身
			var lastVisibleCell = {};
			if(oldCell.not(':visible').length !== 0){
				lastVisibleCell = oldCell.prevAll(':visible').first();
			}else{
				lastVisibleCell = oldCell;
			}
			var visibleColIndex = lastVisibleCell.length === 0 ? -1 :parseInt(lastVisibleCell.attr('col'));
			//未隐藏的单元格的colspan属性
			var lastColspan = lastVisibleCell.attr('colspan') ? parseInt(lastVisibleCell.attr('colspan')) : 1;
			//未隐藏的单元格的rowspan属性
			var addRowspan = lastVisibleCell.attr('rowspan') ? parseInt(lastVisibleCell.attr('rowspan')) : 1;
			//传入的单元格是否在这个未隐藏的单元格的合并行中
			var isInRow = parseInt(oldCell.attr('col')) - visibleColIndex - lastColspan;
			return {isInRow:isInRow,lastColspan:lastColspan,addRowspan:addRowspan,lastVisibleCell:lastVisibleCell};
		},
		_colInfo : function(oldCell){
			//同列前一个未隐藏的单元格，也可以是自身
			var lastVisibleCell = {};
			if(oldCell.not(':visible').length !== 0){
				lastVisibleCell = oldCell.closest('table').find('[col='+parseInt(oldCell.attr('col'))+']:lt('+parseInt(oldCell.attr('row'))+')').not(':hidden').last();
			}else{
				lastVisibleCell = oldCell;
			}
			var visibleRowIndex = lastVisibleCell.length === 0 ? -1 :parseInt(lastVisibleCell.attr('row'));
			//未隐藏的单元格的rowspan属性
			var lastRowspan = lastVisibleCell.attr('rowspan') ? parseInt(lastVisibleCell.attr('rowspan')) : 1;
			//未隐藏的单元格的colspan属性
			var addColspan = lastVisibleCell.attr('colspan') ? parseInt(lastVisibleCell.attr('colspan')) : 1;
			//传入的单元格是否在这个未隐藏的单元格的合并列中
			var isInCol = parseInt(oldCell.attr('row')) - visibleRowIndex - lastRowspan;
			return {isInCol:isInCol,lastRowspan:lastRowspan,addColspan:addColspan,lastVisibleCell:lastVisibleCell};
		}
	});

	function getSelectedCell(tableNode){
	   //获取被选中的单元格
		if(tableNode){
			return $(E.curEditor.dom).find(tableNode).find('.'+ E.curEditor.config.selectCellClass);
		}else{
			return $(E.curEditor.dom).find('.'+ E.curEditor.config.selectCellClass);
		}
	}
	function getCurrentCell(){
		//获取光标所在单元格
		return $(E.utils.getCurElement().pop()).closest('td,th');
	}
	function getCurrentTable(){
		//获取光标所在单元格
		var selectTable = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectTableClass);
		if(selectTable.length > 0){
			return selectTable;
		}else{
			return $(E.utils.getCurElement().pop()).closest('table');
		}
	}
	function getSelectedRectangle(tableNode){
		//获得选择区域的矩形范围
		var cellRectangle = {
			curTable : tableNode,
			startCol : -1,
			endCol : -1,
			startRow : -1,
			endRow : -1
		};
		var jSelectedCell = getSelectedCell(tableNode);
		if(jSelectedCell.length !== 0){
			var jStartCell = $(jSelectedCell[0]);
			var jEndCell = $(jSelectedCell[jSelectedCell.length-1]);
			cellRectangle['startCol'] = parseInt(jStartCell.attr('col'));
			cellRectangle['startRow'] = parseInt(jStartCell.attr('row'));
			cellRectangle['endCol'] = parseInt(jEndCell.attr('col'));
			cellRectangle['endRow'] = parseInt(jEndCell.attr('row'));
			var sEndCol = jEndCell.attr('colspan') ? parseInt(jEndCell.attr('colspan')) : 1;
			var sEndRow = jEndCell.attr('rowspan') ? parseInt(jEndCell.attr('rowspan')) : 1;
			cellRectangle['endCol'] += sEndCol-1;
			cellRectangle['endRow'] += sEndRow-1;
		}else{
			jSelectedCell = $(getCurrentCell());
			cellRectangle['startCol'] = parseInt(jSelectedCell.attr('col'));
			cellRectangle['startRow'] = parseInt(jSelectedCell.attr('row'));
			var sEndCol = jSelectedCell.attr('colspan') ? parseInt(jSelectedCell.attr('colspan')) : 1;
			var sEndRow = jSelectedCell.attr('rowspan') ? parseInt(jSelectedCell.attr('rowspan')) : 1;
			cellRectangle['endCol'] = cellRectangle['startCol'] + sEndCol - 1;
			cellRectangle['endRow'] = cellRectangle['startRow'] + sEndRow - 1;
		}
		cellRectangle['curTable'] = jSelectedCell.closest('table');
		return cellRectangle;
	}
})(window.jQuery.jQEditor,window.jQuery);