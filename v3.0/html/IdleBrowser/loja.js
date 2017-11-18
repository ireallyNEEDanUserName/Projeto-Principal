var start = function(){
	
	var status = {};
	status = iniciar(status);

};

var addInv = function(nome, qtd, tipo){

	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	console.log(itens[tipo][nome].buy);
	
	var custo = itens[tipo][nome].buy;
	var preco = qtd * custo;
	
	if(status.inventario["dinheiro"] >= preco){
		status.inventario[tipo] += qtd;
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
					" | Custa: " +
					"<i id=" + keys + "Val>" + itens[key][keys].buy + "</i> | " +
					"<a class='btnCompra' value='" + keys + "' id='+' outro='" + key + "' > + </a>" +
					"<i class='compra' value='" + keys + "' outro='" + key + "'> COMPRAR </i>" +
					"<a class='btnCompra' value='" + keys + "' id='-' outro='" + key + "'> - </a> <br>";
		}
	}
	
	div += "</p>";
	
	titulo.insertAdjacentHTML('afterend', div);
	
};


var criarSell = function(){
	
	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	
	
	salvar(status);
	
	
};
