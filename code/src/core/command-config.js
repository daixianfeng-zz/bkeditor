/**
* @requires core.js
* @fileoverview
*	编辑器内部配置文件，
*	用于编辑器层面的编辑器配置，需要与初始化参数合并
* @author	daixianfeng@hudong.com
* @createTime	2012.12.12
* @editor
* @updateTime
* @version	0.3
**/
(function(E , $){
	var config = {
		/**
		* @type {object} 命令配置，包含命令过滤，命令分发，命令对应图标
		*	如： textCommand['bold']  {cmd: 'strong',param: '',icon: 'browserChecked'}中
		*	textCommand为命令类型，bold为原始命令（对应html），cmd为待执行命令（对应编辑器）
		*	param为待执行命令所带参数，icon为命令对应图标的判断方式，为空则没有对应图标
		*/
		cCommand: {
			/**
			* @type {object} 文本修改类命令
			*/
			textCommand: {
				'bold': {cmd: 'strong',param: '',icon: 'browserChecked'},
				'italic': {cmd: 'em',param: '',icon: 'browserChecked'},
				'underline': {cmd: 'text-decoration',param: 'underline',icon: 'browserChecked'},
				'strikethrough': {cmd: 'text-decoration',param: 'line-through',icon: 'browserChecked'},
				'superscript': {cmd: 'sup',param: '',icon: 'customChecked'},
				'subscript': {cmd: 'sub',param: '',icon: 'customChecked'},
				'fontsize': {cmd: 'font-size',param: '',icon: 'customValue'},
				'fontfamily': {cmd: 'font-family',param: '',icon: 'customValue'},
				'forecolor': {cmd: 'color',param: '',icon: 'customValue'},
				'backcolor': {cmd: 'background-color',param: '',icon: 'customValue'},
				'tolowercase': {cmd: 'wordcase',param: 'lower',icon: ''},
				'touppercase': {cmd: 'wordcase',param: 'upper',icon: ''}
			},
			/**
			 * @type {object} 段落修改类命令
			 */
			paragraphCommand: {
				'justifyleft': {cmd: 'text-align',param: 'left',icon: 'customChecked'},
				'justifycenter': {cmd: 'text-align',param: 'center',icon: 'customChecked'},
				'justifyright': {cmd: 'text-align',param: 'right',icon: 'customChecked'},
				'justifyfull': {cmd: 'text-align',param: 'justify',icon: 'customChecked'},
				'insertorderedlist': {cmd: 'ol',param: '',icon: 'customValue'},
				'insertunorderedlist': {cmd: 'ul',param: '',icon: 'customValue'},
				'spacetop': {cmd: 'margin-top',param: '',icon: ''},
				'spacebottom': {cmd: 'margin-bottom',param: '',icon: ''},
				'linespace': {cmd: 'line-height',param: '',icon: ''},
				'outdent': {cmd: 'padding-left',param: '-14px',icon: ''},
				'indent': {cmd: 'padding-left',param: '14px',icon: ''}
			},
			/**
			* @type {object} 插件命令
			*/
			pluginCommand: {
				'icon': {cmd: 'icon',param: '',icon: ''},
				'element': {cmd: 'element',param: '',icon: ''},
				'redo': {cmd: 'redo',param: '',icon: ''},
				'undo': {cmd: 'revert',param: '',icon: ''},
				'cut': {cmd: 'paste',param: 'cut',icon: ''},
				'copy': {cmd: 'paste',param: 'copy',icon: ''},
				'paste': {cmd: 'paste',param: '',icon: ''},
				'pastetotext': {cmd: 'paste',param: 'toggleTextpaste',icon: ''},
				'removeformat' : {cmd : 'font',param : 'clear',icon : ''},
				'formatmatch' : {cmd : 'font',param : 'toggleBrush',icon : ''},
				'brush' : {cmd : 'font',param : 'brush',icon : ''},

				'boldmenu': {cmd: 'boldmenu',param: '',icon: ''},
				'forecolormenu': {cmd: 'colormenu',param: 'forecolor',icon: ''},
				'backcolormenu': {cmd: 'colormenu',param: 'backcolor',icon: ''},
				'fontsizemenu': {cmd: 'fontsizemenu',param: '',icon: ''},
				'fontfamilymenu': {cmd: 'fontfamilymenu',param: '',icon: ''},
				'spacebottommenu': {cmd: 'spacemenu',param: 'bottom',icon: ''},
				'spacetopmenu': {cmd: 'spacemenu',param: 'top',icon: ''},
				'linespacemenu': {cmd: 'spacemenu',param: 'line',icon: ''},
				'h2': {cmd: 'hn',param: 'h2',icon: 'customChecked'},
				'h3': {cmd: 'hn',param: 'h3',icon: 'customChecked'},
				'blockquote': {cmd: 'blockquote',param: 'h3',icon: 'customChecked'},
				'image': {cmd: 'image',param: '',icon: ''},
				'imageFloat': {cmd: 'image',param: 'imgFloat',icon: ''},
				'link': {cmd: 'link',param: '',icon: ''},
				'map': {cmd: 'map',param: '',icon: ''},
				'insertvideo': {cmd: 'video',param: '',icon: ''},
				'pasteword': {cmd: 'pasteword',param: '',icon: ''},

				'specharsmenu': {cmd: 'specharsmenu',param: '',icon: ''},
				'baikelink': {cmd: 'baikelink',param: '',icon: ''},
				'inserttable': {cmd: 'table',param: '',icon: 'tableChecked'},
				'inserttablemenu': {cmd: 'tablemenu',param: '',icon: 'tableChecked'},
				'inserttime': {cmd: 'inserttime',param: '',icon: ''},
				'datemenu': {cmd: 'datemenu',param: '',icon: ''},
				'insertdate': {cmd: 'datemenu',param: '',icon: ''},
				'multiimage': {cmd: '',param: '',icon: ''},
				'insertunorderedlistmenu': {cmd: 'ulmenu',param: '',icon: ''},
				'insertorderedlistmenu': {cmd: 'olmenu',param: '',icon: ''},

				'combinecells': {cmd: 'table',param: 'combineCell',icon: 'tableChecked'},
				'combinecolafter': {cmd: 'table',param: 'combineColAfter',icon: 'tableChecked'},
				'combinerowafter': {cmd: 'table',param: 'combineRowAfter',icon: 'tableChecked'},
				'splittocols': {cmd: 'table',param: 'splitToCols',icon: 'tableChecked'},
				'splittorows': {cmd: 'table',param: 'splitToRows',icon: 'tableChecked'},
				'splittocells': {cmd: 'table',param: 'splitCellWhole',icon: 'tableChecked'},
				'insertcolbefore': {cmd: 'table',param: 'insertCol',args: 'forward',icon: 'tableChecked'},
				'insertcolafter': {cmd: 'table',param: 'insertCol',args: 'backward',icon: 'tableChecked'},
				'insertrowbefore': {cmd: 'table',param: 'insertRow',args: 'forward',icon: 'tableChecked'},
				'insertrowafter': {cmd: 'table',param: 'insertRow',args: 'backward',icon: 'tableChecked'},
				'deleterow': {cmd: 'table',param: 'deleteCol',icon: 'tableChecked'},
				'deletecol': {cmd: 'table',param: 'deleteRow',icon: 'tableChecked'},
				'deletetable': {cmd: 'table',param: 'deleteTable',icon: 'tableChecked'},
				'tableprops': {cmd: 'table',param: 'tableAttrDialog',icon: 'tableChecked'},
				'cellcolor': {cmd: 'table',param: 'cellColor',icon: ''},
				'celljustify': {cmd:'table',param: 'cellJustify',icon: ''},
				'tablefloat': {cmd:'table',param: 'tableFloat',icon: ''},
				'tablehead': {cmd:'table',param: 'toggleHead',icon: ''},
				'tabletitle': {cmd:'table',param: 'toggleTitle',icon: ''},

				'reference': {cmd: '',param: '',icon: ''},
				'highlightcode': {cmd: 'highlightcode',param: '',icon: ''},
				'cleardoc': {cmd: 'cleardoc',param: '',icon: ''},
				'preview': {cmd: '',param: '',icon: ''},
				'source': {cmd: 'source',param: '',icon: ''},
				'anchor': {cmd: 'anchor',param: '',icon: ''},
				'autoformat': {cmd: 'autoformat',param: '',icon: ''},
				'selectall': {cmd: 'selectall',param: '',icon: ''},
				'insertparagraphbefore': {cmd: 'insertparagraph',param: 'before',icon: ''},
				'insertparagraphafter': {cmd: 'insertparagraph',param: 'after',icon: ''},
				'codemirror': {cmd: 'codemirror',param: '',icon: ''},
				'about': {cmd: 'about',param: '',icon: ''},
				'search': {cmd: 'search',param: '',icon: ''},
				'shortcutmenu': {cmd: 'shortcutmenu',param: '',icon: ''},
				'dragimage': {cmd: 'dragimage',param: '',icon: ''},
				'ajaxupload': {cmd: 'ajaxupload',param: '',icon: ''},
				'replace': {cmd: 'search',param: '',icon: ''},
				'uploadremoteimage': {cmd: 'uploadremoteimage',param: '',icon: ''},
				'insertcode': {cmd: 'insertcode',param: '',icon: ''},
				'insertcodemenu': {cmd: 'insertcodemenu',param: '',icon: ''}
			},
			/**
			* @type {object} 插入类命令
			*/
			insertCommand: {
				'insert': {cmd: 'insert',param: '',icon: ''},
				'spechars': {cmd: 'insert',param: '',icon: ''}
			},
			/**
			* @type {object} 交互类命令，如对话框内的操作命令
			*/
			uiCommand: {
				'codedialog': {cmd: 'codedialog',param: '',icon: ''},
				'imagedialog': {cmd: 'imagedialog',param: '',icon: ''},
				'tabledialog': {cmd: 'tabledialog',param: '',icon: ''},
				'videodialog': {cmd: 'videodialog',param: '',icon: ''},
				'linkdialog': {cmd: 'linkdialog',param: '',icon: ''},
				'mapdialog': {cmd: 'mapdialog',param: '',icon: ''},
				'pasteworddialog': {cmd: 'pasteworddialog',param: '',icon: ''},
				'sourcedialog': {cmd: 'sourcedialog',param: '',icon: ''},
				'searchdialog': {cmd: 'searchdialog',param: '',icon: ''},
				'aboutdialog': {cmd: 'aboutdialog',param: '',icon: ''},
				'anchordialog': {cmd: 'anchordialog',param: '',icon: ''}
			}
		}
	};
	E.config = $.extend({},E.config,config);
})(window.jQuery.jQEditor , window.jQuery);