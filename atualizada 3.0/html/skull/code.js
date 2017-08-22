var jogo = function () {
	var Game = function(canvasId, statusId) {
		var canvas = document.getElementById(canvasId);
		var canvasStatus = document.getElementById(statusId);
		var screen = canvas.getContext('2d');
		var statusScreen = canvasStatus.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height };
		var statusSize = { x: canvasStatus.width, y: canvasStatus.height };
		
		this.fase = 1;
		this.mortes = 0;
		this.qtdEnemy = 9;
		this.back = 0;
		
		var self = this;
		var bodies;
		var spellArr;
		
		var start = function(){
			self.textUpdate(("Fase: " + self.fase + " Mortes: " + self.mortes), statusScreen, statusSize);
			self.bodies = createEnemy(self, (self.qtdEnemy + self.fase)).concat(new Player(self, gameSize));
			self.spellArr = new Array();
			console.log(self.bodies.length);
		};
		start();
		
		var tick = function() {
			self.update(gameSize);
			self.draw(screen, gameSize, self.back);
			if(self.end()) start();
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
							bodies.splice(z, 1);
							spell.splice(f, 1);
							break;
						}
					}
				}
			};
			
			//funcao de colisao com as magias do player com mob.
			if(this.spellArr.length > 0){
				colideFunc(this.bodies, this.spellArr, 0);
			}
			
			//funcao de colisao magias mob com player
			if(this.spellArrMob.length > 0){
				colideFunc(this.bodies, this.spellArrMob, 1);
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
		},
		
		draw: function(screen, gameSize) {
			drawBack(screen, gameSize, back);
			for (var i = 0; i < this.bodies.length; i++){
				drawRect(screen, this.bodies[i]);
			}
			for (var j = 0; j < this.spellArr.length; j++){
				drawRect(screen, this.spellArr[j]);
			}
			for (var z = 0; z < this.spellArrMob.length; z++){
				drawRect(screen, this.spellArrMob[z]);
			}
		},
		
		addBody: function(body){
			this.spellArr.push(body);
		},
		
		addBodyMob: function(body){
			this.spellArrMob.push(body);
		},
		
		enemyBelow: function(enemy){
			for(var i = 0; i < this.bodies.length; i++){
				if(this.bodies[i] instanceof Enemy && this.bodies[i] !== enemy){
					if(enemy.center.y < this.bodies[i].center.y){
						return false;
					}
				}
			}
			return true;
		},
		
		end: function(){
			var player = false;
			var enemy = false;
			for(var i = 0; i < this.bodies.length; i++){
				if (this.bodies[i] instanceof Player) player = true;
				else if (this.bodies[i] instanceof Enemy) enemy = true;
			}
			if (!player){
				this.mortes++;
				return true;
			} else if (!enemy){
				this.fase++;
				return true;
			}
		},
		
		textUpdate: function(text, statusScreen, statusSize){
			statusScreen.font = 'italic 15pt Arial';
			statusScreen.textAlign = 'center';
		
			statusScreen.clearRect(0, 0, statusSize.x, statusSize.y);
			statusScreen.strokeText(text, statusSize.x / 2, statusSize.y / 2);
		}		
	};
	
	//JOGADOR
	var Player = function(game, gameSize) {
		this.game = game;
		this.gameSize = gameSize;
		this.size = { x: 32, y: 32};
		this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.x };
		this.keyboarder = new Keyboarder(this);
		this.spellCount = 10;
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
	var Enemy = function(game, center) {
		this.game = game;
		this.size = { x: 32, y: 32};
		this.center = center;
		this.patrolX = 0;
		this.speedX = 0.3;
	};
	
	Enemy.prototype = {
		update: function() {
			if (this.patrolX < 0 || this.patrolX > 200){
				this.speedX = -this.speedX;
			}
			
			this.center.x += this.speedX;
			this.patrolX += this.speedX;
			
			if(Math.random() > 0.995 && this.game.enemyBelow(this)) {
				var spell = new Spell(
						{ x: this.center.x, y: this.center.y + this.size.x / 2},
						{ x: Math.random() - 0.5, y: 3}
					);
				this.game.addBodyMob(spell);
			}
		}
	};
	
	//FUNCÕES DO JOGO;
	
	var createEnemy = function(game, qtd) {
		var enemy = [];
		var longe = 40;
		for (var i = 0; i < qtd; i++){
			var x = longe + (i % 11) * longe;
			var y = longe + (i % 5) * longe;
			enemy.push(new Enemy(game, { x: x, y: y }));
		}
		return enemy;
	};
	
	var colliding = function(b1, b2) {		
		return !(b1 === b2 ||
				b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
				b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
				b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
				b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 
				);
	};
	
	var drawRect = function(screen, body){
		if(body instanceof Player){
			var img = document.getElementById("mago");
		} else if(body instanceof Spell){
			var img = document.getElementById("spell");
		} else if(body instanceof Enemy){
			var img = document.getElementById("esqueleto");
		}
		screen.drawImage(img, 
						body.center.x - body.size.x / 2,
						body.center.y - body.size.y / 2,
						body.size.x, body.size.y);
	};
	
	var getBack = function(back){
		var img = document.getElementById("fundo");
		img.src = "imgs/bgs/" + back + ".jpg";
		return img;
	};
	
	var drawBack = function(screen, size, back){
		var img = getBack(back);
		screen.drawImage(img, 0, 0, size.x, size.y);
	};
	
	var Keyboarder = function(player){
		var keyState = {};
		var posx = 0;
		var codeX = 0;
		
		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		};

		window.addEventListener("touchstart", function(e) {
			var local = e.changedTouches;
			posx = local.item(0).clientX;
			codeX = movimentoX(player, posx);
			keyState[codeX] = true;
			keyState[32] = true;
		});
		
		window.addEventListener("touchend", function() {
			keyState[codeX] = false;
			keyState[32] = false;
			codeX = 0;
		});
	
		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		};
		
		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		};
		
		this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38, DOWN: 40 };
		
	};
	
	var movimentoX = function(player, pos) {
		var mov = 0;
		
		if(player.center.x > pos) mov = 37;
		else if(player.center.x < pos) mov = 39;
		
		return mov;
	};	
	
	window.onload = function(){
		new Game("screen", "status");
	};
}; jogo();
