$(document).ready(function(){
	
	$('.botao').mouseenter(function(){
		$(this).css({'color': 'blue'})
	})
	$('.botao').mouseleave(function(){
		$(this).css({'color': 'black'})
	})
	
	$('.botao').mousedown(function(){
		var isso = $(this);
		clicar(isso);
		$(this).animate({
			width: '-=5px'
		}, "fast")
	})
	$('.botao').mouseup(function(){
		$(this).animate({
			width: '+=5px'
		}, "fast")
	})
	
	$('.imagen').click(function(){
		var isso = $(this);
		clicar(isso);
	})
});


var clicar = function(isso){
	var href = isso.attr('href');
	$('#centro').load( href );
};
