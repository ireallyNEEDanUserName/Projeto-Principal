var clickBarra = 0;
var click = false;
var lvl = 1;

var Idle = function(){
	
	var status = {};	
	status = iniciar(status);
	
	var barra = document.getElementById("barra");
	var barraCheia = document.getElementById("barraProgresso");
	var texto = document.getElementById("textoBarra");
	texto.innerHTML = "Lvl: " + status.lvl;
	var tempoTotal = document.getElementById("tempoTotal");
	
	var dataInicial = new Date();
	var dataInicialAtualizada = new Date();
	var data = new Date();
	
	var segundoInicial = dataInicial.getTime() / 1000;
	var segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
	var segundo = data.getTime() / 1000;
	
	var tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
	var tick = function(){
	
		data = new Date();
		segundo = data.getTime() / 1000;
		
		tempoDesdeOInicio = (segundo - segundoInicialAtualizado) + clickBarra;
	
		if(tempoDesdeOInicio.toFixed(0) >= 100){
			dataInicialAtualizada = new Date();
			segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
			tempoDesdeOInicio -= 100;
			clickBarraFunc(false);
			clickBarra = tempoDesdeOInicio;
			tempoDesdeOInicio = 0;
			status.lvl += 1;
			lvl = status.lvl;
			texto.innerHTML = "Lvl: " + status.lvl;
		}
		
		barra.innerHTML = tempoDesdeOInicio.toFixed(0) + " XP";
		barraCheia.style.width = tempoDesdeOInicio.toFixed(0) + 'px'
		
		tempoTotal.innerHTML = calcTempoTotal(segundoInicial, segundo);
		
		if(click) status.clicks += 1;
		click = false;
		
		requestAnimationFrame(tick);
	};
	
	tick();
	
	window.addEventListener("beforeunload", function(){
		localStorage.setItem("Jogador", JSON.stringify(status));
	});
	
};

var iniciar = function(status){
	
	var txt = localStorage.getItem("Jogador");
	
	if(JSON.parse(txt) == null){
		status = checar(status);

		localStorage.setItem("Jogador", JSON.stringify(status));
	}else{
		status = JSON.parse(txt);
		status = checar(status);
		//console.log(status);
	}
		
	return status;
};

var checar = function(status){

	var estrutura = {};
	
	estrutura.lvlCombate = 1;
	estrutura.expCombate = 0;
	estrutura.atk = 1;
	estrutura.vel = 1;
	estrutura.precisao = 1;

	estrutura.lvlMinerar = 1;
	estrutura.expMinerar = 0;
	estrutura.lvlForjar = 1;
	estrutura.expForjar = 0;
	estrutura.lvlCacar = 1;
	estrutura.expCacar = 0;
	estrutura.lvlChefe = 1;
	estrutura.expChefe = 0;

	estrutura.empregados = {};
	estrutura.empregados = iniciarEmp(estrutura.empregados);
	
	estrutura.inventario = {};
	estrutura.inventario = iniciarInv(estrutura.inventario);

	estrutura.clicks = 0;
	estrutura.tempoJogador = 0;
	
	for(var key in estrutura){
		if(!(key in status)){
			status[key] = estrutura[key];
			console.log(status[key]);
		}
	}
	return status;
	
};

var iniciarInv = function(inventario){
	
	inventario.minerio = 0;
	inventario.comida = 0;
	inventario.dinheiro = 0;
	
	return inventario;
};

var iniciarEmp = function(empregados){
	
	var tamanho = Object.keys(empregados).length;
	console.log("iniciarEmp - " + tamanho);
	empregados = adicionarEmp(empregados, "minerio", tamanho);
	
	
	return empregados;
};

var adicionarEmp = function(empregados, funcao, tamanho){
	
	console.log("adicionarEmp - " + tamanho);
	
	var nome = "n" + (tamanho + 1);
	
	var data = new Date();
	var agora = (data.getTime() / 1000).toFixed(0);
	
	empregados[nome] = {};
	
	empregados[nome].tipo = funcao;
	empregados[nome].offline = agora;
	empregados[nome].lvl = 1;
	empregados[nome].exp = 0;
	
	return empregados;
};


