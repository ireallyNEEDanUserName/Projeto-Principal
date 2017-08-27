$(document).ready(function(){

	$("#jogoStart").click(function(){
		var nome = $("#caixaNome").val();
		console.log(nome);
		if(nome.length != 0){
			console.log(nome);
			$("#form").fadeOut("fast");
			inicio();
			$("#status").show("fast");
			$("#screen").show("fast");
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
