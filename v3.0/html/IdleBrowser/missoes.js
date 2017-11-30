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
	
	var dataInicialAtualizada = new Date();
	var data = new Date();
	
	var segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
	var segundo = data.getTime() / 1000;
	
	var tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
	var tick = function(){
		
		if(!status.habilidades.acao.tipo.includes(classeMaterial)){
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
				console.log("Erro na segunda chamada das funcões de inicializacao do missoes.js " + err);
			}	
		}else{
			console.log("Dentro do loop");
			if(classeMaterial == "forja" && possibilidadeForjar(itens, status, item)) loop = true;
			else if(classeMaterial == "forja" && !possibilidadeForjar(itens, status, item)) loop = false;
			else loop = true;
		
			if(loop){
				data = new Date();
				segundo = data.getTime() / 1000;
				
				tempoDesdeOInicio = segundo - segundoInicialAtualizado;
				
				var tempo = item.tempo - status.habilidades["lvl".concat(texto)];
			
				if(tempoDesdeOInicio.toFixed(0) >= tempo){
					dataInicialAtualizada = new Date();
					segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
					tempoDesdeOInicio = 0;
					status = iniciar(status);
					if(tipoMaterial in status.inventario) status.inventario[tipoMaterial] += qtdMaterial;
					else{
						status.inventario[tipoMaterial] = 0;
						status.inventario[tipoMaterial] += qtdMaterial;
					}
					status.habilidades[expTexto] += exp;
					status.habilidades = upaLevel(status.habilidades, texto);
					textoFinalPagina("Você adquiriu " + qtdMaterial + " " + maiuscula(tipoMaterial) + " e " + exp + " de experiência");
					if(classeMaterial == "forja") status = removerItemForja(itens, status, item);
					salvar(status);
					try{
						qtd.innerHTML = maiuscula(tipoMaterial) + ": " + status.inventario[tipoMaterial];
					}catch(err){
						console.log("Erro em colocar qtd de itens total em start() em missoes.js " + err);
					}
				}
				
				var tamanhoBarra = Math.floor(tempoDesdeOInicio.toFixed(0) / (tempo / 100));
				barra.innerHTML = tamanhoBarra + " %";
				barraCheia.style.width = tamanhoBarra + 'px'
				
			}else{
				status = iniciar(status);
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
	
	if(tipo.includes("minerio")){
		texto = "Minerar";
		classeMaterial = "minerio";
		item = itens[classeMaterial][minuscula(tipoMaterial)];
	}else if(tipo.includes("forja")){
		texto = "Forjar";
		classeMaterial = "forja";
		item = forjarItem(itens, status, classeMaterial, tipo);
		tipoMaterial = item.nome;
	}else if(tipo.includes("comida")){
		texto = "Cacar";
		classeMaterial = "comida";
		item = itens[classeMaterial][minuscula(tipoMaterial)];
	}
	
	qtdMaterial = 1 + Math.round(status.habilidades["lvl".concat(texto)] - item.lvl);
	exp = (1 + qtdMaterial) * item.lvl;
	expTexto = "exp" + texto;
	
	dados = [texto, classeMaterial, item, tipoMaterial, qtdMaterial, exp, expTexto];
	//console.log(dados);
	return dados;
};

var inicializacaoBarras = function(tipo, classeMaterial){
	
	var barras = [];
	
	var barra = document.getElementById("barra" + tipo);
	var barraCheia = document.getElementById("barraProgresso" + tipo);
	if(classeMaterial != "forja") var qtd = document.getElementById(classeMaterial);
	else var qtd = "";
	
	barras = [barra, barraCheia, qtd];
	return barras;
};

var forjarItem = function(itens, status, classeMaterial, tipo){
	for(var key in itens[classeMaterial]){
		if(tipo.indexOf(key) > -1){
			for(var keys in itens[classeMaterial][key]){
				if(tipo.indexOf(keys) > -1){
					console.log(itens[classeMaterial][key][keys]);
					return itens[classeMaterial][key][keys];
				}
			}
		}
	}
};

var removerItemForja = function(itens, status, item){
	for(var key in item.req){
		if(status.inventario[maiuscula(key)] >= item.req[key]){
			status.inventario[maiuscula(key)] -= item.req[key];
			return status;
		}else{
			textoFinalPagina("Itens insuficientes para Forjar " + item.nome);
			return status;
		}
	}
};

var possibilidadeForjar = function(itens, status, item){
	for(var key in item.req){
		if(status.inventario[maiuscula(key)] >= item.req[key]){
			return true;
		}else{
			textoFinalPagina("Itens insuficientes para Forjar " + item.nome);
			return false;
		}
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
					console.log(keys + " de " + chaveForja);
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

	console.log("Itens de missoes");
	console.log(itens);
	titulo.insertAdjacentHTML('beforeend', div);
	
};


var definirAcao = function(tipo, material){
	var status = {};
	status = iniciar(status);
	
	status.habilidades.acao.tipo = tipo;
	status.habilidades.acao.material = material;
	salvar(status);
	
};

