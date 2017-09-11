$(document).ready(function(){

	$("#jogoStart").click(function(){
		start();
	})
	$("#caixaNome").on('keypress', function(e){
		if(e.which === 13) start();
	})
	$("#codigoFase").on('keypress', function(e){
		if(e.which === 13) start();
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

var start = function(){
	var nome = $("#caixaNome").val();
	if(nome.length != 0){
		$("#form").fadeOut("fast");
		$("#textoBarra").show("fast");
		$("#barraProgresso").show("fast");
		$("#barra").show("fast");
		
		inicio();
	}
};
