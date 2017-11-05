var start = function(tipo){

	var status = {};
	status = iniciar(status);
	
	var tipoMaterial = "";
	var texto = "";
	var expTexto = "";
	var qtdMaterial = 1;
	var exp = 1;
	
	if(tipo.includes("Minerar")){
		tipoMaterial = "minerio";
		texto = "Minerar";
	}		
	else if(tipo.includes("Forjar")){
		tipoMaterial = "dinheiro";
		texto = "Forjar";
	} 
	else if(tipo.includes("Caca")){
		tipoMaterial = "comida";
		texto = "Cacar";
	} 

	qtdMaterial = 1 + (Math.floor((Math.random() * Math.round(status["lvl".concat(texto)] / 2)) +  Math.round(status["lvl".concat(texto)] / 4)));
	exp = 1 + qtdMaterial;
	expTexto = "exp" + texto;
	
	var barra = document.getElementById("barra" + tipo);
	var barraCheia = document.getElementById("barraProgresso" + tipo);
	var qtd = document.getElementById(tipoMaterial);
	
	var dataInicialAtualizada = new Date();
	var data = new Date();
	
	var segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
	var segundo = data.getTime() / 1000;
	
	var tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
	var tick = function(){
	
		data = new Date();
		segundo = data.getTime() / 1000;
		
		tempoDesdeOInicio = segundo - segundoInicialAtualizado;
	
		if(tempoDesdeOInicio.toFixed(0) >= 10){
			dataInicialAtualizada = new Date();
			segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
			tempoDesdeOInicio = 0;
			status = iniciar(status);
			status.inventario[tipoMaterial] += qtdMaterial;
			status[expTexto] += exp;
			status = upaLevel(status, texto);
			//console.log(status);
			salvar(status);
			qtd.innerHTML = tipoMaterial.charAt(0).toUpperCase() + tipoMaterial.slice(1) + ": " + status.inventario[tipoMaterial];
		}
		
		barra.innerHTML = tempoDesdeOInicio.toFixed(0) + " %";
		barraCheia.style.width = tempoDesdeOInicio.toFixed(0) + 'px'
			
		
		requestAnimationFrame(tick);
	};
	
	tick();
	
};

