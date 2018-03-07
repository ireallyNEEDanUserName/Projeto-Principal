

var gameLoop = function(){

	var canvas = document.getElementById("screen");
	canvas.width = 400;
	canvas.height = 500;
	var screen = canvas.getContext("2d");
	
	var p = document.getElementById("count");
	var count = 0;
	
	var teclado = new Keyboarder();
	
	var pPos = {x: canvas.width / 2, y: canvas.height - 64};
	var ultimaPosY = pPos.y;
	var pos;
	
	var cameraPosY = canvas.height / 2;
	
	var player = new Image();
	var plataforma = new Image();
	var theEnd = new Image();
	player.src = "player/euspriteD0.png";
	plataforma.src = "plataforma/plataforma.png";
	theEnd.src = "plataforma/THEEND.png";
	
	var posicoesPlataforma = [{x: 0, y: canvas.height - 32, src: plataforma},
								{x: 160, y: canvas.height - 32, src: plataforma},
								{x: 160 * 2, y: canvas.height - 32, src: plataforma},
								{x: 160 * 3, y: canvas.height - 32, src: plataforma},
								{x: 160 * 4, y: canvas.height - 32, src: plataforma}];
	
	var u = 0;
	while(posicoesPlataforma.length < 25){
	
		var add = true;
		var addM300 = false;
		var randY = Math.floor((Math.random() * -15000) + 404) ;
		var randX = Math.floor((Math.random() * canvas.width) - 32);
		
		for(var x = 0; x < posicoesPlataforma.length; x++){
			if(posicoesPlataforma[x].y < 0 && randY < 0) var z = Math.abs(posicoesPlataforma[x].y) - Math.abs(randY);
			else var z = posicoesPlataforma[x].y - randY;
			if(z < 0) z *= -1;
			if(z < 90){
				add = false;
				//console.log("U: " + u + " PlatY: " + posicoesPlataforma[x].y + " randY: " + randY);
			}else if(z < 300) addM300 = true;
		}
		//console.log(addM300);
		if(add && addM300){
			posicoesPlataforma.push({x: randX, y: randY, src: plataforma});
		}
		
		u++;
	}
	
	//console.log(u);
	//console.log("Antes: ");
	//console.log(posicoesPlataforma);
	
	//Ordenar lista de localizacoes das plataformas.
	posicoesPlataforma = ordenar(posicoesPlataforma);

	var tam = posicoesPlataforma.length;
	for(var y = 1; y < tam; y++){
		if(posicoesPlataforma[y - 1].y - posicoesPlataforma[y].y > 100){
			//console.log(posicoesPlataforma[y - 1].y - posicoesPlataforma[y].y);
			var randX = Math.floor((Math.random() * canvas.width) - 32);
			//var randY = Math.floor((Math.random() * 100) + 32);
			//console.log(randY);
			posicoesPlataforma.push({x: randX, y: posicoesPlataforma[y - 1].y - Math.floor((posicoesPlataforma[y - 1].y - posicoesPlataforma[y].y) / 2), src: plataforma});
		}
	}
	
	posicoesPlataforma = ordenar(posicoesPlataforma);
	tam = posicoesPlataforma.length;
	posicoesPlataforma.push({x: (canvas.width / 2) - 150, y: posicoesPlataforma[tam - 1].y - 300, src: theEnd});
	
	//console.log("Depois: ");
	console.log(posicoesPlataforma);
	
	var direcao = "D"
	var anterior = 0;
	var anteriorJump = 0;
	var jump = 0;
	
	var colidiu = collide(pPos, posicoesPlataforma, cameraPosY);
	var sobrePlataforma = sobreColide(pPos, posicoesPlataforma);
	
	var subirCamera = 0;
	var descerCamera = 0;
	
	var tick = function(){
		
		screen.fillRect(0, 0, canvas.width, canvas.height);
		
		//PLATAFORMA.
		for(var u = 0; u < posicoesPlataforma.length; u++){
			screen.drawImage(posicoesPlataforma[u].src, posicoesPlataforma[u].x, posicoesPlataforma[u].y - cameraPosY);
		}		
		//PLAYER
		screen.drawImage(player, pPos.x, pPos.y - cameraPosY);
		
		anteriorJump = anterior; //variavel para nao mudar sprite do jogador no ar.
		[pos, direcao, anterior] = move(teclado, anterior, direcao, count);
		
		//if(pPos.x + pos.x + 32 <= canvas.width && pPos.x + pos.x >= 0) pPos.x += pos.x;
		if(pPos.x + pos.x + 5 >= canvas.width){
			var sobra = pPos.x + pos.x - canvas.width;
			//console.log(sobra);
			pPos.x = sobra * -1;
		}else if(pPos.x + pos.x < 0){
			var sobra = pPos.x + pos.x;
			pPos.x = canvas.width - sobra - 32;
			//console.log(sobra);
		//console.log(pos.x + " / " + pPos.x);
			}else pPos.x += pos.x;
		
		if(sobrePlataforma){
			jump = pos.y;
			//subirCamera += jump * -1;
		}
		
		if(jump < 0 && !colidiu){
			pPos.y -= 5;
			jump += 5;
			subirCamera += 5;
		}
		
		if(!colidiu && !sobrePlataforma) anterior = anteriorJump;
		player.src = "player/eusprite" + direcao + anterior + ".png";
		
		if(count <= 5) count++;
		else count = 0;
		
		//Se esta descendo e nao colidiu com nada, aumentar a posicao do player e a camera que desce.
		if(jump >= 0 && !sobrePlataforma){
			pPos.y += 5;
			descerCamera += 5;
		}
		
		//Subir a camera enquanto o player sobe ou desce.
		if(subirCamera > 0 && ultimaPosY != pPos.y){
			cameraPosY -= 3;
			subirCamera -= 3;
		}else if(descerCamera > 0 && ultimaPosY != pPos.y){
			cameraPosY += 6;
			descerCamera -= 6;
		}
		
		//Centralizar o player na tela se não estiver.
		if(pPos.y - cameraPosY > canvas.height / 2){
			//console.log("Meio do Canvas pra Mais: " + canvas.height / 2);
			cameraPosY += 1;
		}else if(subirCamera > 0 && pPos.y < canvas.height / 2) subirCamera = 0;
		
		if(pPos.y - cameraPosY < canvas.height / 2){
			//console.log("Meio do Canvas pra Menos: " + canvas.height / 2);
			cameraPosY -= 1;
		}else if(descerCamera > 0 && pPos.y > canvas.height / 2) descerCamera = 0;
		
		colidiu = collide(pPos, posicoesPlataforma, cameraPosY);
		sobrePlataforma = sobreColide(pPos, posicoesPlataforma);
		if(colidiu) jump = 0;
		ultimaPosY = pPos.y;
		
		p.innerHTML = cameraPosY * -1; 
		//console.log(colidiu + " p:" + (pPos.y + 32) + " j:" + jump + " camPs: " + subirCamera + " camDs: " + descerCamera);
		
		requestAnimationFrame(tick);
	}
	
	tick();
	
};