//ITENS NAO UTILIZAVEIS NO MOMENTO. 
/*
var defItens = function(itens){

	itens.minerio = {};
	itens.comida = {};

	var minerio = itens.minerio;
	var comida = itens.comida;

	minerio.pedra = {lvl: 1, minerio: 1, valor: 1};
	minerio.cobre = {lvl: 3, minerio: 2, valor: 1};
	minerio.ferro = {lvl: 5, minerio: 3, valor: 2};
	minerio.prata = {lvl: 8, minerio: 4, valor: 3};
	minerio.ouro = {lvl: 10, minerio: 7, valor: 7};

	itens.minerio = minerio;

	return itens;

};

var criarElementos = function(){

	var status = {};
	status = iniciar(status);

	var itens = {};
	itens = defItens(itens);

	//console.log(status.lvl);
	//console.log(itens.minerio.pedra.lvl);

	for(var key in itens){
		//console.log(key);
		for(var keys in itens[key]){
			//console.log(keys + ": " + itens[key][keys].lvl);
		}
	}
	

};
//----------------------------
*/

var salvar = function(status){
	localStorage.setItem("Jogador", JSON.stringify(status));
};

var clickBarraFunc = function(bool){

	if(bool){
		clickBarra += lvl;
		click = true;
	}
	else clickBarra = 0;
};

var calcTempoTotal = function(segInicial, segAtual){
	
	var segundo = segAtual - segInicial;
	var minuto = 0;
	var hora = 0;
	
	if( segundo > 59 ){
		while( segundo > 59 ){
			segundo -= 60;
			if(segundo < 0) segundo = 0;
			minuto += 1;
		}		
	}
	if( minuto > 59 ){
		while( minuto > 59 ){
			minuto -= 60;
			hora += 1;
		}
	}
		
	var tempoFormatado = "Tempo Jogado  " + hora.toFixed(0) + ":" + minuto.toFixed(0) + ":" + segundo.toFixed(0);
		
	return tempoFormatado;
	
};

var materiais = function(){

	var status = {};
	status = iniciar(status);
	
	escrever(status);
};

var escrever = function(status){
	
	for(var key in status.inventario){
		try{
			var ele = document.getElementById(key);
			ele.innerHTML = maiuscula(key) + ": " + status.inventario[key];
		}catch(err){
			console.log("Erro na chamada do code.js " + err);
		}
	}
};


var upaLevel = function(status, tipo){
	var level = "lvl" + tipo;
	var experiencia = "exp" + tipo; 
	var compExp = (status[level] * status[level]) * (50 + status[level]);
    if (status[experiencia] >= compExp ) {
    	status[level] += 1; 
		if(tipo == "Chefe" && (status[level] % 5) == 0){
			status.empregados = adicionarEmp(status.empregados, "minerio", Object.keys(status.empregados).length);
			console.log("Funcao upaLevel - " + Object.keys(status.empregados).length);
		}
    	status[experiencia] -= compExp;
    	}
		textoFinalPagina("PARABÉNSS!! VOCÊ UPOU UM LEVEL DE " + tipo + "! - " + status[level]);
		
    console.log("Exp Necessario: " + compExp + " Exp Atual: " + status[experiencia]);
    return status;
};

//FUNCAO PARA DEIXAR A PRIMEIRA LETRA MAIUSCULA.
var maiuscula = function(str){
	str = str.charAt(0).toUpperCase() + str.slice(1);
	return str;
};

//FUNCAO PARA INSERIR TEXTO NA DIV DO FINAL DA PAGINA.
var textoFinalPagina = function(texto){

	var divStatus = "<div id='statusEmpregado'>" + texto + "</div>";
	document.body.insertAdjacentHTML('beforeend', divStatus);
};

