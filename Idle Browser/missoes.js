var start = function(tipo){

	var status = {};
	status = iniciar(status);
	
	var barra = document.getElementById("barra" + tipo);
	var barraCheia = document.getElementById("barraProgresso" + tipo);
	
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
			status.lvl += 1;
		}
		
		barra.innerHTML = tempoDesdeOInicio.toFixed(0) + " %";
		barraCheia.style.width = tempoDesdeOInicio.toFixed(0) + 'px'
			
		
		requestAnimationFrame(tick);
	};
	
	tick();
};
