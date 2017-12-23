var start = function(){

	console.log("Inicio da funcao de missoes");
	
	var status = {};
	status = iniciar(status);
	
	var tempoUltimo = status.tempoInicial; 
	
	var itens = {}; 
	itens = defItens(itens);

	var tipoMaterial = "";
	var classeMaterial = "";
	var texto = "";
	var expTexto = "";
	var qtdMaterial = 1;
	var itemRefino = [1, ""];
	var exp = 1;
	var item;
	var sucesssoForja = false;
	var loop = true;
	var fimLoop = true;
	var materialAddInv = "";
	
	var textoItem = document.getElementById("tipoItem");
	
	var barra;
	var barraCheia;
	
	var dados = [];
	var barras = [];
	
	try{
		dados = inicializacaoDados();
		texto = dados[0];
		classeMaterial = dados[1];
		item = dados[2];
		tipoMaterial = dados[3]; 
		qtdMaterial = dados[4]; 
		exp = dados[5]; 
		expTexto = dados[6];
		barras = inicializacaoBarras(status.habilidades.acao.tipo, classeMaterial);
		barra = barras[0];
		barraCheia = barras[1];
		
		itemRefino = verificarRefino(tipoMaterial);
		if(itemRefino[0] == "") itemRefino[0] = 1;
	}catch(err){
		console.log("Erro na primeira chamada das funcões de inicializacao do missoes.js " + err);
	}
	
	textoItem.innerHTML = tipoMaterial;
	
	loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
	var tempo = verfTempo(classeMaterial, tipoMaterial, item, status);
	
	var dataInicialAtualizada = new Date();
	var data = new Date();
	
	var segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
	var segundo = data.getTime() / 1000;
	
	var tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
	var tick = function(){
		
		if((status.habilidades.acao.material != tipoMaterial || status.habilidades.acao.tipo != classeMaterial) && fimLoop){
			//console.log("Classe: " + tipoMaterial);
			fimLoop = false;
			try{
				dados = inicializacaoDados();
				texto = dados[0];
				classeMaterial = dados[1];
				item = dados[2];
				tipoMaterial = dados[3]; 
				qtdMaterial = dados[4]; 
				exp = dados[5]; 
				expTexto = dados[6];
				
				itemRefino = verificarRefino(tipoMaterial);
				if(itemRefino[0] == "") itemRefino[0] = 1;
				
				//console.log(barra);
			}catch(err){
				console.log("Erro na segunda chamada das funcões de inicializacao do missoes.js " + err);
			}	
			
			loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
			if(!loop){
				if((status.inventario[tipoMaterial] / 2) >= 1){
					
					qtdMaterial = Math.floor(status.inventario[tipoMaterial] / 2);
					console.log("Mudou a qtd: " + qtdMaterial);
					exp = (1 + qtdMaterial) * (parseInt(itemRefino[0]) * item.lvl);
					
					textoFinalPagina("Fazendo " + tipoMaterial + " - " + qtdMaterial);
					loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
					
				}
			}
			tempo = verfTempo(classeMaterial, tipoMaterial, item, status);
			
			textoItem.innerHTML = tipoMaterial;
			
			dataInicialAtualizada = new Date();
			segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
			tempoDesdeOInicio = 0;
			
		}else{
			//console.log("Dentro do loop");
			
			if(loop){
				data = new Date();
				segundo = data.getTime() / 1000;
				
				tempoDesdeOInicio = segundo - segundoInicialAtualizado;
			
				if(tempoDesdeOInicio.toFixed(0) >= tempo){
					fimLoop = true;
					dataInicialAtualizada = new Date();
					segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
					tempoDesdeOInicio = 0;
					
					//tempoUltimo salva o tempo quando a funcao é chamada a primeira vez e para para o tempoInicial do status depois de iniciada.
					//antes de passar o tempo salva o tempo que iniciou agora em tempoNovo para depois de passada para status salvar em tempoUltimo.
					status = iniciar(status);
					var tempoNovo = status.tempoInicial;
					status.tempoInicial = tempoUltimo; 
					tempoUltimo = tempoNovo;
					/////////////////////////////////////////////////
					
					if(classeMaterial != "refinar"){
						materialAddInv = tipoMaterial;
					}else{
						itemRefino = verificarRefino(tipoMaterial);
						var lvlRefino = 1;
						
						if(itemRefino[0] == ""){
							materialAddInv = tipoMaterial + "+" + lvlRefino;
						}else{
							materialAddInv = itemRefino[1] + "+" + (parseInt(itemRefino[0]) + 1);
							console.log("lvl " + parseInt(itemRefino[0]));
						}
					}
					
					console.log(materialAddInv);
					
					if(materialAddInv in status.inventario) status.inventario[materialAddInv] += qtdMaterial;
					else{
						status.inventario[materialAddInv] = 0;
						status.inventario[materialAddInv] += qtdMaterial;
					}
					
					status.habilidades[expTexto] += exp;
					status = upaLevel(status, texto);
					textoFinalPagina("Você adquiriu " + qtdMaterial + " " + maiuscula(materialAddInv) + " e " + exp + " de experiência");
					if(classeMaterial == "forja") status = removerItemForja(status, item, qtdMaterial);
					else if(classeMaterial == "refinar") status = removerItemRefino(status, tipoMaterial, qtdMaterial);
					salvar(status);
					materiais();
					
					loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
					if(!loop){
						if((status.inventario[tipoMaterial] / 2) >= 1){
							qtdMaterial = Math.floor(status.inventario[tipoMaterial] / 2)
							exp = (1 + qtdMaterial) * (parseInt(itemRefino[0]) * item.lvl);
							textoFinalPagina("Fazendo " + materialAddInv + " - " + qtdMaterial);
							loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
						}
					}
					//console.log("Tem itens para fazer: " + loop);
					//console.log(item.req);
					tempo = verfTempo(classeMaterial, tipoMaterial, item, status);
				}
				
				var tamanhoBarra = Math.floor(tempoDesdeOInicio.toFixed(0) / (tempo / 100));
				barra.innerHTML = tamanhoBarra + " %";
				if(tamanhoBarra <= 3) barra.style.width= '3%';
				else barra.style.width = tamanhoBarra + '%'
				
			}else{
				status = iniciar(status);
				fimLoop = true;
			}
		}
		requestAnimationFrame(tick);
	};
	
	tick();
	
};

