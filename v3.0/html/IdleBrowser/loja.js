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
	var tituloSecundario = {espada: false, capacete: false};
	
	div = "<p id='itens'>";
	
	for(var chave in itens){
		var h3 = chave;
		
		if(chave == "minerio") tituloTipo = "minerar";
		else if(chave == "forja") tituloTipo = "forjar";
		else if(chave == "caca"){
			h3 = "Caça";
			tituloTipo = "cacar";
		}else if(chave == "comida") tituloTipo = "cozinhar";
		
		div += "<h3>" + maiuscula(h3) + "</h3>";
		
		for(var key in status.inventario){
		
			item = verificarItem(minuscula(key));

			try{
				if(item != null){
					if(item.tipo == tituloTipo){
					
						if(chave != "forja"){
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
				console.log("Erro no loja.js linha 176");
				console.log(err);
			}
		}
	}
	
	var objetos = "";
	for(key in status.inventario) objetos += key;
	
	for(var chave in itens.forja){
	
		if(objetos.indexOf(maiuscula(chave)) > -1){ //Verifica se a chave existe no inventario.
			//console.log("Possui: " + chave);
			div += "<h4>" + maiuscula(chave) + "</h4>";

			for(var key in status.inventario){
				item = verificarItem(minuscula(key)); //Verifica qual é o item que está no inventario.
				if(key.includes(maiuscula(chave))){ //Verifica se o item é do tipo certo para por na ordem.
					div = sellDiv(status, div, item, "forja", key); //chama a função que cria a div com os itens e preços e etc.
				}
			}
		}
	}
	
	div += "<\p><br>";
	
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
