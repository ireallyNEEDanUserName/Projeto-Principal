var startTrab = function(){
	
	//FUNCAO QUE INICIA O SAVE E STATUS DO JOGADOR.
	var status = {};
	status = iniciar(status);
	
	//CHAMADA DE FUNCAO QUE RODA O TEMPO OFFLINE DOS EMPREGADOS.
	status = updateOffline(status);

	//CHAMADA DE FUNCAO QUE CRIA OS ELEMENTOS NA PAGINA.
	criarElem(status.empregados);
	
	try{
		//CHAMADA DE FUNCAO QUE ATUALIZA O TRABALHO DOS EMPREGADOS.
		updateEmp(status);
	}catch(err){
		console.log(err);
	}
	
	window.addEventListener("beforeunload", function(){
		salvar(status);
	});
	
};

//FUNCAO QUE CHAMA A FUNCAO DE CRIAR O HTML DE ACORDO COM OS EMPREGADOS.
var criarElem = function(empregados){

	var tamanho = Object.keys(empregados).length;
	
	var x;
	for(x = 1; x <= tamanho; x++){
		criarHTML(empregados, x);
	}
};

//FUNCAO QUE CRIA O HTML DE CADA EMPREGADO.
var criarHTML = function(empregados, tamanho){

	var itens = {}; 
	itens = defItens(itens);
	
	//NOME PARA ACESSAR O FUNCIONARIO EX: N1
	var nome = "n" + tamanho; 
	var tipoItem = verfTipo(itens, empregados[nome]);
	console.log(nome + " " + tipoItem.nome + " " + tipoItem.tempo);
	
	//ADICIONAR O FUNCIONARIO ABAIXO DO MENU
	var ult = document.getElementById('Menu');
	
	//HTML DE CADA FUNCIONARIO.
	var emp = "<br><div id=" + nome + " class='Empregado'>" +
			"<div id=" + maiuscula(empregados[nome].tipo) + ">" +	
			"<p id='" + maiuscula(empregados[nome].tipo) + "Item" + nome + "' class='item'>Empregado " + tamanho + ": " + tipoItem.nome + "</p>" +
			"<div id='barraProgresso" + nome +"' class='progresso'>" +
			"<div id='barraLoad" + nome +"' class='barraLoad'>0 %</div>" +
			"</div>" +
			"</div>" +
			"</div>";
	
	//PEGA O ULTIMO ELEMENTO QUE ESTAVA NA PAGINA PARA ADICONAR O PROXIMO EM BAIXO.
	if(tamanho > 1){
		var nome = "n" + (tamanho - 1);
		ult = document.getElementById(nome);
	}
	
	//console.log(emp);
	//CHAMADA QUE ADICIONA O ELEMENTO AO HTML JA EXISTENTE.
	ult.insertAdjacentHTML('afterend', emp);

};

var updateOffline = function(status){
	var itens = {}; 
	itens = defItens(itens);

	//PEGA A DATA ATUAL
	var data = new Date();
	var atual = (data.getTime() / 1000).toFixed(0);	
	//NUMERO DE EMPREGADOS
	var tamanho = Object.keys(status.empregados).length;
	var x;
	var invTipo;
	var qtd;
	var totalItens = 0;
	var exp = 0;
	//LOOP POR TODOS EMPREGADOS
	for(x = 0; x < tamanho; x++){
		var nome = "n" + (x + 1);
		console.log(nome);
		//TEMPO TOTAL OFFLINE
		var tempoOffline = atual - status.empregados[nome].offline;
		invTipo = verfTipo(itens, status.empregados[nome]);
		console.log(nome + " " + invTipo.nome + " " + invTipo.tempo);
		var material = invTipo.nome;
		var tempoNecessarioTarefa = invTipo.tempo;
		//SE TEMPO FOR MAIOR QUE 6H MUDAR PARA 6H
		if(tempoOffline > (21600 + status.empregados[nome].lvl)) tempoOffline = 21600 + status.empregados[nome].lvl;
		qtd = 1 + Math.round(status.empregados[nome].lvl / invTipo.lvl) * Math.floor(tempoOffline / tempoNecessarioTarefa); //qtd de itens que o trabalhador pega.

		console.log("Tempo Atual: " + atual, "| Tempo do Empregado: " + status.empregados[nome].offline, "| Tempo Offline: " + tempoOffline + " | Qtd: " + qtd);
		
		exp = Math.round((1 + qtd) * invTipo.lvl);
		console.log("Experiencia do Empregado: " + exp);
		totalItens += qtd; //Total de itens que todos trabalhadores pegaram.
		//SE TEMPO OFFLINE FOR MAIOR QUE 1MIN ADICIONAR NO INVENTARIO E DEFINIR TEMPO OFFLINE COMO ATUAL.
		if(qtd >= 1){
			if(material in status.inventario) status.inventario[material] += qtd;
			else{
				status.inventario[material] = 0;
				status.inventario[material] += qtd;
			}
			console.log(material);
			status.empregados[nome].exp += exp;
			status.empregados[nome].offline = atual;
			status.empregados[nome] = upaLevel(status.empregados[nome], "");
			
			status.habilidades.expChefe += exp;
			status = upaLevel(status, "Chefe");
			
			console.log("upou emp - " + nome);
		}
	}
	//console.log(totalItens);
	if(totalItens >= 1)	textoFinalPagina("Itens Adquiridos Offline: " + totalItens);
	else textoFinalPagina("Tempo insuficiente offline para pegar qualquer item");
	
	
	return status;
};

