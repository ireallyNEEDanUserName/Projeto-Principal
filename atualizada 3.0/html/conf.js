$(document).ready(function(){

	$("#jogoStart").click(function(){
		var nome = $("#caixaNome").val();
		if(nome.length != 0){
			$("#form").fadeOut("fast");
			$("#status").show("fast");
			$("#screen").show("fast");
			inicio();
		}
	})
	
	$('.botao').mouseenter(function(){
		$(this).css({'color': 'blue'})
	})
	$('.botao').mouseleave(function(){
		$(this).css({'color': 'black'})
	})
	
});


var clicar = function(isso){
	var href = isso.attr('href');
	$(window).load( href );
};
