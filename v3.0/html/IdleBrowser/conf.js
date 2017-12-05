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
			$('.minerio').hide();
			$('.comida').hide();
			$('.forja').hide();
			$('.refinar').hide();
			
			//$('.habilidade').show();
			$("." + clicked).show();
		}
		
	})
	
	$('.item').click(function(){
		var clicked = $(this).attr("id");
		var texto = $(this).text();
		
		console.log(clicked, texto);
		
		try{
			textoFinalPagina("Aguarde terminar a tarefa atual para mudar para " + texto);
			definirAcao(clicked, texto);
		}catch(err){
			console.log("Erro na chamada do conf.js no click ('.item') " + err);
			if(texto.includes("Empregado")) informacoes(texto);
		}
		
	})
	
	$('.item').mouseover(function(){
	
		//console.log($(this).position());
	
		//var refino = verificarRefino($(this).text());
		popUpItens($(this).text());
		/*
		if(refino[0] != ""){
			var id = removerEspaco(refino[1].concat(refino[0]));
		}else var id = removerEspaco($(this).text());
		
		var popup = document.getElementById("popup".concat(id));
		
		popup.classList.toggle("show");
		*/
	})
	
	$('.item').mouseout(function(){
		deletePopUp($(this).text());
	})

	//OPCOES DA PAGINA LOJA.HTML
	$('.btnMaisMenos').click(function(){
	
		var itens = {}; 
		itens = defItens(itens);
		
		var status = {};
		status = iniciar(status);

		var nome = $(this).attr("value");
		var produto = $(this).attr("nome");
		var x = $(this).attr("id");
		var tipo = $(this).attr("outro");
		var metodo = $(this).attr("tipo");
		var opcao = "";
		var multiplicador = 1;
		
		if(metodo == "compra") opcao = "buy";
		else if(metodo == "venda") opcao = "sell";
		
		var qtd = $('#' + nome + 'Qtd' + opcao).text();
		var custo = $("#" + nome + "val" + opcao).text();
		
		item = verificarItem(nome);
		refino = verificarRefino(produto);
		
		if(refino[0] != "") multiplicador = parseInt(refino[0]) + 1;
		
		console.log("#" + nome + "Qtd" + opcao);
		if(x == "+" && ((status.inventario[maiuscula(produto)] > qtd && opcao == "sell") || opcao == "buy")){	
			document.getElementById(nome + "Qtd" + opcao).innerHTML = parseInt(qtd) + 1;
			document.getElementById(nome + "Val" + opcao).innerHTML = (item[opcao] * multiplicador) * (parseInt(qtd) + 1);
			
		}
		else if(x == "-" && parseInt(qtd) >= 1){
			document.getElementById(nome + "Qtd" + opcao).innerHTML = parseInt(qtd) - 1;
			document.getElementById(nome + "Val" + opcao).innerHTML = (item[opcao] * multiplicador) * (parseInt(qtd) - 1);
		}

	})

	$('.compra').click(function(){

		var nome = $(this).attr("value");
		var valor = parseInt($("#" + nome + "Qtdbuy").text());	
		var tipo = $(this).attr("outro");

		//console.log(nome + " " + valor + " " + tipo);

		addInv(nome, valor, tipo);

	})
	
	$('.venda').click(function(){
		
		var nome = $(this).attr("value");
		var produto = $(this).attr("nome");
		var qtd = parseInt($("#" + nome + "Qtdsell").text());	
		var tipo = $(this).attr("outro");

		//console.log(nome + " " + valor + " " + tipo);
		
		venderInv(minuscula(produto), qtd, tipo);
		
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
