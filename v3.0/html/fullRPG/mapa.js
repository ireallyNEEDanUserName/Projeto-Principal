/*

	FAZER UMA FUNCAO DE ENCONTRAR ROTA PARA OS NPCS SEMPRE TENTAREM ALCANÇAR O PLAYER.

*/

var inicar = function(){

	var canvas = document.getElementById("mapa");
	var screen = canvas.getContext('2d');
	
	canvas.width = 1280;
	canvas.height = 640;
	
	var size = {x: canvas.width, y: canvas.height};
	
	var jogador = {img: document.getElementById("jogador"), pos: {x: 0, y: 0}, direcao: "", contador: 0};
	
	var npc = {1: {img: document.getElementById("npc1"), pos: {x: size.x - 32, y: 0}, direcao: "", contador: 0},
				2: {img: document.getElementById("npc2"), pos: {x: size.x - 32, y: size.y - 32}, direcao: "", contador: 0},
				3: {img: document.getElementById("npc3"), pos: {x: 0, y: size.y - 32}, direcao: "", contador: 0}};
	
	//console.log(npc);
	
	var ret;
	ret = criarMapa(screen, size);
	
	console.log(ret[0]);
	
	var evitar = {};
	for(var key in ret[0]){
		if(key != 2 && key != 5 && key != 6 && key != 7){
			console.log(key);
			for(var keys in ret[0][key]){
				if(key == 1 || key == 3 || key == 4){
					if(!(keys in ret[0][6] || keys in ret[0][7])) evitar[keys] = ret[0][key][keys];
				}
			}	
		}
	}
	
	//console.log(evitar);
	[camNpc, caminho] = melhorCaminho(evitar, verfPos(jogador, ret[0]));
	//console.log(camNpc);
	
	var teclado = new Keyboarder();
	var keysTeclado = teclado.KEYS;
	
	var xf = 0;
	
	var tick = function(){
		
		[jogador, mapa] = mover(teclado, keysTeclado, jogador, size, ret[0]);
		screen.clearRect(0, 0, size.x, size.y);
		desenharMapa(screen, ret[0], ret[1], camNpc);
		screen.drawImage(jogador.img, jogador.pos.x, jogador.pos.y);
		
		npc = moverNPC(npc);
		desenharNPC(screen, npc);
		
		var poss = {};
		caminho = {};
		for(var chave in npc){
			mover(teclado, keysTeclado, npc[chave], size, ret[0], npc[chave].direcao);
			[poss[chave], caminho[chave]] = melhorCaminho(evitar, verfPos(npc[chave], ret[0]));
		}		
		
		if(xf <= 5) console.log(caminho); xf++;
		
		camNpc = {};
		for(var key in poss){
			for(var chave in poss[key]){
				if(!(chave in camNpc)) camNpc[chave] = poss[key][chave];	
			}
		} 
		
		requestAnimationFrame(tick);
	};
	
	tick();
};

var melhorCaminho = function(possivel, pos){
	var caminho = {};
	var camPoss = {};
	var posAtual = pos;
	var posInicial = pos;
	//console.log(posAtual);
	
	caminho[posAtual] = {};
	camPoss[posAtual] = 1;
	
	var x = 0;
	var f = 0;
	var e = 0;
	
	for(var z = 0; z <= 100; z++){
		if(posAtual +1 in possivel || posAtual -1 in possivel || posAtual +40 in possivel || posAtual -40 in possivel){
			if(posAtual + 1 in possivel && !(posAtual + 1 in camPoss) && posAtual % 39 != 0) camPoss[posAtual + 1] = e;e++;
			if(posAtual - 1 in possivel && !(posAtual - 1 in camPoss) && posAtual % 40 != 0 && posAtual >= 1) camPoss[posAtual - 1] = e; e++;
			if(posAtual + 40 in possivel && !(posAtual + 40 in camPoss)) camPoss[posAtual + 40] = e; e++;
			if(posAtual - 40 in possivel && !(posAtual - 40 in camPoss)) camPoss[posAtual - 40] = e; e++;
			
			if(posAtual + 1 in possivel && !(posAtual + 1 in caminho[posInicial]) && posAtual % 39 != 0){
				posAtual++;
				caminho[posInicial][posAtual] = f;
				f++;
			}
			else if(posAtual + 40 in possivel && !(posAtual + 40 in caminho[posInicial]) && posAtual <= 760){
				posAtual += 40;
				caminho[posInicial][posAtual] = f;
				f++;
			}
			else if(posAtual - 1 in possivel && !(posAtual - 1 in caminho[posInicial]) && (posAtual % 40) != 0 && posAtual >= 1){
				posAtual--;
				caminho[posInicial][posAtual] = f;
				f++;
			}
			else if(posAtual - 40 in possivel && !(posAtual - 40 in caminho[posInicial]) && posAtual >= 40){
				posAtual -= 40;
				caminho[posInicial][posAtual] = f;
				f++;
			}
			else{
				for(var key in camPoss){
					if(key == posInicial && x == 0) x++;
					else if(x == 1){
						if(!(key in caminho)){
							x++;
							f = 0;
							posInicial = parseInt(key);
							caminho[posInicial] = {};
							posAtual = posInicial;
						}
					}
				}
				x = 0;
			}
		}
	}
	
	//console.log(caminho);
	return [camPoss, caminho];
	
};

