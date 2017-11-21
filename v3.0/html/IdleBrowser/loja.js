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

var venderInv = function(nome, qtd, tipo){

	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	status.inventario.dinheiro += itens[tipo][nome].sell * qtd;
	status.inventario[maiuscula(nome)] -= qtd;
	
	textoFinalPagina("Vendeu com sucesso " + qtd + " de " + maiuscula(nome) + " por: " + itens[tipo][nome].sell * qtd);
	
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
			div += "<i>" +  maiuscula(keys) + ": </i>"+
					"<i id=" + keys + "Qtdbuy>  1 </i>" +
					" | Custa: " +
					"<i id=" + keys + "Valbuy>" + itens[key][keys].buy + "</i> | " +
					"<a class='btnMaisMenos' value='" + keys + "' id='+' outro='" + key + "' tipo='compra' > + </a>" +
					"<i class='compra' value='" + keys + "' outro='" + key + "'> COMPRAR </i>" +
					"<a class='btnMaisMenos' value='" + keys + "' id='-' outro='" + key + "' tipo='compra'> - </a> <br>";
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
	
	var titulo = document.getElementById("sell");	
	var tipo = "";	
	
	div = "<p id='itens'>";
	
	div += "<h3> Minerio </h3>";
	
	for(var key in status.inventario){
		if(minuscula(key) in itens.minerio){
			tipo = "minerio";
			try{
				div += "<i>" +  maiuscula(key) + ": </i>"+
						"<i id='total" + minuscula(key) + "'>" +  status.inventario[key] + " / </i>" +
						"<i id=" + minuscula(key) + "Qtdsell> 1 </i>" +
						" | Valor: " +
						"<i id=" + minuscula(key) + "Valsell>" + itens[tipo][minuscula(key)].sell + "</i> | " +
						"<a class='btnMaisMenos' value='" + minuscula(key) + "' id='+' outro='" + tipo + "' tipo='venda'> + </a>" +
						"<i class='venda' value='" + minuscula(key) + "' outro='" + tipo + "'> VENDER </i>" +
						"<a class='btnMaisMenos' value='" + minuscula(key) + "' id='-' outro='" + tipo + "' tipo='venda'> - </a> <br>";
			}catch(err){
				console.log("Erro no sell no item: " + err);
			}
			
		}
	}
	
	div += "<br><h3> Comida </h3>";
	
	for(var key in status.inventario){
		if(minuscula(key) in itens.comida){
			tipo = "comida";
			try{
				div += "<i>" +  maiuscula(key) + ": </i>"+
						"<i>" +  status.inventario[key] + " / </i>" +
						"<i id=" + minuscula(key) + "Qtd> 1 </i>" +
						" | Valor: " +
						"<i id=" + minuscula(key) + "Val>" + itens[tipo][minuscula(key)].sell + "</i> | " +
						"<a class='btnMaisMenos' value='" + minuscula(key) + "' id='+' outro='" + tipo + "' > + </a>" +
						"<i class='venda' value='" + minuscula(key) + "' outro='" + tipo+ "'> VENDER </i>" +
						"<a class='btnMaisMenos' value='" + minuscula(key) + "' id='-' outro='" + tipo + "'> - </a> <br>";
			}catch(err){
				console.log("Erro no sell no item: " + err);
			}
			
		}
	}
	
	div += "<\p>";
	
	titulo.insertAdjacentHTML('beforeend', div);
	
	
	salvar(status);
	
	
};
