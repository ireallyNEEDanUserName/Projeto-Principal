var inicar = function(){

	var canvas = document.getElementById("mapa");
	var screen = canvas.getContext('2d');
	
	canvas.width = 1290;
	canvas.height = 640;
	
	var size = {x: canvas.width, y: canvas.height};
	
	var jogador = {img: document.getElementById("jogador"), pos: {x: 0, y: 0}, direcao: "", contador: 0};
	
	var ret;
	ret = criarMapa(screen, size);
	
	console.log(ret[0]);
	
	var teclado = new Keyboarder();
	var keys = teclado.KEYS;
	
	var tick = function(){
		
		jogador = mover(teclado, keys, jogador, size, ret[0]);
		screen.clearRect(0, 0, size.x, size.y);
		desenharMapa(screen, ret[0], ret[1]);
		screen.drawImage(jogador.img, jogador.pos.x, jogador.pos.y);
		
		requestAnimationFrame(tick);
	};
	
	tick();
};

var mover = function(teclado, keys, jogador, size, mapa){
	
	if(teclado.isDown(keys.LEFT) && jogador.pos.x >= 2 && verfColisao(jogador, mapa, "E")){
		jogador.direcao = "E";
		jogador.pos.x -= 2;
	}
	else if(teclado.isDown(keys.RIGHT) && jogador.pos.x <= size.x - 2 && verfColisao(jogador, mapa, "D")){
		jogador.direcao = "D";
		jogador.pos.x += 2;
	}
	else if(teclado.isDown(keys.UP) && jogador.pos.y >= 2 && verfColisao(jogador, mapa, "C")){
		jogador.direcao = "c";
		jogador.pos.y -= 2;
	}
	else if(teclado.isDown(keys.DOWN) && jogador.pos.y <= size.y - 2 && verfColisao(jogador, mapa, "B")){
		jogador.direcao = "";
		jogador.pos.y += 2;
	}
	
	if(teclado.isDown(keys.DOWN) || teclado.isDown(keys.UP) || teclado.isDown(keys.RIGHT) || teclado.isDown(keys.LEFT)){
		if(jogador.contador >= 2) jogador.contador = 0;
		else jogador.contador++;
	}
	jogador.img.src = "sprites/jogador/eusprite" + jogador.direcao.concat(jogador.contador) + ".png";
	
	return jogador;
};

var verfColisao = function(jogador, mapa, direcao){
	
	
	var posY = 1;
	var posX = 1;
	if(jogador.pos.y != 0) posY = jogador.pos.y;
	if(jogador.pos.x != 0) posX = jogador.pos.x;
	
	console.log(Math.round((posX * posY) / 40));
	console.log("X: " + jogador.pos.x + " | Y: " + jogador.pos.y);
	console.log(((jogador.pos.y / 32) * 40) + (jogador.pos.x / 40));
	
	if(direcao == "D" || direcao == "E"){
		if(direcao == "D") var x = Math.floor(((posX + 2) * posY) / 20);
		else var x = Math.floor(((posX - 2) * posY) / 20);
		return !(x in mapa[2] || x in mapa[5] || x in mapa[6]);
	}else{
		if(direcao == "C") var y = Math.floor((posX * (posY - 2)) / 20);
		else var y = Math.floor((posX * (posY + 2)) / 20);
		return !(y in mapa[2] || y in mapa[5] || y in mapa[6]);
	}

	
};


var criarMapa = function(){
	
	var pos = {x: 0, y: 0};
	var loop = {x: 0, y: 0};
	
	var mapa = {1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}};
	var qtd = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
	
	var local = {1: document.getElementById("grama"),
				2: document.getElementById("agua"),
				3: document.getElementById("calcada"),
				4: document.getElementById("areia"),
				5: document.getElementById("arvore"),
				6: document.getElementById("pedra")};
	
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
			mapa[5][x] = {x: pos.x, y: pos.y};
			qtd[5]++;
		}else if(rand == 5 && x in mapa[3]){
			mapa[6][x] = {x: pos.x, y: pos.y};
			qtd[6]++;
		}
		
	}

	console.log(qtd);
	
	return [mapa, local];
};

var desenharMapa = function(screen, mapa, local){

	for(var key in mapa){
		for(var chave in mapa[key]){
			screen.drawImage(local[key], mapa[key][chave].x, mapa[key][chave].y);
		}
	}	
};


var Keyboarder = function(){
	var keyState = {};
	var codeX = 0;
	
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