var desenharNPC = function(screen, npc){
	for(var key in npc){
		screen.drawImage(npc[key].img, npc[key].pos.x, npc[key].pos.y);
	}
};

var moverNPC = function(npc){
	
	var dado = Math.floor((Math.random() * 11) + 1);
	
	var npcSelecionado = 0;
	var direcaoTexto = {1: "E", 2: "D", 3: "C", 4: ""};
	
	if(dado <= 4) npcSelecionado = 1;
	else if(dado <= 8) npcSelecionado = 2;
	else if(dado <= 12) npcSelecionado = 3;
	
	npcSelecionado = dado;
	
	if(npcSelecionado >= 1 && npcSelecionado <= 3){
		var direcao = Math.round((Math.random() * 39));
		var sentido = Math.floor(direcao / 10) + 1;
		npc[npcSelecionado].direcao = direcaoTexto[sentido];
	}
	
	return npc;
};

var mover = function(teclado, keys, jogador, size, mapa, direcao = "."){
	
	if((teclado.isDown(keys.LEFT) || direcao == "E") && jogador.pos.x >= 2){
		jogador.direcao = "E";
		if(verfColisao(jogador, mapa, jogador.direcao, "tudo")) jogador.pos.x -= 2;
	}
	else if((teclado.isDown(keys.RIGHT) || direcao == "D") && jogador.pos.x <= size.x - 34){
		jogador.direcao = "D";
		if(verfColisao(jogador, mapa, jogador.direcao, "tudo")) jogador.pos.x += 2;
	}
	else if((teclado.isDown(keys.UP) || direcao == "C") && jogador.pos.y >= 2){
		jogador.direcao = "C";
		if(verfColisao(jogador, mapa, jogador.direcao, "tudo")) jogador.pos.y -= 2;
	}
	else if((teclado.isDown(keys.DOWN) || direcao == "") && jogador.pos.y <= size.y - 34){
		jogador.direcao = "";
		if(verfColisao(jogador, mapa, jogador.direcao, "tudo")) jogador.pos.y += 2;
	}
	
	if(teclado.isDown(keys.SPACE) && direcao == "."){
		var ret = verfColisao(jogador, mapa, jogador.direcao, "tarefa");
		if(ret in mapa[6]) delete mapa[6][ret];
		else if(ret in mapa[7]) delete mapa[7][ret];
	}
	
	var cont = 0;
	if((teclado.isDown(keys.DOWN) || teclado.isDown(keys.UP) || teclado.isDown(keys.RIGHT) || teclado.isDown(keys.LEFT)) && direcao == "."){
		if(jogador.contador >= 9){
			jogador.contador = 0;
			cont = 0;
		}
		else{
			jogador.contador++;
			cont = Math.round(jogador.contador / 3) - 1;
			if(cont < 0) cont = 2;
		}
	}
	if(direcao == ".") jogador.img.src = "sprites/jogador/eusprite" + jogador.direcao.concat(cont) + ".png";
	
	return [jogador, mapa];
};

