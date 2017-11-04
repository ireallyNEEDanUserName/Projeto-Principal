$(document).ready(function(){

	$('#barra').click(function(){
		clickBarraFunc(true);
		
		cor(this, 'black', 'green');
		
	})
	
	//OPCOES DA PAGINA MISSOES.HTML
	$('.opcoes').click(function(){
		var clicked = $(this).attr("value");
		
		$('.habilidade').hide();
		$("#" + clicked).show();

	})
	
	$('.item').click(function(){
		var clicked = $(this).attr("id");
		
		start(clicked);
	})

	//OPCOES DA PAGINA LOJA.HTML
	$('.btn').click(function(){

		var y = $(this).attr("value");
		var x = $(this).attr("id");
		var valor = $("#" + y + "Qtd").text();

		if(x == "+") document.getElementById(y + "Qtd").innerHTML = parseInt(valor) + 1;
		else if(x == "-" && parseInt(valor) > 1) document.getElementById(y + "Qtd").innerHTML = parseInt(valor) - 1;

	})

	$('.comp').click(function(){

		var y = $(this).attr("value");
		var valor = parseInt($("#" + y + "Qtd").text());		

		console.log(y + " " + valor);

		addInv(y, valor);

	})
	
});



var cor = function(self, corPrincipal, corSecundaria){
	if (self.style.color == corPrincipal){
		$(self).css({
			'color' : corSecundaria,
		})
	}
	else{
		$(self).css({
			'color' : corPrincipal,
		})
	}
};
