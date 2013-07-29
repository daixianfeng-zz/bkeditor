/**
* @fileoverview	
* 功能事件，供扩展类功能添加事件的文件，不涉及编辑器的基础问题
* ps:custom.event.js和editarea.event.js中的为基础事件，扩展时不建议修改
* 事件类型整理：
*	自定义事件：
*	@see custom.event.js
*	编辑区域事件：
*	@see editarea.event.js
* @author	daixianfeng@hudong.com
* @createTime	2013.01.06
* @editor	
* @updateTime	
* @version	0.1
**/
(function(E,$){

	/****************************************************************************/
	/** 编辑器执行流程时相关事件                                               **/
	/****************************************************************************/

	
	/****************************************************************************/
	/** 编辑器内容区域相关事件                                                 **/
	/****************************************************************************/
	E.listenEditareaExt = function(curEditor){
		var $dom = $(curEditor.dom);
		/******************************************************/
		/** 表格相关扩展事件                                 **/
		/******************************************************/
		var selectTableClass = E.config.selectTableClass;
		var selectCellClass = E.config.selectCellClass;
		
		$dom.delegate('td,th', 'mousedown', function(e){
			// 这里不再需要设置E.Eid等属性
			// 鼠标一进步编辑区域就会自动设置上这些属性
			
			//开始操作前更新表格，防止属性遗失不能操作;
			E.utils.execPlugin('table','freshTableIndex',$(e.target).closest('table'));
			// 如果是拖动边线调整单元格大小则不选中
			var cursorState = $dom.find('body').css('cursor');
			if(cursorState === 'row-resize' || cursorState === 'col-resize'){
				//不影响后续事件触发（调整单元格大小）
				return true;
			}
			// [TODO]
			if(e.which === 1){
				//记录起始位置
				var scope = {
					col_1 : $(e.target).attr('col'),
					row_1 : $(e.target).attr('row')
				};
				var $cells = $(e.target).closest('table').find('th,td');
				//绑定选中事件（鼠标移动事件）
				$cells.not($(e.target)).bind('mousemove.selectCell',function(e2){
					var $target = $(e2.target), $table = $target.closest('table');
					//选中
					E.utils.removeSelection(E.curEditor.win);
					$cells.removeClass(selectCellClass);
					scope['col_2'] = $target.attr('col');
					scope['row_2'] = $target.attr('row');
					var col_2 = Math.max(scope['col_1'],scope['col_2']),
						col_1 = Math.min(scope['col_1'],scope['col_2']);
					var row_2 = Math.max(scope['row_1'],scope['row_2']),
						row_1 = Math.min(scope['row_1'],scope['row_2']);
					//获取最小范围的矩形，已知的两端坐标
					var selectIndex = getRectangleCells($table,{colStart:col_1,colEnd:col_2,rowStart:row_1,rowEnd:row_2});
					col_2 = selectIndex['colEnd'],col_1 = selectIndex['colStart'];
					row_2 = selectIndex['rowEnd'],row_1 = selectIndex['rowStart'];
					var selTr = $table.find('tr:not(:gt('+row_2+'),:lt('+row_1+'))');
					/*
					不能这样写，因为如果同一行有th又有td会错位
					var selTd = selTr.find('td:not(:gt('+col_2+'),:lt('+col_1+')),th:not(:gt('+col_2+'),:lt('+col_1+'))');
					*/
					var selTd = $();
					selTr.each(function(){
						selTd = selTd.add($(this).find('td,th').not(':gt('+col_2+'),:lt('+col_1+')'));
					});
					selTd.addClass(selectCellClass);
					E.utils.removeSelection(E.curEditor.win);
				});
				$cells.bind('mouseenter',function(e2){
					$cells.removeClass(selectCellClass);
					if(E.curEditor.win.getSelection().type === 'None'){
						/*当拖动时移出编辑器内容区时，会产生编辑器内容区域无选中区*/
						$cells.unbind('mouseenter mousemove.selectCell');
					}else{
						E.utils.setCursor(E.curEditor.win,e.target,true);
					}
				}).bind('mouseup',function(e2){
					$cells.unbind('mouseenter');
				});
			}
		});
		
		$dom.delegate('body', 'mousedown', function(e){
			// 点击内容区域取消表格选中效果
			
			if(e.which === 1){
				var o = $(this);
				o.find('table').removeClass(selectTableClass);
				o.find('td,th').removeClass(selectCellClass);
			}
			
		}).delegate('body', 'mouseup', function(e){
			// 解除单元格的事件绑定
			// this = body 元素
			$(this).find('td,th').unbind('mouseenter mousemove.selectCell mouseup');
			
		});
		
		var timer = 0;
		// 鼠标移动掉表格上时
		// 在表格左上角显示一个全选表格的小图标
		$dom.delegate('table', 'mouseenter', function(){
			clearTimeout(timer);
			//显示全选图标
			var o = $(this),
				offset = o.offset();
				
			$('.bke-selecttablebar').data('table', o).css({
				top: offset.top - 20,
				left: offset.left - 20
			}).show();
			
		}).delegate('table', 'mouseleave', function(){
			// 鼠标手势变成默认情况
			$dom.find('body').css('cursor','default');
			// 鼠标移出表格时删除全选图标
			clearTimeout(timer);
			timer = setTimeout(function(){
				$('.bke-selecttablebar').hide();
			}, 200);
		});
		
		$('#'+curEditor.Eid).delegate('.bke-selecttablebar', 'click', function(){
			// 全选表格时，是给整个表格加背景色，不再针对单元格
			var table = $(this).data('table');
			
			// 移除单元格背景样式
			table.find('td,th').removeClass(selectCellClass);
			
			// 给表格加背景样式
			table.toggleClass(selectTableClass);
			
			return false;
		}).delegate('.bke-selecttablebar', 'mouseenter', function(){
			clearTimeout(timer);
		}).delegate('.bke-selecttablebar', 'mouseleave', function(){
			// 鼠标移出表格时删除全选图标
			clearTimeout(timer);
			timer = setTimeout(function(){
				$('.bke-selecttablebar').hide();
			}, 200);
		});
		
		$dom.delegate('td','mousemove.cursorState',function(e){
			lineState(e);
		});
		
	};
	
	// 获取一个矩形的单元格选择区域
	function getRectangleCells(table,index){
		var pluTable = E.pluginList['table'];
		var maxRow = $(table).find('tr').length-1;
		var maxCol = $(table).find('tr:first').find('th,td').length-1;
		var colStart = index.colStart,
			colEnd = index.colEnd,
			rowStart = index.rowStart,
			rowEnd = index.rowEnd;
		checkall:while(1){
			var curCell = {};
			var colInfo = {},rowInfo = {};
			if(colStart > 0){
				checkleft:for(var i=rowStart;i<=rowEnd;i++){
					curCell = $(table).find('[col='+colStart+'][row='+i+']');
					rowInfo = pluTable._rowInfo(curCell);
					if(rowInfo.isInRow < 0){
						if(rowInfo.lastColspan > 1){
							if(rowInfo.isInRow + rowInfo.lastColspan > 0){
								colStart -= 1;
								continue checkall;
							}
						}
					}else{
						colInfo = pluTable._colInfo(curCell);
						if(colInfo.isInCol >= 0){
							colStart -= 1;
							continue checkall;
						}
					}
				}
			}else{
				colStart = 0;
			}
			if(rowStart > 0){
				checktop:for(var j=colStart;j<=colEnd;j++){
					curCell = $(table).find('[row='+rowStart+'][col='+j+']');
					colInfo = pluTable._colInfo(curCell);
					if(colInfo.isIncol < 0){
						if(colInfo.lastRowspan > 1){
							if(colInfo.isIncol + colInfo.lastRowspan > 0){
								rowStart -= 1;
								continue checkall;
							}
						}
					}else{
						rowInfo = pluTable._rowInfo(curCell);
						if(rowInfo.isInRow >= 0){
							rowStart -= 1;
							continue checkall;
						}
					}
				}
			}else{
				rowStart = 0;
			}
			if(colEnd < maxCol){
				checkright:for(var i=rowStart;i<=rowEnd;i++){
					curCell = $(table).find('[col='+colEnd+'][row='+i+']');
					rowInfo = pluTable._rowInfo(curCell);
					if(rowInfo.isInRow < 0){
						if(rowInfo.lastColspan > 1){
							if(rowInfo.isInRow < -1){
								colEnd += 1;
								continue checkall;
							}
						}
					}
				}
			}else{
				colEnd = maxCol;
			}
			if(rowEnd < maxRow){
				checkbottom:for(var j=colStart;j<=colEnd;j++){
					curCell = $(table).find('[row='+rowEnd+'][col='+j+']');
					colInfo = pluTable._colInfo(curCell);
					if(colInfo.isInCol < 0){
						if(colInfo.lastRowspan > 1){
							if(colInfo.isInCol < -1){
								rowEnd += 1;
								continue checkall;
							}
						}
					}
				}
			}else{
				rowEnd = maxRow;
			}
			break checkall;
		}
		return {
			colStart :colStart,
			colEnd : colEnd,
			rowStart: rowStart,
			rowEnd : rowEnd
		};
	}
	function lineState(e){
		var curTd = e.target,
			curTable = $(curTd).closest('table'),
			curBody = $(curTd).closest('body');
		var cursorLeft = e.offsetX;
		var tdWidth = curTd.offsetWidth;
		var cursorTop = e.offsetY;
		var tdHeight = curTd.offsetHeight;
		curTable.unbind('mousedown.dragLine');
		if(cursorLeft < 4){
			curBody.css('cursor','col-resize');
			dragLine(curTable,{leftTd:$(curTd).prev('td').not(':hidden')[0] ,rightTd:curTd},false);
		}else if(tdWidth - cursorLeft < 4){
			curBody.css('cursor','col-resize');
			dragLine(curTable,{leftTd:curTd,rightTd:$(curTd).next('td').not(':hidden')[0]},false);
		}else if(cursorTop < 4){
			curBody.css('cursor','row-resize');
			var colIndex = parseInt($(curTd).attr('col'));
			var topTd = $(curTd.parentNode).prev('tr').length ? $(curTd.parentNode).prev('tr').find('td').eq(colIndex).not(':hidden')[0] : undefined;
			dragLine(curTable,{topTd:topTd,bottomTd:curTd},true);
		}else if(tdHeight - cursorTop < 4){
			curBody.css('cursor','row-resize');
			var bottomTd = $(curTd.parentNode).next('tr').length ? $(curTd.parentNode).next('tr').find('td').eq(colIndex).not(':hidden')[0] : undefined;
			dragLine(curTable,{topTd:curTd,bottomTd:bottomTd},true);
		}else{
			curBody.css('cursor','default');
			curTable.unbind('mousedown.dragLine');
		}
	}
	function dragLine(curTable,changeTd,ver){
		var curBody = $(curTable).closest('body');
		if(changeTd.topTd === undefined && ver === true){
			return 0;
		}else if(changeTd.leftTd === undefined && ver === false){
			return 0;
		}
		$(curTable).bind('mousedown.dragLine',function(e){
			$(curTable).find('td').unbind('mousemove.cursorState');
			var oriClientX = e.clientX;
			var oriClientY = e.clientY;
			$(curTable).parent().append('<div></div>');
			var cellLine = $(curTable).parent().children(':last');
			cellLine.css('position','absolute');
			cellLine.css('display','block');
			cellLine.css('width','1px');
			cellLine.css('height','1px');
			cellLine.css('z-index','11');
			ver  === true ? cellLine.width($(curTable).find('tbody').width()) : cellLine.height($(curTable).find('tbody').height());
			var tdTop = $(curTable).offset()['top'],tdLeft = $(curTable).offset()['left'];
			ver  === true ? tdTop += $(changeTd.topTd)[0].offsetTop + $(changeTd.topTd)[0].offsetHeight : tdLeft += $(changeTd.leftTd)[0].offsetLeft + $(changeTd.leftTd)[0].offsetWidth;
			cellLine.css('top',tdTop);
			cellLine.css('left',tdLeft);
			cellLine.css('background-color','green');
			$(curBody).bind('mousemove.changeCell',function(e){
				E.utils.removeSelection(E.curEditor.win);
				var newClientX = e.clientX;
				var newClientY = e.clientY;
				if(ver){
					if(newClientY-oriClientY + $(changeTd.topTd)[0].offsetHeight > 45){
						cellLine.css('top',tdTop+newClientY-oriClientY);
					}
				}else{
					if(newClientX-oriClientX + $(changeTd.leftTd)[0].offsetWidth > 45 && (!changeTd.rightTd || $(changeTd.rightTd)[0].offsetWidth - (newClientX-oriClientX) > 45)){
						cellLine.css('left',tdLeft+newClientX-oriClientX);
					}
				}
				E.utils.removeSelection(E.curEditor.win);
			}).bind('mouseup.changeCell',function(e){
				var newClientX = e.clientX;
				var newClientY = e.clientY;
				var changePx = 0;
				if(ver){
					if(newClientY-oriClientY + $(changeTd.topTd)[0].offsetHeight > 45){
						changePx = newClientY-oriClientY;
					}else{
						changePx = 45-$(changeTd.topTd)[0].offsetHeight;
					}
				}else{
					if(newClientX-oriClientX + $(changeTd.leftTd)[0].offsetWidth > 45 && (!changeTd.rightTd || $(changeTd.rightTd)[0].offsetWidth - (newClientX-oriClientX) > 45)){
						changePx = newClientX-oriClientX;
					}else if(newClientX-oriClientX + $(changeTd.leftTd)[0].offsetWidth > 45){
						changePx = $(changeTd.rightTd)[0].offsetWidth-45;
					}else{
						changePx = 45-$(changeTd.leftTd)[0].offsetWidth;
					}
				}
				moveLine(changeTd,changePx,ver);
				E.utils.removeSelection(E.curEditor.win);
				$(curTable).find('td').bind('mousemove.cursorState',function(e2){
					lineState(e2);
				});
				cellLine.remove();
				$(curTable).unbind('mousedown.dragLine');
				curBody.unbind('mousemove.changeCell');
				curBody.unbind('mouseup.changeCell');
			});
		});
	}
	function moveLine(curTd,changePx,ver){
		if(ver){
			// 只改变选择线顶部的单元格的高度
			var rows = $(curTd.topTd).attr('rowspan') ? parseInt($(curTd.topTd).attr('rowspan')) : 1;
			var rowIndex = parseInt($(curTd.topTd).attr('row'))+rows;
			var changeCells = [];
			$(curTd.topTd).closest('table').find('td:visible,th:visible').each(function(){
				var tmpRows = $(this).attr('rowspan') ? parseInt($(this).attr('rowspan')) : 1;
				if(parseInt($(this).attr('row'))+tmpRows === rowIndex){
					var oriTopHeight = parseFloat($(this).height());
					changeCells.push({cell:$(this),height:oriTopHeight+changePx});
				}
			});
			var changeLen = changeCells.length;
			for(var i=0;i<changeLen;i++){
				changeCells[i].cell.height(changeCells[i].height);
			}
		}else{
			// 同时改变选择线左侧和右侧的宽度
			var cols = $(curTd.leftTd).attr('colspan') ? parseInt($(curTd.leftTd).attr('colspan')) : 1;
			var changeCells = [];
			var colIndex = parseInt($(curTd.leftTd).attr('col'))+cols;
			$(curTd.leftTd).closest('table').find('td:visible,th:visible').each(function(){
				var tmpCols = $(this).attr('colspan') ? parseInt($(this).attr('colspan')) : 1
				if(parseInt($(this).attr('col'))+tmpCols === colIndex){
					var oriLeftWidth = parseFloat($(this).width());
					var oriRightWidth = parseFloat($(this).next('td,th').width());
					changeCells.push({cell:$(this),width:oriLeftWidth+changePx});
					
					$(this).next('td,th').length && changeCells.push({cell:$(this).next('td,th'),width:oriRightWidth-changePx});
					var maxTableWidth = 760;
					var finalWidth = parseFloat($(this).closest('table').width())+changePx > 760 ? 760 : parseFloat($(this).closest('table').width())+changePx;
					$(this).next('td,th').length || changeCells.push({cell:$(this).closest('table'),width:finalWidth});
				}
			});
			var changeLen = changeCells.length;
			for(var i=0;i<changeLen;i++){
				changeCells[i].cell.width(changeCells[i].width);
			}
		}
	}
})(window.jQuery.jQEditor,window.jQuery);