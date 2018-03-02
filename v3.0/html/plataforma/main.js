

var gameLoop = function(){

	var canvas = document.getElementById("screen");
	canvas.width = 480;
	canvas.height = 500;
	var screen = canvas.getContext("2d");
	
	var p = document.getElementById("count");
	var count = 0;
	
	var teclado = new Keyboarder();
	
	var pPos = {x: canvas.width / 2, y: canvas.height - 64};
	var pos;
	
	var cameraPosY = 0;
	
	var player = new Image();
	var plataforma = new Image();
	player.src = "player/euspriteD0.png";
	plataforma.src = "plataforma/plataforma.png";
	
	var posicoesPlataforma = [{x: 0, y: canvas.height - 32},
								{x: 160, y: canvas.height - 32},
								{x: 160 * 2, y: canvas.height - 32},
								{x: 160 * 3, y: canvas.height - 32},
								{x: 160 * 4, y: canvas.height - 32}];
								
	var maiorY = 468;
	
	for(var u = 0; u < 100; u++){
	
		var add = true;
		var randY = Math.floor((Math.random() * -5000) + 404) ;
		var randX = Math.floor((Math.random() * canvas.width) - 32);
		
		for(var x = 0; x < posicoesPlataforma.length; x++){
			if(posicoesPlataforma[x].y < 0 && randY < 0) var z = Math.abs(posicoesPlataforma[x].y) - Math.abs(randY);
			else var z = posicoesPlataforma[x].y - randY;
			if(z < 0) z *= -1;
			if(z < 64){
				add = false;
				console.log("U: " + u + " PlatY: " + posicoesPlataforma[x].y + " randY: " + randY);
			}
		}
		if(add){
			posicoesPlataforma.push({x: randX, y: randY});
		}
	}
	console.log(posicoesPlataforma);
	
	var direcao = "D"
	var anterior = 0;
	var anteriorJump = 0;
	var jump = 0;
	
	var colidiu = collide(pPos, posicoesPlataforma);
	
	var subirCamera = 0;
	var descerCamera = 0;
	
	var tick = function(){
		
		screen.fillRect(0, 0, canvas.width, canvas.height);
		screen.drawImage(player, pPos.x, pPos.y - cameraPosY);
		
		//PLATAFORMA.
		for(var u = 0; u < posicoesPlataforma.length; u++){
			screen.drawImage(plataforma, posicoesPlataforma[u].x, posicoesPlataforma[u].y - cameraPosY);
		}		
		anteriorJump = anterior;
		[pos, direcao, anterior] = move(teclado, anterior, direcao, count);
		
		pPos.x += pos.x;
		
		if(colidiu){
			jump = pos.y;
			//subirCamera += jump * -1;
		}
		
		if(jump < 0){
			pPos.y -= 5;
			jump += 5;
			subirCamera += 5;
		}
		
		if(!colidiu) anterior = anteriorJump;
		player.src = "player/eusprite" + direcao + anterior + ".png";
		
		if(count <= 5) count++;
		else count = 0;
		
		if(jump >= 0 && !colidiu){
			pPos.y += 5;
			descerCamera += 5;
		}
		
		
		if(subirCamera > 0){
			cameraPosY -= 3;
			subirCamera -= 3;
		}else if(descerCamera > 0){
			cameraPosY += 3;
			descerCamera -= 3;
		}
		
		colidiu = collide(pPos, posicoesPlataforma);
		if(colidiu) jump = 0;
		
		p.innerHTML = cameraPosY * -1;
		
		console.log(colidiu + " p:" + (pPos.y + 32) + " j:" + jump + " camPs: " + subirCamera);
		
		requestAnimationFrame(tick);
	}
	
	tick();
	
};

var collide = function(posPlayer, array){
	
	var colidiu = false;
	for(var x = 0; x < array.length; x++){
		
		if((posPlayer.y + 32 >= array[x].y && posPlayer.y + 32 <= array[x].y + 32) &&
			(posPlayer.x + 32 >= array[x].x && posPlayer.x + 32 <= array[x].x + 160)) colidiu = true;
			
	}
	
	return colidiu;
};


var move = function(teclado, ant, direcao, count){
	
	var keys = teclado.KEYS;
	var pos = {x: 0, y: 0};
	
	if(teclado.isDown(keys.LEFT)) pos.x -= 4;
	else if(teclado.isDown(keys.RIGHT)) pos.x += 4;
	
	if(teclado.isDown(keys.SPACE)) pos.y -= 150;
	
	if(pos.x > 1 && count % 4 == 0){
		if(direcao == "D"){
			if(ant < 2) ant++;
			else ant = 0;
		}else{
			direcao = "D";
			ant = 0;
		}
		
	}else if(pos.x < 0 && count % 4 == 0){
		if(direcao == "E"){
			if(ant < 2) ant++;
			else ant = 0;
		}else{
			direcao = "E";
			ant = 0;
		}
	}
	
	return [pos, direcao, ant];
	
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

