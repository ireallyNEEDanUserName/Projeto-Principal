var start = function(){
	
	var status = {};
	status = iniciar(status);

};

var addInv = function(nome, qtd, tipo){

	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	//console.log(nome);

	item = verificarItem(nome);
	console.log(item);
	nome = item.nome;

	
	//console.log(item.buy);
	
	var custo = item.buy;
	var preco = qtd * custo;
	
	if(status.inventario["dinheiro"] >= preco){
		if(maiuscula(nome) in status.inventario) status.inventario[maiuscula(nome)] += qtd;
		else{
			status.inventario[maiuscula(nome)] = 0;
			status.inventario[maiuscula(nome)] += qtd;
		}
		status.log.buy += qtd;
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
	
	if(tipo == "forjar"){
		refino = verificarRefino(nome);
		item = verificarItem(minuscula(nome));
		if(refino[0] != ""){
			multiplicador = parseInt(refino[0]) + 1;
			nomeElemento = refino[1].concat(refino[0]);
		}else nomeElemento = item.nome;
	}
	else {
		item = verificarItem(minuscula(nome));
		nomeElemento = nome;
	}
	
	//console.log(status.inventario[maiuscula(nome)] + " " + qtd);
	if(status.inventario[maiuscula(nome)] >= qtd){
		status.inventario.dinheiro += (item.sell * multiplicador) * qtd;
		status.inventario[maiuscula(nome)] -= qtd;
		status.log.sell += qtd;
		textoFinalPagina("Vendeu com sucesso " + qtd + " de " + maiuscula(nome) + " por: " + (item.sell * multiplicador) * qtd);
		document.getElementById("total" + removerEspaco(minuscula(nomeElemento))).innerHTML = (status.inventario[maiuscula(nome)]) + " / ";
		if(status.inventario[maiuscula(nome)] <= 0) delete status.inventario[maiuscula(nome)];
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
		var h2 = key;
		if(key == "caca") h2 = "caça";
		div += "<h2> " + maiuscula(h2) + " </h2>";
		
		for(var keys in itens[key]){
			if(key == "forja" || key == "minerar"){
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
			}else{
				div += "<i>" +  itens[key][keys].nome + ": </i>"+
						"<i id=" + keys + "Qtdbuy>  1 </i>" +
						" | Custa: " +
						"<i id=" + keys + "Valbuy>" + itens[key][keys].buy + "</i> | " +
						"<a class='btnMaisMenos' value='" + keys + "' id='+' outro='" + key + "' tipo='compra' nome='" + minuscula(itens[key][keys].nome) +"'> + </a>" +
						"<i class='compra' value='" + keys + "' outro='" + key + "' nome='" + minuscula(itens[key][keys].nome) +"'> COMPRAR </i>" +
						"<a class='btnMaisMenos' value='" + keys + "' id='-' outro='" + key + "' tipo='compra' nome='" + minuscula(itens[key][keys].nome) +"'> - </a> <br>";
			}
		}
	}
	
	div += "</p><br>";
	
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
	var tituloTipo = "";
	
	div = "<p id='itens'>";
	
	for(var chave in itens){
		var h3 = chave;
		
		if(chave == "caca"){
			h3 = "Caça";
			tituloTipo = "cacar";
		}else if(chave == "comida") tituloTipo = "cozinhar";
		else if(chave == "geral") tituloTipo = "geral";
		
		if(h3 != "minerar" && h3 != "forja") div += "<h2>" + maiuscula(h3) + "</h2>";
		
		for(var key in status.inventario){
		
			item = verificarItem(minuscula(key));

			try{
				if(item != null){
					//console.log(item.nome);
					if(item.tipo == tituloTipo){
						if(chave != "forja" && chave != "minerar"){
							try{
								//console.log(" Nome: " + item.nome + " nome chave: " + maiuscula(key));
								if(item.nome == maiuscula(key)) div = sellDiv(status, div, item, chave, key);		
							}catch(err){
								console.log("Erro na criacao do Div de Sell: " + err);
							}
						}
					}
				}
			}catch(err){
				console.log("Erro no loja.js no criar sell");
				console.log(err);
			}
		}
	}
	
	var objetos = "";
	for(key in status.inventario) objetos += key;
	
	for(var chaves in itens){
	
		if(chaves == "forja" || chaves == "minerar"){
			div += "<h2>" + maiuscula(chaves) + "</h2>";
			
			for(var chave in itens[chaves]){
			
				div += "<h4>" + maiuscula(chave) + "</h4>";
				
				for(var keys in itens[chaves][chave]){
					for(var key in status.inventario){
						if(key == itens[chaves][chave][keys].nome){
							item = verificarItem(minuscula(key));
							if(item != null){
								if(item.tipo == "minerar" || item.tipo == "forjar"){
									div = sellDiv(status, div, item, item.tipo, key);
								}
							}
						}
					}
				}
			}
		}
	}
	
	
	div += "<\p><br>";
	
	titulo.insertAdjacentHTML('beforeend', div);
};

var sellDiv = function(status, div, item, tipo, keyInv){
	
	refino = "";
	
	if(tipo == "forjar"){
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