var inicializacaoDados = function(){

	console.log("Inicializando Dados");

	var status = {};
	status = iniciar(status);
	
	var itens = {}; 
	itens = defItens(itens);
	
	var tipo = status.habilidades.acao.tipo;
	var tipoMaterial = status.habilidades.acao.material;
	
	var dados = [];
	
	var itemRefino = [1, ""];
	
	if(tipo.includes("minerio")){
		texto = "Minerar";
		classeMaterial = "minerio";
		item = itens[classeMaterial][minuscula(tipoMaterial)];
	}else if(tipo.includes("forja")){
		texto = "Forjar";
		classeMaterial = "forja";
		item = verificarItem(tipo);
		//console.log(item);
		tipoMaterial = item.nome;
	}else if(tipo.includes("caca")){
		texto = "Cacar";
		classeMaterial = "caca";
		item = itens[classeMaterial][minuscula(tipoMaterial)];
	}else if(tipo.includes("refinar")){
		texto = "Forjar";
		classeMaterial = "refinar";
		item = verificarItem(tipo);
		//console.log(item);
		itemRefino = verificarRefino(tipoMaterial);
		if(itemRefino[0] == "") itemRefino[0] = 1;
	}
	
	qtdMaterial = 1 + (Math.round(status.habilidades["lvl".concat(texto)] - item.lvl) - parseInt(itemRefino[0]));
	if(qtdMaterial <= 0) qtdMaterial = 1;
	exp = (1 + qtdMaterial) * (parseInt(itemRefino[0]) * item.lvl);
	expTexto = "exp" + texto;
	
	dados = [texto, classeMaterial, item, tipoMaterial, qtdMaterial, exp, expTexto];
	//console.log(dados);
	return dados;
};

var inicializacaoBarras = function(){

	console.log("Inicializando Barras");
	
	var barras = [];
	
	barras[0] = document.getElementById("barra");
	barras[1] = document.getElementById("barraProgresso");
	barras[2]  = "";
	
	//console.log(barras);
	return barras;
};

var verfTempo = function(classeMaterial, tipoMaterial, item, status){
	
	console.log(item);
	
	var hab = "lvl";
	
	if(classeMaterial == "minerio") hab = hab.concat("Minerar");
	else if(classeMaterial == "caca") hab = hab.concat("Cacar");
	else if(classeMaterial == "forja") hab = hab.concat("Forjar");
	else if(classeMaterial == "refinar") hab = hab.concat("Forjar");
	
	var diminuir = Math.floor(status.habilidades[hab] / 2);
	var tempo = 0;
	var lvlItem = verificarRefino(tipoMaterial);
	if(classeMaterial == "refinar" && parseInt(lvlItem[0]) > 0 && lvlItem[0] != "") tempo = (item.tempo * parseInt(lvlItem[0])) - diminuir;
	else tempo = item.tempo - diminuir;
	
	if(tempo <= 0) tempo = 1;
	
	console.log("Tempo para realizar a tarefa: " + tempo);	
	//console.log(tempo);
	return tempo;
};

