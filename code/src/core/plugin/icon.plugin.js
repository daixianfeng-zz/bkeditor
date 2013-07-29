/**
 * 根据光标当前位置修改工具条按钮状态
 */
 
(function(E, $){
/**
 * @type {object} 工具条图标列表
 */
var cmdConfig = E.config.cCommand
var iconList = {
	browserChecked : {},
	customChecked : {},
	browserValue : {},
	customValue : {},
	tableChecked : {}
};
for(var cmdType in cmdConfig){
	for(var tmpCmd in cmdConfig[cmdType]){
		var objCmd = cmdConfig[cmdType][tmpCmd];
		if(objCmd.icon !== ''){
			if(objCmd.icon === 'customChecked' || objCmd.icon === 'browserChecked'){
				if(objCmd.param === ''){
					iconList[objCmd.icon][tmpCmd] = {tag : objCmd.cmd,state:'_off'};
				}else if(cmdType === 'pluginCommand'){
					iconList[objCmd.icon][tmpCmd] = {tag : objCmd.param,state:'_off'};
				}else{
					iconList[objCmd.icon][tmpCmd] = {style : objCmd.cmd,value : objCmd.param,state:'_off'};
				}
			}else{
				iconList[objCmd.icon][tmpCmd] = {style : objCmd.cmd, value : objCmd.param, state : '_off'};
			}
		}
	}
}
//表格相关图标的状态，_off为可用状态，_unknown为需继续判定状态
var tableIconState = {
	tableSelect : {
		tableprops : '_off',
		deletetable : '_off'
	},
	cellSelect : {
		cellcolor : '_off',
		cellcolormenu : '_off',
		insertcolbefore : '_off',
		insertcolafter : '_off',
		insertrowbefore : '_off',
		insertrowafter : '_off',
		deletecol : '_off',
		deleterow : '_off',
		combinecells : '_off',
		tableprops : '_off',
		deletetable : '_off'
	},
	cellIn : {
		cellcolor : '_off',
		cellcolormenu : '_off',
		deletecol : '_off',
		deleterow : '_off',
		splittocols : '_split',
		splittorows : '_split',
		splittocells : '_split',
		combinecolafter : '_combine',
		combinerowafter : '_combine',
		insertcolbefore : '_off',
		insertcolafter : '_off',
		insertrowbefore : '_off',
		insertrowafter : '_off',
		tableprops : '_off',
		deletetable : '_off'
	},
	tableOut : {
		inserttable : '_off',
		inserttablemenu : '_off'
	}
};

E.addEvent({
	name: 'iconstate',
	type: ['mouseup','keyup', 'afterCommand'],
	area: 'editArea',
	fn: function(e) {
		main();
	}
});

function main(){
	var iconState = {};
	var tagList = {};
	var styleList = {};
	var elementList = E.utils.getCurElement();
	var Elen = elementList.length;
	var cmdName = '';
	/**
	* @description 查找并合并父节点的样式
	**/
	for(var i=0;i<Elen;i++){
		var tagName = elementList[i].nodeName.toLowerCase();
		tagList[tagName] = true;
		if($(elementList[i]).attr('style')){
			var cssArr = $(elementList[i]).attr('style').split(';');
			var Slen = cssArr.length;
			for(var j=0;j<Slen;j++){
				var styleArr = cssArr[j].split(':');
				if(typeof styleArr[1] === 'string'){
					styleArr[0] = styleArr[0].replace(/^[ ]+/g,"");
					styleList[styleArr[0]] = styleArr[1].replace(/^[ ]+/g,"");
				}
				//styleList[elementList[i].style[j]] = elementList[i].style[elementList[i].style[j]];
			}
		}
	}
	/**
	* @description 自定义判断图标状态是否开启
	**/
	for(cmdName in iconList.customChecked){
		var iconTag = iconList.customChecked[cmdName].tag;
		var iconStyle = iconList.customChecked[cmdName].style;
		if(iconTag && tagList[iconTag] === true){
			iconState[cmdName] = '_on';
		}else if(iconStyle && styleList[iconStyle] === iconList.customChecked[cmdName].value){
			iconState[cmdName] = '_on';
		}else{
			iconState[cmdName] = '_off';
		}
		if(iconState['justifycenter'] === '_off' && iconState['justifyright'] === '_off'){
			iconState['justifyleft'] = '_on';
		}
	}
	/**
	* @description 自定义获取图标的值
	**/
	for(cmdName in iconList.customValue){
		var iconStyle = iconList.customValue[cmdName].style;
		if(iconStyle && styleList[iconStyle]){
			iconState[cmdName] = styleList[iconStyle];
		}else{
			iconState[cmdName] = iconList.customValue[cmdName].state;
		}
	}
	/**
	* @description 浏览器判断图标状态是否开启
	**/
	for(cmdName in iconList.browserChecked){
		if(E.curEditor.dom.queryCommandState(cmdName) === true){
			iconState[cmdName] = '_on';
		}else{
			iconState[cmdName] = '_off';
		}
	}
	/**
	* @description 浏览器获取图标的值
	**/
	for(cmdName in iconList.browserValue){
		if(E.curEditor.dom.queryCommandValue(cmdName)){
			iconState[cmdName] = E.curEditor.dom.queryCommandValue(cmdName);
			if(cmdName === 'ForeColor' || cmdName === 'BackColor'){
				var regColor = /[0-9]+/g;
				var colorArr = iconState[cmdName].match(regColor);
				iconState[cmdName] = '#';
				for(var i=0;i<colorArr.length;i++){
					var oriColor = parseInt(colorArr[i],16);
					if(oriColor < 128){
						iconState[cmdName] += '0';
					}
					iconState[cmdName] += oriColor;
				}
			}
		}else{
			iconState[cmdName] = iconList.browserValue[cmdName].state;
		}
	}
	/**
	 * @description 判断表格图标
	 **/
	var selectedTableLen = $(E.curEditor.dom).find('table.'+ E.curEditor.config.selectTableClass).length;
	var selectedCellLen = $(E.curEditor.dom).find('td.'+ E.curEditor.config.selectCellClass,'th.'+ E.curEditor.config.selectCellClass).length ;
	for(cmdName in iconList.tableChecked){
		iconState[cmdName] = '_freeze';
		if(selectedTableLen !== 0){
			//表格被整体选中的时候
			if(typeof tableIconState.tableSelect[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.tableSelect[cmdName];
			}
		}else if(selectedCellLen !== 0){
			//表格中单元格处于选中状态的时候
			if(typeof tableIconState.cellSelect[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.cellSelect[cmdName];
			}
		}else if(tagList['td'] === true || tagList['th'] === true){
			//tagList在判断自定义样式的时候已经被复制，所以有依赖关系
			//光标在表格的单元格中的时候
			if(typeof tableIconState.cellIn[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.cellIn[cmdName];
			}
			if(iconState[cmdName] === '_split'){
				//还需其他判定的时候，拆分判断
				var curTd = $(E.utils.getCurElement().pop()).closest('td,th');
				iconState[cmdName] = '_freeze';
				if(curTd.attr('colspan') && parseInt(curTd.attr('colspan')) > 1){
					iconState['splittocols'] = '_off';
					iconState['splittocells'] = '_off';
				}
				if(curTd.attr('rowspan') && parseInt(curTd.attr('rowspan')) > 1){
					iconState['splittorows'] = '_off';
					iconState['splittocells'] = '_off';
				}
			}
			if(iconState[cmdName] === '_combine'){
				//还需其他判定的时候，合并判断
				iconState[cmdName] = '_freeze';
				if(E.utils.execPlugin('table','combineRowAfter',true)){
					iconState['combinerowafter'] = '_off';
				}
				if(E.utils.execPlugin('table','combineColAfter',true)){
					iconState['combinecolafter'] = '_off';
				}
			}
		}else{
			//与表格无关的时候
			if(typeof tableIconState.tableOut[cmdName] !== 'undefined'){
				iconState[cmdName] = tableIconState.tableOut[cmdName];
			}
		}
	}
	/**
	* @description 特殊情况Redo，Undo,pastetotext,stylebrush
	**/
	var historyTmp = E.curEditor.baseHistory;
	if(historyTmp){
		iconState['redo'] = historyTmp.redoState ? '_off':'_freeze';
		iconState['undo'] = historyTmp.revertState ? '_off':'_freeze';
	}
	if(E.curEditor.pasteToText === true){
		iconState['pastetotext'] = '_on';
	}
	if(E.pluginList['font']){
		iconState['formatmatch'] = E.pluginList['font'].brushOn[E.curId] ? '_on' : '_off';
	}
	
	// 当前标签是目录时，需要禁用的功能
	if (E.curEditor.cursorElements) {
		$.each(['hn', 'table', 'a', 'sub', 'sup', 'pre'], function(i, tagname){
			if (E.curEditor.cursorElements[tagname]) {
				$.each(E.curEditor.config.cTagDisable[tagname], function(i, n){
					iconState[n] = '_freeze';
				});
			}
		});
	}
	
	/**
	* @description 更新工具条图标状态
	**/
	var o = E.curEditor.$toolbar;
	
	// 显示源码时，禁用所有工具栏按钮，除了源码、帮助、全屏等按钮
	if ( E.curEditor.isShowSource ) {
		o.children('.bke-btn').not('[cmd=codemirror],[cmd=about],[cmd=fullscreen]').addClass('bke-disabled');
		return;
	}
	
	
	/*对于有下拉菜单的项不能移除checked样式，会导致已经打开的面板被隐藏掉
	* 是由于checked样式直接影响打开面板（即图标状态与面板显示耦合）
	* */
	o.children('.bke-btn').not(':has(div.bke-submenu)').removeClass('bke-checked');
	o.children('.bke-btn').removeClass('bke-disabled');

	for(cmdName in iconState){
		if(iconState[cmdName] === '_on'){
			o.find('#icon-'+cmdName).closest('.bke-btn').addClass('bke-checked');
		}else if(iconState[cmdName] === '_freeze'){
			o.find('#icon-'+cmdName).closest('.bke-btn').addClass('bke-disabled');
		}else if(iconState[cmdName] === '_off'){
			// nothing to do
		}else{
			// 字体、字号、颜色、背景色需要将值设置到指定位置
			if (cmdName === 'backcolor' || cmdName === 'forecolor') {
				o.find('#icon-'+cmdName).find('i').css('backgroundColor', iconState[cmdName]);
			} else if (cmdName === 'fontsize' || cmdName === 'fontfamily'){
				var Plugin = E.plugin(cmdName+'menu');
				if ( Plugin && typeof Plugin.echo === 'function' ) {
					Plugin.echo(o, iconState[cmdName]);
				}
			}
		}
	}
}

})(jQuery.jQEditor, jQuery);