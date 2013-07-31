(function(){

$(document).ready(function(){
	
	$('#back-feature td').on('mouseenter',function(e){
		var target = $(this);
		target.find('p:first').fadeOut('fast');
		target.find('p:last').fadeIn('fast');
	}).on('mouseleave',function(e){
		var target = $(this);
		target.find('p:first').fadeIn('fast');
		target.find('p:last').fadeOut('fast');
	});
	$('ul.version-list li p.version-opt span').on('mouseenter',function(e){
		var target = $(this);
		target.css('cursor','pointer');
		target.css('color','#2268b2');
	}).on('mouseleave',function(e){
		var target = $(this);
		target.css('color','#666');
	}).on('click',function(e){
		var target = $(this);
		target.closest('li').find('div.version-info').slideToggle('fast');
	});
});
function loadCss(url){
	var link = document.createElement("link");
	
	link.setAttribute('type', 'text/css');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', url);
	
	// �˴�����ʹ��ԭ����DOM��������css�ļ�������ʹ��jQuery��append��������
	$("head")[0].appendChild(link);
};
})()