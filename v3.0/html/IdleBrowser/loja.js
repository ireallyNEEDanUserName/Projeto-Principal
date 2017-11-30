var start = function(){
	
	var status = {};
	status = iniciar(status);

};

var addInv = function(nome, qtd, tipo){

	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	console.log(nome);
	if(tipo == "forja"){
		item = forjarItem(itens, status, tipo, nome);
		nome = item.nome;
	}
	else item = itens[tipo][nome];
	
	console.log(item.buy);
	
	var custo = item.buy;
	var preco = qtd * custo;
	
	if(status.inventario["dinheiro"] >= preco){
		if(maiuscula(nome) in status.inventario) status.inventario[maiuscula(nome)] += qtd;
		else{
			status.inventario[maiuscula(nome)] = 0;
			status.inventario[maiuscula(nome)] += qtd;
		}
		status.inventario["dinheiro"] -= preco;
		textoFinalPagina("Comprou com sucesso " + qtd + " de " + maiuscula(nome) + " por: " + preco);
	}
	else textoFinalPagina("Dinheiro Insuficiente");	

	salvar(status);
	materiais(status);

};

var venderInv = function(nome, qtd, tipo){

	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	console.log(status.inventario[maiuscula(nome)]);
	
	if(status.inventario[maiuscula(nome)] >= qtd){
		status.inventario.dinheiro += itens[tipo][nome].sell * qtd;
		status.inventario[maiuscula(nome)] -= qtd;
		textoFinalPagina("Vendeu com sucesso " + qtd + " de " + maiuscula(nome) + " por: " + itens[tipo][nome].sell * qtd);
		document.getElementById("total" + minuscula(nome)).innerHTML = (status.inventario[maiuscula(nome)]) + " / ";
	}else textoFinalPagina("Itens insuficientes no seu inventario");
	
	salvar(status);
	materiais(status);
	
};

var criarBuy = function(){
	
	var itens = {}; 
	itens = defItens(itens);
	
	var titulo = document.getElementById("titulo");	
	
	var div = "<p id='itens'>";
	
	for(var key in itens){
		
		div += "<h2> " + maiuscula(key) + " </h2>";
		
		for(var keys in itens[key]){
			if(key == "forja"){
				div += "<h4> " + maiuscula(keys) + " </h4>";
				for(var chave in itens[key][keys]){
					div += "<i>" +  itens[key][keys][chave].nome + ": </i>"+
						"<i id=" + keys.concat(chave) + "Qtdbuy>  1 </i>" +
						" | Custa: " +
						"<i id=" + keys.concat(chave) + "Valbuy>" + itens[key][keys][chave].buy + "</i> | " +
						"<a class='btnMaisMenos' value='" + keys.concat(chave) + "' id='+' outro='" + key + "' tipo='compra' > + </a>" +
						"<i class='compra' value='" + keys.concat(chave) + "' outro='" + key + "'> COMPRAR </i>" +
						"<a class='btnMaisMenos' value='" + keys.concat(chave) + "' id='-' outro='" + key + "' tipo='compra'> - </a> <br>";
				}
			}
			else{
				div += "<i>" +  maiuscula(keys) + ": </i>"+
						"<i id=" + keys + "Qtdbuy>  1 </i>" +
						" | Custa: " +
						"<i id=" + keys + "Valbuy>" + itens[key][keys].buy + "</i> | " +
						"<a class='btnMaisMenos' value='" + keys + "' id='+' outro='" + key + "' tipo='compra' > + </a>" +
						"<i class='compra' value='" + keys + "' outro='" + key + "'> COMPRAR </i>" +
						"<a class='btnMaisMenos' value='" + keys + "' id='-' outro='" + key + "' tipo='compra'> - </a> <br>";
			}
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
	
	console.log(status.inventario);
	
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
			console.log(status.inventario[key]);
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
	
	div += "<\p>";
	
	titulo.insertAdjacentHTML('beforeend', div);
	
	
	salvar(status);
	
	
};
