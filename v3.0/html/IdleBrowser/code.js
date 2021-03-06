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
		salvar(status);
	});
	
};

var iniciar = function(status){
	
	var txt = localStorage.getItem("Jogador");
	
	var data = new Date();
	var agora = data.getTime() / 1000;
	
	if(JSON.parse(txt) == null){
		status = checar(status);

		localStorage.setItem("Jogador", JSON.stringify(status));
	}else{
		status = JSON.parse(txt);
		status = checar(status);
		//console.log(status);
	}
	
	status.tempoInicial = agora;
	
	return status;
};

var checar = function(status){

	var estrutura = {};
	
	estrutura.combate = {};
	estrutura.combate.pontos = 0;
	estrutura.combate.lvlCombate = 1;
	estrutura.combate.expCombate = 0;
	estrutura.combate.atkBase = 1;
	estrutura.combate.atkPontos = 0;
	estrutura.combate.atk = 1;
	estrutura.combate.defFisicaBase = 15;
	estrutura.combate.defFisicaPontos = 0;
	estrutura.combate.defFisica = 15;
	estrutura.combate.defMagicaBase = 15;
	estrutura.combate.defMagicaPontos = 0;
	estrutura.combate.defMagica = 15;
	estrutura.combate.velBase = 1;
	estrutura.combate.velPontos = 0;
	estrutura.combate.vel = 1;
	estrutura.combate.precisaoBase = 20;
	estrutura.combate.precisaoPontos = 0;
	estrutura.combate.precisao = 20;
	estrutura.combate.critBase = 5;
	estrutura.combate.critPontos = 0;
	estrutura.combate.crit = 5;
	estrutura.combate.danoCritBase = 20;
	estrutura.combate.danoCritPontos = 0;
	estrutura.combate.danoCrit = 20;
	
	estrutura.habilidades = {};
	estrutura.habilidades.acao = {tipo:"", material:""};
	estrutura.habilidades.lvlMinerar = 1;
	estrutura.habilidades.expMinerar = 0;
	estrutura.habilidades.lvlForjar = 1;
	estrutura.habilidades.expForjar = 0;
	estrutura.habilidades.lvlCacar = 1;
	estrutura.habilidades.expCacar = 0;
	estrutura.habilidades.lvlCozinhar = 1;
	estrutura.habilidades.expCozinhar = 0;
	estrutura.habilidades.lvlChefe = 1;
	estrutura.habilidades.expChefe = 0;
	
	estrutura.log = {};
	estrutura.log.forjar = 0;
	estrutura.log.minerar = 0;
	estrutura.log.cacar = 0;
	estrutura.log.cozinhar = 0;
	estrutura.log.empregado = 0;
	estrutura.log.buy = 0;
	estrutura.log.sell = 0;
		
	estrutura.equipamentos = {};
	estrutura.equipamentos.espada = "";
	estrutura.equipamentos.escudo = "";
	estrutura.equipamentos.luva = "";
	estrutura.equipamentos.bota = "";
	estrutura.equipamentos.capacete = "";
	estrutura.equipamentos.peito = "";
	estrutura.equipamentos.pernas = "";
	estrutura.equipamentos.cinto = "";
	estrutura.equipamentos.anel1 = "";
	estrutura.equipamentos.anel2 = "";
	estrutura.equipamentos.anel3 = "";
	estrutura.equipamentos.anel4 = "";
	estrutura.equipamentos.anel5 = "";
	estrutura.equipamentos.colar1 = "";
	estrutura.equipamentos.colar2 = "";
	estrutura.equipamentos.colar3 = "";

	estrutura.empregados = {};
	estrutura.empregados = iniciarEmp(estrutura.empregados);
	
	estrutura.inventario = {};
	estrutura.inventario = iniciarInv(estrutura.inventario);

	estrutura.clicks = 0;
	estrutura.tempoJogado = 0;
	estrutura.tempoInicial = 0;
	
	for(var key in estrutura){
		if(typeof estrutura[key] == 'object' && key != "inventario" && key != "empregados" && (key in status)){
			for(var chave in estrutura[key]){
				if(!(chave in status[key])){
					console.log("Adicionada: " + chave);
					status[key][chave] = estrutura[key][chave];
				}else if(key == "combate"){
					if(chave.includes("Base")){
						if(status[key][chave] != estrutura[key][chave]){
							console.log("Alterado o valor Base " + chave + " de " + status[key][chave] + " para " + estrutura[key][chave]);
							status[key][chave] = estrutura[key][chave];
						}
					}
				}
			}
		}
		else if(!(key in status)){
			status[key] = estrutura[key];
			console.log("Adicionada: " + key);
		}
	}
	for(var key in status){
		if(typeof status[key] == 'object' && key != "inventario" && key != "empregados"){
			for(var chave in status[key]){
				if(!(chave in estrutura[key])){
					console.log("Deletada: " + chave);
					delete status[key][chave];
				}
			}
		}
		else if(!(key in estrutura)){
			console.log("Deletada: " + key);
			delete status[key];
		}
	}
	for(key in status){
		if(typeof status[key] == 'number') status[key] = Math.floor(status[key]);
		else if(typeof status[key] == 'object'){
			for(chave in status[key]){
				if(typeof status[key][chave] == 'number') status[key][chave]  = Math.floor(status[key][chave]);
			}
		}
		if(key == "empregados"){
			for(chave in status[key]){
				if(status[key][chave].tipo == "minerio") status[key][chave].tipo = "minerar";
			}
		}
	}
	
	return status;
	
};