//Funcao que roda enquanto a pagina do trabalhador estiver aberta.
var updateEmp = function(status){

	var itens = {}; 
	itens = defItens(itens);

	var tamanho = Object.keys(status.empregados).length;
	var x;
	
	console.log(status.empregados);
	console.log("updateEmp - " + tamanho);
	
	var tipo = new Array();
	var tipoMaterial;
	var qtdMaterial;
	var nome;
	var tempoMaterial;
	
	var dataInicial = new Array();
	var inicial = new Array();
	for(x = 1; x <= tamanho; x++){
		dataInicial[x] = new Date();
		inicial[x] = (dataInicial[x].getTime() / 1000).toFixed(0);	 //variavel de tempo de cada trabalhador
		
		nome = "n" + x; //nome do trabalhador.
		tipo[x] = verfTipo(itens, status.empregados[nome]);
		console.log(x + " " + tipo[x].nome + " " + tipo[x].tempo);
		
		var elem = maiuscula(status.empregados[nome].tipo).concat("Item").concat(nome);
		var empTexto = document.getElementById(elem);
		empTexto.innerHTML = "Empregado " + x + ": " + tipo[x].nome;
	}
	
	var tick = function(){
	
		var data = new Date(); 
		var atual = (data.getTime() / 1000).toFixed(0);	//data atual para comparar o tempo que passou com a variavel 'inicial'
		var tempoDesdeOInicio = new Array(); //variavel para guardar o tempo que passou desde que começou.
		
		for(x = 1; x <= tamanho; x++){
		
			nome = "n" + x; //nome do trabalhador.
			var material = tipo[x].nome;
			tempoMaterial = tipo[x].tempo - Math.floor((status.empregados[nome].lvl / 2)); //tempo que demora para pegar o material.
			if(tempoMaterial < 0) tempoMaterial = 1;
			qtdMaterial = 1 + Math.floor(status.empregados[nome].lvl / tipo[x].lvl); //qtuantidade de material que o empregado pega.
			tipoMaterial = status.empregados[nome].tipo;
			
			tempoDesdeOInicio[x] = atual - inicial[x];
			var barra = document.getElementById("barraLoad" + nome);
			var barraCheia = document.getElementById("barraProgresso" + nome);
			
			//Caso o tempo seja maior ou igual o tempo necessario.
			if(tempoDesdeOInicio[x] >= tempoMaterial){
				dataInicial[x] = new Date(); 
				inicial[x] = (dataInicial[x].getTime() / 1000).toFixed(0); //pegar novo tempo inicial para esse empregado.
				status.empregados[nome].offline = inicial[x]; //adicionar no tempo offline o tempo atual como inicial.
				tempoDesdeOInicio.x = 0; 
				//adicionar o material no inventario.
				if(material in status.inventario) status.inventario[material] += qtdMaterial;
				else{
					status.inventario[material] = 0;
					status.inventario[material] += qtdMaterial;
				}
				
				status.empregados[nome].exp += qtdMaterial; //adicionar no exp no empregado a quantidade de material pego.
				status.empregados[nome] = upaLevel(status.empregados[nome], ""); //chamada da função que verifica se upou de level do empregado.
				
				status.habilidades.expChefe += qtdMaterial; //adicionar exp na skill do jogador.
				status = upaLevel(status, "Chefe"); //chamada da função que verifica se upou de level do jogador.
				
				tipo[x] = verfTipo(itens, status.empregados[nome]);				
				
				salvar(status); //save do jogo.
				textoFinalPagina("Você adquiriu " + maiuscula(tipoMaterial) + ": " + qtdMaterial); //barra final da tela com informações.
			}
			//calcular o quanto a barra tem que aumentar para dar os 100%.
			var tamanhoBarra = Math.floor(tempoDesdeOInicio[x].toFixed(0) / (tempoMaterial / 100)); 
			
			try{
				barra.innerHTML = tamanhoBarra + " %";
				if(tamanhoBarra <= 5) barra.style.width= '5%';
				else barra.style.width = tamanhoBarra + '%'
			}
			catch(err){
				console.log("Erro em Trabalhador.js");
				console.log(err);
			}
		
		}
		//chama o loop na função tick().
		requestAnimationFrame(tick);
	};
	//chama a função pela primeira vez.
	tick();
	
};

//barra final da pagina com informações do empregado quando clica nele.
var informacoes = function(texto){

	var status = {};
	status = iniciar(status);
	var tamanho = Object.keys(status.empregados).length;
	var empAtual;
	
	for(var x = 1; x <= tamanho; x++){
		if(texto.includes(x)) empAtual = x; //seleciona o empregado em que foi clicado.
	}
	//texto para inserir no final da pagina.
	var texto = "Empregado " + empAtual +
				" | Level: " + status.empregados["n" + empAtual].lvl +
				" | Experiência: " + status.empregados["n" + empAtual].exp;
	
	textoFinalPagina(texto);
	
};

var verfTipo = function(itens, emp){
	
	var tiposHabilidades = [];
	
	for(var key in itens){
		if(key == emp.tipo){
			//console.log(emp.tipo);
			if(emp.tipo == "minerar" || emp.tipo == "forjar"){
				for(var keys in itens[key]) tiposHabilidades.push(keys);
				var random = Math.round(Math.random() * (tiposHabilidades.length - 1)) + 1;
				//console.log(random + " " + tiposHabilidades[random - 1]);
				for(var chaves in itens[key][tiposHabilidades[random - 1]]){
					if(emp.lvl >= itens[key][tiposHabilidades[random - 1]][chaves].lvl){
						invTipo = itens[key][tiposHabilidades[random - 1]][chaves];
					}
				}
			}
			for(var keys in itens[key]){
				if(emp.lvl >= itens[key][keys].lvl){
					invTipo = itens[key][keys];
				}
			}
		}
	}
	//console.log("Itens que o empregado pega: " + invTipo.nome);
	return invTipo;
};
