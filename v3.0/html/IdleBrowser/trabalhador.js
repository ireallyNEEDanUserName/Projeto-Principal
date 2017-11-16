var startTrab = function(){
	
	//FUNCAO QUE INICIA O SAVE E STATUS DO JOGADOR.
	var status = {};
	status = iniciar(status);
	
	//CHAMADA DE FUNCAO QUE CRIA OS ELEMENTOS NA PAGINA.
	criarElem(status.empregados);
	//CHAMADA DE FUNCAO QUE RODA O TEMPO OFFLINE DOS EMPREGADOS.
	updateOffline(status);
	//CHAMADA DE FUNCAO QUE ATUALIZA O TRABALHO DOS EMPREGADOS.
	updateEmp(status);
	
	
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
	
	//NOME PARA ACESSAR O FUNCIONARIO EX: N1
	var nome = "n" + tamanho; 
	
	//ADICIONAR O FUNCIONARIO ABAIXO DO MENU
	var ult = document.getElementById('Menu');
	
	//HTML DE CADA FUNCIONARIO.
	var emp = "<div id=" + nome + " class='Empregado'>" +
			"<div id=" + maiuscula(empregados[nome].tipo) + ">" +	
			"<p id=" + maiuscula(empregados[nome].tipo) + "Item' class='item'>Empregado " + tamanho + ": " + maiuscula(empregados[nome].tipo) + "</p>" +
			"<div id='barraProgresso" + nome +"' class='progresso'>" +
			"<div id='barra" + nome +"' class='barra'>0 %</div>" +
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
	//PEGA A DATA ATUAL
	var data = new Date();
	var atual = (data.getTime() / 1000).toFixed(0);	
	//NUMERO DE EMPREGADOS
	var tamanho = Object.keys(status.empregados).length;
	var tempoNecessarioTarefa = 100;
	var x;
	var invTipo;
	var qtd;
	var totalItens;
	//LOOP POR TODOS EMPREGADOS
	for(x = 1; x <= tamanho; x++){
		//TEMPO TOTAL OFFLINE
		var tempoOffline = atual - status.empregados["n" + x].offline;
		//SE TEMPO FOR MAIOR QUE 6H MUDAR PARA 6H
		if(tempoOffline > 21600) tempoOffline = 21600;
		qtd = Math.floor(tempoOffline / tempoNecessarioTarefa) * Math.floor((status.empregados["n" + x].lvl / 3) + 1); //qtd de itens que o trabalhador pega.
		
		console.log("Tempo Atual: " + atual, "| Tempo do Empregado: " + status.empregados["n" + x].offline, "| Tempo Offline: " + tempoOffline + " | Qtd: " + qtd);
		//Tipo item que o trabalhador pega.
		if(status.empregados["n" + x].tipo == "caca") invTipo = "comida";
		else invTipo = status.empregados["n" + x].tipo;
		
		totalItens += qtd; //Total de itens que todos trabalhadores pegaram.
		//SE TEMPO OFFLINE FOR MAIOR QUE 1MIN ADICIONAR NO INVENTARIO E DEFINIR TEMPO OFFLINE COMO ATUAL.
		if(qtd >= 1){
			status.inventario[invTipo] += qtd;
			status.empregados["n" + x].exp += qtd;
			status.expChefe += qtd;
			status.empregados["n" + x].offline = atual;
			status.empregados["n" + x] = upaLevel(status.empregados["n" + x], "");
			status = upaLevel(status, "Chefe");
			//console.log(status.empregados["n" + x]);
		}
		
	}
	
	textoFinalPagina("Itens Adquiridos Offline: " + totalItens);
};

//Funcao que roda enquanto a pagina do trabalhador estiver aberta.
var updateEmp = function(status){

	var tamanho = Object.keys(status.empregados).length;
	var x;
	
	console.log(status.empregados);
	console.log("updateEmp - " + tamanho);
	
	var dataInicial = new Array();
	var inicial = new Array();
	for(x = 1; x <= tamanho; x++){
		dataInicial[x] = new Date();
		inicial[x] = (dataInicial[x].getTime() / 1000).toFixed(0);	 //variavel de tempo de cada trabalhador
	}
	
	var tick = function(){
	
		var data = new Date(); 
		var atual = (data.getTime() / 1000).toFixed(0);	//data atual para comparar o tempo que passou com a variavel 'inicial'
		var tempoDesdeOInicio = new Array(); //variavel para guardar o tempo que passou desde que começou.
	
		var tipo;
		var tipoMaterial;
		var qtdMaterial;
		var nome;
		var tempoMaterial;
		
		for(x = 1; x <= tamanho; x++){
			nome = "n" + x; //nome do trabalhador.
			tempoDesdeOInicio[x] = atual - inicial[x];
			tempoMaterial = 100 - Math.floor((status.empregados[nome].lvl / 2)); //tempo que demora para pegar o material.
			
			tipo = status.empregados[nome].tipo; //tipo do material que o empregado pega.
			qtdMaterial = 1 + Math.floor((status.empregados[nome].lvl / 2)); //qtuantidade de material que o empregado pega.
			if(status.empregados[nome].tipo == "caca") tipoMaterial = "comida"; 
			else tipoMaterial = status.empregados[nome].tipo;
		
			var barra = document.getElementById("barra" + nome);
			var barraCheia = document.getElementById("barraProgresso" + nome);
			
			//Caso o tempo seja maior ou igual o tempo necessario.
			if(tempoDesdeOInicio[x] >= tempoMaterial){
				dataInicial[x] = new Date(); 
				inicial[x] = (dataInicial[x].getTime() / 1000).toFixed(0); //pegar novo tempo inicial para esse empregado.
				status.empregados[nome].offline = inicial[x]; //adicionar no tempo offline o tempo atual como inicial.
				tempoDesdeOInicio.x = 0; 
				status.inventario[tipoMaterial] += qtdMaterial; //adicionar o material no inventario.
				status.empregados[nome].exp += qtdMaterial; //adicionar no exp no empregado a quantidade de material pego.
				status.empregados[nome] = upaLevel(status.empregados[nome], ""); //chamada da função que verifica se upou de level do empregado.
				status.expChefe += qtdMaterial; //adicionar exp na skill do jogador.
				status = upaLevel(status, "Chefe"); //chamada da função que verifica se upou de level do jogador.
				salvar(status); //save do jogo.
				textoFinalPagina("Você adquiriu " + maiuscula(tipoMaterial) + ": " + qtdMaterial); //barra final da tela com informações.
			}
			//calcular o quanto a barra tem que aumentar para dar os 100%.
			var tamanhoBarra = Math.floor(tempoDesdeOInicio[x].toFixed(0) / (tempoMaterial / 100)); 
			
			try{
				barra.innerHTML = tamanhoBarra + " %";
				barraCheia.style.width = tamanhoBarra + 'px'
			}
			catch(err){
				console.log("Erro em Trabalhador.js " + err);
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
	
	var objeto = document.getElementById("statusEmpregado");
	
	try{
		document.body.removeChild(objeto);
	}catch(err){
		console.log("Erro informacoes Empregado " + err);
	}
	
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
