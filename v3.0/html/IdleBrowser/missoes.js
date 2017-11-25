var start = function(tipo, material){

	var status = {};
	status = iniciar(status);
	
	var itens = {}; 
	itens = defItens(itens);
	
	var tipoMaterial = material;
	var classeMaterial = "";
	var texto = "";
	var expTexto = "";
	var qtdMaterial = 1;
	var exp = 1;
	
	if(tipo.includes("minerio")){
		texto = "Minerar";
		classeMaterial = "minerio";
	}		
	else if(tipo.includes("Forjar")){
		texto = "Forjar";
	} 
	else if(tipo.includes("comida")){
		texto = "Cacar";
		classeMaterial = "comida";
	} 

	qtdMaterial = 1 + (Math.floor((Math.random() * Math.round(status.habilidades["lvl".concat(texto)] / 2)) +  Math.round(status.habilidades["lvl".concat(texto)] / 4)));
	exp = (1 + qtdMaterial) * itens[classeMaterial][minuscula(tipoMaterial)].lvl;
	expTexto = "exp" + texto;
	
	var barra = document.getElementById("barra" + tipo);
	var barraCheia = document.getElementById("barraProgresso" + tipo);
	var qtd = document.getElementById(classeMaterial);
	
	var dataInicialAtualizada = new Date();
	var data = new Date();
	
	var segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
	var segundo = data.getTime() / 1000;
	
	var tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
	var tick = function(){
	
		data = new Date();
		segundo = data.getTime() / 1000;
		
		tempoDesdeOInicio = segundo - segundoInicialAtualizado;
		
		var tempo = itens[classeMaterial][minuscula(tipoMaterial)].tempo - status.habilidades["lvl".concat(texto)];
	
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
			salvar(status);
			qtd.innerHTML = maiuscula(tipoMaterial) + ": " + status.inventario[tipoMaterial];
		}
		
		var tamanhoBarra = Math.floor(tempoDesdeOInicio.toFixed(0) / (tempo / 100));
		barra.innerHTML = tamanhoBarra + " %";
		barraCheia.style.width = tamanhoBarra + 'px'
			
		
		requestAnimationFrame(tick);
	};
	
	tick();
	
};


var criarMissoes = function(){
	var status = {};
	status = iniciar(status);
	var itens = {}; 
	itens = defItens(itens);
	
	var div = "";
	var titulo = document.getElementById("todasMissoes");	

	
	for(key in itens){
		for(keys in itens[key]){
			if(status.habilidades["lvl" + maiuscula(itens[key][keys].tipo)] >= itens[key][keys].lvl){
				div += "<div id='" + itens[key][keys].tipo + "' class='" + key + "'>" +
						"<div id='" + maiuscula(keys) + "'>" +
						"<p id='" + key.concat(keys) + "' class='item'>" + maiuscula(keys) + "</p>" +
						"<div id='barraProgresso" + key.concat(keys) + "' class='progresso'> " +
						"<div id='barra" + key.concat(keys) + "' class='barra'>0 %</div>" +
						"</div> </div> </div>";
			}
		}		
	}

	
	console.log("Itens de missoes");
	console.log(itens);
	titulo.insertAdjacentHTML('beforeend', div);
	
};

