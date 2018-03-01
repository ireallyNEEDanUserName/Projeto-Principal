

var gameLoop = function(){

	var canvas = document.getElementById("screen");
	canvas.width = 700;
	canvas.height = 500;
	var screen = canvas.getContext("2d");
	
	var p = document.getElementById("count");
	var count = 0;
	
	var teclado = new Keyboarder();
	
	var posx = canvas.width / 2;
	var posy = canvas.height - 64;
	var pos;
	
	var cameraPosX = 0;
	var cameraPosY = 0;
	
	var player = new Image();
	var plataforma = new Image();
	player.src = "player/euspriteD0.png";
	plataforma.src = "plataforma/plataforma.png";
	var plataformaPosY = canvas.height - 32;
	
	var direcao = "D"
	var anterior = 0;
	var anteriorJump = 0;
	var jump = 0;
	
	var tick = function(){
		
		screen.fillRect(0, 0, canvas.width, canvas.height);
		screen.drawImage(player, posx + cameraPosX, posy + cameraPosY);
		
		//PLATAFORMA DO CHÃO.
		screen.drawImage(plataforma, 0 - cameraPosX, plataformaPosY - cameraPosY);
		screen.drawImage(plataforma, plataforma.width - cameraPosX, plataformaPosY - cameraPosY);
		screen.drawImage(plataforma, (plataforma.width * 2) - cameraPosX, plataformaPosY - cameraPosY);
		screen.drawImage(plataforma, (plataforma.width * 3) - cameraPosX, plataformaPosY - cameraPosY);
		screen.drawImage(plataforma, (plataforma.width * 4) - cameraPosX, plataformaPosY - cameraPosY);
		//PLATAFORMA NO AR.
		screen.drawImage(plataforma, (plataforma.width) - cameraPosX, plataformaPosY - cameraPosY - 160);
		screen.drawImage(plataforma, (plataforma.width * 3) - cameraPosX, plataformaPosY - cameraPosY - 192);
		
		anteriorJump = anterior;
		[pos, direcao, anterior] = move(teclado, anterior, direcao, count);
		
		//FAZER A TELA SE MOVER PARA O LADO CONFORME SE MOVIMENTA
		posx += pos.x;
		
		if(jump >= 0 && posy == canvas.height - 64) jump = pos.y;
		else if(jump < 0){
			console.log(jump);
			posy -= 2;
			cameraPosY -= 3;
			jump += 5;
		}
		
		if(posy != canvas.height - 64) anterior = anteriorJump;
		player.src = "player/eusprite" + direcao + anterior + ".png";
		
		if(count <= 5) count++;
		else count = 0;
		
		if(posy < canvas.height - 64 && jump >= 0){
			posy += 2;
			cameraPosY += 3;
		}
		
		if(posy  > canvas.height - 64) posy = canvas.height - 64;
		
		p.innerHTML = count;
		
		requestAnimationFrame(tick);
	}
	
	tick();
	
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

