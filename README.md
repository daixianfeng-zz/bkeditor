# bkeditor

- pubdate: 2013-07-24
- update： 2013-07-24
- tags: bkeditor， web， editor， word

__*bkeditor —— target:一个很像word的web在线编辑器 !*__

###Feature  

>异步加载：所有功能插件均可以异步加载（或延时加载）  
>工具条外观易修改：工具条使用html编写，可以任意重构，发布前进行编译生成json文件  
>标签seo：编辑器编辑出的html代码标签嵌套规则，使用strong，em等标签使生成内容更有利于seo  
>使用简单：支持不写js，使用class类产生编辑器，使用data-XXX属性配置  
>浏览器一致性：在各个浏览器中产生的html代码几乎一样  
>功能全面：目标是做web编辑器中的word  
>用户体验：目标是尽量向word的用户习惯和体验靠拢  
>错误记录：提供上传错误记录，方便后期维护，发现问题及时更新

------------------------------------------------------------------

## Getting Started

+	下载

必须下载的库文件libs文件夹和皮肤文件skin文件夹，如果需要面向ie用户要下载ie文件夹
>jquery和artDialog如在网页其他地方使用可以不用下载  
>其他库文件(libs文件夹)，皮肤文件（skin文件夹），ie兼容文件（ie文件夹）必须放在主js文件目录下

完整版
>bke目录下的bkeditor.min.js文件

异步版
>bke目录下的其他所有文件

开发完整版
>dist目录下的bkeditor.js，bkeditor.ext.js文件

开发异步版
>dist目录下的所有文件

+	先引入JS文件 

完整版
	
	<script type="text/javascript" src="./**/bkeditor.min.js"></script>
异步版
	
	<script type="text/javascript" src="./**/bkeditor.js"></script>

+	再new 一个editor实例 .

js代码生成

	editor = $.editor({
		id : 'editor',
		position : $('#e')
	});
	
> id 为唯一标识,当一个页面上有多个编辑器时,id不能重复.
> position 为绑定在哪个结节元素上.为jquery选择器 ,一般为#id


也可以这样调用,只要带上 class="bkeditor" 即可:

	<textarea name="bkeditor1" class="bkeditor" >这里是默认的内容</textarea>


看了上面,当有默认内容时知道怎么办了吧.

ok了,就这么简单 ! 记住返回的是一个编辑器的实例哦 .

## Documentation

### 自定义工具栏
  
  可以在配置文件config中按照实际情况减少或是重排工具栏,如下:


	config = {
		cTools : [
				'bold','italic','about','superscript','subscript','baikelink',
				'strikethrough','underline','redo','undo','cut','h2','h3',
				'fontsize','fontfamily','justifyleft','justifycenter','justifyright',
				'pastetotext','pasteword','image','map','preview','formatmatch',
				'cleardoc','reference','inserttime','insertdate','highlightcode',
				'multiimage','insertvideo','inserttable','spechars','link',
				'outdent','indent','insertunorderedlist','insertorderedlist',
				'removeformat','backcolor','forecolor','forecolormenu','source'
			]
	}

也可以这样 ,调用系统默认配置的工具栏

	editor = $.editor({
		id : 'editor',
		position : $('#e'),
		toolbar : 'base'
	});

>除了 `base` 外,还有 `simple` ,`default`,`all` ,默认不写为 `default`.

还可以这样写

	<div data-toolbar="simple" ></div>

##主要参数
*	cBase : 

	`lang : {string} (default:'zh-cn')`	--语言包

*	cEvent : 
	
	`whiteList : {array.<string>} (default:[])`	--白名单，启用的事件名，优先级高于黑名单  
	`blackList : {array.<string>} (default:[])`	--黑名单，禁用的事件名，优先级低于白名单  
*	cPlugin : 
	
	`whiteList : {array.<string>} (default:[])`	--白名单，启用的插件名，优先级高于黑名单  
	`blackList : {array.<string>} (default:[])`	--黑名单，禁用的插件名，优先级低于白名单

*	cFilter : 
	
	`whiteList : {array.<string>} (default:['block','combine','replace','space'])`	--白名单，启用的过滤器名，优先级高于黑名单
	`blackList : {array.<string>} (default:[])`	--黑名单，禁用的过滤器名，优先级低于白名单

*	cHistory :
	
	`onHistory : {boolean} (default:true)`	--是否开启历史记录功能
	`length : {number} (default:100)`	--历史记录最多记录数目

*	cError : 
	
	`onError : {boolean} (default:false)`	--是否需要记录错误
	`errorSendAddr : {string} (default:'')`	--错误发送到服务端的地址
	`length : {number} (default:1)`	--最长错误记录数，达到数目向服务端发送

*	cLog : 
	
	`onLog : {boolean} (default:false)`	--是否需要记录错误  
	`errorSendAddr : {string} (default:'')`	--错误发送到服务端的地址  
	`length : {number}  (default:10)`	--最长错误记录数  

*	`toolbar : {string}|{array.<string>} (default:'default')`	--工具栏显示的工具，有顺序，当为string类型时有固定的一类工具条功能

*	`skin : {string} (default:'default')`	--编辑器工具栏风格

*	`editWidth : {string} (default:'auto')`	--编辑区域宽，如果是数字需要带上px，如800px