var collide = function(posPlayer, array, camY){
	
	var colidiu = false;
	for(var x = 0; x < array.length; x++){
		if(posPlayer.x + 16 >= array[x].x && posPlayer.x - 16 <= array[x].x + 132){
			if(posPlayer.y <= array[x].y + 30 && posPlayer.y > array[x].y + 12){
				colidiu = true;
				if(x > 4){
					//console.log("x: " + x + " || " + array[x].x + " > "  + posPlayer.x +  " < " + (array[x].x + 160));
					console.log("Bateu - xY: " + x + " || " + (array[x].y + 32) + " > "  + (posPlayer.y) +  " < " + (array[x].y + 27));
				}
			}
		}
	}
	
	return colidiu;
};

var sobreColide = function(posPlayer, array){
	
	var colidiu = false;
	for(var x = 0; x < array.length; x++){
		if(posPlayer.x + 16 >= array[x].x && posPlayer.x - 16 <= array[x].x + 132){
			if((posPlayer.y + 32) >= array[x].y  && (posPlayer.y + 32) < array[x].y + 5){
				colidiu = true;
				if(x < 4){
					//console.log("x: " + x + " || " + array[x].x + " > "  + posPlayer.x +  " < " + (array[x].x + 160));
					//console.log("xY: " + x + " || " + (array[x].y ) + " > "  + (posPlayer.y) +  "+32 < " + (array[x].y + 5)) ;
				}
			}
		}
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

var ordenar = function(posicoesPlataforma){
	var naoMenor = 0;
	for(var y = 0; y < posicoesPlataforma.length; y++){
		for(var y2 = y + 1; y2 <  posicoesPlataforma.length; y2++){
			if(posicoesPlataforma[y].y < posicoesPlataforma[y2].y){
				naoMenor = posicoesPlataforma[y];
				posicoesPlataforma[y] = posicoesPlataforma[y2];
				posicoesPlataforma[y2] = naoMenor;
			}
		}	
	}
	
	return posicoesPlataforma;
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

