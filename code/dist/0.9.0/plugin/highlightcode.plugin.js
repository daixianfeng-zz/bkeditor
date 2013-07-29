/*! Bkeditor - v0.9.0 - 2013-07-29
* https://github.com/daixianfeng/bkeditor
* Copyright (c) 2013 daixianfeng;*/
(function(E, $){
	var langs = {
		'html': 'HTML/XML',
		'js': 'Javascript',
		'css': 'CSS',
		'php': 'PHP',
		'java': 'Java',
		'py': 'Python',
		'pl': 'Perl',
		'rb': 'Ruby',
		'cs': 'C#',
		'c': 'C++/C',
		'vb': 'VB/ASP'
	};
	
	var html = '<div><select name="code_language" style="margin:2px 0;">';
	for( var i in langs) {
		html += '<option value="'+i+'">' + langs[i]+'</option>';
	}
	html += '</select></div>';
	html += '<textarea name="content" style="width:600px;height:300px;resize:none;"></textarea>';
	
	// 注册UI插件
	E.addUi({
		id: 'codedialog',
		html: html,
		
		submit: function() {
			var panel = $('#codedialog'),
				code_language = panel.find('select[name=code_language]').val(),
				content = panel.find('textarea').val();
			content = E.utils.escape(content);
			
			return '\n<pre class="prettyprint lang-' + code_language + '">' + content + '</pre>\n';
		}
	});
	
	// 注册命令插件
	E.addPlugin({
		id: 'highlightcode',
		title: '插入代码',
		ui: 'codedialog',
		type: 'dialog',
		
		getData: function(editor) {
			var el = editor.getCursorElement();
			var content = $(el).closest('pre').text();
			
			var data = {
					content: content
				};
				
			return data;
		}
	});
	
})(jQuery.jQEditor, jQuery);