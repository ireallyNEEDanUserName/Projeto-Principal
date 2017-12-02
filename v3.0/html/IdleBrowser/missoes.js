var start = function(){

	console.log("Inicio da funcao de missoes");
	
	var status = {};
	status = iniciar(status);
	
	var itens = {}; 
	itens = defItens(itens);

	var tipoMaterial = "";
	var classeMaterial = "";
	var texto = "";
	var expTexto = "";
	var qtdMaterial = 1;
	var exp = 1;
	var item;
	var sucesssoForja = false;
	var loop = true;
	var fimLoop = true;
	var materialAddInv = "";
	
	var barra;
	var barraCheia;
	var qtd;
	
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
		qtd = barras[2];
	}catch(err){
		console.log("Erro na primeira chamada das funcões de inicializacao do missoes.js " + err);
	}
	
	loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
	var tempo = verfTempo(classeMaterial, tipoMaterial, item);
	
	var dataInicialAtualizada = new Date();
	var data = new Date();
	
	var segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
	var segundo = data.getTime() / 1000;
	
	var tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
	var tick = function(){
		
		if(status.habilidades.acao.material != tipoMaterial && fimLoop){
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
				barras = inicializacaoBarras(status.habilidades.acao.tipo, classeMaterial);
				barra = barras[0];
				barraCheia = barras[1];
				qtd = barras[2];
				console.log(barra);
			}catch(err){
				console.log("Erro na segunda chamada das funcões de inicializacao do missoes.js " + err);
			}	
			
			loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
			tempo = verfTempo(classeMaterial, tipoMaterial, item);
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
					status = iniciar(status);
					if(classeMaterial != "refinar"){
						materialAddInv = tipoMaterial;
					}else{
						itemRefino = verificarRefino(tipoMaterial);
						var lvlRefino = 0;
						
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
					status.habilidades = upaLevel(status.habilidades, texto);
					textoFinalPagina("Você adquiriu " + qtdMaterial + " " + maiuscula(materialAddInv) + " e " + exp + " de experiência");
					if(classeMaterial == "forja") status = removerItemForja(status, item, qtdMaterial);
					else if(classeMaterial == "refinar") status = removerItemRefino(status, tipoMaterial, qtdMaterial);
					salvar(status);
					materiais();
					try{
						qtd.innerHTML = maiuscula(tipoMaterial) + ": " + status.inventario[tipoMaterial];
					}catch(err){
						console.log("Erro em colocar qtd de itens total em start() em missoes.js " + err);
					}
					
					//console.log(barra);
					
					loop = chamadaPossForjar(classeMaterial, tipoMaterial, status, item, qtdMaterial);
					tempo = verfTempo(classeMaterial, tipoMaterial, item);
				}
				
				var tamanhoBarra = Math.floor(tempoDesdeOInicio.toFixed(0) / (tempo / 100));
				barra.innerHTML = tamanhoBarra + " %";
				barraCheia.style.width = tamanhoBarra + 'px'
				
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
	
	var itemRefino = [0, 0];
	
	if(tipo.includes("minerio")){
		texto = "Minerar";
		classeMaterial = "minerio";
		item = itens[classeMaterial][minuscula(tipoMaterial)];
	}else if(tipo.includes("forja")){
		texto = "Forjar";
		classeMaterial = "forja";
		item = verificarItem(tipo);
		console.log(item);
		tipoMaterial = item.nome;
	}else if(tipo.includes("comida")){
		texto = "Cacar";
		classeMaterial = "comida";
		item = itens[classeMaterial][minuscula(tipoMaterial)];
	}else if(tipo.includes("refinar")){
		texto = "Forjar";
		classeMaterial = "refinar";
		item = verificarItem(tipo);
		console.log(item);
		itemRefino = verificarRefino(tipoMaterial);
	}
	
	qtdMaterial = 1 + Math.round(status.habilidades["lvl".concat(texto)] - item.lvl);
	exp = (1 + qtdMaterial + itemRefino[0]) * item.lvl;
	expTexto = "exp" + texto;
	
	dados = [texto, classeMaterial, item, tipoMaterial, qtdMaterial, exp, expTexto];
	console.log(dados);
	return dados;
};

