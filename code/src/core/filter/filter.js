/**
 * 过滤器核心
 * 用于启用，禁用及执行过滤操作
 */
(function(E){
	/**
	* 过滤器基类
	* @constructor
	* @param {object} attr 过滤器配置参数
	**/
	function Filter(attr){
		this.name = attr.name;
		this.order = attr.order?attr.order:'third';
		this.type = attr.type?attr.type:['dom'];
		this.replace = attr.replace?attr.replace:function(){};
	}
	
	/**
	* 过滤器执行对象
	* 这样分类的目的是减少
	* key(过滤类型) => value(执行优先级对象 
	*					@type {object} key(优先级) => value(过滤器对象数组 
	*													@type {Array}) )
	* @type {object}
	**/
	Filter.exeList = {
		// 过滤器的类型（过滤字符串还是过滤节点）类型不能同时属于 dom 和 html
		/** 
		* 根据触发时机就应该可以区分过滤的类型，只有在编辑内容进出编辑区域的时候才会使用html类型的过滤
		* 对于既要使用 dom 类型，又要使用 html 类型过滤的，应当分成两个时机
		* 如在将一段html插入编辑器中，先执行 html 类型的beforePaste 再执行 dom 类型的 beforeInsert
		**/
		'dom' : {
			// 所有 dom 类型过滤器
			'dom' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			// 以下类型属于触发时机，可以同时属于以下类型的多个，应属于 dom 类型
			'afterTextPre' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'afterText' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'afterList' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'beforeSubmit' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'beforeCmd' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'afterCmd' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'beforeInsert' : {first:[],second:[],third:[],fourth:[],fifth:[]},
			'afterInsert' : {first:[],second:[],third:[],fourth:[],fifth:[]}
		},
		'html' : {
			// 所有 html 类型过滤器
			'html' :{first:[],second:[],third:[],fourth:[],fifth:[]},
			// 以下类型属于触发时机，可以同时属于以下类型的多个，应属于 html 类型
			'beforePaste' : {first:[],second:[],third:[],fourth:[],fifth:[]}
		}
	};
	/**
	* 过滤器列表对象
	* key(过滤器名) => value(过滤器对象)
	* @type {object}
	**/
	Filter.list = {};
	/**
	* @description
	* 添加并初始化一个过滤器
	* @param {object} attr 插件配置对象
	**/
	E.addFilter = function(attr){
		try{
			var oneFilter = new Filter(attr);
			var len = oneFilter.type.length;
			
			for(var i=0;i<len;i++){
			
				if(oneFilter.type[i] === 'dom'){
					Filter.exeList['dom']['dom'][oneFilter.order].push(oneFilter);
					
				} else if ( Filter.exeList['dom'][oneFilter.type[i]] ){
				
					Filter.exeList['dom'][oneFilter.type[i]][oneFilter.order].push(oneFilter);
					Filter.exeList['dom']['dom'][oneFilter.order].push(oneFilter);
				}
				
				if(oneFilter.type[i] === 'html'){
					Filter.exeList['html']['html'][oneFilter.order].push(oneFilter);
					
				} else if ( Filter.exeList['html'][oneFilter.type[i]] ){
				
					Filter.exeList['html'][oneFilter.type[i]][oneFilter.order].push(oneFilter);
					Filter.exeList['html']['html'][oneFilter.order].push(oneFilter);
				}
			}
			Filter.list[oneFilter.name] = oneFilter;
			
		}catch(ex){
			E.error.writeError(attr.name+' filter add error: ' + ' '+ex.message+(ex.stack ? ex.stack : ''),3,'filter');
		}
	};
	/**
	* @description
	* 动态加载一个过滤器
	* @param {object} 插件配置对象
	**/
	E.loadFilter = function(addr){
		E.load.loadOneFile(addr,function(){
			for(var Eid in E.editorList){
				E.editorList[Eid].baseFilter.refreshList();
			}
		});
	};
	Filter.prototype = {
		/**
		* @description
		* 过滤替换，会被重写
		* @override
		**/
		replace : function(){}
		
	};
	/**
	* 编辑器实例关联的过滤器基类
	* @constructor
	* @param {object} editor 编辑器实例
	**/
	function EditorFilter(editor){
		try{
			this.editWin = editor.win;
			this.editDom = editor.dom;
			this.Eid = editor.Eid;
			this.curEditor = editor;
			this.enableList = this.configFilter(editor.config);
			this.exeList = {};
			this.refreshList();
		}catch(ex){
			E.error.writeError('editor filter init error: '+ex.message+(ex.stack ? ex.stack : ''),5,'filter');
			E.utils.message(E.lang['initError'],'finish');
		}
	}
	
	EditorFilter.prototype = {
		/**
		* @description
		* 按过滤顺序合并过滤器对象，并添加到 this.exeList 中
		**/
		refreshList : function(){
			try{
				for(var type in Filter.exeList['dom']){
					var empty = [];
					var first = Filter.exeList['dom'][type]['first'],
						second = Filter.exeList['dom'][type]['second'],
						third = Filter.exeList['dom'][type]['third'],
						fourth = Filter.exeList['dom'][type]['fourth'],
						fifth = Filter.exeList['dom'][type]['fifth'];
					this.exeList[type] = empty.concat(first,second,third,fourth,fifth);
				}
				for(var type in Filter.exeList['html']){
					var empty = [];
					var first = Filter.exeList['html'][type]['first'],
						second = Filter.exeList['html'][type]['second'],
						third = Filter.exeList['html'][type]['third'],
						fourth = Filter.exeList['html'][type]['fourth'],
						fifth = Filter.exeList['html'][type]['fifth'];
					this.exeList[type] = empty.concat(first,second,third,fourth,fifth);
				}
			}catch(ex){
				E.error.writeError('filter refresh error: '+ex.message+(ex.stack ? ex.stack : ''),3,'filter');
			}
		},
		/**
		* @description
		* 根据白名单和黑名单为所有编辑器实例配置过滤器
		* @return {object} config 插件配置对象
		**/
		configFilter : function(config){
			var filterEnable = {};
			// 在白名单中出现的均为启用，在黑名单中出现的均为禁用
			// 在白名单黑名单中都出现的为启用，其余为过滤器中编写的默认情况
			var blackList = config.cFilter.blackList,
				whiteList = config.cFilter.whiteList;
			var blackLen = blackList.length,whiteLen = whiteList.length;
			for(var i=0;i<blackLen;i++){
				filterEnable[blackList[i]] = false;
			}
			for(var i=0;i<whiteLen;i++){
				filterEnable[whiteList[i]] = true;
			}
			return filterEnable;
		},
		/**
		* @description
		* 执行一组过滤器
		* @param {string} type 过滤类型
		* @param {object | string} arg 过滤内容参数
		* @return {void} 修改DOM无返回 | {object |string} 过滤后的内容
		**/
		excute : function(type,arg){
			var len = this.exeList[type].length;
			if(typeof arg === 'string'){
				var reStr = undefined;
				var backStr = arg;
				for(var i=0;i<len;i++){
					var exName = this.exeList[type][i].name;
					if(this.enableList[exName] !== false){
						try{
							reStr = this.exeList[type][i].replace(this.editWin,backStr);
							if(typeof reStr !== 'undefined'){
								backStr = reStr;
							}
						}catch(ex){
							E.error.writeError(type+' type-'+exName+' filter error '+ex.message+(ex.stack ? ex.stack : ''),2,'filter');
						}
					}
				}
				return backStr;
			}else{
				if(typeof arg === 'undefined'){
					arg = this.editDom;
				}
				var backNode = arg;
				for(var i=0;i<len;i++){
					var exName = this.exeList[type][i].name;
					if(this.enableList[exName] !== false){
						try{
							this.exeList[type][i].replace(this.editWin,backNode);
						}catch(ex){
							E.error.writeError(type+' type-'+exName+' filter error '+ex.message+(ex.stack ? ex.stack : ''),3,'filter');
						}
					}
				}
				return backNode;
			}
		},
		/**
		* @description
		* 执行单个过滤器
		* @param {string} name 过滤名称
		* @param {object | string} arg 过滤内容参数
		* @return {void} 修改DOM无返回 | {object |string} 过滤后的内容
		**/
		excuteOne : function(name,arg){
			if(Filter.list[name] && this.enableList[name] !== false){
				if(typeof arg === 'string'){
					var reStr = undefined;
					var backStr = arg;
					try{
						reStr = Filter.list[name].replace(this.editWin,backStr);
						if(typeof reStr !== 'undefined'){
							backStr = reStr;
						}
					}catch(ex){
						E.error.writeError(name+' filter error '+ex.message+(ex.stack ? ex.stack : ''),2,'filter');
					}
					return backStr;
				}else{
					if(typeof arg === 'undefined'){
						arg = this.editDom;
					}
					try{
						var backNode = arg;
						Filter.list[name].replace(this.editWin,backNode);
					}catch(ex){
						E.error.writeError(name+' filter error '+ex.message+(ex.stack ? ex.stack : ''),3,'filter');
					}
					return backNode;
				}
			}
		},
		/**
		* @description
		* 启用过滤器
		* @param {string} name 过滤器名
		**/
		enable : function(name){
			this.enableList[name] = true;
		},
		/**
		* @description
		* 禁用过滤器
		* @param {string} name 过滤器名
		**/
		disable : function(name){
			this.enableList[name] = false;
		}
	};
	EditorFilter.ready = true;
	E.EditorFilter = EditorFilter;
})(window.jQuery.jQEditor);