var verfColisao = function(jogador, mapa, direcao, tipo){
	
	var variavelX = 16;
	var variavelY = 16;
	if(direcao == "D") variavelX = 32;
	else if(direcao == "E") variavelX = 0;
	else if(direcao == "C") variavelY = 0;
	else if(direcao == "") variavelY = 32;
	posY = jogador.pos.y + variavelY;
	posX = jogador.pos.x + variavelX;
	
	//console.log(posY / 32);
	//console.log("X: " + posX + " | Y: " + posY);
	//console.log(Math.round((Math.floor(posY / 32) * 40) + Math.floor(posX / 32)));
	
	if(direcao == "D" || direcao == "E"){
		if(direcao == "D") var x = Math.round((Math.floor(posY / 32) * 40) + (Math.floor((posX + 2) / 32)));
		else var x = Math.round((Math.floor(posY / 32) * 40) + (Math.floor((posX - 2) / 32)));
	}else{
		if(direcao == "C") var x = Math.round(((Math.floor((posY - 2) / 32)) * 40) + Math.floor(posX / 32));
		else var x = Math.round(((Math.floor((posY + 2) / 32)) * 40) + Math.floor(posX / 32));
	}
	
	//console.log("Quadro: " + x);
	if(tipo == "tudo") return !(x in mapa[2] || x in mapa[6] || x in mapa[7]);
	else return x;
	
};

var verfPos = function(jogador, mapa){
	var variavelX = 16;
	var variavelY = 16;
	posY = jogador.pos.y + variavelY;
	posX = jogador.pos.x + variavelX;
	
	var x = Math.round((Math.floor(posY / 32) * 40) + (Math.floor(posX / 32)));
	
	return x;
};

var criarMapa = function(){
	
	var pos = {x: 0, y: 0};
	var loop = {x: 0, y: 0};
	
	var mapa = {1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}};
	var qtd = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0};
	
	var local = {1: document.getElementById("grama"),
				2: document.getElementById("agua"),
				3: document.getElementById("calcada"),
				4: document.getElementById("areia"),
				5: document.getElementById("terra"),
				6: document.getElementById("arvore"),
				7: document.getElementById("pedra")};
	
	for(var x = 0; x < 800; x++){
		var rand = Math.floor(Math.random() * 4) + 1;
		
		if(loop.x%40 == 0 && loop.x > 0){
			loop.x = 0;
			loop.y++;
		}
		pos.x = loop.x * 32;
		pos.y = loop.y * 32;
		loop.x += 1;
		
		if(rand == 4 && (x - 1 in mapa[2] || x - 20 in mapa[2] || x - 1 in mapa[4])){
			mapa[rand][x] = {x: pos.x, y: pos.y};
			qtd[rand]++;
		}else{
			if(rand == 4) rand = 3;
			mapa[rand][x] = {x: pos.x, y: pos.y};
			qtd[rand]++;
		}
		
	}
	
	loop.x = 0;
	loop.y = 0;
	pos.x = 0;
	pos.y = 0;
	
	for(var x = 0; x < 800; x++){
		var rand = Math.floor(Math.random() * 5) + 1;
		
		if(loop.x%40 == 0 && loop.x > 0){
			loop.x = 0;
			loop.y++;
		}
		pos.x = loop.x * 32;
		pos.y = loop.y * 32;
		loop.x += 1;
		
		if(rand == 1 && x in mapa[1]){
			mapa[6][x] = {x: pos.x, y: pos.y};
			qtd[6]++;
		}else if(rand == 5 && x in mapa[3]){
			mapa[7][x] = {x: pos.x, y: pos.y};
			qtd[7]++;
		}
		
	}

	console.log(qtd);
	
	return [mapa, local];
};

var desenharMapa = function(screen, mapa, local, camPoss){

	for(var key in mapa){
		for(var chave in mapa[key]){
			screen.drawImage(local[key], mapa[key][chave].x, mapa[key][chave].y);
			if(chave in camPoss) screen.strokeText(chave, mapa[key][chave].x + 16, mapa[key][chave].y + 16);
		}
	}	
};


var Keyboarder = function(){
	var keyState = {};
	
	window.onkeydown = function(e) {
		keyState[e.keyCode] = true;
	};
	window.onkeyup = function(e) {
		keyState[e.keyCode] = false;
	};

	this.isDown = function(keyCode) {
		return keyState[keyCode] === true;
	};

	this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38, DOWN: 40, ENTER: 13 };
		
};
