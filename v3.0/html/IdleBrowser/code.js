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
		status.lvl = 1;
		status.atk = 1;
		status.vel = 1;
		status.precisao = 1;
		status.clicks = 0;
		status.inventario = {};
		status.inventario = iniciarInv(status.inventario);

		localStorage.setItem("Jogador", JSON.stringify(status));
	}else{
		status = JSON.parse(txt);
		//console.log(status);
	}
		
	return status;
};

var iniciarInv = function(inventario){
	
	inventario.construcao = 0;
	inventario.comida = 0;
	inventario.dinheiro = 0;
	
	return inventario;
};

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

	var construcao = document.getElementById("construcao");
	var comida = document.getElementById("comida");
	var dinheiro = document.getElementById("dinheiro");
	
	for(var key in status.inventario){
		if(key == "construcao") construcao.innerHTML = "Construção: " + status.inventario[key];
		else if(key == "comida") comida.innerHTML = "Comida: " + status.inventario[key];
		else if(key == "dinheiro") dinheiro.innerHTML = "Dinheiro: " + status.inventario[key];
	}
};