var inicializacaoBarras = function(tipo, classeMaterial){

	console.log("Inicializando Barras");
	
	var barras = [];
	
	barras[0] = document.getElementById("barra" + tipo);
	barras[1] = document.getElementById("barraProgresso" + tipo);
	if(classeMaterial != "forja") barras[2] = document.getElementById(classeMaterial);
	else barras[2]  = "";
	
	//barras = [barra, barraCheia, qtd];
	return barras;
};

var verfTempo = function(classeMaterial, tipoMaterial, item){
	var tempo = 0;
	var lvlItem = verificarRefino(tipoMaterial);
	if(classeMaterial == "refinar" && parseInt(lvlItem[0]) > 0) tempo = item.tempo * parseInt(lvlItem[0]);
	else tempo = item.tempo;
	
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
		if(status.inventario[maiuscula(key)] >= (item.req[key] * qtd)) possibilidade[key] = true;
		else possibilidade[key] = false;
	}
	
	//console.log(possibilidade);
	var verfPoss = true;
	for(var chave in possibilidade) if(!possibilidade[key]) verfPoss = false;
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

	for(key in itens){
		for(keys in itens[key]){
			if(key != "forja"){
				if(status.habilidades["lvl" + maiuscula(itens[key][keys].tipo)] >= itens[key][keys].lvl){
					div += "<div id='" + itens[key][keys].tipo + "' class='" + key + "'>" +
							"<div id='" + maiuscula(keys) + "'>" +
							"<p id='" + key.concat(keys) + "' class='item'>" + maiuscula(keys) + "</p>" +
							"<div id='barraProgresso" + key.concat(keys) + "' class='progresso'> " +
							"<div id='barra" + key.concat(keys) + "' class='barra'>0 %</div>" +
							"</div> </div> </div>";
				}
			}else{
				for(chaveForja in itens[key][keys]){
					//console.log(keys + " de " + chaveForja);
					var nome = maiuscula(keys) + " de " + maiuscula(chaveForja);
					if(status.habilidades["lvl" + maiuscula(itens[key][keys][chaveForja].tipo)] >= itens[key][keys][chaveForja].lvl){
						div += "<div id='" + itens[key][keys][chaveForja].tipo + "' class='" + key + "'>" +
								"<div id='" + keys.concat(chaveForja) + "'>" +
								"<p id='" + key.concat(keys.concat(chaveForja)) + "' class='item'>" + nome + "</p>" +
								"<div id='barraProgresso" +  key.concat(keys.concat(chaveForja)) + "' class='progresso'> " +
								"<div id='barra" +  key.concat(keys.concat(chaveForja)) + "' class='barra'>0 %</div>" +
								"</div> </div> </div>";
					}
				}
			}
		}		
	}
	
	//console.log(status.inventario);
	var refinarItem = "";
	for(key in status.inventario){
		//console.log(key);
		refinarItem = verificarItem(minuscula(key));
		try{
			if(refinarItem.tipo == "forjar"){
				
				var nome = removerEspaco(minuscula(key));
			
				//console.log(status.habilidades["lvl" + maiuscula(refinarItem.tipo)]);
				//console.log(refinarItem.nome + " > " + refinarItem.lvl * 2);
				//verificarRefino(key);
				if(status.habilidades["lvl" + maiuscula(refinarItem.tipo)] >= (refinarItem.lvl * 2)){
					div += "<div id='forjar' class='refinar'>" +
							"<div id='" + nome + "'>" +
							"<p id='" + "refinar".concat(nome) + "' class='item'>" + key + "</p>" +
							"<div id='barraProgresso" +  "refinar".concat(nome) + "' class='progresso'> " +
							"<div id='barra" +  "refinar".concat(nome) + "' class='barra'>0 %</div>" +
							"</div> </div> </div>";
				}
			
			}
		}catch(err){
			console.log("Erro em criar o refinar: " + err);
		}
	}
	
	//console.log("Itens de missoes");
	//console.log(itens);
	titulo.insertAdjacentHTML('beforeend', div);
	
};


var definirAcao = function(tipo, material){
	var status = {};
	status = iniciar(status);
	
	status.habilidades.acao.tipo = tipo;
	status.habilidades.acao.material = material;
	salvar(status);
	
};

