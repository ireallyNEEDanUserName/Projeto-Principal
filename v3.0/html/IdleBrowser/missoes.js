var start = function(tipo){

	var status = {};
	status = iniciar(status);
	
	var tipoMaterial = "";
	var qtdMaterial = 1;
	
	if(tipo.includes("Ferro")) qtdMaterial = 2;
	else if(tipo.includes("Adolescente")) qtdMaterial = 2;
	
	if(tipo.includes("Minerar")) tipoMaterial = "construcao";
	else if(tipo.includes("Forjar")) tipoMaterial = "dinheiro";
	else if(tipo.includes("Caca")) tipoMaterial = "comida";
	
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
	
		if(tempoDesdeOInicio.toFixed(0) >= 100){
			dataInicialAtualizada = new Date();
			segundoInicialAtualizado = dataInicialAtualizada.getTime() / 1000;
			tempoDesdeOInicio = 0;
			status = iniciar(status);
			status.inventario[tipoMaterial] += qtdMaterial;
			salvar(status);
			qtd.innerHTML = tipoMaterial.charAt(0).toUpperCase() + tipoMaterial.slice(1) + ": " + status.inventario[tipoMaterial];
		}
		
		barra.innerHTML = tempoDesdeOInicio.toFixed(0) + " %";
		barraCheia.style.width = tempoDesdeOInicio.toFixed(0) + 'px'
			
		
		requestAnimationFrame(tick);
	};
	
	tick();
	
};

