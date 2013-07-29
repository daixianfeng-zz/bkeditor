/**
* @fileoverview	
* 编辑区域内事件
* 用于在编辑区域中，委托并添加与编辑器编辑内容相关的事件，委托执行时触发
* 事件类型整理：
*	自定义事件：
*	@see custom.event.js
*	编辑区域事件：
*	click,dblclick,rightClick,scroll,mousedown,mouseup,mouseenter,mouseleave,mousemove
*	keydown,keyup,keypress
* @author	daixianfeng@hudong.com
* @createTime	2013.01.06
* @editor	
* @updateTime	
* @version	0.6
**/
(function(E,$){
	var elist = 'click,mousedown,mouseup,mouseenter,mouseleave,scroll,keypress,keyup,keydown,paste,beforepaste,dragenter,dragover,drop,dragleave,dragend'.split(',');
	
	// 事件关联
	function ln($dom, type, curEditor) {
		// IE 下的粘帖事件不能绑定到document上，否则不起作用
		if ( E.IE && /paste/i.test(type) ) {
			$dom = $dom.find('body');
		}
		
		$dom.bind(type, function(e) {
			return E.trigger(type, {
				targetElement: e.target,
				target: e.target,
				event: e,
				targetEditor: curEditor
			});
		});	
	}
	
	/**
	* @description
	* 监听编辑区域浏览事件
	* 之后触发对应自定义事件，
	* ps:编辑区域的事件相当于特殊的自定义事件，需要在此委托到浏览器
	**/
	E.listenEditarea = function(curEditor){
		var $dom = $(curEditor.dom);
		
		// 处理右键菜单
		$dom.bind('contextmenu', function(e) {
			if( e.ctrlKey || e.shiftKey || e.altKey ){
				return true;
			} else {
				E.trigger('contextmenu', {
					targetElement: e.target,
					target: e.target,
					clientX: e.clientX,
					clientY: e.clientY,
					targetEditor: curEditor
				});
				return false;
			}
		});
		
		for( var i=0, len=elist.length; i< len; i++ ){
			var type = $.trim(elist[i]);
			ln($dom, type, curEditor);
		}
		var pasteTime = E.IE ? 'beforepaste' : 'paste';
		//必须绑定到dom下面的某一个节点上面，不能绑定到dom上，在ie不会被触发
		$dom.find('body').bind(pasteTime,function(e){
			E.utils.execPlugin('paste','paste');
		});
		$dom.find('body').bind('beforecopy',function(e){
			$dom.find('body').unbind(pasteTime);
			setTimeout(function(){
				$dom.find('body').bind(pasteTime,function(e){
					E.utils.execPlugin('paste','paste');
				});
			},0);
			E.IE && E.errorMessage('请使用 Ctrl+v 进行粘贴');
		});
		$dom.bind('keydown',function(e){
			if (e.shiftKey && e.which === 13){//shift+enter
			//alert(1);return false;
			}else if (e.ctrlKey && e.which === 13){//ctrl+enter
			//alert(2);return false;
			}else if (e.ctrlKey && e.which === 67){//ctrl+c
				//alert(3);
			}else if (e.ctrlKey && e.which === 86){//ctrl+v
				//alert(4);
			}else if (e.ctrlKey && e.which === 88){//ctrl+x
				//alert(5);
			}else if (e.ctrlKey && e.which === 66){//ctrl+b
				E.command('bold');return false;
			}else if (e.ctrlKey && e.which === 73){//ctrl+i
				E.command('italic');return false;
			}else if (e.ctrlKey && e.which === 85){//ctrl+u
				E.command('underline');return false;
			}else if (e.ctrlKey && e.which === 90){//ctrl+z
				E.command('undo');return false;
			}else if (e.ctrlKey && e.which === 89){//ctrl+y
				E.command('redo');return false;
			}else if (e.ctrlKey && e.which === 65){//ctrl+a
				E.curEditor.selectAll();return false;
			}else if (e.ctrlKey && e.which === 70){//ctrl+f
				E.command('search');return false;
			}else if (e.ctrlKey && e.which === 72){//ctrl+h
				E.command('replace');return false;
			}else if (e.ctrlKey && e.which === 83){//ctrl+s
			alert(11);return false;
			}else if (e.which === 13){//enter
				E.curEditor.baseHistory.prepareHistory();
				setTimeout(function(){
					E.curEditor.baseHistory.recordHistory();
				},0);
			}else if (e.which === 8){//backspace

			}else if (e.which === 46){//delete

			}else{

			}
			setTimeout(function(){
				var curTime = +(new Date());
				if(curTime - curEditor.baseHistory.getLastTime() > 3000){
					E.curEditor.baseHistory.prepareHistory();
					E.curEditor.baseHistory.recordHistory();
				}
			},0);
		});

		// 鼠标移入到某个编辑区域时，设置相关属性值
		$dom.bind('mouseenter',function(e){
			if ( E.curId !== curEditor.Eid ) {
				E.curId = curEditor.Eid;
				E.curEditor = curEditor;
				// 触发编辑器激活事件
				E.trigger('active', {editor:curEditor});
			}
		}).bind('mousedown',function(e){
		
			$dom.bind('mousemove.drag',function(e){
				E.trigger('drag',{
					targetElement : e,
					targetEditor : curEditor
				});
			});
		}).bind('mouseup',function(e){
			$dom.unbind('mousemove.drag');
		});
	};
	/****************************************************************************/
	/** 编辑器内容区域相关事件                                                 **/
	/****************************************************************************/
	
	// 在点击编辑区域或是编辑区域输入时隐藏工具栏的面板
	E.addEvent({
		name : 'editareaHidePanel',
		type : ['mousedown','keydown'],
		area : 'editArea',
		fn : function(){
			E.toolbar.hidePanel();
		}
	});
	
	// webkit内核浏览器下，点击图片默认不会像ie/firefox一样选中图片
	// 需特殊处理，使其点击图片将图片处于选中状态
	if (/AppleWebKit/i.test(navigator.userAgent)) {
		E.addEvent({
			name : 'selectimg',
			type : ['mousedown'],
			area : 'editArea',
			fn : function(arg) {
				if( arg.target.nodeName.toLowerCase() === 'img' ){
					// 将图片选中
					E.utils.selectNode(E.curEditor.win, arg.target);
				}
				
			}
		});
	}
})(window.jQuery.jQEditor,window.jQuery);