var start = function(){
	
	var status = {};
	status = iniciar(status);

};

var addInv = function(tipo, qtd){

	var status = {};
	status = iniciar(status);
	
	var custo;
	var qtdGeral;
	
	if(tipo == "pedra"){
		tipoMaterial = "minerio";
		custo = 2;
		qtdGeral = qtd;
	}
	else if(tipo == "ferro"){
		tipoMaterial = "minerio";
		custo = 5;
		qtdGeral = qtd * 2;
	}
	
	var preco = qtd * custo;
	
	if(status.inventario["dinheiro"] >= preco){
		status.inventario[tipoMaterial] += qtdGeral;
		status.inventario["dinheiro"] -= preco;
		textoFinalPagina("Comprou com sucesso " + qtd + " de " + maiuscula(tipo) + " por: " + preco);
	}
	else textoFinalPagina("Dinheiro Insuficiente");	

	salvar(status);
	materiais();

};

var criarBuy = function(){
	
	var itens = {}; 
	itens = defItens(itens);
	
	var titulo = document.getElementById("titulo");	
	
	var div = "<p id='itens'>";
	
	for(var key in itens){
		
		div += "<h3> " + maiuscula(key) + " </h3>";
		
		for(var keys in itens[key]){
			console.log(itens[key][keys]);
			div += "<i>" +  maiuscula(keys) + ": </i>"+
					"<i id=" + keys + "Qtd>  1 </i>" +
					"| Custa: " +
					"<i id=" + keys + "Val>" + itens[key][keys].buy + "</i> |" +
					"<a class='btnCompra' value='" + keys + "' id='+' outro='" + key + "' > + </a>" +
					"<i class='comp' value='" + keys + "'> COMPRAR </i>" +
					"<a class='btnCompra' value='" + keys + "' id='-' outro='" + key + "'> - </a> <br>";
		}
	}
	
	div += "</p>";
	
	titulo.insertAdjacentHTML('afterend', div);
	
};
