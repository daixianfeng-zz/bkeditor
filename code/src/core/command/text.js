/**
* @requires execCommand.js
* @requires myDTD.js
* @fileoverview
*	文本处理
*	对文本的样式进行改变
*	对选中区域的文字节点进行遍历，包裹相应的标签或添加相应的style
*	试用于添加删除紧贴文本的标签如strong，span等
*	对于标签应当有嵌套顺序，如果不能嵌套则进行截断，嵌套在应该嵌套的位置
*	使用DOM RANGE对选区文本进行修改
*	入口：
*	text(cmd,value);创建插入处理对象，根据jQEditor的激活编辑器确定window和document
*	changeText(cmd,value);
*	执行思想：
*	根据选中区域判断是设置还是修改。根据参数styleValue判断是设置/取消标签样式还是修改span样式
*	根据选区位置，取出公共父节点，进行线性遍历，根据修改规则对其中的文本节点进行修改。
*	嵌套规则：
*	@see myDTD.js 样式标签必须紧贴文本节点，多重嵌套需要截断，嵌套有一定的顺序
* @author	daixianfeng@hudong.com
* @createTime	2012.11.21
* @editor
* @updateTime
* @version	0.6 
*/
(function(E,$){
	var _win,_dom;
	/**
	* @description 修改文字样式入口，每次修改生成一个新的对象
	* @param {string} cmd 修改命令
	* @param {string} value 修改参数
	* @return {boolean} 是否修改成功
	*/
	var text = function(cmd,value){
		var textObj = new Text();
		var selRangeObj = textObj.init(_win,_dom);
		textObj.mainRange = selRangeObj.rangeSet[0];
		if(!value || cmd === 'text-decoration'){
			value = textObj.judgeValue(cmd,value);
		}
		for(var i=0;i<selRangeObj.len;i++){
			textObj.mainRange = selRangeObj.rangeSet[i];
			var result = textObj.changeText(cmd,value);
		}
		E.curEditor.baseFilter.excute('afterTextPre');
		E.curEditor.baseFilter.excute('afterText');
		return result;
	};
	/**
	* 修改文字样式对象构造函数
	* @constructor
	*/
	function Text(){
		_win = E.curEditor.win;
		_dom = E.curEditor.dom;
	}
	Text.prototype = {
		mainRange : {},
		mainSelection : {},
		document : {},
		win : {},
		/**
		* @description 修改文字样式对象初始化
		* @param {object} win 修改执行的window对象
		* @param {object} dom 修改执行的document对象
		*/
		init : function(win,dom){
			var rangeObj = {len:0,rangeSet:[]};
			this.spaceText = E.IE6 ? '\ufeff' : '\u200B';
            this.win = win;
			this.document = dom;
			var mainRange = dom.createRange();
			this.mainSelection = win.getSelection();
			/*表格选中情况区分多个带改变范围*/
			var selectedCell = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectCellClass);
			var selectedTable = $(E.curEditor.dom).find('.'+ E.curEditor.config.selectTableClass);
			if(selectedTable.length !== 0){
				rangeObj.len = selectedTable.length;
				for(var i=0;i<selectedTable.length;i++){
					mainRange.selectNodeContents(selectedTable[i]);
					rangeObj.rangeSet[i] = mainRange.cloneRange();
				}
			}else if(selectedCell.length !== 0){
				rangeObj.len = selectedCell.length;
				for(var i=0;i<selectedCell.length;i++){
					mainRange.selectNodeContents(selectedCell[i]);
					rangeObj.rangeSet[i] = mainRange.cloneRange();
				}
			}else{
				if(this.mainSelection.rangeCount === 0 || this.mainSelection.type === 'None'){
					rangeObj.len = 0;
				}else{
					rangeObj.len = 1;
					rangeObj.rangeSet[0] = this.mainSelection.getRangeAt(0);
				}
			}

			return rangeObj;
		},
		/**
		* @description 执行文本修改操作
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 修改的参数值
		*/
		changeText : function(styleType,styleValue){
			if(!styleValue || (styleType === 'text-decoration' && styleValue !== 'none')){
				styleValue = this.judgeValue(styleType,styleValue);
			}
			if(this.mainRange.collapsed){
				//设置样式
				this.setChange(this.mainRange,styleType,styleValue);
			}else{
				//修改样式
                this.excuteChange(this.mainRange,styleType,styleValue);
			}
		},
		/**
		* @description 根据参数分发修改操作
		* @param {object.<range>} setRange 待修改的范围
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 修改的参数值
		*/
		setChange : function(setRange,styleType,styleValue){
			if(styleValue !== "_on" && styleValue !== "_off"){
				//新增span样式
				this._setSpan(setRange,styleType,styleValue);
            }else if(styleValue === "_on"){
				//开启标签样式
				this._setTag(setRange,styleType); 
            }else{
				//关闭标签样式
                this._unsetTag(setRange,styleType);
            }
            var span = this.document.createElement("span");
		},
		/**
		* @description 执行修改
		* @param {object.<range>} setRange 待修改的范围
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 修改的参数值
		*/
		excuteChange : function(excuteRange,styleType,styleValue){
            var changeType = 'style';
			if(styleType === 'wordcase'){
				changeType = 'wordcase';
			}else if(styleValue === "_on"){
                changeType = 'tag_on';
            }else if(styleValue === "_off"){
				changeType = 'tag_off';
            }
			var comStartRange = excuteRange.cloneRange();
			comStartRange.collapse(true);
			var comEndRange = excuteRange.cloneRange();
			comEndRange.collapse(false);
            var commonAncestor = excuteRange.commonAncestorContainer;
			var oriOptArea = {
                ancestor : commonAncestor,
				firstNode : excuteRange.startContainer,
				firstOffset : excuteRange.startOffset,
				lastNode : excuteRange.endContainer,
				lastOffset : excuteRange.endOffset
			};
			var startRange = '',endRange = '',tmpEndRange = '',midRange = '';
			if(oriOptArea.firstNode !== oriOptArea.lastNode || oriOptArea.firstNode.nodeType !== 3){
				//线性遍历公共父节点
				var ancestorList = {};
				if(navigator.userAgent.indexOf("MSIE") <= 0){
					ancestorList = this.document.createNodeIterator(commonAncestor,NodeFilter.SHOW_TEXT);
				}else{
					ancestorList = this.document.createNodeIterator(commonAncestor,3);
				}
				var queryNode = ancestorList.nextNode();
				var queryNode2 = {};
				var startOpt = 0,endOpt = 1,startEmpty = 0;
				while(queryNode){
					//指向下一个节点，因为可能会对当前节点做修改
					queryNode2 = ancestorList.nextNode();
					if(startOpt === 0){
						var comRange = this.document.createRange();
						comRange.selectNode(queryNode);
						var inStart = comRange.compareBoundaryPoints(comRange.START_TO_START,comStartRange);
					}
					if(endOpt === 1){
						if(queryNode2){
							var comRange2 = this.document.createRange();
							comRange2.selectNode(queryNode2);
							var	inEnd = comRange2.compareBoundaryPoints(comRange2.START_TO_START,comEndRange);
						}else{
							var	inEnd = 1;
						}
					}
					var startCome = inStart > -1 && startOpt === 0;

					var	endCome = inEnd > -1 && startOpt === 1 && endOpt === 1;
					if(startOpt === 0 && inEnd > -1){
						startOpt = 1;
					}
					//修改尾部被截断的节点
					if(queryNode === oriOptArea.lastNode || endCome){
                        if(!endCome){
							if(changeType === 'style'){
								endRange = this._addSpan(queryNode,oriOptArea,styleType,styleValue,'last');
							}else if(changeType === 'wordcase'){
								endRange = this._wordCase(queryNode,oriOptArea,styleType,styleValue,'last');
							}else if(changeType === 'tag_on'){
								endRange = this._addTag(queryNode,oriOptArea,styleType,'last','on');
							}else{
								endRange = this._addTag(queryNode,oriOptArea,styleType,'last','off');
							}
						}
						
						if(!endRange){
							endRange = tmpEndRange;
						}else{
							if(!startRange){
								startRange = endRange;
							}
						}
						endOpt = 0;
						this.mainRange.setStart(startRange.startContainer,startRange.startOffset);
						this.mainRange.setEnd(endRange.endContainer,endRange.endOffset);
						this.mainSelection.removeAllRanges();
						this.mainSelection.addRange( this.mainRange );
						break;
					}
					//修改中间完整节点
					if(startOpt && endOpt){
                        if(changeType === 'style'){
                            midRange = this._addSpan(queryNode,oriOptArea,styleType,styleValue,'mid');
                        }else if(changeType === 'wordcase'){
	                        midRange = this._wordCase(queryNode,oriOptArea,styleType,styleValue,'mid');
                        }else if(changeType === 'tag_on'){
                            midRange = this._addTag(queryNode,oriOptArea,styleType,'mid','on');
                        }else{
							midRange = this._addTag(queryNode,oriOptArea,styleType,'mid','off');
						}
						if(midRange){
							tmpEndRange = midRange;
							if(!startRange){
								startRange = midRange;
							}
						}
					}
					//修改头部被截断的节点
					if( !startOpt && (queryNode === oriOptArea.firstNode || startCome) ){
						if(!startCome){
							 if(changeType === 'style'){
								startRange = this._addSpan(queryNode,oriOptArea,styleType,styleValue,'first');
							}else if(changeType === 'wordcase'){
								startRange = this._wordCase(queryNode,oriOptArea,styleType,styleValue,'first');
							}else if(changeType === 'tag_on'){
								startRange = this._addTag(queryNode,oriOptArea,styleType,'first','on');
							}else{
								startRange = this._addTag(queryNode,oriOptArea,styleType,'first','off');
							}
						}
                        startOpt = 1;
						tmpEndRange = startRange;
						if(startRange && queryNode.nodeType !== 3){
							startEmpty = 1;
						}
					}
					//指向下一个要修改的节点
					queryNode = queryNode2;
				}
			}else{
				//选区在同一个节点上，截断选区前后，修改选区
                if(changeType === 'style'){
					startRange = this._addSpan(oriOptArea.firstNode,oriOptArea,styleType,styleValue,'cut');
                }else if(changeType === 'wordcase'){
	                startRange = this._wordCase(oriOptArea.firstNode,oriOptArea,styleType,styleValue,'cut');
                }else if(changeType === 'tag_on'){
                    startRange = this._addTag(oriOptArea.firstNode,oriOptArea,styleType,'cut','on');    
                }else{
					startRange = this._addTag(oriOptArea.firstNode,oriOptArea,styleType,'cut','off');
				}
				this.mainRange = startRange;
				this.mainSelection.removeAllRanges();
                this.mainSelection.addRange( this.mainRange );
			}
		},
		/**
		* @description 添加span标签
		* @param {object.<node>} queryNode 待修改的单个节点
		* @param {object} oriOptArea 待修改的原始范围信息
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 修改的参数值
		* @param {string} position 待修改的节点位置
		*/
		_addSpan : function(queryNode,oriOptArea,styleType,styleValue,position){
			var tmpSpan = this.document.createElement("span");
			if(queryNode.nodeType === 3 && /\S/.test(queryNode.nodeValue)){//Text节点
				var tmpRange = this.document.createRange();
				tmpRange.selectNode(queryNode);
				var lastRange = tmpRange.cloneRange();
				var firstRange = tmpRange.cloneRange();
				//设置截断的尾部范围
				if(position === 'last' || position === 'cut'){
					tmpRange.setEnd(queryNode,oriOptArea.lastOffset);
					lastRange.setEndAfter(queryNode.parentNode);
					lastRange.setStart(queryNode,oriOptArea.lastOffset);
				}
				//设置截断的头部范围
				if(position === 'first' || position === 'cut'){
					tmpRange.setStart(queryNode,oriOptArea.firstOffset);
					firstRange.setStartBefore(queryNode.parentNode);
					firstRange.setEnd(queryNode,oriOptArea.firstOffset);
				}
				if(queryNode.parentNode.tagName === 'SPAN'){
					var lastCut = '',firstCut = '';
					if(position === 'cut'){
						//截断头尾，中间修改
						lastCut = lastRange.extractContents();
						lastRange.insertNode(lastCut);
						firstCut = firstRange.extractContents();
						firstRange.insertNode(firstCut);
						this.setStyleType(styleType,styleValue,queryNode.parentNode);
						tmpRange.selectNodeContents(queryNode);
					}else{
						//截断尾
						if(position === 'last'){
							lastCut = lastRange.extractContents();
							lastRange.insertNode(lastCut);
						}
						//截断头
						if(position === 'first'){
							firstCut = firstRange.extractContents();
							firstRange.insertNode(firstCut);
						}
						if(queryNode.parentNode.firstChild !== queryNode.parentNode.lastChild){
							var endCut = '',startCut = '';
							if(position === 'first'){
								tmpRange.setStartBefore(queryNode.parentNode);
								tmpRange.setEndAfter(queryNode);
								startCut = tmpRange.extractContents();
								queryNode = startCut.firstChild.firstChild;
								tmpRange.insertNode(startCut);
							}else if(position === 'last'){
								tmpRange.setEndAfter(queryNode.parentNode);
								tmpRange.setStartBefore(queryNode);
								endCut = tmpRange.extractContents();
								queryNode = endCut.firstChild.firstChild;
								tmpRange.insertNode(endCut);
							}else if(position === 'mid'){
								tmpRange.setStartBefore(queryNode.parentNode);
								tmpRange.setEndAfter(queryNode);
								startCut = tmpRange.extractContents();
								tmpRange.insertNode(startCut);
								tmpRange.setStartBefore(queryNode);
								endCut = tmpRange.extractContents();
								queryNode = endCut.firstChild.firstChild;
								tmpRange.insertNode(endCut);
							}
						}
						/**包裹span标签
						if(queryNode.parentNode === this.mainRange.commonAncestorContainer){
							tmpRange.selectNode(queryNode);
							tmpRange.surroundContents(tmpSpan);
						}
						*/
						this.setStyleType(styleType,styleValue,queryNode.parentNode);
						tmpRange.selectNodeContents(queryNode);
					}
				}else{
					//直接包裹span标签
					this.setStyleType(styleType,styleValue,tmpSpan);
					tmpRange.surroundContents(tmpSpan);
				}
				return tmpRange;
			}
		},
		/**
		 * @description 大小写转化
		 * @param {object.<node>} queryNode 待修改的单个节点
		 * @param {object} oriOptArea 待修改的原始范围信息
		 * @param {string} styleType 待修改的样式
		 * @param {string} styleValue 修改的参数值
		 * @param {string} position 待修改的节点位置
		 */
		_wordCase : function(queryNode,oriOptArea,styleType,styleValue,position){
			if(queryNode.nodeType === 3 && /\S/.test(queryNode.nodeValue)){//Text节点
				var tmpRange = this.document.createRange();
				tmpRange.selectNode(queryNode);
				//设置截断的尾部范围
				if(position === 'last' || position === 'cut'){
					tmpRange.setEnd(queryNode,oriOptArea.lastOffset);
				}
				//设置截断的头部范围
				if(position === 'first' || position === 'cut'){
					tmpRange.setStart(queryNode,oriOptArea.firstOffset);
				}
				var tmpTextFrag = tmpRange.extractContents();
				var wordText = tmpTextFrag.firstChild.nodeValue;
				var newText =(styleValue === 'lower' ? wordText.toLowerCase() : wordText.toUpperCase());
				tmpTextFrag.firstChild.nodeValue = newText;
				tmpRange.insertNode(tmpTextFrag);
				return tmpRange;
			}
		},
		/**
		* @description 添加（或取消）其他样式标签
		* @param {object.<node>} queryNode 待修改的单个节点
		* @param {object} oriOptArea 待修改的原始范围信息
		* @param {string} styleType 待修改的样式
		* @param {string} position 待修改的节点位置
		* @param {string} on_off 添加标签还是取消标签
		*/
		_addTag : function(queryNode,oriOptArea,styleType,position,on_off){
			var tmpTag = this.document.createElement(styleType);
			if(queryNode.nodeType === 3 && /\S/.test(queryNode.nodeValue)){//Text节点
				var tmpRange = this.document.createRange();
				tmpRange.selectNode(queryNode);
				var cutFirstRange = tmpRange.cloneRange();
				var cutLastRange = tmpRange.cloneRange();
				//设置头部截断范围
				if(position === 'first' || position === 'cut'){
					tmpRange.setStart(queryNode,oriOptArea.firstOffset);
					cutFirstRange.setStartBefore(queryNode);
					cutFirstRange.setEnd(queryNode,oriOptArea.firstOffset);
				}
				//设置尾部截断范围
				if(position === 'last' || position === 'cut'){
					tmpRange.setEnd(queryNode,oriOptArea.lastOffset);
					cutLastRange.setEndAfter(queryNode);
					cutLastRange.setStart(queryNode,oriOptArea.lastOffset);
				}
				//遍历父标签，直到不能被包裹的标签终止
				while(DTD[styleType][queryNode.parentNode.tagName] === 1 && DTD.$block[queryNode.parentNode.tagName] !== 1){
					if(queryNode.parentNode.firstChild !== queryNode.parentNode.lastChild){
                        //父节点不再是紧贴文本节点的标签了
						break;
                    }else{
						//设置头部截断范围，修改区起始范围
						if(position === 'first' || position === 'mid' || position === 'cut'){
							tmpRange.setEndAfter(queryNode.parentNode);
							cutFirstRange.setStartBefore(queryNode.parentNode);
						}
						//设置尾部截断范围，修改区终止范围
						if(position === 'last' || position === 'mid' || position === 'cut'){
							tmpRange.setStartBefore(queryNode.parentNode);
							cutLastRange.setEndAfter(queryNode.parentNode);
						}
                        queryNode = queryNode.parentNode;  
                    }
                }
				//已经被需要的标签包裹
                if(queryNode.parentNode.tagName === styleType.toUpperCase()){
                    if(on_off === 'on'){
						return tmpRange;
					}else{
						var canDel = true;
					}
                }
				//没有被需要的标签包裹
				else{
					if(on_off === 'off'){
						return tmpRange;
					}
				}
				var cutLastTag = '',cutFirstTag = '';
				//尾部截断，设置修改区终止范围
				if(position === 'cut' || position === 'last'){
					cutLastTag = cutLastRange.extractContents();
					cutLastRange.insertNode(cutLastTag);
					tmpRange.setEnd(cutLastRange.startContainer,cutLastRange.startOffset);
				}
				//头部截断，设置修改区起始范围
				if(position === 'cut' || position === 'first'){
					cutFirstTag = cutFirstRange.extractContents();
					cutFirstRange.insertNode(cutFirstTag);
					tmpRange.setStart(cutFirstRange.endContainer,cutFirstRange.endOffset);
				}
				//修改区节点的父标签与修改标签不能共存
                if(DTD[styleType][queryNode.parentNode.tagName] === 2 || canDel === true){
                    var upNode = queryNode.parentNode;
					//截断修改区域，保存
					var cutTag = tmpRange.extractContents();
					//尾部截断
					if(position === 'cut' || position === 'last'){
						cutLastRange.setEndAfter(upNode);
						cutLastTag = cutLastRange.extractContents();
						cutLastRange.insertNode(cutLastTag);
						cutLastRange.collapse(true);
						tmpRange = cutLastRange;
					}
					//头部截断
					if(position === 'cut' || position === 'first' || position === 'mid'){
						cutFirstRange.setEnd(tmpRange.startContainer,tmpRange.startOffset);
						cutFirstRange.setStartBefore(upNode);
						cutFirstTag = cutFirstRange.extractContents();
						cutFirstRange.insertNode(cutFirstTag);
						cutFirstRange.collapse(false);
						tmpRange = cutFirstRange;
					}
					
                    tmpRange.insertNode(cutTag);
					if(canDel !== true){
						tmpRange.surroundContents(tmpTag);
					}
                }else{
					//直接包裹需要标签
					if(position === 'cut'){
						tmpRange.setStart(cutFirstRange.endContainer,cutFirstRange.endOffset);
						tmpRange.setEnd(cutLastRange.startContainer,cutLastRange.startOffset);
					}
                    tmpRange.surroundContents(tmpTag);
                }
				return tmpRange;
			}
		},
		/**
		* @description 设置其他样式标签
		* @param {object.<range>} queryRange 待修改的范围
		* @param {string} styleType 待修改的样式
		*/
        _setTag : function(queryRange,styleType){
            var queryNode = queryRange.startContainer;
            var tag = this.document.createElement(styleType);
            if(queryNode.nodeType === 3 && /\S/.test(queryNode.nodeValue)){//Text节点
                //创建空节点
				var selText = this.document.createTextNode(this.spaceText);
                queryRange.insertNode(selText);
                queryNode = selText;
                var tmpRange = queryRange.cloneRange();
				tmpRange.setStartBefore(selText);
				tmpRange.setEndAfter(selText);
				var tmpTag = tag.cloneNode();
				var tagRange = this.document.createRange(tmpTag);
				tagRange.selectNodeContents(tmpTag);
				//设置头尾截断范围
				var cutFirstRange = tmpRange.cloneRange();
				var cutLastRange = tmpRange.cloneRange();
				cutFirstRange.setStartBefore(queryNode);
				cutFirstRange.setEndBefore(selText);
                cutLastRange.setEndAfter(queryNode);
                cutLastRange.setStartAfter(selText);
				//遍历父节点，直到不能被包裹的节点
				while(DTD[styleType][queryNode.parentNode.tagName] === 1 && DTD.$block[queryNode.parentNode.tagName] !== 1){
                    if(queryNode.parentNode.firstChild !== queryNode.parentNode.lastChild){
                        break;
                    }
                    else{
                        cutFirstRange.setStartBefore(queryNode.parentNode);
                        cutLastRange.setEndAfter(queryNode.parentNode);
                        queryNode = queryNode.parentNode;  
                    }
                }
                if(queryNode.parentNode.tagName === styleType.toUpperCase()){
                    return;
                }
				//截断头尾
				var cutLastTag = cutLastRange.extractContents();
				cutLastRange.insertNode(cutLastTag);
                var cutFirstTag = cutFirstRange.extractContents();
                cutFirstRange.insertNode(cutFirstTag);
				//如果父标签不能与设置标签共存
                if(DTD[styleType][queryNode.parentNode.tagName] === 2){
                    var upNode = queryNode.parentNode;
					//截取空节点
                    tmpRange.setStart(cutFirstRange.endContainer,cutFirstRange.endOffset);
                    tmpRange.setEnd(cutLastRange.startContainer,cutLastRange.startOffset);
                    var cutTag = tmpRange.extractContents();
					//截断头尾
					cutLastRange.setEndAfter(upNode);
                    cutLastTag = cutLastRange.extractContents();
                    cutLastRange.insertNode(cutLastTag);
                    cutFirstRange.setStartBefore(upNode);
                    cutFirstTag = cutFirstRange.extractContents();
                    cutFirstRange.insertNode(cutFirstTag);
					//删除不能共存的节点，插入截取的空节点，包裹设置标签
                    tmpRange.setStart(cutFirstRange.endContainer,cutFirstRange.endOffset);
                    tmpRange.setEnd(cutLastRange.startContainer,cutLastRange.startOffset);
                    tmpRange.deleteContents();
                    tmpRange.insertNode(cutTag);
                    tmpRange.surroundContents(tag);
                }else{
					//直接包裹设置标签
                    tmpRange.setStart(cutFirstRange.endContainer,cutFirstRange.endOffset);
                    tmpRange.setEnd(cutLastRange.startContainer,cutLastRange.startOffset);
                    tmpRange.surroundContents(tmpTag);
                }
                //设置光标在刚刚建立的空节点中
                this.mainSelection.removeAllRanges();
                this.mainRange.setStart(selText,0);
                this.mainRange.setEnd(selText,1);
                this.mainSelection.addRange( this.mainRange );
			}
        },
		/**
		* @description 设置（或取消设置）span标签，带style样式
		* @param {object.<range>} queryRange 待修改的范围
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 待修改的样式值
		*/
        _setSpan : function(queryRange,styleType,styleValue){
            var tmpSpan = this.document.createElement("span");
            var queryNode = queryRange.startContainer;
			if(queryNode.nodeType === 3 && /\S/.test(queryNode.nodeValue)){//Text节点
				var tmpRange = queryRange.cloneRange();
				if(queryNode.parentNode.tagName === 'SPAN'){
					var styleString = styleType + ': ' + styleValue;
					var styleExist = queryNode.parentNode.style.cssText.search(styleString);
					if(styleExist !== -1){
						return;
					}else{
						//截断父span
                        tmpRange.setStartBefore(queryNode.parentNode);
						var cutSpan = tmpRange.extractContents();
						tmpRange.insertNode(cutSpan);
						tmpRange.collapse(false);
                    }
				}
				//建立空节点，并插入到截断位置，设置光标位置在空节点中
				var selRange = this.document.createRange();
				selRange.selectNodeContents(tmpSpan);
				var selText = this.document.createTextNode(this.spaceText);
				selRange.insertNode(selText);
				this.setStyleType(styleType,styleValue,tmpSpan);
				tmpRange.insertNode(tmpSpan);
				this.mainSelection.removeAllRanges();
				this.mainRange.setStart(selText,1);
				this.mainSelection.addRange(this.mainRange);

			}
        },
		/**
		* @description 取消设置其他样式标签
		* @param {object.<range>} queryRange 待修改的范围
		* @param {string} styleType 待修改的样式
		*/
        _unsetTag : function(queryRange,styleType){
            var firstRange = queryRange.cloneRange();
            var lastRange = queryRange.cloneRange();
            var selRange = queryRange.cloneRange();
            var tmpRange = queryRange.cloneRange();
			//建立空节点
            var selText = this.document.createTextNode(this.spaceText);
            selRange.insertNode(selText);
            firstRange.setEndBefore(selText);
            lastRange.setStartAfter(selText);
            var queryNode = queryRange.startContainer;
			//找到取消设置的标签节点
            while(queryNode.parentNode && styleType.toUpperCase() !== queryNode.parentNode.tagName ){
				queryNode = queryNode.parentNode;
            }
			//截断头尾，插入空节点
            if(styleType.toUpperCase() === queryNode.parentNode.tagName){
				var upNode = queryNode.parentNode;
				var cutLastTag = '',cutFirstTag = '';
					//截取空节点
                    selRange.setStart(firstRange.endContainer,firstRange.endOffset);
                    selRange.setEnd(lastRange.startContainer,lastRange.startOffset);
                    var cutTag = selRange.extractContents();
					//截断头尾
					lastRange.setEndAfter(upNode);
                    cutLastTag = lastRange.extractContents();
                    lastRange.insertNode(cutLastTag);
                    firstRange.setStartBefore(upNode);
                    cutFirstTag = firstRange.extractContents();
                    firstRange.insertNode(cutFirstTag);
					//删除不能共存的节点，插入截取的空节点，包裹设置标签
                    selRange.setStart(firstRange.endContainer,firstRange.endOffset);
                    selRange.setEnd(lastRange.startContainer,lastRange.startOffset);
                    selRange.deleteContents();
                    selRange.insertNode(cutTag);
				/*	
                firstRange.setStartBefore(queryNode);
                lastRange.setEndAfter(queryNode);
                var tmpLast = lastRange.extractContents();
                lastRange.insertNode(tmpLast);
				var tmpFirst = firstRange.extractContents();
                firstRange.insertNode(tmpFirst);
				selRange.setStart(firstRange.endContainer,firstRange.endOffset);
                selRange.setEnd(lastRange.startContainer,lastRange.startOffset);
                var cutTag = selRange.extractContents();
				lastRange.setEndAfter(upNode);
                tmpLast = lastRange.extractContents();
                lastRange.insertNode(tmpLast);
				firstRange.setStartBefore(upNode);
                tmpFirst = firstRange.extractContents();
                firstRange.insertNode(tmpFirst);
				selRange.selectNode(selRange.commonAncestorContainer);
				selRange.deleteContents();
				selRange.insertNode(cutTag);*/
            }
			//将光标设置在空节点中
            this.mainSelection.removeAllRanges();
            this.mainRange.setStart(selText,0);
            this.mainRange.setEnd(selText,1);
            this.mainSelection.addRange( this.mainRange );
        },
		/**
		* @description 设置节点的style属性
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 待修改的样式值
		* @param {object.<node>} optNode 待修改的节点
		*/
		setStyleType : function(styleType,styleValue,optNode){
			optNode.style.cssText += ';'+styleType + ': ' + styleValue+';';
		},
		/**
		* @description 判断该选中区域是应该添加标签样式，还是取消标签样式
		* @param {string} styleType 待修改的样式
		* @param {string} styleValue 待修改的样式值
		* @return {string} '_on'为应该添加标签，'_off'为应该取消标签
		*/
		judgeValue : function(styleType,styleValue){
			var on_off = "_on";
			var tmpElement = this.mainRange.startContainer;
			var isTextEnd = tmpElement.nodeType !== 3 || tmpElement.nodeValue.length <= this.mainRange.startOffset;
			if(!this.mainRange.collapsed && isTextEnd){
				var ancestorList = {};
				var commonAncestor = this.mainRange.commonAncestorContainer;
				if(navigator.userAgent.indexOf("MSIE") <= 0){
					ancestorList = this.document.createNodeIterator(commonAncestor,NodeFilter.SHOW_ALL);
				}else{
					ancestorList = this.document.createNodeIterator(commonAncestor);
				}
				var hasConRange = this.document.createRange();
				var judgeNode = ancestorList.nextNode();
				var isFind = false;
				while(judgeNode) {
					if(judgeNode === tmpElement || isFind === true)  {
						isFind = true;
						if(judgeNode.nodeType === 3 && judgeNode.nodeValue.length > 0){
							hasConRange.selectNodeContents(judgeNode);
							if(this.mainRange.compareBoundaryPoints(hasConRange.START_TO_START,hasConRange) < 1){
								tmpElement = judgeNode;
								break;
							}
						}
					}
					judgeNode = ancestorList.nextNode();
				}
				hasConRange.detach();
			}
			if(typeof styleValue === 'string'){
				on_off = styleValue;
				if(E.curEditor.dom.queryCommandState('underline') === true){
					if(styleValue === 'underline'){
						on_off = "none";
					}
				}
				if(E.curEditor.dom.queryCommandState('strikethrough') === true){
					if(styleValue === 'line-through'){
						on_off = "none";
					}
				}
			}else{
				while(tmpElement && tmpElement.nodeName !== 'BODY'){
					if( tmpElement.nodeType !== 3 && (DTD[tmpElement.nodeName][styleType] === 3 || styleType === tmpElement.nodeName.toLowerCase() ) ){
						on_off = "_off";

						break;
					}
					tmpElement = tmpElement.parentNode;
				}
			}
			return on_off;
		}
	};

	E.coreCommand.editText = text;
})(window.jQuery.jQEditor,window.jQuery);