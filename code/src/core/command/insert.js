/**
* @requires execCommand.js
* @requires myDTD.js
* @fileoverview 
*	插入处理
*	插入带有HTML标签的字符串，并将其转化为节点
*	使用DOM RANGE在光标出进行插入
*	入口：
*	初始化：insert(html);创建插入处理对象，根据jQEditor的激活编辑器确定window和document
*	执行修改：insert(innerHtml);
*	执行思想：
*	根据光标位置进行插入，先判断能在哪一个父标签下可以插入，再考虑是否截断标签，进行插入
*	如果插入标签不全则进行补全
*	采用对插入HTML最外层节点逐个插入的方法进行插入，
*	每次插入后将光标置于插入节点后进行下一个节点的插入
*	修改规则：
*	@see myDTD.js
* @author	daixianfeng@hudong.com
* @createTime	2012.11.21
* @editor
* @updateTime
* @version	0.6 
*/
(function(E){
	var _win,_dom;
	/**
	* @description 插入入口，每次插入生成一个新的对象
	* @param {string} html 插入的html代码
	* @return {boolean} 是否插入成功
	*/
	var insert = function(html){
		var insertObj = new Insert();
		insertObj.init(_win,_dom);
		html = E.utils.filterInner(E.curEditor,html);
		insertObj.insert(html);
		return insertObj;
	};
	/**
	* 插入对象构造函数
	* @constructor
	*/
	function Insert(){
		_win = E.curEditor.win;
		_dom = E.curEditor.dom;
	}
	Insert.prototype = {
		mainRange : {},
		mainSelection : {},
		document : {},
		win : {},
		tmpBoard : {},
		/**
		* @description 插入对象初始化
		* @param {object} win 插入执行的window对象
		* @param {object} dom 插入执行的document对象
		*/
		init : function(win,dom){
            this.win = win;
			this.document = dom;
			this.mainRange = dom.createRange();
			this.mainSelection = win.getSelection();
			if(this.mainSelection.rangeCount === 0 || this.mainSelection.type === 'None'){
                this.mainSelection.addRange(this.mainRange);
            }else{
                this.mainRange = this.mainSelection.getRangeAt(0);
            }
		},
		/**
		* @description 执行插入操作
		* @param {string} innerHtml 插入的html代码
		*/
		insert : function(innerHtml){
			//预处理插入的字符串
			var nextHtml = this._preDoHtml(innerHtml);
			//将字符串变成node节点放到DOM上
			var pasteNode = this._copyToBoard(nextHtml);
			if(pasteNode !== false){
				for(var i=0;i<pasteNode.length;i++){
					//粘贴节点
					this._paste(pasteNode[i]);
				}
			}
			this.tmpBoard.nodeValue = "";
			E.curEditor.baseFilter.excute('afterInsert');
		},
		/**
		* @description 预处理插入代码
		* @param {string} preHtml 未处理的待插入的html代码
		* @return {string} 处理后的待插入的html代码
		*/
		_preDoHtml : function(preHtml){
			//[TODO] html字符串过滤，过滤掉合理的html
			return preHtml;
		},
		/**
		* @description 将hmtl代码转化成文档片段
		* @param {string} nextHtml 处理后的待插入的html代码
		* @return {object.<fragment>} 待插入的文档片段
		*/
		_copyToBoard : function(nextHtml){
			var pasteNode = {};
			var boardRange = this.document.createRange();
			boardRange.selectNodeContents(this.document.body);
			//在DOM树上将要插入的字符串变成node节点
			this.tmpBoard = boardRange.createContextualFragment(nextHtml);
			/*
			this.tmpBoard = this.document.createElement('div')
			this.tmpBoard.style.visibility = "hidden";
			this.tmpBoard.setAttribute('id','tmpBoard');
			this.tmpBoard.innerHTML = nextHtml;
			this.document.body.appendChild(this.tmpBoard);
			*/
			//处理每一个节点（最外层）
			pasteNode = this._cutInsertNode(this.tmpBoard);
			return pasteNode;
		},
		/**
		* @description 插入单个node节点
		* @param {object.<fragment>} queryNode 待插入的文档片段
		*/
		_paste : function(queryNode){
			if(!this.mainRange.collapsed){
				this.mainRange.deleteContents();
			}
			var cutRange = this.mainRange.cloneRange();
			var cutNode = cutRange.startContainer;
			//监测范围是否在标签头部或尾部，并且可以设置到标签的外面去
			var startFlag = false , endFlag = false;
			if(cutRange.startContainer.childNodes.length === cutRange.startOffset){
				endFlag = true;
			}
			if(0 === cutRange.startOffset){
				startFlag = true;
			}
			if(queryNode.insertType !== 'text'){
				if(!this._hasParentNode(queryNode.insertType,cutNode)){
					//补全标签的父标签
					this._fillNode(queryNode);
				}
				//遍历选区节点的父节点，确定能够包裹插入节点的位置
				while(cutNode.tagName !== 'BODY' && (cutNode.nodeType === 3 || (cutNode.nodeType !== 3 && DTD[cutNode.tagName][queryNode.insertType] !== 1)) ){
					/*if(cutNode.firstChild !== cutNode){
						startFlag = false;
					}
					if(cutNode.lastChild !== cutNode){
						endFlag = false;
					}
					if(startFlag){
						cutRange.setStartBefore(cutNode);
						cutRange.collapse(true);
					}
					if(endFlag){
						cutRange.setEndAfter(cutNode);
						cutRange.collapse(false);
					}*/
					cutRange.setStartBefore(cutNode);
					cutNode = cutNode.parentNode;
				}
				//进行截断
				var startPart = cutRange.extractContents();
				cutRange.insertNode(startPart);
				cutRange.collapse(false);
				cutRange.insertNode(queryNode.insertValue);
			}else if(cutRange.startContainer.nodeType !== 3){
				//为与元素节点并列的节点添加p标签
				cutRange.insertNode(queryNode.insertValue);
				var prevNode = cutRange.startContainer.childNodes[cutRange.startOffset-1];
				if(prevNode && prevNode.nodeType !== 3 && DTD.$block[prevNode.nodeName] === 1){
					var tmpP = this.document.createElement('p');
					cutRange.surroundContents(tmpP);
				}
			}else{
				cutRange.insertNode(queryNode.insertValue);
			}
			//设置光标在插入节点的后边
			cutRange.selectNode(queryNode.insertOri);
			cutRange.collapse(false);
			this.mainRange = cutRange;
			this.mainSelection.removeAllRanges();
			this.mainSelection.addRange(this.mainRange);
		},
		/**
		* @description 整理待插入节点
		* @param {object.<fragment>} queryNode 待插入的文档片段
		* @return {array.<node>} 待插入的节点信息数组
		*/
		_cutInsertNode : function(queryNode){
			//打断被插入节点，取出最外层节点存入数组，信息包括插入节点值，节点标签类型，原始节点
			var insertArray = [];
			for(var i=0;i<queryNode.childNodes.length;i++){
				var insertOne = new Object({insetType:'',insertValue:{},insertOri:{}});
				if(queryNode.childNodes[i].nodeType === 3){
					insertOne.insertType = 'text';
					insertOne.insertValue = queryNode.childNodes[i];
					insertOne.insertOri = queryNode.childNodes[i];
				}else{
					insertOne.insertType = queryNode.childNodes[i].tagName;
					insertOne.insertValue = queryNode.childNodes[i];
					insertOne.insertOri = queryNode.childNodes[i];
				}
				insertArray[i] = insertOne;
			}
			return insertArray;
		},
		/**
		* @description 检查是否外层有可以包裹该标签的节点
		* @param {string} tagName 待检查的标签
		* @param {object.<node>} searchNode 检查的节点
		* @return {boolean} 是否存在可包裹该标签的节点
		*/
		_hasParentNode : function(tagName,searchNode){
			var hasParent = false;
			while(searchNode.tagName !== 'HTML'){
				if(searchNode.nodeType !== 3 && DTD[searchNode.tagName][tagName] === 1){
					hasParent = true;
					break;
				}
				searchNode = searchNode.parentNode;
			}
			return hasParent;
		},
		/**
		* @description 填充父标签，如li没有ul，td没有tr、table等
		* @param {object.<node>} partNode 不完整的节点
		*/
		_fillNode : function(partNode){
			var partRange = this.document.createRange();
			partRange.selectNode(partNode.insertValue);
			var tagName = partNode.insertType;
			while(DTD[tagName]['parent']){
				var elementTag = this.document.createElement(DTD[tagName]['parent']);
				partRange.surroundContents(elementTag);
				tagName = DTD[tagName]['parent'];
				partNode.insertType = tagName;
				partNode.insertValue = elementTag;
			}
		}
	};
	E.coreCommand.editInsert = insert;
})(window.jQuery.jQEditor);