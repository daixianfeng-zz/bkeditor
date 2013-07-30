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
});

})()