var iniciarInv = function(inventario){
	
	inventario.minerio = 0;
	inventario.caca = 0;
	inventario.dinheiro = 0;
	inventario.diamante = 0;
	
	return inventario;
};

var iniciarEmp = function(empregados){
	
	var tamanho = Object.keys(empregados).length;
	//console.log("iniciarEmp - " + tamanho);
	empregados = adicionarEmp(empregados, "minerar", tamanho);
	
	return empregados;
};

var adicionarEmp = function(empregados, funcao, tamanho){
	
	//console.log("adicionarEmp - " + tamanho);
	
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

//Função para criar itens;
var defItens = function(itens){

	itens.geral = {};
	
	itens.minerar = {};
	
	itens.caca = {};
	itens.comida = {};
	itens.forja = {};
	
	var geral = itens.geral;
	var minerar = itens.minerar;
	var caca = itens.caca;
	var comida = itens.comida;
	var forja = itens.forja;
	
	/* ITENS NO GERAL */
	
	geral.agua = {lvl: 1, tempo: 0, sell: 1, buy: 1, tipo:"geral", nome:"Garrafa de Agua"};
	
	/*SKILL MINERAR */
	
	minerar.minerio = {};
	minerar.gemas = {};
	
	/* MINERIOS PARA MINERAR. */
	minerar.minerio.pedra = {lvl: 1, tempo: 10, sell: 1, buy: 3, tipo:"minerar", nome:"Pedra"};
	minerar.minerio.cobre = {lvl: 3, tempo: 20, sell: 1, buy: 3, tipo:"minerar", nome:"Minerio de Cobre"};
	minerar.minerio.ferro = {lvl: 5, tempo: 30, sell: 2, buy: 5, tipo:"minerar", nome:"Minerio de Ferro"};
	minerar.minerio.prata = {lvl: 8, tempo: 40, sell: 3, buy: 7, tipo:"minerar", nome:"Minerio de Prata"};
	minerar.minerio.ouro = {lvl: 10, tempo: 70, sell: 7, buy: 10, tipo:"minerar", nome:"Minerio de Ouro"};
	minerar.minerio.titanio = {lvl: 15, tempo: 80, sell: 20, buy: 30, tipo:"minerar", nome:"Minerio de Titanio"};
	minerar.minerio.platina = {lvl: 25, tempo: 100, sell: 50, buy: 100, tipo:"minerar", nome:"Minerio de Platina"};
	minerar.minerio.osmio = {lvl: 33, tempo: 100, sell: 70, buy: 200, tipo:"minerar", nome:"Minerio de Osmio"};
	minerar.minerio.iridio = {lvl: 40, tempo: 120, sell: 80, buy: 200, tipo:"minerar", nome:"Minerio de Iridio"};
	minerar.minerio.tungstenio = {lvl: 50, tempo: 300, sell: 500, buy: 1000, tipo:"minerar", nome:"Minerio de Tungstenio"};
	
	/* GEMAS PARA MINERAR */
	minerar.gemas.safira = {lvl: 5, tempo: 30, sell: 5, buy: 10, tipo:"minerar", nome:"Gema de Safira"};
	
	/* ANIMAIS PARA CACAR. */
	caca.rato = {lvl: 1, tempo: 10, sell: 1, buy: 3, tipo:"cacar", nome:"Rato"};
	caca.urso = {lvl: 5, tempo: 30, sell: 3, buy: 5, tipo:"cacar", nome:"Urso"};
	caca.lobo = {lvl: 5, tempo: 25, sell: 2, buy: 4, tipo:"cacar", nome:"Lobo"};
	caca.jacare = {lvl: 8, tempo: 25, sell: 5, buy: 10, tipo:"cacar", nome:"Jacare"};
	
	/* ANIMAIS PARA COZINHAR. */
	
	comida.rato = {lvl: 1, tempo: 5, sell: 0, buy: 2, tipo:"cozinhar", req: { rato: 1 }, nome:"Carne de Rato", cura: 5};
	comida.rato = {lvl: 3, tempo: 15, sell: 7, buy: 10, tipo:"cozinhar", req: { rato: 1, "Garrafa de Agua": 1 }, nome:"Sopa de Rato", cura: 7};
	comida.urso = {lvl: 8, tempo: 20, sell: 5, buy: 7, tipo:"cozinhar", req: { urso: 1 }, nome:"Carne de Urso", cura: 10};
	comida.lobo = {lvl: 5, tempo: 10, sell: 4, buy: 5, tipo:"cozinhar", req: { lobo: 1 }, nome:"Carne de Lobo", cura: 7};
	comida.jacare = {lvl: 10, tempo: 15, sell: 10, buy: 15, tipo:"cozinhar", req: { jacare: 1 }, nome:"Carne de Jacare", cura: 20};
	
	/* ITENS PARA FORJAR. */
	forja.barra = {};
	forja.espada = {};
	forja.capacete = {};
	forja.bota = {};
	forja.escudo = {};
	forja.luva = {};
	
	forja.barra.cobre = {lvl: 3, tempo: 25, sell: 5, buy: 7, tipo:"forjar", req: { "Minerio de Cobre": 4 }, nome:"Barra de Cobre"};
	forja.barra.ferro = {lvl: 5, tempo: 40, sell: 10, buy: 15, tipo:"forjar", req: { pedra: 1, "Minerio de Ferro": 2 }, nome:"Barra de Ferro"};
	forja.barra.prata = {lvl: 8, tempo: 50, sell: 15, buy: 25, tipo:"forjar", req: { pedra: 2, "Minerio de Prata": 1 }, nome:"Barra de Prata"};
	forja.barra.ouro = {lvl: 10, tempo: 80, sell: 50, buy: 70, tipo:"forjar", req: { "Minerio de Prata": 1, "Minerio de Ouro": 3 }, nome:"Barra de Ouro"};
	
	forja.espada.pedra = {lvl: 1, tempo: 10, sell: 5, buy: 10, req: { pedra: 4 }, tipo:"forjar", nome:"Espada de Pedra", estatisticas: {atk: 1, precisao: 20, vel: 1}};
	forja.espada.cobre = {lvl: 5, tempo: 15, sell: 6, buy: 13, req: { "Barra de Cobre": 3, pedra: 1 }, tipo:"forjar", nome:"Espada de Cobre", estatisticas: {atk: 2, precisao: 25, vel: 2}};
	forja.espada.ferro = {lvl: 7, tempo: 35, sell: 7, buy: 18, req: { "Barra de Cobre": 1, pedra: 1, "Barra de Ferro": 2 }, tipo:"forjar", nome:"Espada de Ferro", estatisticas: {atk: 5, precisao: 25, vel: 3}};
	forja.espada.excalibur = {lvl: 70, tempo: 350, sell: 7000, buy: 180000, req: { "Barra de Tungstenio": 10, "Barra de Titanio": 50, "Onix": 5 }, tipo:"forjar", nome:"Excalibur", estatisticas: {atk: 50, precisao: 100, vel: 30}};
	
	forja.capacete.pedra = {lvl: 1, tempo: 15, sell: 5, buy: 10, req: { pedra: 5 }, tipo:"forjar", nome:"Capacete de Pedra", estatisticas: {defFisica: 10, vel: -1}};
	forja.capacete.cobre = {lvl: 4, tempo: 25, sell: 15, buy: 35, req: { "Barra de Cobre": 3 }, tipo:"forjar", nome:"Capacete de Cobre", estatisticas: {defFisica: 20, vel: -3}};
	forja.capacete.ferro = {lvl: 7, tempo: 40, sell: 20, buy: 50, req: { "Barra de Ferro": 3, pedra: 2 }, tipo:"forjar", nome:"Capacete de Ferro", estatisticas: {defFisica: 25, vel: -3}};
	
	forja.bota.pedra = {lvl: 1, tempo: 5, sell: 2, buy: 10, req: { pedra: 2 }, tipo:"forjar", nome:"Bota de Pedra", estatisticas: {defFisica: 10, vel: -1}};
	forja.bota.cobre = {lvl: 3, tempo: 10, sell: 5, buy: 20, req: { "Barra de Cobre": 2 }, tipo:"forjar", nome:"Bota de Cobre", estatisticas: {defFisica: 15, vel: -1}};
	forja.bota.ferro = {lvl: 5, tempo: 20, sell: 10, buy: 30, req: { "Barra de Ferro": 2 }, tipo:"forjar", nome:"Bota de Ferro", estatisticas: {defFisica: 20, vel: -3}};
	
	forja.escudo.pedra = {lvl: 2, tempo: 10, sell: 2, buy: 10, req: { pedra: 2, rato: 1 }, tipo:"forjar", nome:"Escudo de Pedra", estatisticas: {defFisica: 30, vel: -2}};
	forja.escudo.rato = {lvl: 2, tempo: 7, sell: 2, buy: 7, req: { rato: 5 }, tipo:"forjar", nome:"Escudo de Couro de Rato", estatisticas: {defFisica: 7, defMagica: 7, vel: 2}};
	forja.escudo.urso = {lvl: 5, tempo: 15, sell: 7, buy: 20, req: { urso: 3 }, tipo:"forjar", nome:"Escudo de Couro de Urso", estatisticas: {defFisica: 15, defMagica: 10, vel: 4}};
	
	forja.luva.rato = {lvl: 1, tempo: 15, sell: 2, buy: 3, req: { rato: 2 }, tipo:"forjar", nome:"Luva de Couro de Rato", estatisticas: {defMagica: 5, vel: 2}};
	forja.luva.pedra = {lvl: 1, tempo: 20, sell: 2, buy: 3, req: { pedra: 2 }, tipo:"forjar", nome:"Luva de Pedra", estatisticas: {defFisica: 5, vel: 1}};
	
	
	itens.minerar = minerar;
	itens.caca = caca;
	itens.comida = comida;
	itens.geral = geral;
	itens.forja = forja;

	return itens;

};

var salvar = function(status){

	var data = new Date();
	var agora = data.getTime() / 1000;
	
	status.tempoJogado += parseInt(calcTempo(status.tempoInicial, agora));
	//console.log(calcTempo(status.tempoInicial, agora));
	console.log(formatarTotal(status.tempoJogado));

	localStorage.setItem("Jogador", JSON.stringify(status));
};

var clickBarraFunc = function(bool){

	if(bool){
		clickBarra += lvl;
		click = true;
	}
	else clickBarra = 0;
	
};

var calcTempo = function(segInicial, segAtual){
	return segAtual - segInicial;
};

var formatarTotal = function(seg){
	
	var segundo = seg;
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
		
	var tempoFormatado = hora.toFixed(0) + ":" + minuto.toFixed(0) + ":" + segundo.toFixed(0);
		
	return tempoFormatado;
	
};

var materiais = function(status = ""){
	
	if (status == ""){
		var status = {};
		status = iniciar(status);
	}
	
	escrever(status);
};

var escrever = function(status){
	
	var itens = {}; 
	itens = defItens(itens);
	
	var tipo = {};
	
	tipo.minerar = 0;
	tipo.cacar = 0;
	tipo.dinheiro = 0;
	tipo.diamante = 0;
	
	for(var key in status.inventario){
		if(key in tipo) tipo[key] += status.inventario[key]; //Soma o dinheiro e gemas.
		else{
			item = verificarItem(key);
			if(item != null){
				if(item.tipo in tipo) tipo[item.tipo] += status.inventario[key];
			}
		}
	}
	
	console.log("Total de itens");
	console.log(tipo);
	
	var qtd = "";
	for(var key in tipo){
		try{
			var ele = document.getElementById(key + "Qtd");
			if(tipo[key] > 1000){
				ele.style.color = "#cccccc";
				qtd = (tipo[key] / 1000).toFixed(1) + "k";
			}else if(tipo[key] > 1000000){
				ele.style.color = "gold";
				qtd = (tipo[key] / 1000000).toFixed(1) + "M";
			}
			else qtd = tipo[key];
			ele.innerHTML = qtd;
			
			if(key == "caca") var title = "caça";
			else var title = key;
			
			var id = "#" + key + "Cont";
			$(id).attr({"title": maiuscula(title) + " : " + tipo[key]});
		}catch(err){
			console.log("Erro na chamada do code.js da funcao escrever() ");
			console.log(err);
		}
	}
};


var upaLevel = function(status, tipo){
	console.log(status);
	console.log(tipo);
	tipo = maiuscula(tipo);
	if(tipo != "") var habilidades = status.habilidades;
	else var habilidades = status;
	var level = "lvl" + tipo;
	var experiencia = "exp" + tipo; 
	var compExp = (habilidades[level] * habilidades[level]) * (50 + habilidades[level]);
    if (habilidades[experiencia] >= compExp ) {
    	habilidades[level] += 1; 
		if(tipo == "Chefe" && (habilidades[level] % 5) == 0){
			var random = (Math.round(Math.random() * 9) + 1);
			var emp = "";
			if(random < 5) emp = "minerar";
			else emp = "caca";
			//else if(random >= 5 && random < 10) emp = "cozinhar";
			
			console.log("Empregado Ganho: " + emp);
			status.empregados = adicionarEmp(status.empregados, emp, Object.keys(status.empregados).length);
			console.log("Funcao upaLevel - " + Object.keys(status.empregados).length);
		}
    	habilidades[experiencia] -= compExp;
    }
	textoFinalPagina("PARABÉNSS!! VOCÊ UPOU UM LEVEL DE " + tipo + "! : " + habilidades[level]);
		
    console.log("Exp Necessario: " + compExp + " Exp Atual: " + habilidades[experiencia]);
	
	if(tipo != "") status.habilidades = habilidades;
	else status = habilidades;
	
    return status;
};

var verificarRefino = function(str){
	var lvlRefino = "";
	var novaStr = "";
	
	var x;
	for(x = 0; x < str.length; x++){
		if(str[x] == "+"){
			for(var y = x + 1; y < str.length; y++) lvlRefino += str[y];
			novaStr = str.slice(0, x);
		}
	}
	
	//console.log(lvlRefino + " | " + novaStr + " > " + str);
	
	return [lvlRefino, novaStr];
};

//FUNCAO PARA DEIXAR A PRIMEIRA LETRA MAIUSCULA.
var maiuscula = function(str){
	var novaStr = "";
	var proxima = false;
	var x = 0;
	for(x = 0; x < str.length; x++){
		if(x == 0 || proxima){
			novaStr += str[x].toUpperCase();
			proxima = false;
		}
		else{
			novaStr += str[x];
			if(str[x] == " " && str[x + 3] != " ") proxima = true;
		}
	}
	//console.log(str+ " > " + novaStr);
	return novaStr;
};

var minuscula = function(str){
	var novaStr = "";
	for(var char in str) novaStr += str[char].toLowerCase();
	return novaStr;
};

var removerEspaco = function(str){
	var novaStr = "";
	
	for(char in str){
		if(str[char] != " ") novaStr+= str[char];
	}
	
	return novaStr;
};

//VERIFICAR ITEM PASSADO EM tipo E RETORNAR A VARIAVEL COM DADOS DELE.
var verificarItem = function(nome){
	
	//console.log(nome);
	
	var status = {};
	status = iniciar(status);
	
	var itens = {}; 
	itens = defItens(itens);

	for(var chave in itens){
		for(var key in itens[chave]){
			
			if(maiuscula(nome) == itens[chave][key].nome){
				//console.log(nome + " " + itens[chave][key].nome);
				return itens[chave][key];
			}
			else{
				for(var keys in itens[chave][key]){
					if(chave == "forja"){
						var refino = verificarRefino(nome);
						if(refino[1] != "") nome = refino[1];
					}
					if(maiuscula(nome) == itens[chave][key][keys].nome){
						//console.log(nome + " " + itens[chave][key][keys].nome + " " + key);
						return itens[chave][key][keys];
					}
				}
			}
		}
	}
};

//FUNCAO PARA INSERIR TEXTO NA DIV DO FINAL DA PAGINA.
var textoFinalPagina = function(texto){
	
	try{
		document.getElementById("statusBar").remove();
	}catch(err){
		console.log("Erro em remover a barra de Status em code.js em textoFinalPagina() " + err);
	}
	
	var divStatus = "<div id='statusBar'>" + texto + "</div>";
	document.body.insertAdjacentHTML('beforeend', divStatus);
	
};

var popUpItens = function(nome, tipo){

	//console.log(nome, tipo);

	var status = {};
	status = iniciar(status);

	var refino = verificarRefino(nome);
	var texto = "";

	if(refino[0] != "" || tipo.includes("refinar")){

		if(refino[0] != ""){
			var item = verificarItem(minuscula(refino[1]));
			texto = "Item lvl: " + item.lvl * parseInt(refino[0]) + " | Req 2 - " + refino[1].concat(" +".concat(parseInt(refino[0]))) + " | Possui: " + status.inventario[nome];
		}else{
			var item = verificarItem(minuscula(nome)); 
			texto = "Item lvl: " + item.lvl + "| Req 2 - " + nome + " | Possui: " + status.inventario[nome];
		}

	}
	else{
		
		var item = verificarItem(minuscula(nome));
		//console.log(item);
		var possui = 0;
		if(nome in status.inventario) possui = status.inventario[nome];

		if(item != null){
			var req = "";
			var x = 0;
			if(item.req != null){			
				for(var chave in item.req){
					if(x >= 1) req += " | ";
					//console.log(status.inventario[maiuscula(chave)] + " "  + chave);
					var qtdInv = status.inventario[maiuscula(chave)];
					if(!(maiuscula(chave) in status.inventario)) qtdInv = 0;
					req += item.req[chave] + " " + maiuscula(chave) + " - " + qtdInv;
					x++;
				}
				texto = "Item lvl: " + item.lvl + " | Req: " + req + " | Possui: " + possui;
			}
			else{
				texto = "Item lvl: " + item.lvl + " | " + nome + " | Possui: " + possui;
			}
		}
	}
	//console.log(texto);
	if(texto != null) textoFinalPagina(texto);
	
	/*
	var span = "";
	var refino = verificarRefino(nome);
	if(refino[0] != "") var id = removerEspaco(refino[1].concat(refino[0]));
	else var id = removerEspaco(nome);
	
	deletePopUp(nome);
	
	span += "<span class='popUp' id='popup" + id + "' > " + nome + "</span>"
	
	local = document.getElementById(removerEspaco(minuscula(nome)));
	local.insertAdjacentHTML('afterend', span);
	
	//console.log(local);
	
	*/
};

var deletePopUp = function(nome){

	/*

	try{
		document.getElementById("statusBar").remove();
	}catch(err){
		console.log("Erro em remover o popUp em missoes.js em deletePopUp() " + err);
	}
	
	
	/*
	
	var refino = verificarRefino(nome);
	if(refino[0] != "") var id = removerEspaco(refino[1].concat(refino[0]));
	else var id = removerEspaco(nome);
	
	try{
		document.getElementById("popup".concat(id)).remove();
	}catch(err){
		console.log("Erro em remover o popUp em missoes.js em deletePopUp() " + err);
	}
	
	*/

};