var removerItemForja = function(status, item, qtd){

	for(var key in item.req){
		if(status.inventario[maiuscula(key)] >= (item.req[key] * qtd)){
			status.inventario[maiuscula(key)] -= (item.req[key] * qtd);
		}else{
			textoFinalPagina("Itens insuficientes para Forjar " + item.nome);
		}
	}
	return status;
};

var removerItemRefino = function(status, item, qtd){
	
	if(status.inventario[item] >= (2 * qtd)) status.inventario[item] -= (2 * qtd);
	else{
		textoFinalPagina("Itens insuficientes para Refinar " + item);
	}
	
	return status;
};

var chamadaPossForjar = function(classeMaterial, tipoMaterial, status, item, qtd){
	
	if(classeMaterial == "forja") return possibilidadeForjar(status, item, qtd);
	else if(classeMaterial == "refinar") return possibilidadeRefinar(status, tipoMaterial, qtd);
	else return true;
	
};

var possibilidadeRefinar = function(status, item, qtd){
	//console.log("PossibilidadeRefinar : " + item.nome);
	//console.log(status.inventario[item]);
	if(status.inventario[item] >= (2 * qtd)) return true;
	else{
		textoFinalPagina("Quantidade de itens insuficientes para Refinar " + item);
		return false;
	}
};

var possibilidadeForjar = function(status, item, qtd){

	var possibilidade = [];
	for(var key in item.req){
		//console.log(status.inventario[maiuscula(key)] + " " + item.req[key] * qtd);
		if(status.inventario[maiuscula(key)] >= (item.req[key] * qtd)) possibilidade[key] = true;
		else possibilidade[key] = false;
	}
	
	//console.log(possibilidade);
	
	var verfPoss = true;
	for(var chave in possibilidade) if(!possibilidade[chave]) verfPoss = false;

	//console.log(verfPoss);
	if(verfPoss) return true;
	else{
		textoFinalPagina("Itens insuficientes para Forjar " + item.nome);
		return false;
	}
}

var criarMissoes = function(){

	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	var div = "";
	var titulo = document.getElementById("todasMissoes");	
	
	var objetos = "";
	for(key in status.inventario) objetos += key;

	for(key in itens){
		var h4 = key;
		if(key == "caca") h4 = "caça";
		if(key != "forja") div += "<h4 class='" + key + "'>" + maiuscula(h4) + "</h4>";
		for(keys in itens[key]){
			if(key != "forja"){
				if(status.habilidades["lvl" + maiuscula(itens[key][keys].tipo)] >= itens[key][keys].lvl){
					div += "<div id='" + itens[key][keys].tipo + "' class='" + key + "'>" +
							"<div id='" + maiuscula(keys) + "'>" +
							"<p id='" + key.concat(keys) + "' class='item'>" + maiuscula(keys) + "</p>" +
							"</div> </div>";
				}
			}else{
				div += "<div class='" + key + "' id='" + keys + "'>"
				div += maiuscula(keys);
				for(chaveForja in itens[key][keys]){
					var nome = itens[key][keys][chaveForja].nome;
					if(status.habilidades["lvl" + maiuscula(itens[key][keys][chaveForja].tipo)] >= itens[key][keys][chaveForja].lvl){
						div += "<div id='" + itens[key][keys][chaveForja].tipo + "'>" +
								"<div id='" + keys.concat(chaveForja) + "'>" +
								"<p id='" + key.concat(keys.concat(chaveForja)) + "' class='item'>" + nome + "</p>" +
								"</div> </div>";
					}
				}
				div += "</div>";
			}
		}		
	}
	
	for(var chave in itens.forja){
		
		if(objetos.indexOf(maiuscula(chave)) > -1){ //Verifica se a chave existe no inventario.
			div += "<div class='refinar' id='" + chave + "'>";
			div += maiuscula(chave);
			for(var key in status.inventario){
				if(key.includes(maiuscula(chave))){
					var refinarItem = verificarItem(minuscula(key));
					var nome = removerEspaco(minuscula(key));
					var refino = verificarRefino(key);
					var val = 0;
					if(refino[0] != "") val = parseInt(refino[0]);
					console.log((refinarItem.lvl * 2) + val);
					if(status.habilidades["lvl" + maiuscula(refinarItem.tipo)] >= (refinarItem.lvl * 2) + val){
						div += "<div id='forjar'>" +
								"<div id='" + nome + "'>" +
								"<p id='" + "refinar".concat(nome) + "' class='item'>" + key + "</p>" +
								"</div> </div>";
					}
				}
			}
			div += "</div>";
		}
	}
	
	div += "<br><br>";
	
	titulo.insertAdjacentHTML('beforeend', div);
	
};


var definirAcao = function(tipo, material){
	var status = {};
	status = iniciar(status);
	
	status.habilidades.acao.tipo = tipo;
	status.habilidades.acao.material = material;
	salvar(status);
	
};



