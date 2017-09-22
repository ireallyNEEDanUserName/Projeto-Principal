var backMax = 4; //Numero de mapas que o jogo tem, EX 0-4.
var imgJogadorMax = 3; //Numero de opções de jogadores que o jogo tem. EX 0-3
var imgJogadorMove = 5; //Numero de sprites de movimento, (6*imgJogadorMax) - 1.

var jogo = function () { //Função principal do jogo, com funções secundarias definidas aqui.
	//Definicoes do jogo;
	var pressionado = false;
	
	var Game = function(canvasId, statusId) { //Loop principal onde o jogo roda.
		var canvas = document.getElementById(canvasId); //Tela principal do jogo.
		var canvasStatus = document.getElementById(statusId); //Tela do status onde fica o texto da fase, vida e etc.
		
		var screen = canvas.getContext('2d'); 
		var statusScreen = canvasStatus.getContext('2d');
		
		var gameSize = { x: canvas.width, y: canvas.height }; //Tamanho da tela do jogo.
		var statusSize = { x: canvasStatus.width, y: canvasStatus.height }; //Tamanho da tela do status.
		
		console.log("Comeco do Jogo"); 
		
		this.tipo = document.getElementById("tipo").getAttribute("val"); //Tipo de jogo, se mobile ou pc.
		var tamanhoLetra = 13;
		if(this.tipo == "p") tamanhoLetra = 20;
		
		//Pegar o codigo digitado em coedigoFase e validar o mesmo e atribuir a fase.
		if(document.getElementById("codigoFase").value == "") this.fase = 1; //Se o codigo não for digitado na caixa de texto, vai para primeira fase.
		else{
			var retorno = verf(document.getElementById("codigoFase").value); //Chamada de função para verificar o codigo da fase.
			//console.log(retorno);
			if(retorno != false && retorno > 10001){ //Se o codigo não existir ou for menor que 10001.
				this.fase = retorno - 10000;
				this.tipo += "h";
			}
			else this.fase = 1;
		}
		
		this.loopTexto = 0;
		this.loopTextoEspera = 0;
			
		this.qtdEnemy = 9;
		this.back = 0;
		this.morte = false;
		var iterateEspera = 0;
		var drawWait = false;
		this.mudouFase = false;
		this.codigoFase = false;

		this.nome = document.getElementById("caixaNome").value; //Nome do jogador.
		
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
		
		var start = function(inicio = true){ //Chama as funções caso a fase mude ou o player morra.
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
			if(!iniciarJogo){ //Inicio do jogo onde voce seleciona com quem jogar.
				self.textUpdate("Escolha com quem quer jogar. Use as setas para escolher e Enter para selecionar!", 
								statusScreen, statusSize, tamanhoLetra);
				drawBack(screen, gameSize, self.back);
				opcoes = escolherPlayer(screen, gameSize, retornarEscolha[0]);
				retornarEscolha = escolherPlayerUpdate(retornarEscolha, teclado, opcoes);
				if(retornarEscolha[1]){
					iniciarJogo = true;
					start();
				}
			}
			else{
				self.update(gameSize); //Chama o update de tudo no jogo.
				
				if(self.morte == true){ //Se o carinha morreu ficar na pagina do game over.
					drawBack(screen, gameSize, "gameOver");
					iterateEspera++;
				}
				else if(self.codigoFase == true){ //Se mudou a fase ficar um tempo no codigo na tela.
					drawBack(screen, gameSize, "preto");
					var codigo = verf(self.fase + 10000, true).toString();				
					while(codigo.includes(",")) codigo = codigo.replace(",", "");
					self.imprimirTexto(("Codigo da Fase " + self.fase + ": " + codigo), screen, gameSize, 22, "white", true);
					iterateEspera++;
				}
				else if(!drawWait || mudouFase){
					drawWait = true;
					mudouFase = false;
					self.draw(screen, gameSize, self.back);
				}
				else drawWait = false;
				
				if(iterateEspera == 10){ //Muda o fundo quando ja tiver rodado dez vezes o loop principal.
					
					wait(2000); //Espera 2 segundos antes de continuar o codigo.
					
					if(self.morte == true) location.reload();
					else if(self.codigoFase == true) self.codigoFase = false;
					
					iterateEspera = 0;
				}
			
				var end = self.end(); //Verifica se o jogo terminou.
				if(end == "player") start(true); //Chamar inicio do jogo se o jogador morreu.
				else if(end == "enemy") start(false); //Chamar inicio do jogo se todos os mobs morreram.
			
				if(!(self.bodies[localPlayer] instanceof Player)) localPlayer = verfPlayer(self.bodies); //Verificar a localização do jogador para imprimir status na tela.
				self.imprimirTexto((self.nome + " | Fase: " + self.fase + " Vidas: " + self.bodies[localPlayer].vida), statusScreen, statusSize, 15);
			}
			requestAnimationFrame(tick); //Chamada da função tick, fazendo loop no jogo.
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
			this.spellArr = this.spellArr.filter(longeDaTela); //Remover as magias do jogador que estão fora da tela.
			this.spellArrMob = this.spellArrMob.filter(longeDaTela); //Remover as magias dos mobs que estão fora da tela.
			
			//funcao de colisao magia e corpos.
			var colideFunc = function(bodies, spell, type){
				var colide = false;
				for (var z = 0; z < bodies.length; z++){
					while(type == 1 && bodies[z] instanceof Enemy) z++; //Se for magia dos mobs e o corpo for de um mob, pular para o proximo.
					for (var f = 0; f < spell.length; f++){	//Testar todas as magias contra o corpo a cima selecionado.				
						colide = colliding(bodies[z], spell[f]); //Testar se a magia esta no mesmo local que o corpo.
						if(colide){ //Se a colisão for verdadeira.
							if(bodies[z].vida > 0){
								bodies[z].vida--; //Tira vida do mob atingido
								spell.splice(f, 1); //Remove a magia que acertou o mob.
								if(bodies[z].vida <= 0) bodies.splice(z, 1); //Se vida menor ou igual a 0 remove o mob da lista.	
								else bodies[z].acertou = true; //Poem em verdadeiro o acerto no mob q nao morreu, para realizar a animacao.
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
				colideFunc(this.bodies, this.spellArrMob, 1);
			}
			
			
			for (var i = 0; i < this.bodies.length; i++){
				this.bodies[i].update(); //Atualizar a posição dos mobs e player no jogo.
			}
			for (var j = 0; j < this.spellArr.length; j++){
				this.spellArr[j].update(); //Atualizar a posição das magias do jogador na tela.
			}
			for (var z = 0; z < this.spellArrMob.length; z++){
				this.spellArrMob[z].update(); //Atualizar a posição das magias dos mobs na tela.
			}

			//console.log("Bodies: " + this.bodies.length + " spellMob: " + this.spellArrMob.length + " spellPlayer: " + this.spellArr.length);
		},
		
		//Desenhar tudo que aparece na tela, desde fundo ate personagens e magias.
		draw: function(screen, gameSize, back) {
			drawBack(screen, gameSize, back); //Desenhar o fundo da tela.
			
			for (var i = 0; i < this.bodies.length; i++){
				drawBody(screen, this.bodies[i]); //Desenhar os corpos dos mobs e player na tela.
			}
			for (var j = 0; j < this.spellArr.length; j++){
				drawBody(screen, this.spellArr[j]); //Desenhar magias do jogador na tela.
			}
			for (var z = 0; z < this.spellArrMob.length; z++){
				drawBody(screen, this.spellArrMob[z]); //Desenhar magias dos mobs na tela.
			}
		},
		
		addBody: function(body){ //Adicionar magia do jogador na Array.
			this.spellArr.push(body);
		},
		
		addBodyMob: function(body){ //Adicionar magia do mob na Array.
			if(this.spellArrMob.length <= (this.bodies.length / 2) + 1) this.spellArrMob.push(body);
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
				else if (this.bodies[i] instanceof Enemy) enemy = true;  //Se algum inimigo ainda restar na array retornar verdadeiro.
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
					this.codigoFase = true;
					this.back++;
					this.bodies[playerPos].vida++;
				}
				return "enemy";
			}
		},
		
		verfTexto: function(text){
			var textSlice = new Array();
			var cortar = false;
			var local = text.length / 2;
			var wait = false;
			
			if(text.length > 10){ //Se o texto for maior que 10 caracteres, dividir ele em duas partes iguais.
				wait = true;
				while(!cortar){ //Enquanto cortar for falso, continuar o loop.
					if(local < text.length){
						if(text[local] == " ") cortar = true; //Cortar somente em um espaço e não no meio de uma palavra.
						else local++;
					}
					else cortar = true;
				}
				textSlice[0] = text.slice(0, local);
				textSlice[0] += " ...";
				textSlice[1] = text.slice(local, text.length);
			}
			if(wait) return textSlice;
			else return false;
		},
		
		//Imprime o texto onde for mandado - Screen e Size da screen.
		imprimirTexto: function(text, Screen, Size, tam, color = "black", clear = false){ //Texto na barra de status em cima do jogo.
			Screen.font = 'italic ' + tam + 'pt Arial' + color;
			Screen.textAlign = 'center';

			if(!clear){
				Screen.clearRect(0, 0, Size.x, Size.y);
				Screen.strokeText(text, Size.x / 2, Size.y / 2);
			}
			else{
				Screen.fillStyle = color;
				Screen.fillText(text, Size.x / 2, Size.y / 2);
			}
		},
		
		textUpdate: function(text, screen, status, sizeLetra){
			var texto = this.verfTexto(text); //Ver se o texto vai ser dividido ou não.
			if(texto != false){
				this.imprimirTexto(texto[this.loopTexto], screen, status, sizeLetra); //chama a função de imprimir o texto.
				this.loopTextoEspera++;
			}
			else{
				this.imprimirTexto(text, screen, status, sizeLetra);  //chama a função de imprimir o texto.
			}
				
			if(this.loopTextoEspera == 100){ //Espera até mudar o texto em cima no status.
				this.loopTextoEspera = 0;
				this.loopTexto++;
				if(this.loopTexto > 1) this.loopTexto = 0;
			}
		},

		dadosReturn: function(){ //Retorno dos dados do jogo para lançar no banco.
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

		$.ajax({ //Envia dados para a pagina que conecta com o banco e carrega as informções nele.
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
	var verf = function(achar, codigo = false){

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
						if(codigo){
							if(valor == achar) return inicial;
						}
						else{
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
		}
		
		return false;
	}
	
	//JOGADOR
	var Player = function(game, canvas, gameSize, img) {
		this.game = game;
		this.gameSize = gameSize;
		this.canvas = canvas;
		this.playerImg = img;
		this.playerImgOriginal = img;
		this.playerImgCount = 0;
		this.playerUltimaDirecao = 0;
		this.acertou = false;
		this.Animation = 0;
		this.size = { x: 32, y: 32};
		this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y };
		this.keyboarder = new Keyboarder(this, this.canvas);
		this.spellCount = 10;
		this.vida = 2;
	};
	
	Player.prototype = {
		update: function() {
			var keys = this.keyboarder.KEYS;
			//Funções de movimento do jogador.
			if (this.keyboarder.isDown(keys.LEFT) && this.center.x > 16){
				this.center.x -= 2;
				
				if(this.playerUltimaDirecao == 0 || this.playerUltimaDirecao == 2) this.playerImgCount++;
				else this.playerImgCount = 1;
				this.playerUltimaDirecao = 2;
				
				if(this.playerImgOriginal == 1){
					if(this.playerImgCount <= 4) this.playerImg = "1_3";
					else if(this.playerImgCount <= 8) this.playerImg = "1_4";
					else if(this.playerImgCount <= 12){
						this.playerImg = "1_5";
						this.playerImgCount = 0;
					}
				}
			} else if (this.keyboarder.isDown(keys.RIGHT) && this.center.x < this.gameSize.x - 16){
				this.center.x += 2;
				
				if(this.playerUltimaDirecao == 0 || this.playerUltimaDirecao == 1) this.playerImgCount++;
				else this.playerImgCount = 1;
				this.playerUltimaDirecao = 1;
				
				if(this.playerImgOriginal == 1){
					if(this.playerImgCount <= 4) this.playerImg = "1_0";
					else if(this.playerImgCount <= 8) this.playerImg = "1_1";
					else if(this.playerImgCount <= 12){
						this.playerImg = "1_2";
						this.playerImgCount = 0;
					}
				}
			} else{
				this.playerImgCount = 0;
				this.playerImg = this.playerImgOriginal;
			} 
			
			
			if (this.keyboarder.isDown(keys.UP) && this.center.y > 16){
				this.center.y -= 2;
			} else if (this.keyboarder.isDown(keys.DOWN) && this.center.y < this.gameSize.y - 16){
				this.center.y += 2;
			} 
			if (this.keyboarder.isDown(keys.SPACE) && this.spellCount == 10){
				this.spellCount --;
				var spell = new Spell(
					{ x: this.center.x, y: this.center.y - this.size.x / 2 },
					{ x: 0, y: -4 }
				);
				this.game.addBody(spell);
			}
			
			if (this.spellCount > 0) this.spellCount--;
			if (this.spellCount === 0 || !this.keyboarder.isDown(keys.SPACE)) this.spellCount = 10;
			
		}
	};
	
	var verfPlayer = function(bodies){ //Verificar qual a posição do player na array de corpos.
		var localPlayer;
		for(var i = 0; i < bodies.length; i++){
			if(bodies[i] instanceof Player) localPlayer = i;
		}
		return localPlayer;
	};
	//FIM DAS FUNCOES PLAYER
	
	//MAGIAS DO JOGO
	var Spell = function(center, velocity) {
		this.size = { x: 5, y: 5}; //Tamanho da magia.
		this.center = center; //Posição da magia na tela.
		this.velocity = velocity; //Velocidade da magia.
	};
	
	Spell.prototype = {
		update: function() {
			this.center.x += this.velocity.x; //Adicionar a velocidade x na posição x da magia.
			this.center.y += this.velocity.y; //Adicionar a velocidade y na posição y da magia.
		}
	};
	
	//MOBS DO JOGO
	var Enemy = function(game, gameSize, center) {
		this.game = game;
		this.gameSize = gameSize;
		this.size = { x: 32, y: 32 };
		this.center = center;
		this.patrolX = 0;
		this.speedX = 0.7;
		this.vida = 1;
		this.acertou = false;
		this.Animation = 0;
	};
	
	Enemy.prototype = {
		update: function() {
			//Verificar se o mob ainda está dentro da tela na esquerda e direita, e se não inverter a velocidade dele.
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
			var mesmaPosicao = false;
			//Designar a posicao X
			var x = longe + (i % 11) + xAnt + tam;
			xAnt = x;
			//Designar a posicao Y
			var y = longe + tam + + ((i % 4) * tam);
			yAnt = y;
		
			if(x < gameSize.x - 16 && y < gameSize.y){ //Ver se o x e y estao dentro da tela
				if(i == 0){
					enemy.push(new Enemy(game, gameSize, { x: x, y: y })); //Criar o primeiro inimigo
					mesmaPosicao = true;
				}
				else{
					for(var z = 0; z < enemy.length; z++){
					
						if(enemy[z].center.x == x){ //Se algum inimigo estiver na mesma posição do que sera criado agora, aumentar a vida do que
													//ja foi criado e esta na mesma posição e não criar um novo.
							mesmaPosicao = true;
							enemy[z].vida++;
							//console.log(enemy[z].vida);
						}
					}
				}
				
				if(!mesmaPosicao) enemy.push(new Enemy(game, gameSize, { x: x, y: y })); //Se não estiver na mesma posição que nenhum outro mob
																						// criar novo inimigo.
			}
			if(x >= gameSize.x) xAnt = 0; //Ver se o x ainda está dentro da tela.
			else if(y >= gameSize.y) yAnt = 0; //Ver se o y ainda está dentro da tela.
		}
		
		return enemy;
	};
	//FIM DAS FUNCOES MOBS
	
	
	//FUNCÕES DO JOGO;
	var colliding = function(b1, b2) { //Função de colisão dos corpos no jogo.	
		
		if(b1.center != undefined && b2.center != undefined){
			return !(b1 === b2 ||
					b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
					b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
					b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
					b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 
					);
		}
		else{
			console.log("Erro na colisao entre: " + b1 + " : " + b2);
		}
	};
	
	//FUNCOES PARA DESENHAR O JOGADOR E MOBS NA TELA
	var drawBody = function(screen, body){
		var img = new Image();
		var corpo = false;
		var desenhar = true;
		
		//Ver qual tipo é o corpo e carregar a imagem correspondente.
		if(body instanceof Player){
			img.src = "imgs/player/" + body.playerImg + ".png";
		} else if(body instanceof Spell){
			img.src = "http://i.imgur.com/VAW78xv.png";
		} else if(body instanceof Enemy){
			img.src = "http://i.imgur.com/LGfOQtu.png";
		}		
		
		if(!(body instanceof Spell)){ //Se o corpo não for uma magia.
			if(body.acertou){ //Se o corpo foi acertado por uma magia.
				var desenhar = false; //Não desenhar o corpo na proxima vez para fazer o efeito de acerto.
				body.acertou = false; //Setar a variavel acerto para falso.
				body.Animation++; 
				body.size.x -= 3; //Diminuir o tamanho X do corpo.
				body.size.y -= 3; //Diminuir o tamanho Y do corpo.
			}
		}
		
		if(desenhar){ //Se desenhar for verdadeiro desenhar o corpo na tela.
			screen.drawImage(img, 
							body.center.x - body.size.x / 2,
							body.center.y - body.size.y / 2,
							body.size.x, body.size.y);
		}
		
		if(body.Animation > 0){ //Se a animação for maior que 0 começar a animação.
			body.Animation++;
			if(body.Animation > 5){
				body.Animation = 0;
				body.size.x = 32;
				body.size.y = 32;
			}
		}
		
	};
	
	//DESENHAR FUNDO DO JOGO
	var getBack = function(back){
		if(Number.isInteger(back) && back > backMax) back = backMax;
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
	
	function wait(ms){ //Esperar determinados Milisegundos.
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
var loadAssets = function(tipo = false){
	
	var loop = 0;
	//diz qual o numero de fundos e jogadores
	if(!tipo){
		var max = backMax;
		loop = max;
	}
	else{
		var max = imgJogadorMax;
		var max2 = imgJogadorMove;
		loop = max + max2 + 1;
	}
	
	var deferred = $.Deferred();
	var sucesso = true;
	var i = 0;
	var u = 0;
	var z = 0;
	
	//funcao que carrega os fundos e jogadores
	var fundo = function(){
		if((i + z) <= loop && sucesso){
			var imgF = new Image();
			
			if(!tipo){
				imgF.src = "imgs/bgs/" + i + ".jpg";
				i++;
			}
			else if(i <= max){
				imgF.src = "imgs/player/" + i + ".png";
				i++;
			}
			else if(i > max && z <= max2){ 
				var valor = Math.floor((z + 1)/6);
				imgF.src = "imgs/player/1" /* MUDAR O 1 POR valor.toString() quando tiver os sprites do primeiro char. */  + "_" + z.toString() + ".png"; 
				z++;
			}
			
			deferred.notify((i + z));
			imgF.addEventListener("load", fundo); //chama o load(funcao fundo()) denovo quando o fundo ja tiver sido carregado.
			imgF.addEventListener("error", function(){
				sucesso = false //para de chamar o load quando nao achou a img.
			});
			
		}
		else if(i > max && sucesso && !tipo && u <= 2){
			var imgF = new Image();
			
			if(u == 0) imgF.src = "imgs/bgs/gameOver.jpg";
			else if(u == 1) imgF.src = "imgs/bgs/preto.jpg";
			else imgF.src = "imgs/bgs/error.jpg";
			
			u++;
			deferred.notify((i + u));
			
			imgF.addEventListener("load", fundo); //chama o load(funcao fundo()) denovo quando o fundo ja tiver sido carregado.
			imgF.addEventListener("error", function(){
				sucesso = false //para de chamar o load quando nao achou a img.
			});
		}
		else{
			deferred.resolve(sucesso); //quando termina o loop manda o resultado devolta.
		}
	};
	fundo();
	return deferred.promise();	
};

var carregarBarra = function(tamanho, barra, aumento){

	barra.style.width = tamanho * aumento + '%';
	barra.innerHTML = tamanho * aumento + '%';
	tamanho++;
	return tamanho;
};


var inicio = function() {
	
	var barra = document.getElementById("barra");
	var texto = document.getElementById("textoBarra");
	var tamanho = 0;

	/* CHAMADA DA FUNCAO QUE CARREGA OS FUNDOS. LOADASSETS() */
	var promise = loadAssets();
	
	//mostra a barra de progreco do load
	promise.progress(function(prog){
		aumento = 100 / (backMax + 3);
		texto.innerHTML = "LOAD DOS MAPAS DO JOGO";
		tamanho = carregarBarra(tamanho, barra, aumento);
	});
	
	//Chama o jogo depois de ter baixado as imagens
	promise.then(function(result){
		if(result){
			promise = loadAssets(true); //chama o load dos jogadores.
			tamanho = 0;
			
			//barra de load dos jogadores.
			promise.progress(function(prog){ 
				aumento = 100 / (imgJogadorMax + imgJogadorMove + 2);
				texto.innerHTML = "LOAD DOS PERSONAGENS DO JOGO";
				tamanho = carregarBarra(tamanho, barra, aumento);
			});
						
			promise.then(function(result){
			
				$("#barraProgresso").fadeOut("fast");
				$("#barra").fadeOut("fast");
				$("#textoBarra").fadeOut("fast");
				
				$("#status").show("fast");
				$("#screen").show("fast");
				if(result) jogo(); //chama o jogo se tudo foi carregado corretamente.
				else $("#screen").toggleClass('error'); //mostra pagina de erro se nao carregou algo.
			});
		}
	});
	
};
