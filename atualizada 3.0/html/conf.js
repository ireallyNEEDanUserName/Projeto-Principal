$(document).ready(function(){

	$('h3').click(function(){
		var isso = $(this);
		clicar(isso);
		$(this).css({ 'color': 'blue', 'text-decoration': 'underline'});
	})
	$('li1').click(function(){
		var isso = $(this);
		clicar(isso);
	})
});


var clicar = function(isso){
	var href = isso.attr('href');
	$('#centro').load( href );
};
