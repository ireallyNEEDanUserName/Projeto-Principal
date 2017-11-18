$(document).ready(function(){

	$('#barra').click(function(){
		clickBarraFunc(true);
		
		cor(this, 'black', 'green');
		
	})
	
	//OPCOES DA PAGINA MISSOES.HTML
	$('.opcoes').click(function(){
		var clicked = $(this).attr("value");
		
		console.log(clicked);
		
		if(clicked == "buy"){
			$(document.getElementById('sell')).hide();
			$(document.getElementById('buy')).show();
		}else if(clicked == "sell"){
			$(document.getElementById('buy')).hide();
			$(document.getElementById('sell')).show();
		}else{
			$('.habilidade').hide();
			$("#" + clicked).show();
		}
		
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
	$('.btnCompra').click(function(){
	
		var itens = {}; 
		itens = defItens(itens);

		var nome = $(this).attr("value");
		var x = $(this).attr("id");
		var tipo = $(this).attr("outro");
		
		var valor = $("#" + nome + "Qtd").text();
		var custo = $("#" + nome + "val").text();

		if(x == "+"){
			document.getElementById(nome + "Qtd").innerHTML = parseInt(valor) + 1;
			document.getElementById(nome + "Val").innerHTML = itens[tipo][nome].buy * (parseInt(valor) + 1);
		}
		else if(x == "-" && parseInt(valor) > 1){
			document.getElementById(nome + "Qtd").innerHTML = parseInt(valor) - 1;
			document.getElementById(nome + "Val").innerHTML = itens[tipo][nome].buy * (parseInt(valor) - 1);
		}

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
