var jogo = function () {
	var Game = function(canvasId) {
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height};
		
		this.bodies = createEnemy(this).concat(new Player(this, gameSize));
		this.spellArr = new Array();
		
		var self = this;
		var tick = function() {
			self.update();
			self.draw(screen, gameSize);
			self.end();
			requestAnimationFrame(tick);
		};
		
		tick();
	};
	
	Game.prototype = {
		update: function() {
			var bodies = this.bodies;
			var spellArr = this.spellArr;
			var notCollidingWithAnythig = function(b1) {
				return spellArr.filter(function(b2) { return colliding(b1, b2); }).length === 0;
			};
			
			this.bodies = this.bodies.filter(notCollidingWithAnythig);
		
			for (var i = 0; i < this.bodies.length; i++){
				this.bodies[i].update();
			}
			for (var j = 0; j < this.spellArr.length; j++){
				this.spellArr[j].update();
			}
		},
		
		draw: function(screen, gameSize) {
			screen.clearRect(0, 0, gameSize.x, gameSize.y);
			for (var i = 0; i < this.bodies.length; i++){
				drawRect(screen, this.bodies[i]);
			}
			for (var j = 0; j < this.spellArr.length; j++){
				drawRect(screen, this.spellArr[j]);
			}
		},
		
		addBody: function(body){
			this.spellArr.push(body);
		},
		
		enemyBelow: function(enemy){
			for(var i = 0; i < this.bodies.length; i++){
				if(this.bodies[i] instanceof Enemy){
					if(enemy.center.y < this.bodies[i].center.y){
						return false;
					}
				}
			}
			return true;
		},
		
		
		end: function(){
			//if (instanceof Player in this.bodies)
		}
	};
	
	//JOGADOR
	var Player = function(game, gameSize) {
		this.game = game;
		this.size = { x: 32, y: 32};
		this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.x };
		this.keyboarder = new Keyboarder(this);
		this.spellCount = 10;
	};
	
	Player.prototype = {
		update: function() {
			var keys = this.keyboarder.KEYS;
			
			if (this.keyboarder.isDown(keys.LEFT)){
				this.center.x -= 2;
			} else if (this.keyboarder.isDown(keys.RIGHT)){
				this.center.x += 2;
			} 
			if (this.keyboarder.isDown(keys.UP)){
				this.center.y -= 2;
			} else if (this.keyboarder.isDown(keys.DOWN)){
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
				this.game.addBody(spell);
			}
		}
	};
	
	//FUNCÕES DO JOGO;
	
	var createEnemy = function(game) {
		var enemy = [];
		var longe = 40;
		for (var i = 0; i < 24; i++){
			var x = longe + (i % 8) * longe;
			var y = longe + (i % 3) * longe;
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
	
	
	
	var Keyboarder = function(player){
		var keyState = {};
		var pos = { x: 0, y: 0 };
		var codeX = 0;
		var codeY = 0;
		
		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		};

		window.addEventListener("touchstart", function(e) {
			e.preventDefaul();
			var local = e.changedTouches;
			pos.x = local.item(0).clientX;
			//pos.y = local.item(0).clientY;
			codeX = movimentoX(player, pos.x);
			//codeY = movimentoY(player, pos.y);
			keyState[codeX] = true;
			//keyState[codeY] = true;
			keyState[32] = true;
		});
		
		window.addEventListener("touchend", function() {
			keyState[codeX] = false;
			//keyState[codeY] = false;
			keyState[32] = false;
			codeX = 0;
			//codeY = 0
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
	
	var movimentoY = function(player, pos) {
		var mov = 0;
		
		if(player.center.y < pos) mov = 40;
		else if(player.center.y > pos) mov = 38;
		
		return mov;
	};
	
	
	window.onload = function(){
		new Game("screen");
	};
}; jogo();