*	`editHeight : {string} (default:'auto')`	--编辑区域高，如果是数字需要带上px，如300px

*	`editScroll : {string} (default:'no')`	--编辑区域是否有滚动条

*	`position : {object.<jQuery> | object{toolbar:object.<jQyery>,content:object.<jQuery>} (default:'')`	--编辑器位置

*	`oriHtml : {string} (default:'')`	--一般是在编辑器初始化时从textarea表单项获取初始内容


##编辑器API

编辑器的核心对象，绑定在了主窗口的jQuery对象下，使用 `window.jQuery.jQEditor` 即可以访问  

### 如何获得编辑器实例 ?
只有在javascript代码中生成的编辑器，才会返回编辑器实例对象
以.bkeditor为class的textarea使用时间戳设置id后缀，可以通过遍历编辑器实例列表获得；可通过匹配设置的id筛选出需要的编辑器实例。

	var editor = $.editor({
		id : 'editor',
		position : $('#e')
	});

以.bkeditor为class的textarea使用时间戳设置id后缀，可以通过遍历编辑器实例列表获得；可通过匹配设置的id筛选出需要的编辑器实例。

	var elId = 'elementId';
	var targetEditor = {};
	var editorList = jQuery.jQEditor.editorList;
	for(var tmpEditor in editorList){
		if(tmpEditor.split('_').slice(0, -1).join('_') === elId){
			targetEditor = tmpEditor;
		}
	}


## 一些常用的编辑器核心方法
- `getAttr(attrName);`	--获取编辑器核心属性
	>attrName : 属性名
	
- `destory(Eid);`	--销毁编辑器实例
	>Eid : 编辑器id
	
- `ready(callback);`	--编辑器核心功能加载完成
	>callback : 回调函数
	
- `trigger(type,args);`	--触发某一类型的事件
	>type : 事件类型  
	>args : 触发事件需要的参数  
	
## 一些常用的编辑器实例方法
- `ready(callback);`	--编辑器实例功能加载完成
	>callback : 回调函数
	
- `changeTheme(themeName,position);`	--更改编辑器主题
	>themeName : 主题名称  
	>position : 主题修改的位置('editarea'|'toolbar')  
	
- `setContent (content);`	--设置内容
	>content : 要设置的内容 ,可以包含HTML标签 .

- `getContent ();`	--得到内容

- `getContentText ();`	--得到文本内容(不含html标签),可用于统计字数

- `empty ();` 	--内容是否为空 ,为空是返回 true ,否则为 false

- `getSelectionHtml ();` 	--得到内容选择区的html内容

- `getSelectionText();` 	--得到内容选择区的text内容

- `execCommand(cmd);`	--执行命令
	>cmd : 命令名称
	
- `insert(html); `	--向光标处插入html
	>html : 插入的html

- `enable ();` 	--编辑器可用

- `disable ();`	--编辑器禁用

- `error(msg, color, timeout);`	--显示错误消息
	>msg : 错误内容  
	>color : 错误显示的颜色  
	>timeout : 错误延时多久消失  
	
- `focus();`	--让编辑器获得焦点

- `selectAll();`	--全选内容区域

- `getCursorElement();`	--获得光标所在的元素

- `getRange();`	--获得光标所指示的选中范围
	
- `getSelectionText();`	--获得选中的纯文本文字
	
- `insertNode(node);`	--向光标处插入一个节点
	>node : 插入的节点
	
- `setCursor(node, start);`	--将光标设置在节点的头部或尾部
	>node : 设置的目标节点  
	>start : 头部还是尾部(true|false)
	
- `selectNode(node);`	--选择相应节点
	>node : 选择的目标节点
	
###Grunt配置

由于采用异步方式运行，对初始加载的各种代码有可调整的功能
该功能采用grunt的打包方式进行处理，需要调整grunt中的打包策略根据需要优化编辑器
也可以不使用grunt打包，使用我们预先处理好的目录结构和打包js亦可

## Examples
	<html>

	  <head>
		<meta charset='utf-8' />
		<link id="artDialog-skin" href="./code/bke/0.9.0/libs/artdialog/skins/default.css" rel="stylesheet" />
		<title>BKEditor</title>
	  </head>

	  <body>
		
		<script type="text/javascript" src="./code/bke/0.9.0/libs/jquery/jquery.js"></script>
		<script type="text/javascript" src="./code/bke/0.9.0/libs/artdialog/artdialog.js"></script>
		<script type="text/javascript" src="./code/bke/0.9.0/bkeditor.min.js"></script>
		
		<!-- MAIN CONTENT -->
	 
		<div>
			<textarea id="ed_title" class="bkeditor" data-toolbar="base" style="width:800px;height:100px;">Here is the Title</textarea>
			<hr />
			<div id="ed_toolbar"></div>
			<hr />
			<textarea id="ed_contents">Here is the Contents</textarea>
		</div>

	   
	  </body>
	  <script type="text/javascript">
		$(document).ready(function(){
			$.editor({
				id : 'content',
				position : {toolbar:$('#ed_toolbar'),content:$('#ed_contents')},
				oriHtml : $('#ed_contents').val(),
				toolbar: 'default',
				editWidth : '800px',
				height:'auto',
				editHeight : '600px'
			});
		});
		
	  </script>
	</html>

## Release History
_(Nothing yet)_
