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
		item = verificarItem(nome);
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
	
	multiplicador = 1;
	
	if(tipo == "forja"){
		refino = verificarRefino(nome);
		item = verificarItem(nome);
		if(refino[0] != ""){
			multiplicador = parseInt(refino[0]) + 1;
			nomeElemento = refino[1].concat(refino[0]);
		}else nomeElemento = item.nome;
	}
	else {
		item = itens[tipo][nome];
		nomeElemento = nome;
	}
	
	if(status.inventario[maiuscula(nome)] >= qtd){
		status.inventario.dinheiro += (item.sell * multiplicador) * qtd;
		status.inventario[maiuscula(nome)] -= qtd;
		textoFinalPagina("Vendeu com sucesso " + qtd + " de " + maiuscula(nome) + " por: " + (item.sell * multiplicador) * qtd);
		document.getElementById("total" + removerEspaco(minuscula(nomeElemento))).innerHTML = (status.inventario[maiuscula(nome)]) + " / ";
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
						"<a class='btnMaisMenos' value='" + keys.concat(chave) + "' id='+' outro='" + key + "' tipo='compra'  nome='" + minuscula(itens[key][keys][chave].nome) +"'> + </a>" +
						"<i class='compra' value='" + keys.concat(chave) + "' outro='" + key + "' nome='" + minuscula(itens[key][keys][chave].nome) +"'> COMPRAR </i>" +
						"<a class='btnMaisMenos' value='" + keys.concat(chave) + "' id='-' outro='" + key + "' tipo='compra' nome='" + minuscula(itens[key][keys][chave].nome) +"'> - </a> <br>";
				}
			}
			else{
				div += "<i>" +  maiuscula(keys) + ": </i>"+
						"<i id=" + keys + "Qtdbuy>  1 </i>" +
						" | Custa: " +
						"<i id=" + keys + "Valbuy>" + itens[key][keys].buy + "</i> | " +
						"<a class='btnMaisMenos' value='" + keys + "' id='+' outro='" + key + "' tipo='compra' nome='" + minuscula(itens[key][keys].nome) +"'> + </a>" +
						"<i class='compra' value='" + keys + "' outro='" + key + "' nome='" + minuscula(itens[key][keys].nome) +"'> COMPRAR </i>" +
						"<a class='btnMaisMenos' value='" + keys + "' id='-' outro='" + key + "' tipo='compra' nome='" + minuscula(itens[key][keys].nome) +"'> - </a> <br>";
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
	
	var item;
	div = "<p id='itens'>";
	
	for(chave in itens){
		div += "<h3>" + maiuscula(chave) + "</h3>";
		for(key in status.inventario){
			item = verificarItem(minuscula(key));

			if(chave != "forja"){
				try{
					console.log(" Nome: " + itens[chave][minuscula(key)].nome + " nome chave: " + maiuscula(key));
					if(itens[chave][minuscula(key)].nome == maiuscula(key)) div = sellDiv(status, div, item, chave, key);		
				}catch(err){
					console.log("Erro na criacao do Div de Sell: " + err);
				}
			}else{
				refino = verificarRefino(key);
				//console.log(refino);
				if(refino[1] == "") nome = key;
				else nome = refino[1];
				for(keys in itens[chave]){
					for(var ultimaChave in itens[chave][keys]){
						if(maiuscula(nome) == itens[chave][keys][ultimaChave].nome){
							div = sellDiv(status, div, item, chave, key);
						}
					}
				}
			}
			
		}
		
	}
	div += "<\p>";
	
	titulo.insertAdjacentHTML('beforeend', div);
};

var sellDiv = function(status, div, item, tipo, keyInv){
	
	refino = "";
	
	if(tipo == "forja"){
		nome = keyInv
		refino = verificarRefino(keyInv);
		key = removerEspaco(refino[1].concat(refino[0]))
		valor = item.sell * (parseInt(refino[0]) + 1);
		if(refino[0] == ""){
			nome = item.nome;
			valor = item.sell;
			key = removerEspaco(item.nome);
		}
	}else{
		nome = item.nome;
		key = removerEspaco(item.nome);
		valor = item.sell;
	}
	
	//console.log(refino);
	
	try{
		div += "<i>" +  nome + ": </i>"+
				"<i id='total" + minuscula(key) + "'>" +  status.inventario[nome] + " / </i>" +
				"<i id='" + minuscula(key) + "Qtdsell'> 1 </i>" +
				" | Valor: " +
				"<i id='" + minuscula(key) + "Valsell'>" + valor + "</i> | " +
				"<a class='btnMaisMenos' value='" + minuscula(key) + "' id='+' outro='" + tipo + "' tipo='venda' nome='" + nome +"'> + </a>" +
				"<i class='venda' value='" + minuscula(key) + "' outro='" + tipo + "'  nome='" + nome +"'> VENDER </i>" +
				"<a class='btnMaisMenos' value='" + minuscula(key) + "' id='-' outro='" + tipo + "' tipo='venda'  nome='" + nome +"'> - </a> <br>";
	}catch(err){
		console.log("Erro no sell no item: " + err);
	}
	
	return div;
};
