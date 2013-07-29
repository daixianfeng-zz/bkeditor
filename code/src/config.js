/**
 *	用于用户层面的编辑器配置，需要与初始化参数合并
 */
(function(E , $){
	//var rootDir = 'http://bkeditor.com/';
	var rootDir = 'http://localhost/bkeditor/';
	var isLog = false,
		isError = false,
		isHistory = true;
		
	var cTools = {
		all : ['codemirror','bold','italic','superscript','subscript','baikelink',
			'strikethrough','underline','removeformat','formatmatch',
			'tolowercase','touppercase','undo','redo','h2','h3','blockquote',
			'fontsizemenu','fontfamilymenu','justifyleft','justifycenter','justifyright',
			'pastetotext','pasteword','image','map','preview','cleardoc',
			'reference','inserttime','insertdate','highlightcode',
			'insertvideo','inserttablemenu','tableprops','combinecells',
			'combinecolafter','combinerowafter','splittocols','splittorows','splittocells',
			'insertcolbefore','insertcolafter','insertrowbefore','insertrowafter',
			'deleterow','deletecol','deletetable',
			'specharsmenu','link','anchor','backcolor','forecolor',
			'linespacemenu','spacebottommenu','spacetopmenu',
			'outdent','indent','insertunorderedlist','insertorderedlist',
			'source','autoformat','search','about'],
		base : ['bold','italic','underline','strikethrough','superscript','subscript',
			'lowercase','uppercase','redo','undo','pastetotext','pasteword',
			'specharsmenu','link','backcolor','forecolor','fontsizemenu','fontfamilymenu',
			'insertunorderedlist','insertorderedlist','source','search'
			]
	};
	
	// 某标签需要禁用的功能，有的插件不需要检查，如redo、undo、html等
	var _allDisabledPlugin = [
		'bold','italic','superscript','subscript','baikelink',
		'strikethrough','underline','formatmatch',
		'h2','h3','blockquote',
		'fontsizemenu','fontfamilymenu',
		'pasteword','image','map',
		'reference','highlightcode',
		'insertvideo','inserttablemenu',
		'specharsmenu','link','anchor','backcolor','forecolor',
		'linespacemenu','spacebottommenu','spacetopmenu',
		'outdent','indent','insertunorderedlist','insertorderedlist',
		'forecolormenu'
	];
	var cTagDisable = {
		// 标签对应的需要禁用的插件，如
		'a': _allDisabledPlugin,
		'table': ['h2','h3'],
		'hn': _allDisabledPlugin,
		'sub': _allDisabledPlugin,
		'sup': _allDisabledPlugin,
		'pre': _allDisabledPlugin,
		'img': _allDisabledPlugin,
		'selectedTable': []
	};
	
	var config = {
		rootDir : rootDir,
		
		// 基础配置
		cBase : {
			libDir : rootDir+'libs/',
			// ie浏览器使用需要额外加载文件的路径
			ieDir : rootDir+'src/core/base/ie/',
			pluginDir : rootDir+'src/core/plugin/',
			uiDir : rootDir+'src/core/ui/',
			skinDir : rootDir+'src/skin/',
			// 是否需要记录日志
			isLog : isLog,
			
			// 是否需要记录错误
			isError : isError,
			
			// {array.<string>} 可以延时加载的文件
			//delayFile : ['search.plugin.js','font.plugin.js'],
			
			lang : 'zh-cn',
			
			plupload: {
				max_file_size: '10mb',
				url: '/plupload.php',
				pluploadswf: rootDir+'libs/plupload/plupload.swf'
			},
			ajaxupload: {
				uploadUrl: '../upload.php?action=saveFromDrag'
			}
		},
		
		// 事件配置
		cEvent : {
			// {array.<string>} 白名单，启用的事件名，优先级高于黑名单
			whiteList : [],
			
			// {array.<string>} 黑名单，禁用的事件名，优先级低于白名单
			blackList : []
		},
		
		// 插件配置
		cPlugin : {
			// {array.<string>} 白名单，启用的插件名，优先级高于黑名单
			whiteList : [],
			
			// {array.<string>} 黑名单，禁用的插件名，优先级低于白名单
			blackList : []
		},
		
		// ui配置
		cUi : {
		},
		
		// 过滤器配置
		cFilter : {
			// {array.<string>} 白名单，启用的过滤器名，优先级高于黑名单
			whiteList : ['block','combine','replace','space'],
			
			// {array.<string>} 黑名单，禁用的过滤器名，优先级低于白名单
			blackList : []
		},
		
		// 历史记录配置
		cHistory : {
			// {boolean} 是否开启历史记录功能
			onHistory : isHistory,
			
			// {number} 历史记录最多记录数目
			length : 100
		},
		
		// 错误处理配置
		cError : {
			// {boolean} 是否需要记录错误
			onError : isError,
			
			// {string} 错误发送到服务端的地址
			errorSendAddr : '',

			// {number} 最长错误记录数，达到数目向服务端发送
			length : 1
		},

		// 日志处理配置
		cLog : {
			// {boolean} 是否需要记录日志
			onLog : isLog,

			// {string} 日志发送到服务端的地址
			logSendAddr : '',

			// {number} 最长日志记录数，达到数目从删除最早的记录
			length : 10
		},

		// {object.<array>.<string>} 工具栏分类对象，存储多种预设的工具条内容及顺序
		cTools : cTools,
		
		// 鼠标点击到某标签上，需要禁用的功能
		cTagDisable : cTagDisable,
		
		// {array.<string> | string} 工具栏显示的工具，有顺序
		// 当为string类型时有固定的一类工具条功能
		toolbar : '',
		
		// {string} 编辑器主题风格
		//editTheme : '',
		
		// {string} 编辑器工具栏风格
		skin : 'default',
		
		cSkin : {
			
		},

		// {string} 编辑区域宽，如果是数字需要带上px，如800px
		editWidth : 'auto',

		// {string} 编辑区域高，如果是数字需要带上px，如300px
		editHeight : 'auto',

		// {boolean} 编辑区域是否有滚动条
		editScroll : 'no',
		
		// {object.<jQuery> | object{
		//							toolbar:object.<jQyery>,
		//							content:object.<jQuery>}
		//		} 编辑器位置
		position : '',

		// {string} 编辑区域的原始内容
		// 一般是在编辑器初始化时从textarea表单项获取初始内容
		oriHtml : '<p><br /></p>',

		 // {string} 表格选中样式
		selectTableClass : 'bke-table-selected',

		 // {string} 单元格选中样式
		selectCellClass : 'bke-cell-selected',

		 // {string} 图片选中样式
		selectImgClass : 'bke-img-selected',
		
		// 编辑器高度是否根据内容高度自动调整
		autoHeight: 1,
		
		// 编辑器默认高度
		height: 200,
		
		fixedClassName: 'bke-toolbar-fixed',
		
		// 编辑区域body的默认样式
		bodyStyle: {'font-size':'14px', 'font-family': 'SimSun'}
	};
	
	E.config = $.extend(true, {}, E.config, config);

})(jQuery.jQEditor , jQuery);