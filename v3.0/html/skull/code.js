var backMax = 4;
var imgJogadorMax = 3;

var jogo = function () {
	//Definicoes do jogo;
	var pressionado = false;
	
	var Game = function(canvasId, statusId) {
		var canvas = document.getElementById(canvasId);
		var canvasStatus = document.getElementById(statusId);
		
		var screen = canvas.getContext('2d');
		var statusScreen = canvasStatus.getContext('2d');
		
		var gameSize = { x: canvas.width, y: canvas.height };
		var statusSize = { x: canvasStatus.width, y: canvasStatus.height };
		
		//Pegar o codigo digitado em coedigoFase e validar o mesmo e atribuir a fase.
		if(document.getElementById("codigoFase").value == "") this.fase = 1;
		else{
			var retorno = verf(document.getElementById("codigoFase").value);
			//console.log(retorno);
			if(retorno != false && retorno > 10001) this.fase = retorno - 10000;
			else this.fase = 1;
		}		

		this.qtdEnemy = 9;
		this.back = 0;
		this.morte = false;
		var iterateMorte = 0;
		var drawWait = false;
		this.mudouFase = false;

		this.nome = document.getElementById("caixaNome").value;
		this.tipo = document.getElementById("tipo").getAttribute("val");
		var self = this;
		var bodies;
		var localPlayer;
		var spellArr;
		var spellArrMob;
		
		//Funcoes para escolher personagem
		var iniciarJogo = false;
		var retornarEscolha = [0, false];
		var teclado = new Keyboarder(this, canvas);
		var keys = teclado.KEYS;
		var opcoes = new Array();
		
		self.textUpdate("Escolha com quem quer jogar. Use as setas para escolher e Enter para selecionar!", statusScreen, statusSize, 10);
		
		var start = function(inicio = true){
			if(self.morte == false) drawBack(screen, gameSize, self.back);
			if(inicio) self.bodies = createEnemy(self, gameSize, (self.qtdEnemy + self.fase)).concat(new Player(self, canvas, gameSize, retornarEscolha[0]));
			else{
				localPlayer = verfPlayer(self.bodies);
				player = self.bodies[localPlayer];
				self.bodies = createEnemy(self, gameSize, (self.qtdEnemy + self.fase)).concat(player);
			}
			self.spellArr = new Array();
			self.spellArrMob = new Array();
		};
		
		var tick = function() {
			if(!iniciarJogo){
				drawBack(screen, gameSize, self.back);
				opcoes = escolherPlayer(screen, gameSize, retornarEscolha[0]);
				retornarEscolha = escolherPlayerUpdate(retornarEscolha, teclado, opcoes);
				if(retornarEscolha[1]){
					iniciarJogo = true;
					start();
				}
			}
			else{
				self.update(gameSize);
				if(self.morte == true){
					drawBack(screen, gameSize, "gameOver");
					iterateMorte++;
				}
				else if(!drawWait || mudouFase){
					drawWait = true;
					mudouFase = false;
					self.draw(screen, gameSize, self.back);
				}
				else drawWait = false;
				if(iterateMorte == 10){
					if(self.morte == true){
						self.morte = false;
						iterateMorte = 0
						wait(2000);
					}
				}
			
				var end = self.end();
				if(end == "player") start(true);
				else if(end == "enemy") start(false);
			
				if(!(self.bodies[localPlayer] instanceof Player)) localPlayer = verfPlayer(self.bodies);
				self.textUpdate((self.nome + " | Fase: " + self.fase + " Vidas: " + self.bodies[localPlayer].vidas), statusScreen, statusSize, 15);
			}
			requestAnimationFrame(tick);
		};
		tick();
		
	};
	
	Game.prototype = {
		update: function(gameSize) {
			
			//Remover magias que ja estão fora da tela.
			var longeDaTela = function(b1){
				return !(b1.center.x > gameSize.x || b1.center.x < 0 ||
					b1.center.y < 0 || b1.center.y  > gameSize.y);
			};
			this.spellArr = this.spellArr.filter(longeDaTela);
			this.spellArrMob = this.spellArrMob.filter(longeDaTela);
			
			//funcao de colisao magia e corpos.
			var colideFunc = function(bodies, spell, type){
				var colide = false;
				for (var z = 0; z < bodies.length; z++){
					while(type == 1 && bodies[z] instanceof Enemy) z++;
					for (var f = 0; f < spell.length; f++){						
						colide = colliding(bodies[z], spell[f]);
						if(colide){
							if(type == 1 && bodies[z].vidas > 0){
								bodies[z].vidas--;
								spell.splice(f, 1);
								return z;
							}
							else{
								bodies.splice(z, 1);
								spell.splice(f, 1);
								break;
							}
						}
					}
				}
				return false;
			};
			
			//funcao de colisao com as magias do player com mob.
			if(this.spellArr.length > 0){
				colideFunc(this.bodies, this.spellArr, 0);
			}
			
			//funcao de colisao magias mob com player
			if(this.spellArrMob.length > 0){
				var colideReturn = false;
				colideReturn = colideFunc(this.bodies, this.spellArrMob, 1);
				if(colideReturn != false) this.bodies[colideReturn].colideReturnPlayer = true;
				//if(colideReturnPlayer) this.colideReturnPlayer = true;
				//else this.colideReturnPlayer = false;
			}
			
			
			for (var i = 0; i < this.bodies.length; i++){
				this.bodies[i].update();
			}
			for (var j = 0; j < this.spellArr.length; j++){
				this.spellArr[j].update();
			}
			for (var z = 0; z < this.spellArrMob.length; z++){
				this.spellArrMob[z].update();
			}

			//console.log("Bodies: " + this.bodies.length + " spellMob: " + this.spellArrMob.length + " spellPlayer: " + this.spellArr.length);
		},
		
		//Desenhar tudo que aparece na tela, desde fundo ate personagens e magias.
		draw: function(screen, gameSize, back) {
			drawBack(screen, gameSize, back);
			
			for (var i = 0; i < this.bodies.length; i++){
				drawBody(screen, this.bodies[i]);
			}
			for (var j = 0; j < this.spellArr.length; j++){
				drawBody(screen, this.spellArr[j]);
			}
			for (var z = 0; z < this.spellArrMob.length; z++){
				drawBody(screen, this.spellArrMob[z]);
			}
		},
		
		addBody: function(body){ //Adicionar magia do jogador na Array.
			this.spellArr.push(body);
		},
		
		addBodyMob: function(body){ //Adicionar magia do mob na Array.
			if(this.spellArrMob.length <= (this.bodies.length / 3) + 1) this.spellArrMob.push(body);
		},
		
		end: function(){ //Verificar morte do jogador ou de todos mobs para proxima fase ou Game Over.
			var player = false;
			var playerPos = 0;
			var enemy = false;
			
			for(var i = 0; i < this.bodies.length; i++){ //Loop para verificar se Player ou Mob ainda esta na Array Bodies.
				if (this.bodies[i] instanceof Player){
					player = true;
					playerPos = i;
				}
				else if (this.bodies[i] instanceof Enemy) enemy = true; 
			}
			
			if (!player){ //Se player morreu retornar fase para 1 e iniciar um novo jogo.
				this.morte = true
				banco(this.nome, this.fase, this.tipo);
				this.fase = 1;
				this.mudouFase = true;
				this.back = 0;
				return "player";
			} else if (!enemy){ //Se mobs morreram aumentar a fase e verificar se muda o fundo ou ganha mais vida a cada 5 fases.
				this.fase++;
				this.mudouFase = true;
				if((this.fase % 5) == 0){
					this.back++;
					this.bodies[playerPos].vidas++;
				}
				return "enemy";
			}
		},
		
		textUpdate: function(text, statusScreen, statusSize, tam){ //Texto na barra de status em cima do jogo.
			statusScreen.font = 'italic ' + tam + 'pt Arial';
			statusScreen.textAlign = 'center';
		
			statusScreen.clearRect(0, 0, statusSize.x, statusSize.y);
			statusScreen.strokeText(text, statusSize.x / 2, statusSize.y / 2);
		},

		dadosReturn: function(){
			var dados = [this.nome, this.fase, this.tipo];
			return dados;
		}	
	};

	//CODIGO PARA MANDAR PRO BANCO ANTES DE FECHAR OU ATUALIZAR A PAGINA.
	window.addEventListener("beforeunload", function(){
		var dados = jogo.dadosReturn();
		banco(dados[0], dados[1], dados[2]);
	});
	
	//CODIGO PARA RANKING
	var banco = function(nome, fase, tipo){

		$.ajax({
			method: "POST",
			url: "enviarBanco.php",
			data: {'nome': nome,
					'fase': fase,
					'tipo': tipo},
			success: function(data){
				console.log("sucessefull");
			}
		});

	};
	
	//CODIGO PARA ENTRAR EM UMA FASE ESPECIFICA.
	var verf = function(achar){

		var str = ["0" , "2" , "b" , "c", "3", "6" , "7" ,
					"8" , "9" , "1" , "a" , "%", "@"];
		var inicial = new Array();			
		var valor = 0;
		//Loop para verificar o codigo informado e retornar a fase que ele corresponde ou false se o codigo nao for verdadeiro.
		for(var x = 0; x < str.length; x++){
			inicial[0] = str[x];
			for(var y = 0; y < str.length; y++){
				inicial[1] = str[y];
				for(var z = 0; z < str.length; z++){
					inicial[2] = str[z]
					for(var d = 0; d < str.length; d++){
						inicial[3] = str[d]
						valor++;
						if(achar[0] == inicial[0]){
							if(achar[1] == inicial[1]){
								if(achar[2] == inicial[2]){
									if(achar[3] == inicial[3]) return valor;
								}
							}
						}
					}
				}
			}
		}
		
		return false;
	}
	
	//JOGADOR
	var Player = function(game, canvas, gameSize, img) {
		this.game = game;
		this.gameSize = gameSize;
		this.canvas = canvas;
		this.playerImg = img;
		this.colideReturnPlayer = false;
		this.playerAnimation = 0;
		this.size = { x: 32, y: 32};
		this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y };
		this.keyboarder = new Keyboarder(this, this.canvas);
		this.spellCount = 10;
		this.vidas = 2;
	};
	
	Player.prototype = {
		update: function() {
			var keys = this.keyboarder.KEYS;
			
			if (this.keyboarder.isDown(keys.LEFT) && this.center.x > 16){
				this.center.x -= 2;
			} else if (this.keyboarder.isDown(keys.RIGHT) && this.center.x < this.gameSize.x - 16){
				this.center.x += 2;
			} 
			if (this.keyboarder.isDown(keys.UP) && this.center.y > 16){
				this.center.y -= 2;
			} else if (this.keyboarder.isDown(keys.DOWN) && this.center.y < this.gameSize.y - 16){
				this.center.y += 2;
			} 
			if (this.keyboarder.isDown(keys.SPACE) && this.spellCount == 10){
				this.spellCount --;
				var spell = new Spell(
					{ x: this.center.x, y: this.center.y - this.size.x / 2},
					{ x: 0, y: -4}
				);
				this.game.addBody(spell);
			}
			
			if (this.spellCount > 0) this.spellCount--;
			if (this.spellCount === 0 || !this.keyboarder.isDown(keys.SPACE)) this.spellCount = 10;
			
		}
	};
	
	var verfPlayer = function(bodies){
		var localPlayer;
		for(var i = 0; i < bodies.length; i++){
			if(bodies[i] instanceof Player) localPlayer = i;
		}
		return localPlayer;
	};
	//FIM DAS FUNCOES PLAYER
	
	//MAGIAS DO JOGO
	var Spell = function(center, velocity) {
		this.size = { x: 5, y: 5};
		this.center = center;
		this.velocity = velocity;
	};
	
	Spell.prototype = {
		update: function() {
			this.center.x += this.velocity.x;
			this.center.y += this.velocity.y;
		}
	};
	
	//MOBS DO JOGO
	var Enemy = function(game, gameSize, center) {
		this.game = game;
		this.gameSize = gameSize;
		this.size = { x: 32, y: 32};
		this.center = center;
		this.patrolX = 0;
		this.speedX = 0.7;
	};
	
	Enemy.prototype = {
		update: function() {
			if (verfPosLastMob("equerda", this.center.x) < 16 || verfPosLastMob("direita", this.center.x) > this.gameSize.x - 16){
				this.speedX = -this.speedX;
			}
			
			this.center.x += this.speedX;
			this.patrolX += this.speedX;
			
			if(Math.random() > 0.998) {
				var spell = new Spell(
						{ x: this.center.x, y: this.center.y + this.size.x / 2},
						{ x: Math.random() - 0.5, y: 3}
					);
				this.game.addBodyMob(spell);
			}
		}
	};
	
	var verfPosLastMob = function(pos, center){
		var ultimo = 0;
		if(pos == "direita"){
			if(ultimo == 0) ultimo = center;
			else if(ultimo < center) ultimo = center;
		}
		else{
			if(ultimo == 0) ultimo = center;
			else if(ultimo > center) ultimo = center;
		}
		
		return ultimo;
	};
	
	var createEnemy = function(game, gameSize, qtd) {
		var enemy = [];
		var longe = 5;
		var tam = 32;
		var xAnt = 0;
		var yAnt = 0;
		
		for (var i = 0; i < qtd; i++){
			var x = longe + (i % 11) + xAnt + tam;
			xAnt = x;
			var y = longe + tam + + ((i % 4) * tam);
			yAnt = y;
			if(x < gameSize.x - 16 && y < gameSize.y) enemy.push(new Enemy(game, gameSize, { x: x, y: y }));
			
			if(x >= gameSize.x) xAnt = 0;
			else if(y >= gameSize.y) yAnt = 0;
		}
		return enemy;
	};
	//FIM DAS FUNCOES MOBS
	
	
	//FUNCÕES DO JOGO;
	var colliding = function(b1, b2) {		
		return !(b1 === b2 ||
				b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
				b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
				b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
				b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 
				);
	};
	
	//FUNCOES PARA DESENHAR O JOGADOR E MOBS NA TELA
	var drawBody = function(screen, body){
		var img = new Image();
		var corpo = false;
		var desenhar = true;
		
		if(body instanceof Player){
			corpo = true;
			img.src = "imgs/player/" + body.playerImg + ".png";
			if(body.colideReturnPlayer){
				var desenhar = false;
				body.playerAnimation++;
				body.size.x -= 3;
				body.size.y -= 3;
			}
		} else if(body instanceof Spell){
			img.src = "http://i.imgur.com/VAW78xv.png";
		} else if(body instanceof Enemy){
			img.src = "http://i.imgur.com/LGfOQtu.png";
		}		
		
		if(desenhar){
			screen.drawImage(img, 
							body.center.x - body.size.x / 2,
							body.center.y - body.size.y / 2,
							body.size.x, body.size.y);
		}
		
		if(corpo && body.playerAnimation > 0){
			body.colideReturnPlayer = false;
			body.playerAnimation++;
			if(body.playerAnimation > 5){
				body.playerAnimation = 0;
				body.size.x += 3;
				body.size.y += 3;
			}
		}
		
	};
	
	//DESENHAR FUNDO DO JOGO
	var getBack = function(back){
		if(back > backMax) back = backMax;
		var img = new Image();
		img.src = "imgs/bgs/" + back + ".jpg";
		return img;
	};
	
	var drawBack = function(screen, size, back){
		var img = getBack(back);
		screen.drawImage(img, 0, 0, size.x, size.y);
	};
	//FIM DO DESENHAR FUNDO DO JOGO
	
	//FUNCOES PARA ESCOLHER PERSONAGEM
	var escolherPlayer = function(scr, scrSize, atual){
		var width = 32;
		var height = 32;
		var posSeta = new Array();
		
		var pos = { xD: scrSize.x / 2 - width / 2, xE: scrSize.x / 2 + width / 2, 
					yC: scrSize.y / 2 - height / 2 , yB: scrSize.y / 2 + height / 2};
		
		posSeta[0] = { xD: pos.xD - 70, xE: pos.xD - 38, 
					   yC: pos.yB + 25 , yB: pos.yB + 57};
					   
		posSeta[1] = { xD: pos.xE + 38, xE: pos.xE + 70, 
					   yC: pos.yB + 25 , yB: pos.yB + 57};
					   
		posSeta[2] = { xD: posSeta[0].xD + ((posSeta[1].xE - posSeta[0].xD) / 2) - 53 / 2, 
					   xE: posSeta[0].xD + ((posSeta[1].xE - posSeta[0].xD) / 2) + 53 / 2, 
					   yC: pos.yB + 25 , yB: pos.yB + 57};
		
		var setaD = new Image();
		var setaE = new Image();
		var enter = new Image();
		var img = new Image();
		
		img.src = "imgs/player/" + atual + ".png";
		setaE.src = "imgs/outros/esquerda.png";
		setaD.src = "imgs/outros/direita.png";
		enter.src = "imgs/outros/enter.png";
		
		scr.drawImage(img, pos.xD, pos.yC, width, height);
		scr.drawImage(setaE, posSeta[0].xD, posSeta[0].yC, width, height);
		scr.drawImage(setaD, posSeta[1].xD, posSeta[1].yC, width, height);
		scr.drawImage(enter, posSeta[2].xD, posSeta[2].yC, 53, height);
		
		return posSeta;
	};
		
	var escolherPlayerUpdate = function(returN, teclado, opcoes) {
		
		var keys = teclado.KEYS;
		
		if(pressionado === true){
			pressionado = false;
			
			if(teclado.isClicked()){
				var pos = teclado.posClicked();
			
				if(rectCollideEscolhaPlayer(pos, opcoes[0]) ||
					rectCollideEscolhaPlayer(pos, opcoes[1]) ||
					rectCollideEscolhaPlayer(pos, opcoes[2])){
					
						if(rectCollideEscolhaPlayer(pos, opcoes[0]) && returN[0] > 0){
								returN[0]--;
								return returN;
						}
						else if(rectCollideEscolhaPlayer(pos, opcoes[1]) && returN[0] < imgJogadorMax){
									returN[0]++;
									return returN;
						}
						else if(rectCollideEscolhaPlayer(pos, opcoes[2])){
									returN[1] = true;
									return returN;
						}
						else{
							return returN;
						}
					}
			} 
			
			if (teclado.isDown(keys.LEFT) && returN[0] > 0){
				returN[0]--;
				return returN;
			}
			else if (teclado.isDown(keys.RIGHT) && returN[0] < imgJogadorMax){
				returN[0]++;
				return returN;
			}
			else if (teclado.isDown(keys.ENTER)){
				returN[1] = true;
				return returN;
			}
			else{
				return returN;
			}
		}
		else{
			return returN;
		}
	};
	
	var rectCollideEscolhaPlayer = function(pos , opcoes){
		return ((pos[0] >= opcoes.xD && pos[0] <= opcoes.xE) &&
				(pos[1] >= opcoes.yC && pos[1] <= opcoes.yB))
	};
	
	function wait(ms){
		var start = new Date().getTime();
		var end = start;
		while(end < start + ms) {
			end = new Date().getTime();
		}
	}

	
	var Keyboarder = function(player, rect = 0){
		var keyState = {};
		var posClick = new Array();
		var posTouch = new Array();
		var click = false;
		var touch = false;
		var codeX = 0;
		var margin = 0;
		
		if(rect != 0) var canvasRect = rect.getBoundingClientRect();
		if(document.getElementById('centro') != null) margin = document.getElementById('centro').offsetTop;


		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
			pressionado = true;
		};
		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		};

		rect.onmousedown = function(e){
			posClick[0] = e.clientX - canvasRect.left + window.pageXOffset;
			posClick[1] = e.clientY - rect.offsetTop + window.pageYOffset - margin;
			click = true;
			pressionado = true;
		};
		rect.onmouseup = function(){
			click = false;
		};

		rect.addEventListener("touchstart", function(e) {
			if(touch == false){
				var local = e.changedTouches;
				posTouch[0] = local.item(0).clientX - canvasRect.left + window.pageXOffset;
				posTouch[1] = local.item(0).clientY - rect.offsetTop + window.pageYOffset - margin
				console.log(posTouch);
				if(player instanceof Player) codeX = movimentoX(player, posTouch[0]);
				keyState[codeX] = true;
				keyState[32] = true;
				touch = true;
				pressionado = true;
			}
		}, {passive: true});
		rect.addEventListener("touchend", function() {
			if(touch == true){
				keyState[codeX] = false;
				keyState[32] = false;
				codeX = 0;
				touch = false;
			}
		});
		
		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		};
		
		this.isClicked = function(){
			if(click === true) return true;
			else if(touch === true) return true;
			else return false;
		};
		
		this.posClicked = function(){
			if(click === true) return posClick;
			else if(touch === true) return posTouch;
		};
		
		this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38, DOWN: 40, ENTER: 13 };
		
	};
	
	var movimentoX = function(player, pos) {
		var mov = 0;
		
		if(player.center.x > pos) mov = 37;
		else if(player.center.x < pos) mov = 39;
		
		return mov;
	};	
	
	var jogo = new Game("screen", "status");
	
}; 

//CARREGAR ASSETS ANTES DO JOGO
var loadAssets = function(){
	for(var x = 0; x <= backMax; x++){
		var img = new Image();
		img.addEventListener("load", function(e){
			console.log("Carregou Fundo");
		});
		img.src = "imgs/bgs/" + x + ".jpg";
	}
	
	for(var y = 0; y <= imgJogadorMax; y++){
		var img = new Image();
		img.addEventListener("load", function(e){
			console.log("Carregou Jogador");
		});
		img.src = "imgs/player/" + y + ".png";
	}
	
};


var inicio = function() {
	
	loadAssets(); //CHAMADA DA FUNCAO QUE CARREGA OS FUNDOS.
	jogo();
	
};
