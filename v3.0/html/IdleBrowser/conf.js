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
		var texto = $(this).text();
		
		try{
			start(clicked);
		}catch(err){
			console.log("Erro na chamada do conf.js " + err);
			if(texto.includes("Empregado")) informacoes(texto);
		}
		
	})

	//OPCOES DA PAGINA LOJA.HTML
	$('.btn').click(function(){

		var y = $(this).attr("value");
		var x = $(this).attr("id");
		var valor = $("#" + y + "Qtd").text();
		var custo;
		
		if(y == "pedra") custo = 2;
		else if(y == "ferro") custo = 5;

		if(x == "+"){
			document.getElementById(y + "Qtd").innerHTML = parseInt(valor) + 1;
			document.getElementById(y + "Val").innerHTML = (parseInt(valor) + 1) * custo;
		}
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
