var iniciarExp = function(){

	var status = iniciar(status);
	
	var canvas = document.getElementById("mapa");
	var screen = canvas.getContext("2d");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	var size = {x: canvas.width, y: canvas.height};
	
	screen.fillStyle = "black";
	screen.fillRect(0, 0, canvas.width, canvas.height);
	
	screen.fillStyle = "red";
	screen.fillRect(0, size.y / 2, size.x,10);
	
	mapa(screen, size);
	
	window.addEventListener("beforeunload", function(){
		salvar(status);
	});
	
};

var mapa = function(screen, size){
	
	screen.fillStyle = "white";
	
	var dimensoes = {x: 20, y: 20};
	var tam = 15;
	var move = tam + 1;
	
	var pos = {x: 0, y: size.y / 2};
	
	var direcaoRand = 0;
	var direcao = {1: "direita", 2: "esquerda", 3: "baixo", 4: "cima"};
	var distancia = 0;
	var multp = 0;
	
	screen.fillRect(pos.x, pos.y, tam, tam);
	
	for(var x = 2; x <= 60; x++){
		multp = Math.floor(Math.random() * 8) + 5;
		distancia = Math.floor(Math.random() * multp) + 1;
		direcaoRand = Math.floor(Math.random() * 4) + 1;
		
		for(var y = 0; y <= distancia; y++){
			
			if(direcaoRand == 1 || direcaoRand == 2){
				if(direcaoRand == 1) pos.x += move;
				else pos.x -= move;
				
				if(pos.x <= 0) pos.x = 0;
				else if(pos.x >= size.x) pos.x = size.x - move;
			}else{
				if(direcaoRand == 3) pos.y += move;
				else pos.y -= move;
				
				if(pos.y <= 0) pos.y = 0;
				else if(pos.y >= size.y) pos.y = size.y - move;
			}
			
			screen.fillRect(pos.x, pos.y, tam, tam);
		}
		console.log("Fez " + distancia + " para a " + direcao[direcaoRand]);
	}

};