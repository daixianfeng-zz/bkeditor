/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(e,t){var n={SPAN:!1,EM:!1,STRONG:!1,SUB:!1,SUP:!1},r="";e.addPlugin({id:"font",isEnable:!0,brushOn:{},recordTag:n,recordStyle:r,fontRecord:"",toggleBrush:function(){var t=this.brushOn[e.curId]?!0:!1;this.brushOn[e.curId]=!t,this.brushOn[e.curId]===!0?this.recordStyle():this.fontRecord=""},clear:function(n){var r=e.curEditor.win,i=r.document,o=r.getSelection(),a=o.getRangeAt(0),s=a.commonAncestorContainer,l={ancestor:s,firstNode:a.startContainer,firstOffset:a.startOffset,lastNode:a.endContainer,lastOffset:a.endOffset},c=["td","th","dd","dt"];for(var d in DTD.$block)d=d.toLowerCase(),1===DTD.$block[d]&&c.push(d);c=c.join(",");var u=t(l.lastNode).closest(c)[0],f=a.cloneRange();f.selectNodeContents(u),f.setStart(l.lastNode,l.lastOffset);var m=f.extractContents();f.insertNode(m);var h=t(l.firstNode).closest(c)[0],p=a.cloneRange();p.selectNodeContents(h),p.setEnd(l.firstNode,l.firstOffset);var g=p.extractContents();p.insertNode(g),a.setEnd(f.startContainer,f.startOffset),a.setStart(p.endContainer,p.endOffset);var b=a.cloneRange();b.collapse(!0);var v=a.cloneRange();v.collapse(!1);var y=v.endContainer.childNodes[v.endOffset],E={},s=a.commonAncestorContainer;E=e.IE?i.createNodeIterator(s):i.createNodeIterator(s,NodeFilter.SHOW_ALL);for(var w=E.nextNode(),C=w,k=0,N=1;w;){do C=E.nextNode();while(w===C);if(0===k){var T=i.createRange();T.selectNode(w);var x=T.compareBoundaryPoints(T.START_TO_START,b)}if(1===N)if(C){var S=i.createRange();S.selectNode(C);var L=S.compareBoundaryPoints(S.START_TO_START,v)}else var L=-1;var j=x>-1&&0===k,R=L>-1&&1===N;if(k&&N||j)if(1===w.nodeType&&1===DTD.$font[w.nodeName]){for(var _=w.nextSibling,I=w.parentNode,A=w.childNodes.length,D=A-1;D>=0;D--)_?I.insertBefore(w.childNodes[D],_):I.appendChild(w.childNodes[D]);if(y)v.setEndBefore(y),v.collapse(!1);else{var Q=v.endContainer.parentNode;v.setEnd(Q,Q.childNodes.length),v.collapse(!1)}var O=i.createRange();if(O.selectNode(w),O.deleteContents(),j&&(k=1,a.setStart(O.startContainer,O.startOffset)),R){_?a.setEndBefore(_):a.setEnd(I,I.childNodes.length);break}}else if(j&&(k=1,a.setStartBefore(w)),R){a.setEndAfter(w);break}w=C}return o.removeAllRanges(),o.addRange(a),n?a:(e.curEditor.baseFilter.excute("afterTextPre"),e.curEditor.baseFilter.excute("afterText"),void 0)},brush:function(){if(this.brushOn[e.curId]===!0){var t=this.fontRecord,n=this.clear(!0),r=e.curEditor.win,i=r.document,o=r.getSelection(),a=o.getRangeAt(0),s=n.cloneRange();s.collapse(!0);var l=n.cloneRange();l.collapse(!1);var c={},d=n.commonAncestorContainer;c=e.IE?i.createNodeIterator(d,3):i.createNodeIterator(d,NodeFilter.SHOW_TEXT);for(var u=c.nextNode(),f=u,m=0,h=1;u;){if(f=c.nextNode(),0===m){var p=i.createRange();p.selectNode(u);var g=p.compareBoundaryPoints(p.START_TO_START,s)}if(1===h)if(f){var b=i.createRange();b.selectNode(f);var v=b.compareBoundaryPoints(b.START_TO_START,l)}else var v=-1;var y=g>-1&&0===m,E=v>-1&&1===h;if(m&&h||y){var w=i.createRange();if(w.selectNodeContents(u),""!==t.fontStyle){var C=i.createElement("span");C.style.cssText=t.fontStyle,w.surroundContents(C)}for(var k in t.fontTag)if("SPAN"!==k&&t.fontTag[k]===!0){var N=i.createElement(k);w.surroundContents(N)}if(y&&(m=1,a.setStart(w.startContainer,w.startOffset)),E){a.setEnd(w.endContainer,w.endOffset);break}}u=f}o.removeAllRanges(),o.addRange(a)}this.toggleBrush(),e.curEditor.baseFilter.excute("afterTextPre"),e.curEditor.baseFilter.excute("afterText")},recordStyle:function(){for(var r=e.utils.getCurElement(),i=r.length,o=t.extend(!0,{},this.recordTag),a="",s=0;i>s;s++)3!==r[s].nodeType&&n[r[s].nodeName]!==void 0&&(o[r[s].nodeName]=!0,a+=r[s].style.cssText);this.fontRecord={fontTag:o,fontStyle:a}}}),e.addEvent({name:"editareaBrush",type:["mouseup"],area:"editArea",fn:function(){e.curEditor.$toolbar.find("[cmd=formatmatch].bke-checked").length>0&&e.command("brush")}})})(window.jQuery.jQEditor,window.jQuery);